"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Segment = {
  name: string;
  value: number;
  color: string;
  kpi: string;
};

type Props = {
  data: Segment[];
};

export default function TokenomicsChart({ data }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const size = 260;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const GAP = 0.6;

  /**
   * Geometry (immutable)
   */
  const segments = useMemo(() => {
    const total = data.reduce((sum, d) => sum + d.value, 0);

    return data.map((item, index) => {
      const acc = data.slice(0, index).reduce((s, d) => s + d.value, 0);

      const start = (acc / total) * 360;
      const angle = (item.value / total) * 360;

      return {
        ...item,
        startAngle: start,
        endAngle: start + angle,
      };
    });
  }, [data]);

  /**
   * Angle-based hover detection (stable)
   */
  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - center;
    const y = e.clientY - rect.top - center;

    const dist = Math.sqrt(x * x + y * y);

    if (dist < radius - strokeWidth || dist > radius + strokeWidth) {
      setActiveIndex(null);
      return;
    }

    let angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
    if (angle < 0) angle += 360;

    const index = segments.findIndex((seg) => {
      const start = seg.startAngle + GAP / 2;
      const end = seg.endAngle - GAP / 2;
      return angle >= start && angle <= end;
    });

    setActiveIndex(index === -1 ? null : index);
  };

  const active = activeIndex !== null ? segments[activeIndex] : null;

  return (
    <div className="relative w-[260px] h-[260px] mx-auto">
      <svg
        ref={svgRef}
        width={size}
        height={size}
        onMouseMove={handleMove}
        onMouseLeave={() => setActiveIndex(null)}
      >
        {/* Dynamic Gradients */}
        <defs>
          {segments.map((seg, i) => (
            <linearGradient
              key={i}
              id={`grad-${i}`}
              x1="0%"
              y1="50%"
              x2="100%"
              y2="50%"
            >
              <stop offset="0%" stopColor={seg.color} stopOpacity="0.6" />
              <stop offset="100%" stopColor={seg.color} />
            </linearGradient>
          ))}
        </defs>

        {/* Base ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Segments */}
        <g style={{ isolation: "isolate" }}>
          {segments.map((seg, i) => {
            const startA = seg.startAngle + GAP / 2;
            const endA = seg.endAngle - GAP / 2;

            if (endA <= startA) return null;

            const start = polar(center, radius, endA);
            const end = polar(center, radius, startA);

            const largeArc = endA - startA > 180 ? 1 : 0;

            const d = `
              M ${start.x} ${start.y}
              A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}
            `;

            const isActive = activeIndex === i;

            return (
              <g key={seg.name}>
                {/* Glow layer */}
                <motion.path
                  d={d}
                  stroke={`url(#grad-${i})`}
                  strokeWidth={strokeWidth + 6}
                  fill="none"
                  initial={false}
                  animate={{
                    opacity: isActive ? 0.25 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 20,
                  }}
                />

                {/* Main arc */}
                <motion.path
                  d={d}
                  stroke={`url(#grad-${i})`}
                  strokeWidth={strokeWidth}
                  strokeLinecap="butt"
                  fill="none"
                  initial={false}
                  animate={{
                    opacity: activeIndex === null ? 1 : isActive ? 1 : 0.15,
                    scale: isActive ? 1.02 : 1,
                  }}
                  style={{ transformOrigin: "center" }}
                  transition={{
                    type: "spring",
                    stiffness: 160,
                    damping: 18,
                  }}
                />
              </g>
            );
          })}
        </g>
      </svg>

      {/* Center KPI */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={active ? active.name : "default"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 16,
            }}
          >
            <p className="text-xs uppercase tracking-wider text-white/40">
              {active ? active.name : "Total Supply"}
            </p>

            <p className="text-xl font-semibold">
              {active ? `${active.value}%` : "1B OGT"}
            </p>

            <p className="text-xs mt-1" style={{ color: active?.color }}>
              {active ? active.kpi : "Token Distribution"}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * Polar helper
 */
function polar(c: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: c + r * Math.cos(rad),
    y: c + r * Math.sin(rad),
  };
}
