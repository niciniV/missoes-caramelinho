import { onCleanup, onMount } from "solid-js";
import { ASSETS } from "../../config/site";

/**
 * MascotGuide — o Caramelinho acompanha a rolagem da pagina.
 *
 * Coreografia (ancorada nas secoes reais do documento):
 *  1. Atravessa a base da secao "O projeto" (esq. -> dir.), saltitando.
 *  2. Some por tras da grade de Missoes (tunel: troca de pose oculta).
 *  3. Reaparece em "A experiencia" na cena do papel (quadros A/B
 *     alternados APENAS enquanto essa cena esta ativa).
 *  4. Atravessa "A experiencia" (esq. -> dir.).
 *  5. Some por tras de "Para quem" (segundo tunel).
 *  6. Atravessa "Seguranca" (esq. -> dir.).
 *  7. Some por tras de "Identidade" e reaparece descansando no "Contato".
 *
 * Tudo usa transform/opacity, listener de rolagem passivo e um loop rAF
 * suavizado. Com prefers-reduced-motion, sem ancoras ou sem JS, o guia
 * nao aparece — e a pagina continua completa sem ele.
 */

type Pose = "classico" | "movimento" | "papel";

interface Marco {
  /** progresso de rolagem (0..1) */
  p: number;
  /** posicao horizontal do centro do sprite, em % da viewport */
  x: number;
  /** distancia da base da viewport, em px */
  lane: number;
  /** visibilidade ao CHEGAR neste marco (define as pernas "tunel") */
  visivel: boolean;
  /** pose ao terminar parado neste marco */
  poseParado: Pose;
}

const DURACAO_PAPEL_MS = 650;

function limite(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/** Progresso de rolagem em que uma secao entra/sai da area util da viewport. */
function medirSecao(id: string): { ini: number; fim: number } | null {
  const el = document.getElementById(id);
  if (!el) return null;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return null;
  const topo = el.getBoundingClientRect().top + window.scrollY;
  return {
    ini: limite((topo - window.innerHeight * 0.55) / max, 0, 1),
    fim: limite((topo + el.offsetHeight - window.innerHeight * 0.45) / max, 0, 1),
  };
}

function construirRota(mobile: boolean): Marco[] | null {
  const sobre = medirSecao("projeto");
  const missoes = medirSecao("missoes");
  const experiencia = medirSecao("experiencia");
  const paraQuem = medirSecao("para-quem");
  const seguranca = medirSecao("seguranca");
  const identidade = medirSecao("identidade");
  const contato = medirSecao("contato");
  if (
    !sobre ||
    !missoes ||
    !experiencia ||
    !paraQuem ||
    !seguranca ||
    !identidade ||
    !contato
  ) {
    return null;
  }

  const X_ESQ = mobile ? 14 : 7;
  const X_DIR = mobile ? 70 : 86;
  const LANE_BASE = mobile ? 42 : 68;
  const LANE_CENA = mobile ? 56 : 96;

  const marcos: Marco[] = [
    { p: sobre.ini + 0.015, x: X_ESQ, lane: LANE_BASE, visivel: true, poseParado: "movimento" },
    { p: sobre.fim, x: X_DIR, lane: LANE_BASE, visivel: true, poseParado: "classico" },
    // Tunel 1: some por tras das Missoes; reaparece ja em pose de papel.
    { p: missoes.fim, x: X_ESQ, lane: LANE_BASE, visivel: false, poseParado: "papel" },
    // Cena do papel: parado, examinando os planos da experiencia.
    {
      p: experiencia.ini + (experiencia.fim - experiencia.ini) * 0.45,
      x: X_ESQ,
      lane: LANE_CENA,
      visivel: true,
      poseParado: "papel",
    },
    { p: experiencia.fim, x: X_DIR, lane: LANE_BASE, visivel: true, poseParado: "classico" },
    // Tunel 2: por tras de "Para quem".
    { p: paraQuem.fim, x: X_ESQ, lane: LANE_BASE, visivel: false, poseParado: "classico" },
    { p: seguranca.fim, x: X_DIR, lane: LANE_BASE, visivel: true, poseParado: "classico" },
    // Tunel 3: por tras de "Identidade".
    { p: identidade.fim, x: 50, lane: LANE_CENA, visivel: false, poseParado: "classico" },
    // Descanso final, acenando no "Contato".
    { p: 1, x: 50, lane: LANE_CENA, visivel: true, poseParado: "classico" },
  ];

  // Garante ordem estritamente crescente; descarta marcos comprimidos
  // por secoes muito curtas em telas extremas.
  const ordenados = marcos
    .filter((m) => Number.isFinite(m.p))
    .sort((a, b) => a.p - b.p)
    .filter((m, i, arr) => i === 0 || m.p > arr[i - 1]!.p + 0.005);
  return ordenados.length >= 3 ? ordenados : null;
}

export default function MascotGuide() {
  let guia: HTMLDivElement | undefined;
  let salto: HTMLDivElement | undefined;
  let flip: HTMLDivElement | undefined;
  let imgClassico: HTMLImageElement | undefined;
  let imgMovimento: HTMLImageElement | undefined;
  let imgPapelA: HTMLImageElement | undefined;
  let imgPapelB: HTMLImageElement | undefined;

  onMount(() => {
    if (!guia || !salto || !flip || !imgClassico || !imgMovimento || !imgPapelA || !imgPapelB) {
      return;
    }
    const elGuia = guia;
    const elSalto = salto;
    const elFlip = flip;
    const elClassico = imgClassico;
    const elMovimento = imgMovimento;
    const elPapelA = imgPapelA;
    const elPapelB = imgPapelB;

    const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");
    const consultaMobile = window.matchMedia("(max-width: 45rem)");

    let rota: Marco[] | null = null;
    let alvo = 0;
    let atual = 0;
    let raf = 0;
    let ativo = false;
    let poseAtual: Pose | null = null;
    let flipAtual = 1;
    let papelB = false;
    let papelTimer: number | undefined;

    const definirPose = (pose: Pose) => {
      if (pose === poseAtual) return;
      poseAtual = pose;
      elClassico.classList.toggle("ativa", pose === "classico");
      elMovimento.classList.toggle("ativa", pose === "movimento");
      elPapelA.classList.toggle("ativa", pose === "papel" && !papelB);
      elPapelB.classList.toggle("ativa", pose === "papel" && papelB);

      // Espelha apenas o sprite de movimento; poses com papel e a
      // classica nunca sao espelhadas.
      if (pose !== "movimento" && flipAtual !== 1) {
        flipAtual = 1;
        elFlip.style.transform = "scaleX(1)";
      }

      // Alternancia A/B somente enquanto a cena do papel estiver ativa.
      if (pose === "papel" && papelTimer === undefined) {
        papelTimer = window.setInterval(() => {
          papelB = !papelB;
          elPapelA.classList.toggle("ativa", !papelB);
          elPapelB.classList.toggle("ativa", papelB);
        }, DURACAO_PAPEL_MS);
      } else if (pose !== "papel" && papelTimer !== undefined) {
        window.clearInterval(papelTimer);
        papelTimer = undefined;
        papelB = false;
      }
    };

    const aplicarFrame = (p: number) => {
      if (!rota) return;
      if (p < rota[0]!.p) {
        elGuia.style.opacity = "0";
        return;
      }

      // Perna atual: marco i -> i+1
      let i = 0;
      while (i < rota.length - 2 && p > rota[i + 1]!.p) i++;
      const a = rota[i]!;
      const b = rota[i + 1]!;

      const t = limite((p - a.p) / Math.max(b.p - a.p, 1e-6), 0, 1);
      const e = t * t * (3 - 2 * t); // smoothstep: trajetoria curva e suave

      const x = a.x + (b.x - a.x) * e;
      const dx = b.x - a.x;
      const viajando = Math.abs(dx) > 0.01;

      // Arco da trajetoria + pulinhos enquanto caminha (transform puro)
      const pulos = viajando ? Math.abs(Math.sin(e * Math.PI * 3)) * 11 : 0;
      const arco = viajando ? Math.sin(Math.PI * e) * 24 : 0;
      const lane = a.lane + (b.lane - a.lane) * e;

      const tam = elGuia.offsetWidth || 190;
      const xPx = (x / 100) * window.innerWidth - tam / 2;
      const yPx = window.innerHeight - lane - tam;

      elGuia.style.opacity = b.visivel ? "1" : "0";
      elGuia.style.transform = `translate3d(${xPx.toFixed(1)}px, ${yPx.toFixed(1)}px, 0)`;
      elSalto.style.transform = `translate3d(0, ${(-(pulos + arco)).toFixed(1)}px, 0)`;

      if (viajando) {
        const direcao = dx >= 0 ? 1 : -1;
        if (direcao !== flipAtual) {
          flipAtual = direcao;
          elFlip.style.transform = `scaleX(${flipAtual})`;
        }
      }

      definirPose(viajando ? "movimento" : b.poseParado);
    };

    const calcularAlvo = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      alvo = max > 0 ? limite(window.scrollY / max, 0, 1) : 0;
    };

    const tick = () => {
      raf = 0;
      const d = alvo - atual;
      if (Math.abs(d) < 0.00035) {
        if (atual !== alvo) {
          atual = alvo;
          aplicarFrame(atual);
        }
        return;
      }
      atual += d * 0.16;
      aplicarFrame(atual);
      raf = requestAnimationFrame(tick);
    };

    const agendar = () => {
      if (!raf && ativo) raf = requestAnimationFrame(tick);
    };

    const aoRolar = () => {
      calcularAlvo();
      agendar();
    };

    const remontar = () => {
      rota = construirRota(consultaMobile.matches);
      elGuia.style.setProperty("--tam", consultaMobile.matches ? "7rem" : "11.875rem");
      calcularAlvo();
      atual = alvo; // recalibra sem animacao
      aplicarFrame(atual);
    };

    const atualizarAtivacao = () => {
      const deveAtivar = !reduzMovimento.matches;
      if (deveAtivar === ativo) return;
      ativo = deveAtivar;
      elGuia.hidden = !ativo;
      if (ativo) {
        remontar();
        agendar();
      } else {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
        if (papelTimer !== undefined) {
          window.clearInterval(papelTimer);
          papelTimer = undefined;
        }
      }
    };

    // Carregamento progressivo: os sprites so sao buscados agora,
    // depois do idle (o classico ja veio pre-carregado do <head>).
    elMovimento.src = ASSETS.mascot.movimento;
    elPapelA.src = ASSETS.mascot.papelA;
    elPapelB.src = ASSETS.mascot.papelB;
    elClassico.src = ASSETS.mascot.classico;

    atualizarAtivacao();

    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", remontar);
    // Recalcula quando o layout estabiliza (imagens podem mover secoes).
    window.addEventListener("load", remontar);
    reduzMovimento.addEventListener("change", atualizarAtivacao);
    consultaMobile.addEventListener("change", remontar);

    onCleanup(() => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", remontar);
      window.removeEventListener("load", remontar);
      reduzMovimento.removeEventListener("change", atualizarAtivacao);
      consultaMobile.removeEventListener("change", remontar);
      if (raf) cancelAnimationFrame(raf);
      if (papelTimer !== undefined) window.clearInterval(papelTimer);
    });
  });

  return (
    <div id="mascote-guia" ref={guia} hidden aria-hidden="true" style={{ opacity: 0 }}>
      <div class="mascote-flip" ref={flip}>
        <div class="mascote-salto" ref={salto}>
          {/* Sem src no SSR: os arquivos so sao buscados apos o idle,
              quando a hidratacao define os caminhos. */}
          <img ref={imgClassico} alt="" width={ASSETS.mascot.width} height={ASSETS.mascot.height} draggable="false" decoding="async" />
          <img ref={imgMovimento} alt="" width={ASSETS.mascot.width} height={ASSETS.mascot.height} draggable="false" decoding="async" />
          <img ref={imgPapelA} alt="" width={ASSETS.mascot.width} height={ASSETS.mascot.height} draggable="false" decoding="async" />
          <img ref={imgPapelB} alt="" width={ASSETS.mascot.width} height={ASSETS.mascot.height} draggable="false" decoding="async" />
        </div>
      </div>
    </div>
  );
}
