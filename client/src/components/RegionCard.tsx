// RegionCard — Captain's Charter Weather
// Displays region name, status badge, avg wind/wave, and 7-day forecast on hover
import { useState } from "react";
import { Link } from "wouter";
import { STATUS_CONFIG, ConditionStatus } from "@/lib/data";
import ForecastHoverPanel from "@/components/ForecastHoverPanel";

interface RegionCardProps {
  id: string;
  name: string;
  shortName: string;
  description: string;
  overallStatus: ConditionStatus;
  avgWindKnots: number;
  avgWaveFt: number;
  loading: boolean;
  group: "florida" | "bahamas";
}

export default function RegionCard({
  id, name, description, overallStatus, avgWindKnots, avgWaveFt, loading, group
}: RegionCardProps) {
  const cfg = STATUS_CONFIG[overallStatus];
  const href = `/${group}/${id}`;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={href}>
        <div
          className="region-card h-full cursor-pointer transition-all duration-200"
          style={{
            minHeight: 160,
            boxShadow: hovered ? `0 0 0 1px ${cfg.color}40, 0 4px 20px rgba(0,0,0,0.4)` : undefined,
          }}
        >
          {/* Status bar top */}
          <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)`, opacity: hovered ? 1 : 0.6, transition: "opacity 0.2s" }} />
          <div className="p-4 flex flex-col gap-3 h-full">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-tactical text-white leading-tight" style={{ fontSize: "1rem", fontWeight: 700 }}>
                  {name}
                </div>
                <div className="font-data mt-1" style={{ fontSize: "0.65rem", color: "#7B9BB5", lineHeight: 1.4 }}>
                  {description}
                </div>
              </div>
              {/* Status badge */}
              <div
                className="flex-shrink-0 font-tactical font-bold px-2 py-1"
                style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
              >
                {loading ? "..." : cfg.label}
              </div>
            </div>

            {/* Wind / Wave stats */}
            {!loading && (
              <div className="flex gap-4 mt-auto">
                <div>
                  <div className="font-data" style={{ fontSize: "1.1rem", fontWeight: 600, color: "#E8F4FF" }}>{avgWindKnots} kt</div>
                  <div className="data-label">AVG WIND</div>
                </div>
                <div>
                  <div className="font-data" style={{ fontSize: "1.1rem", fontWeight: 600, color: "#E8F4FF" }}>{avgWaveFt} ft</div>
                  <div className="data-label">AVG WAVE</div>
                </div>
              </div>
            )}
            {loading && (
              <div className="flex gap-2 mt-auto items-center">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00D4FF" }} />
                <span className="font-data" style={{ fontSize: "0.6rem", color: "#7B9BB5" }}>LOADING DATA...</span>
              </div>
            )}

            {/* Hover hint */}
            <div className="flex justify-between items-center">
              <div
                className="font-data transition-opacity duration-200"
                style={{ fontSize: "0.5rem", color: "#4A6A82", letterSpacing: "0.08em", opacity: hovered ? 1 : 0 }}
              >
                7-DAY FORECAST ▼
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke={cfg.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </Link>

      {/* 7-day forecast panel — shown on hover, positioned below card */}
      <ForecastHoverPanel regionId={id} visible={hovered} />
    </div>
  );
}
