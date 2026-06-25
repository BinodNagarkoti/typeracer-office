"use client";

import { useEffect, useRef, useMemo } from "react";
import { motion, useMotionValue, useTransform, animate, MotionValue } from "framer-motion";

interface RaceTrackProps {
  wpm: number;
  accuracy: number;
  isPlaying: boolean;
  isPaused?: boolean;
}

const MIN_SPEED = 0;
const MAX_SPEED = 200;
const MIN_WPM = 0;
const MAX_WPM = 150;

function getSpeedFromWPM(wpm: number): number {
  const normalized = Math.min(Math.max((wpm - MIN_WPM) / (MAX_WPM - MIN_WPM), 0), 1);
  return MIN_SPEED + normalized * (MAX_SPEED - MIN_SPEED);
}

export function RaceTrack({ wpm, accuracy, isPlaying, isPaused }: RaceTrackProps) {
  const speedMV = useMotionValue(0);
  const roadOffset = useMotionValue(0);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const targetSpeed = isPlaying && !isPaused ? getSpeedFromWPM(wpm) : 0;
    animate(speedMV, targetSpeed, { duration: 0.8, ease: "easeOut" });
  }, [wpm, isPlaying, isPaused, speedMV]);

  useEffect(() => {
    let lastTime = performance.now();
    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      const speed = speedMV.get();
      if (speed > 0) {
        const currentOffset = roadOffset.get();
        roadOffset.set((currentOffset + speed * dt * 60) % 800);
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [speedMV, roadOffset]);

  const shakeY = useMotionValue(0);

  useEffect(() => {
    const unsub = speedMV.on("change", (v) => {
      const shakeAmount = v > 80 ? Math.sin(Date.now() * 0.02) * (v / 100) : 0;
      shakeY.set(shakeAmount);
    });
    return unsub;
  }, [speedMV, shakeY]);

  const roadLines = useMemo(() => Array.from({ length: 16 }, (_, i) => i), []);
  const scenery = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i): { id: number; x: number; side: "top" | "bottom"; size: number } => ({
        id: i,
        x: (i / 12) * 100,
        side: i % 2 === 0 ? "top" : "bottom",
        size: 0.5 + Math.random() * 0.8,
      })),
    []
  );

  return (
    <div className="relative w-full h-40 sm:h-48 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--muted)]">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--muted) 60%, var(--success) 10%) 0%, var(--muted) 30%, var(--muted) 70%, color-mix(in srgb, var(--muted) 60%, var(--success) 10%) 100%)",
        }}
      />

      {/* Road surface — horizontal band */}
      <div className="absolute inset-y-0 left-0 right-0 top-1/2 -translate-y-1/2 h-20 sm:h-24">
        {/* Asphalt */}
        <div className="absolute inset-0 bg-[#374151] dark:bg-[#1f2937]" />

        {/* Shoulder lines — top and bottom edges */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-400/60" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400/60" />

        {/* Center dashed line — scrolls left */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 flex items-center overflow-hidden">
          {roadLines.map((i) => (
            <RoadLine key={i} offset={roadOffset} index={i} count={roadLines.length} />
          ))}
        </div>

        {/* Scenery above road */}
        {scenery
          .filter((s) => s.side === "top")
          .map((item) => (
            <SceneryElement key={item.id} offset={roadOffset} x={item.x} side="top" size={item.size} />
          ))}

        {/* Scenery below road */}
        {scenery
          .filter((s) => s.side === "bottom")
          .map((item) => (
            <SceneryElement key={item.id} offset={roadOffset} x={item.x} side="bottom" size={item.size} />
          ))}
      </div>

      {/* Player Car — positioned on the road, facing right */}
      <motion.div
        className="absolute z-20"
        style={{
          left: "30%",
          top: "50%",
          x: "-50%",
          y: "-50%",
          translateY: shakeY,
          opacity: isPaused ? 0.4 : 1,
          filter: isPaused ? "grayscale(1)" : "none",
          transition: "opacity 0.3s, filter 0.3s",
        }}
      >
        <PlayerCar wpm={wpm} speed={speedMV} />
      </motion.div>

      {/* Speed indicator — top right */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-2 bg-[var(--background)]/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-[var(--border)]">
        <Speedometer wpm={wpm} />
        <div className="text-right">
          <p className="text-xs text-[var(--muted-foreground)] leading-none">Speed</p>
          <p className="text-sm font-bold text-[var(--foreground)] leading-tight">{wpm} WPM</p>
        </div>
      </div>

      {/* Exhaust particles — trailing behind car (to the left) */}
      <ExhaustParticles speed={speedMV} />

      {/* Status overlay */}
      {!isPlaying && wpm === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--background)]/40 z-30">
          <p className="text-[var(--muted-foreground)] font-medium">Start typing to race!</p>
        </div>
      )}
    </div>
  );
}

function RoadLine({ offset, index, count }: { offset: MotionValue<number>; index: number; count: number }) {
  const x = useTransform(offset, (o) => {
    const base = (index / count) * 100;
    const shift = (o / 800) * 100;
    return ((base - shift) % 100 + 100) % 100;
  });

  return (
    <motion.div
      className="absolute h-1.5 w-8 bg-white/70 dark:bg-white/50 rounded-full flex-shrink-0"
      style={{ left: useTransform(x, (v) => `${v}%`) }}
    />
  );
}

function SceneryElement({
  offset,
  x,
  side,
  size,
}: {
  offset: MotionValue<number>;
  x: number;
  side: "top" | "bottom";
  size: number;
}) {
  const posX = useTransform(offset, (o) => {
    const shift = (o / 800) * 100;
    return ((x - shift * 0.5 + 200) % 200 - 50);
  });

  const iconSize = 10 * size;

  return (
    <motion.div
      className="absolute z-10"
      style={{
        top: side === "top" ? "-4px" : "auto",
        bottom: side === "bottom" ? "-4px" : "auto",
        opacity: useTransform(posX, (v) => (v < -10 || v > 110 ? 0 : 0.7)),
      }}
    >
      <motion.div style={{ left: useTransform(posX, (v) => `${v}%`) }} className="absolute">
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" className="text-green-600 dark:text-green-500">
          <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.6" />
          <circle cx="12" cy="8" r="6" fill="currentColor" opacity="0.8" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function PlayerCar({ wpm, speed }: { wpm: number; speed: MotionValue<number> }) {
  const bounceY = useMotionValue(0);

  useEffect(() => {
    let frame: number;
    const tick = () => {
      const s = speed.get();
      const bounce = s > 0 ? Math.sin(Date.now() * 0.012) * (s / 150) * 2 : 0;
      bounceY.set(bounce);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [speed, bounceY]);

  const carColor = wpm > 120 ? "#ef4444" : wpm > 80 ? "#f59e0b" : wpm > 40 ? "#22c55e" : "#3b82f6";

  return (
    <motion.div style={{ y: bounceY }}>
      {/* Car facing RIGHT — rotated 90° from top-down */}
      <svg width="90" height="50" viewBox="0 0 90 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Car body */}
        <rect x="10" y="8" width="65" height="34" rx="8" fill={carColor} />
        {/* Windshield */}
        <rect x="42" y="12" width="16" height="26" rx="4" fill="#1e293b" opacity="0.8" />
        {/* Headlights — front (right side) */}
        <circle cx="73" cy="16" r="3" fill="#fef08a" />
        <circle cx="73" cy="34" r="3" fill="#fef08a" />
        {/* Tail lights — rear (left side) */}
        <rect x="10" y="13" width="4" height="8" rx="2" fill="#ef4444" />
        <rect x="10" y="29" width="4" height="8" rx="2" fill="#ef4444" />
        {/* Wheels — top and bottom */}
        <rect x="22" y="2" width="14" height="6" rx="3" fill="#1f2937" />
        <rect x="22" y="42" width="14" height="6" rx="3" fill="#1f2937" />
        <rect x="52" y="2" width="14" height="6" rx="3" fill="#1f2937" />
        <rect x="52" y="42" width="14" height="6" rx="3" fill="#1f2937" />
        {/* Racing stripe */}
        <rect x="12" y="22" width="58" height="6" rx="3" fill="white" opacity="0.25" />
      </svg>
    </motion.div>
  );
}

function ExhaustParticles({ speed }: { speed: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{ x: number; y: number; life: number; vx: number; vy: number; size: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    let frame: number;
    const tick = () => {
      const s = speed.get();
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);

      if (s > 10) {
        const spawnRate = Math.min(s / 15, 4);
        for (let i = 0; i < spawnRate; i++) {
          if (Math.random() > 0.4) {
            particlesRef.current.push({
              x: w * 0.30 - 10,
              y: h * 0.5 + (Math.random() - 0.5) * 10,
              life: 1,
              vx: -(1 + Math.random() * 2),
              vy: (Math.random() - 0.5) * 0.8,
              size: 2 + Math.random() * 4,
            });
          }
        }
      }

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life -= 0.025;
        p.x += p.vx;
        p.y += p.vy;
        p.size *= 0.97;

        if (p.life <= 0) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(156, 163, 175, ${p.life * 0.4})`;
        ctx.fill();

        return true;
      });

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [speed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function Speedometer({ wpm }: { wpm: number }) {
  const normalized = Math.min(wpm / 150, 1);
  const rotation = -90 + normalized * 180;

  const needleColor =
    normalized > 0.8 ? "var(--destructive)" : normalized > 0.5 ? "var(--warning)" : "var(--success)";

  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" stroke="var(--border)" strokeWidth="2" />
      <path
        d="M 4 16 A 12 12 0 0 1 28 16"
        stroke="var(--border)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 4 16 A 12 12 0 0 1 28 16"
        stroke={needleColor}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${normalized * 37.7} 37.7`}
      />
      <line
        x1="16"
        y1="16"
        x2={16 + Math.cos((rotation * Math.PI) / 180) * 10}
        y2={16 + Math.sin((rotation * Math.PI) / 180) * 10}
        stroke={needleColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="2" fill={needleColor} />
    </svg>
  );
}
