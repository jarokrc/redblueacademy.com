import { useEffect, useRef, useState } from "react";
import logoPng from "@/assets/logo/academy.png";

type Point = { x: number; y: number };
type CircuitPath = { points: Point[]; delay: number; duration: number; length: number; depth: number; isBranch: boolean };
type CircuitNode = { x: number; y: number; delay: number; size: number };
type CircuitLayout = {
  width: number;
  height: number;
  center: Point;
  chipSize: number;
  grid: number;
  paths: CircuitPath[];
  nodes: CircuitNode[];
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const snapToGrid = (value: number, grid: number) => Math.round(value / grid) * grid;

const mulberry32 = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const pathLength = (points: Point[]) => {
  let total = 0;
  for (let i = 0; i < points.length - 1; i += 1) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    total += Math.hypot(dx, dy);
  }
  return total;
};

const pointAtLength = (points: Point[], target: number) => {
  let remaining = target;
  for (let i = 0; i < points.length - 1; i += 1) {
    const start = points[i];
    const end = points[i + 1];
    const seg = Math.hypot(end.x - start.x, end.y - start.y);
    if (remaining <= seg) {
      const ratio = seg === 0 ? 0 : remaining / seg;
      return {
        x: start.x + (end.x - start.x) * ratio,
        y: start.y + (end.y - start.y) * ratio,
      };
    }
    remaining -= seg;
  }
  return points[points.length - 1];
};

const buildManhattanPath = (start: Point, end: Point, rand: () => number, grid: number) => {
  const points: Point[] = [start];
  const midCount = 2 + Math.floor(rand() * 2);
  let current = start;
  const axisFirst = rand() > 0.5 ? "x" : "y";
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const split = (value: number, steps: number) => {
    const parts: number[] = [];
    let remaining = value;
    for (let i = 0; i < steps; i += 1) {
      const weight = i === steps - 1 ? 1 : 0.2 + rand() * 0.6;
      const step = remaining * weight;
      parts.push(step);
      remaining -= step;
    }
    return parts;
  };

  const xSteps = split(dx, midCount);
  const ySteps = split(dy, midCount);
  for (let i = 0; i < midCount; i += 1) {
    if (axisFirst === "x") {
      current = { x: snapToGrid(current.x + xSteps[i], grid), y: current.y };
      points.push(current);
      current = { x: current.x, y: snapToGrid(current.y + ySteps[i], grid) };
      points.push(current);
    } else {
      current = { x: current.x, y: snapToGrid(current.y + ySteps[i], grid) };
      points.push(current);
      current = { x: snapToGrid(current.x + xSteps[i], grid), y: current.y };
      points.push(current);
    }
  }
  points.push(end);
  return points.filter((point, index) => index === 0 || point.x !== points[index - 1].x || point.y !== points[index - 1].y);
};

const pickBranchPoint = (points: Point[], rand: () => number) => {
  if (points.length < 3) return points[points.length - 1];
  const index = 1 + Math.floor(rand() * (points.length - 2));
  return points[index];
};

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
};

const createCircuitLayout = (width: number, height: number, seed: number): CircuitLayout => {
  const rand = mulberry32(seed);
  const minSide = Math.min(width, height);
  const grid = Math.max(24, Math.floor(minSide / 20));
  const margin = Math.max(20, Math.floor(minSide / 12));
  const center = { x: width / 2, y: height / 2 };
  const chipSize = Math.min(Math.max(minSide * 0.26, 150), 220);
  const maxRadius = Math.hypot(width, height) * 0.55;

  const clampPoint = (p: Point) => ({
    x: clamp(p.x, margin, width - margin),
    y: clamp(p.y, margin, height - margin),
  });

  const toPoint = (angle: number, radius: number) => ({
    x: snapToGrid(center.x + Math.cos(angle) * radius, grid),
    y: snapToGrid(center.y + Math.sin(angle) * radius, grid),
  });

  const paths: CircuitPath[] = [];
  const nodes: CircuitNode[] = [];

  type SeedNode = { point: Point; depth: number };
  const seedNodes: SeedNode[] = [{ point: center, depth: 0 }];
  const maxDepth = 4;
  const maxPaths = 70;
  const baseDelay = 0.25;
  const baseAngleOffset = rand() * Math.PI * 2;

  for (let depth = 0; depth < maxDepth; depth += 1) {
    const layerNodes = seedNodes.filter((node) => node.depth === depth);
    layerNodes.forEach((node, nodeIndex) => {
      if (paths.length >= maxPaths) return;
      const branchCount = depth === 0 ? 8 + Math.floor(rand() * 4) : 2 + Math.floor(rand() * 2);
      for (let b = 0; b < branchCount; b += 1) {
        if (paths.length >= maxPaths) break;
        const angle =
          baseAngleOffset +
          (nodeIndex / Math.max(1, layerNodes.length)) * Math.PI * 2 +
          (b / branchCount) * (Math.PI / 4) +
          (rand() - 0.5) * 0.8;
        const lengthBase = maxRadius * (0.35 + rand() * 0.3) * (1 - depth * 0.12);
        const length = lengthBase * (0.7 + rand() * 0.6);
        const end = clampPoint(toPoint(angle, length));
        const points = buildManhattanPath(node.point, end, rand, grid);
        const pathLen = pathLength(points);
        const endDist = Math.hypot(end.x - center.x, end.y - center.y);
        const isBranch = depth > 0;
        paths.push({
          points,
          length: pathLen,
          delay: baseDelay + depth * 0.35 + (endDist / maxRadius) * 0.6 + rand() * 0.15,
          duration: 0.7 + rand() * 0.6,
          depth,
          isBranch,
        });
        const branchPoint = pickBranchPoint(points, rand);
        seedNodes.push({ point: branchPoint, depth: depth + 1 });
        nodes.push({
          x: end.x,
          y: end.y,
          delay: baseDelay + depth * 0.35 + (endDist / maxRadius) * 0.6,
          size: 3 + rand() * 3,
        });
      }
    });
  }

  return { width, height, center, chipSize, grid, paths, nodes };
};

const drawPartialPath = (
  ctx: CanvasRenderingContext2D,
  points: Point[],
  totalLength: number,
  progress: number
) => {
  const target = totalLength * progress;
  let remaining = target;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 0; i < points.length - 1; i += 1) {
    const start = points[i];
    const end = points[i + 1];
    const seg = Math.hypot(end.x - start.x, end.y - start.y);
    if (remaining <= 0) break;
    if (remaining >= seg) {
      ctx.lineTo(end.x, end.y);
      remaining -= seg;
    } else {
      const ratio = seg === 0 ? 0 : remaining / seg;
      ctx.lineTo(start.x + (end.x - start.x) * ratio, start.y + (end.y - start.y) * ratio);
      remaining = 0;
    }
  }
  ctx.stroke();
};

const renderCircuit = (
  ctx: CanvasRenderingContext2D,
  layout: CircuitLayout,
  time: number,
  logoImage: HTMLImageElement | null
) => {
  const { width, height, center, grid, paths, nodes } = layout;
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "#02040a";
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, width * 0.7);
  glow.addColorStop(0, "rgba(255, 255, 255, 0.12)");
  glow.addColorStop(0.4, "rgba(56, 189, 248, 0.1)");
  glow.addColorStop(1, "rgba(2, 6, 23, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.strokeStyle = "rgba(148, 163, 184, 0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= width; x += grid) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += grid) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();

  paths.forEach((path, index) => {
    const progress = clamp((time - path.delay) / path.duration, 0, 1);
    if (progress <= 0) return;

    ctx.save();
    ctx.shadowBlur = 14;
    ctx.shadowColor = "rgba(56, 189, 248, 0.3)";
    ctx.strokeStyle = "rgba(125, 211, 252, 0.25)";
    ctx.lineWidth = 2.5;
    drawPartialPath(ctx, path.points, path.length, progress);
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(226, 232, 240, 0.65)";
    ctx.lineWidth = 1.2;
    drawPartialPath(ctx, path.points, path.length, progress);
    ctx.restore();

    if (progress > 0.02) {
      const head = pointAtLength(path.points, path.length * progress);
      ctx.save();
      ctx.fillStyle = "rgba(125, 211, 252, 0.85)";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(56, 189, 248, 0.7)";
      ctx.beginPath();
      ctx.arc(head.x, head.y, 2.5 + (index % 2), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (path.isBranch && progress > 0.08 && progress < 0.45) {
      const sparkHead = pointAtLength(path.points, path.length * progress);
      ctx.save();
      ctx.globalAlpha = 0.95;
      ctx.shadowBlur = 18;
      ctx.shadowColor = "rgba(255, 255, 255, 0.85)";
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.beginPath();
      ctx.arc(sparkHead.x, sparkHead.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.lineWidth = 2.5;
      drawPartialPath(ctx, path.points, path.length, Math.min(progress + 0.02, 1));
      ctx.restore();
    }
  });

  nodes.forEach((node) => {
    const pulse = 0.6 + 0.4 * Math.sin((time + node.delay) * 3.5);
    ctx.save();
    ctx.globalAlpha = clamp(pulse, 0.2, 1);
    ctx.fillStyle = "rgba(226, 232, 240, 0.7)";
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  const logoWidth = logoImage?.naturalWidth ? Math.min(logoImage.naturalWidth, width * 0.7) : width * 0.5;
  const logoHeight = logoImage?.naturalWidth
    ? (logoImage.naturalHeight / logoImage.naturalWidth) * logoWidth
    : logoWidth * 0.35;
  const logoX = center.x - logoWidth / 2;
  const logoY = center.y - logoHeight / 2;

  ctx.save();
  ctx.shadowBlur = 24;
  ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
  ctx.fillStyle = "#ffffff";
  drawRoundedRect(ctx, logoX - 24, logoY - 18, logoWidth + 48, logoHeight + 36, 26);
  ctx.fill();
  ctx.restore();

  if (logoImage && logoImage.complete) {
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);
    ctx.restore();
  }

  const flashStart = 2.1;
  const flashWindow = 0.35;
  if (time > flashStart) {
    const phase = clamp((time - flashStart) / flashWindow, 0, 1);
    const alpha = Math.sin(phase * Math.PI) * 0.35;
    ctx.save();
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
};

const IntroCanvas = () => {
  const [bootDone, setBootDone] = useState(false);
  const [isImploding, setIsImploding] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const seedRef = useRef(Math.floor(Math.random() * 1_000_000));
  const rafRef = useRef<number | null>(null);
  const totalDurationMs = 3000;
  const implodeStartMs = totalDurationMs - 300;

  useEffect(() => {
    if (typeof window === "undefined") {
      setBootDone(true);
      return;
    }
    const introStorageKey = "rb-academy-intro-last-seen";
    if (typeof localStorage !== "undefined") {
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
        now.getDate()
      ).padStart(2, "0")}`;
      const lastSeen = localStorage.getItem(introStorageKey);
      if (lastSeen === today) {
        setBootDone(true);
        return;
      }
      localStorage.setItem(introStorageKey, today);
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setBootDone(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      setBootDone(true);
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setBootDone(true);
      return;
    }

    let layout = createCircuitLayout(canvas.clientWidth, canvas.clientHeight, seedRef.current);
    let running = true;
    let imploding = false;
    const logoImage = new Image();
    logoImage.src = logoPng;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { clientWidth, clientHeight } = canvas;
      canvas.width = clientWidth * dpr;
      canvas.height = clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layout = createCircuitLayout(clientWidth, clientHeight, seedRef.current);
    };

    resize();
    const start = performance.now();
    const tick = (now: number) => {
      if (!running) return;
      const elapsed = (now - start) / 1000;
      renderCircuit(ctx, layout, elapsed, logoImage);
      if (!imploding && now - start >= implodeStartMs) {
        imploding = true;
        setIsImploding(true);
      }
      if (now - start < totalDurationMs + 400) {
        rafRef.current = window.requestAnimationFrame(tick);
      } else {
        setBootDone(true);
      }
    };

    rafRef.current = window.requestAnimationFrame(tick);
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950 origin-center transition-[opacity,transform,filter] duration-700 ease-in-out ${
        bootDone ? "pointer-events-none opacity-0 scale-0 blur-[2px]" : isImploding ? "opacity-100 scale-0 blur-[2px]" : "opacity-100 scale-100"
      }`}
      aria-hidden
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
};

export default IntroCanvas;
