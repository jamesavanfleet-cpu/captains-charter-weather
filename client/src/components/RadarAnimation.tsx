// RadarAnimation.tsx — Captain's Charter Weather
// Sweeping radar display for hero section
import { useRef, useEffect } from "react";

interface RadarAnimationProps {
  size?: number;
  className?: string;
}

export default function RadarAnimation({ size = 320, className = "" }: RadarAnimationProps) {
  const lineRef = useRef<SVGLineElement>(null);
  const angleRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const animate = () => {
      angleRef.current = (angleRef.current + 0.5) % 360;
      if (lineRef.current) {
        const g = (angleRef.current - 90) * (Math.PI / 180);
        const cx = size / 2;
        const cy = size / 2;
        const r = size / 2 - 4;
        lineRef.current.setAttribute("x2", String(cx + r * Math.cos(g)));
        lineRef.current.setAttribute("y2", String(cy + r * Math.sin(g)));
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [size]);

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ filter: "drop-shadow(0 0 16px rgba(0,212,255,0.4))" }}
    >
      <defs>
        <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,212,255,0.08)" />
          <stop offset="100%" stopColor="rgba(0,212,255,0)" />
        </radialGradient>
        <radialGradient id="sweepGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,212,255,0.6)" />
          <stop offset="100%" stopColor="rgba(0,212,255,0)" />
        </radialGradient>
        <clipPath id="radarClip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>

      {/* Background */}
      <circle cx={cx} cy={cy} r={r} fill="rgba(0,14,30,0.7)" />

      {/* Range rings */}
      {[0.25, 0.5, 0.75, 1].map(x => (
        <circle key={x} cx={cx} cy={cy} r={r * x} fill="none" stroke="rgba(0,212,255,0.12)" strokeWidth="1" />
      ))}

      {/* Cross lines */}
      <line x1={cx} y1={4} x2={cx} y2={size - 4} stroke="rgba(0,212,255,0.1)" strokeWidth="1" />
      <line x1={4} y1={cy} x2={size - 4} y2={cy} stroke="rgba(0,212,255,0.1)" strokeWidth="1" />
      <line x1={cx - r * 0.707} y1={cy - r * 0.707} x2={cx + r * 0.707} y2={cy + r * 0.707} stroke="rgba(0,212,255,0.06)" strokeWidth="1" />
      <line x1={cx + r * 0.707} y1={cy - r * 0.707} x2={cx - r * 0.707} y2={cy + r * 0.707} stroke="rgba(0,212,255,0.06)" strokeWidth="1" />

      {/* Glow fill */}
      <g clipPath="url(#radarClip)">
        <circle cx={cx} cy={cy} r={r} fill="url(#radarGlow)" />
      </g>

      {/* Sweep line */}
      <line
        ref={lineRef}
        x1={cx}
        y1={cy}
        x2={cx}
        y2={cy - r}
        stroke="rgba(0,212,255,0.9)"
        strokeWidth="1.5"
        style={{ filter: "drop-shadow(0 0 4px rgba(0,212,255,0.8))" }}
      />

      {/* Center dot */}
      <circle cx={cx} cy={cy} r={3} fill="#00D4FF" style={{ filter: "drop-shadow(0 0 6px #00D4FF)" }} />

      {/* Blip dots */}
      {[
        { x: cx + r * 0.35, y: cy - r * 0.45 },
        { x: cx - r * 0.55, y: cy + r * 0.2 },
        { x: cx + r * 0.65, y: cy + r * 0.3 },
        { x: cx - r * 0.2, y: cy - r * 0.6 },
        { x: cx + r * 0.15, y: cy + r * 0.55 },
      ].map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r={2.5} fill="#FF8C00" opacity={0.7} style={{ filter: "drop-shadow(0 0 4px #FF8C00)" }} />
      ))}

      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,212,255,0.3)" strokeWidth="1.5" />

      {/* Tick marks */}
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = (i * 10 - 90) * (Math.PI / 180);
        const inner = i % 9 === 0 ? r - 10 : r - 6;
        return (
          <line
            key={i}
            x1={cx + inner * Math.cos(angle)}
            y1={cy + inner * Math.sin(angle)}
            x2={cx + r * Math.cos(angle)}
            y2={cy + r * Math.sin(angle)}
            stroke="rgba(0,212,255,0.25)"
            strokeWidth={i % 9 === 0 ? 1.5 : 0.75}
          />
        );
      })}
    </svg>
  );
}
