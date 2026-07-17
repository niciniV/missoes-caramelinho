import test from "node:test";
import assert from "node:assert/strict";

import {
  chooseOcclusionStrategy,
  cubicBezierPoint,
  dualHandoff,
  gentleEase,
  isFullyOccluded,
  paperFrame,
  sampleScene,
  selectScene,
  stagingCurve,
  transitionScrollWindow,
} from "../src/components/solid/mascot-route.js";

test("cubicBezierPoint follows the endpoints and bends through its controls", () => {
  const curve = {
    p0: { x: 0, y: 0 },
    p1: { x: 0, y: 100 },
    p2: { x: 100, y: 100 },
    p3: { x: 100, y: 0 },
  };

  assert.deepEqual(cubicBezierPoint(curve, 0), { x: 0, y: 0 });
  assert.deepEqual(cubicBezierPoint(curve, 1), { x: 100, y: 0 });
  assert.deepEqual(cubicBezierPoint(curve, 0.5), { x: 50, y: 75 });
});

test("sampleScene is scroll-driven, clamped and reversible", () => {
  const scene = {
    start: 100,
    end: 900,
    curve: {
      p0: { x: 10, y: 20 },
      p1: { x: 80, y: 5 },
      p2: { x: 120, y: 150 },
      p3: { x: 220, y: 90 },
    },
    scaleStart: 1.8,
    scaleEnd: 1,
  };

  const forward = sampleScene(scene, 500);
  sampleScene(scene, 850);
  const backward = sampleScene(scene, 500);

  assert.deepEqual(backward, forward);
  assert.equal(sampleScene(scene, -50).progress, 0);
  assert.equal(sampleScene(scene, 1200).progress, 1);
  assert.ok(forward.x > 10 && forward.x < 220);
  assert.ok(forward.y > 20 && forward.y < 150);
  assert.equal(forward.scale, 1.4);
});

test("gentleEase avoids the speed spike of smoothstep during card crossings", () => {
  assert.equal(gentleEase(0), 0);
  assert.equal(gentleEase(0.5), 0.5);
  assert.equal(gentleEase(1), 1);
  assert.ok(gentleEase(0.25) > 0.2);
  assert.ok(gentleEase(0.75) < 0.8);
});

test("selectScene chooses stable boundaries in both scroll directions", () => {
  const scenes = [
    { id: "hero", start: 0, end: 400 },
    { id: "missions", start: 400, end: 1000 },
    { id: "contact", start: 1000, end: 1400 },
  ];

  assert.equal(selectScene(scenes, 0).id, "hero");
  assert.equal(selectScene(scenes, 399).id, "hero");
  assert.equal(selectScene(scenes, 400).id, "missions");
  assert.equal(selectScene(scenes, 1400).id, "contact");
  assert.equal(selectScene(scenes, 700).id, "missions");
});

test("paperFrame alternates only while the paper scene is active", () => {
  assert.equal(paperFrame(0, false), null);
  assert.equal(paperFrame(0.1, true), "papel-a");
  assert.equal(paperFrame(0.3, true), "papel-b");
  assert.equal(paperFrame(0.55, true), "papel-a");
  assert.equal(paperFrame(0.8, false), null);
});

test("full occlusion requires the complete mascot plus safety margin", () => {
  const curtain = { left: 100, top: 100, right: 400, bottom: 360 };

  assert.equal(
    isFullyOccluded({ left: 150, top: 140, right: 300, bottom: 290 }, curtain, 10),
    true,
  );
  assert.equal(
    isFullyOccluded({ left: 92, top: 140, right: 242, bottom: 290 }, curtain, 10),
    false,
  );
});

test("occlusion strategy falls back to a dual handoff for narrow cards", () => {
  assert.equal(chooseOcclusionStrategy({ width: 320, height: 240 }, 160, 16, false), "simple");
  assert.equal(chooseOcclusionStrategy({ width: 170, height: 150 }, 160, 16, false), "dual");
  assert.equal(chooseOcclusionStrategy({ width: 320, height: 240 }, 112, 12, true), "dual");
});

test("dual handoff exposes both poses only inside the scroll window", () => {
  assert.deepEqual(dualHandoff(0.2, "classico", "movimento"), {
    primaryPose: "classico",
    secondaryPose: "movimento",
    secondaryVisible: false,
    phase: "before",
  });
  assert.deepEqual(dualHandoff(0.5, "classico", "movimento"), {
    primaryPose: "classico",
    secondaryPose: "movimento",
    secondaryVisible: true,
    phase: "overlap",
  });
  assert.deepEqual(dualHandoff(0.8, "classico", "movimento"), {
    primaryPose: "movimento",
    secondaryPose: "movimento",
    secondaryVisible: false,
    phase: "after",
  });
});

test("stagingCurve brings a same-edge scene into the viewport", () => {
  const curve = stagingCurve({ x: 1300, y: 500 }, { x: 1300, y: 260 }, 1160, 24);

  assert.deepEqual(cubicBezierPoint(curve, 0), { x: 1300, y: 500 });
  assert.deepEqual(cubicBezierPoint(curve, 1), { x: 1300, y: 260 });
  assert.ok(cubicBezierPoint(curve, 0.5).x < 1200);
});

test("transitionScrollWindow gives card crossings enough scroll distance", () => {
  assert.deepEqual(transitionScrollWindow(2000, 900, 5000), {
    start: 1271,
    end: 1703,
  });

  assert.deepEqual(transitionScrollWindow(240, 900, 5000), {
    start: 0,
    end: 0,
  });
});
