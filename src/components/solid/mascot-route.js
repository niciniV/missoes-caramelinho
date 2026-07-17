// @ts-check

/** @typedef {{ x: number, y: number }} Point */
/** @typedef {{ p0: Point, p1: Point, p2: Point, p3: Point }} BezierCurve */
/** @typedef {{ left: number, top: number, right: number, bottom: number }} Bounds */

/**
 * @param {number} value
 * @param {number} [min]
 * @param {number} [max]
 */
export function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

/** @param {number} progress */
export function smoothstep(progress) {
  const t = clamp(progress);
  return t * t * (3 - 2 * t);
}

/**
 * Preserves a small ease at both ends without the pronounced midpoint speed
 * spike of a full smoothstep curve.
 * @param {number} progress
 */
export function gentleEase(progress) {
  const t = clamp(progress);
  return t + (smoothstep(t) - t) * 0.35;
}

/**
 * @param {BezierCurve} curve
 * @param {number} progress
 * @returns {Point}
 */
export function cubicBezierPoint(curve, progress) {
  const t = clamp(progress);
  const mt = 1 - t;
  const a = mt * mt * mt;
  const b = 3 * mt * mt * t;
  const c = 3 * mt * t * t;
  const d = t * t * t;

  return {
    x: curve.p0.x * a + curve.p1.x * b + curve.p2.x * c + curve.p3.x * d,
    y: curve.p0.y * a + curve.p1.y * b + curve.p2.y * c + curve.p3.y * d,
  };
}

/**
 * Builds a curve that enters the viewport and returns to the same edge.
 * @param {Point} start
 * @param {Point} end
 * @param {number} insetX
 * @param {number} [arc]
 * @returns {BezierCurve}
 */
export function stagingCurve(start, end, insetX, arc = 0) {
  const dy = end.y - start.y;
  return {
    p0: start,
    p1: { x: insetX, y: start.y + dy * 0.28 - arc },
    p2: { x: insetX, y: start.y + dy * 0.72 + arc * 0.45 },
    p3: end,
  };
}

/**
 * Keeps a card crossing visible for almost half a viewport of scroll.
 * The midpoint remains at the same visual anchor used by the card geometry.
 * @param {number} center
 * @param {number} viewportHeight
 * @param {number} maxScroll
 */
export function transitionScrollWindow(center, viewportHeight, maxScroll) {
  const midpointAnchor = 0.57;
  const halfSpan = 0.24;
  return {
    start: clamp(center - viewportHeight * (midpointAnchor + halfSpan), 0, maxScroll),
    end: clamp(center - viewportHeight * (midpointAnchor - halfSpan), 0, maxScroll),
  };
}

/**
 * @param {{ start: number, end: number, curve: BezierCurve, scaleStart?: number, scaleEnd?: number }} scene
 * @param {number} scrollY
 * @param {(progress: number) => number} [easing]
 */
export function sampleScene(scene, scrollY, easing = smoothstep) {
  const duration = Math.max(scene.end - scene.start, 1);
  const progress = clamp((scrollY - scene.start) / duration);
  const eased = easing(progress);
  const point = cubicBezierPoint(scene.curve, eased);
  const scaleStart = scene.scaleStart ?? 1;
  const scaleEnd = scene.scaleEnd ?? scaleStart;

  return {
    progress,
    eased,
    x: point.x,
    y: point.y,
    scale: scaleStart + (scaleEnd - scaleStart) * eased,
  };
}

/**
 * @template {{ start: number, end: number }} T
 * @param {T[]} scenes
 * @param {number} scrollY
 * @returns {T}
 */
export function selectScene(scenes, scrollY) {
  if (scenes.length === 0) {
    throw new Error("A rota do mascote precisa de pelo menos uma cena.");
  }

  const first = scenes[0];
  const last = scenes[scenes.length - 1];
  if (!first || !last) throw new Error("Rota inválida.");
  if (scrollY <= first.start) return first;

  return (
    scenes.find((scene, index) => {
      const isLast = index === scenes.length - 1;
      return scrollY >= scene.start && (scrollY < scene.end || isLast);
    }) ?? last
  );
}

/**
 * @param {number} progress
 * @param {boolean} active
 * @returns {"papel-a" | "papel-b" | null}
 */
export function paperFrame(progress, active) {
  if (!active) return null;
  return Math.floor(clamp(progress) * 4) % 2 === 0 ? "papel-a" : "papel-b";
}

/**
 * @param {Bounds} mascot
 * @param {Bounds} curtain
 * @param {number} [margin]
 */
export function isFullyOccluded(mascot, curtain, margin = 0) {
  return (
    mascot.left >= curtain.left + margin &&
    mascot.top >= curtain.top + margin &&
    mascot.right <= curtain.right - margin &&
    mascot.bottom <= curtain.bottom - margin
  );
}

/**
 * @param {{ width: number, height: number }} curtain
 * @param {number} mascotSize
 * @param {number} [margin]
 * @param {boolean} [preferDual]
 * @returns {"simple" | "dual"}
 */
export function chooseOcclusionStrategy(curtain, mascotSize, margin = 12, preferDual = false) {
  if (preferDual) return "dual";
  const required = mascotSize + margin * 2;
  return curtain.width >= required && curtain.height >= required ? "simple" : "dual";
}

/**
 * @template {string} T
 * @param {number} progress
 * @param {T} fromPose
 * @param {T} toPose
 * @param {number} [overlapStart]
 * @param {number} [overlapEnd]
 */
export function dualHandoff(progress, fromPose, toPose, overlapStart = 0.35, overlapEnd = 0.65) {
  if (progress < overlapStart) {
    return {
      primaryPose: fromPose,
      secondaryPose: toPose,
      secondaryVisible: false,
      phase: "before",
    };
  }

  if (progress <= overlapEnd) {
    return {
      primaryPose: fromPose,
      secondaryPose: toPose,
      secondaryVisible: true,
      phase: "overlap",
    };
  }

  return {
    primaryPose: toPose,
    secondaryPose: toPose,
    secondaryVisible: false,
    phase: "after",
  };
}
