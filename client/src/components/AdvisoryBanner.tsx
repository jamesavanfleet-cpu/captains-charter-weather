// AdvisoryBanner.tsx — Captain's Charter Weather
// Live NOAA marine advisory banner with severity color coding and animated count
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAdvisories } from "@/hooks/useAdvisories";
import { FLORIDA_REGION_IDS, BAHAMAS_REGION_IDS, REGION_DISPLAY_NAMES } from "@/lib/advisoryData";

interface Props {
  filter?: "all" | "florida" | "bahamas";
}

function AnimatedCount({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    let current = 0;
    const step = Math.ceil(target / 12);
    const id = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(current);
      if (current >= target) clearInterval(id);
    }, 60);
    return () => clearInterval(id);
  }, [target]);
  return <>{count}</>;
}

export default function AdvisoryBanner({ filter = "all" }: Props) {
  const { alerts, loading, lastUpdated } = useAdvisories();

  const filtered = filter === "all"
    ? alerts
    : filter === "florida"
      ? alerts.filter(a => a.affectedRegions.some(r => FLORIDA_REGION_IDS.includes(r)))
      : alerts.filter(a => a.affectedRegions.some(r => BAHAMAS_REGION_IDS.includes(r)));

  const count = filtered.length;
  const severityOrder = ["extreme", "severe", "moderate", "minor", "unknown"];

  const highestSeverity = count === 0 ? null
    : filtered.reduce<string>((best, a) => {
        return severityOrder.indexOf(a.severity) < severityOrder.indexOf(best) ? a.severity : best;
      }, filtered[0].severity);

  const severityStyles: Record<string, { color: string; glow: string; label: string; pulse: boolean; bg: string; border: string }> = {
    extreme: { color: "#FF0000", glow: "#FF000060", label: "EXTREME", pulse: true, bg: "rgba(255,0,0,0.08)", border: "rgba(255,0,0,0.35)" },
    severe: { color: "#FF6600", glow: "#FF660060", label: "SEVERE", pulse: true, bg: "rgba(255,102,0,0.08)", border: "rgba(255,102,0,0.35)" },
    moderate: { color: "#FF8C00", glow: "#FF8C0060", label: "MODERATE", pulse: true, bg: "rgba(255,140,0,0.06)", border: "rgba(255,140,0,0.3)" },
    minor: { color: "#FFD700", glow: "#FFD70050", label: "MINOR", pulse: false, bg: "rgba(255,215,0,0.05)", border: "rgba(255,215,0,0.25)" },
    unknown: { color: "#7B9BB5", glow: "#7B9BB540", label: "ADVISORY", pulse: false, bg: "rgba(123,155,181,0.05)", border: "rgba(123,155,181,0.2)" },
  };
  const allClearStyle = { color: "#39FF14", glow: "#39FF1440", label: "ALL CLEAR", pulse: false, bg: "rgba(57,255,20,0.04)", border: "rgba(57,255,20,0.2)" };

  const style = count === 0 || !highestSeverity ? allClearStyle : (severityStyles[highestSeverity] ?? allClearStyle);

  const topEvents = Array.from(new Set(filtered.map(a => a.event))).slice(0, 3);
  const affectedRegions = Array.from(new Set(filtered.flatMap(a => a.affectedRegions)));

  return (
    <Link href="/advisories">
      <div>
        <div
          className="w-full cursor-pointer transition-all duration-300 group"
          style={{
            background: style.bg,
            border: `1px solid ${style.border}`,
            borderLeft: `4px solid ${style.color}`,
            boxShadow: `0 0 24px ${style.glow}, inset 0 0 40px ${style.bg}`,
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${style.glow}, inset 0 0 60px ${style.bg}`;
            (e.currentTarget as HTMLElement).style.borderColor = style.color;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${style.glow}, inset 0 0 40px ${style.bg}`;
            (e.currentTarget as HTMLElement).style.borderColor = style.border;
          }}
        >
          {/* Scan line animation */}
          <div
            style={{
              position: "absolute", top: 0, left: "-100%", width: "60%", height: "100%",
              background: `linear-gradient(90deg, transparent, ${style.color}08, transparent)`,
              animation: "scanLine 4s linear infinite", pointerEvents: "none",
            }}
          />

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 px-6 py-5">
            {/* Left: count + severity badge */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="relative flex-shrink-0">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ background: style.color, boxShadow: `0 0 12px ${style.color}, 0 0 24px ${style.glow}`, animation: style.pulse ? "pulse 1.2s ease-in-out infinite" : "none" }}
                />
                {style.pulse && (
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ background: style.color, opacity: 0.3, animation: "ping 1.2s cubic-bezier(0,0,0.2,1) infinite", transform: "scale(2)" }}
                  />
                )}
              </div>
              <div className="text-center">
                <div
                  className="font-tactical leading-none"
                  style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", fontWeight: 900, color: style.color, textShadow: `0 0 20px ${style.glow}`, lineHeight: 1 }}
                >
                  {loading ? "--" : <AnimatedCount target={count} />}
                </div>
                <div className="font-data" style={{ color: style.color, fontSize: "0.55rem", letterSpacing: "0.18em", fontWeight: 700, marginTop: 2 }}>
                  {count === 1 ? "ADVISORY" : "ADVISORIES"}
                </div>
              </div>
              <div
                className="font-data font-bold px-3 py-1 flex-shrink-0"
                style={{ background: `${style.color}18`, border: `1px solid ${style.color}60`, color: style.color, fontSize: "0.65rem", letterSpacing: "0.18em" }}
              >
                {style.label}
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px self-stretch" style={{ background: `${style.color}25` }} />

            {/* Middle: event names + regions */}
            <div className="flex-1 min-w-0">
              {count === 0 ? (
                <div>
                  <div className="font-tactical font-bold text-white" style={{ fontSize: "clamp(0.9rem, 2vw, 1.2rem)", letterSpacing: "0.05em" }}>No Active Advisories</div>
                  <div className="font-data mt-1" style={{ color: "#7B9BB5", fontSize: "0.7rem" }}>
                    Florida and Bahamas waters are clear. Last checked: {lastUpdated ?? "--"}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {topEvents.map(e => (
                      <span key={e} className="font-tactical font-bold" style={{ color: "#FFFFFF", fontSize: "clamp(0.75rem, 1.5vw, 1rem)", letterSpacing: "0.04em" }}>{e}</span>
                    ))}
                    {filtered.length > topEvents.length && (
                      <span className="font-data" style={{ color: "#7B9BB5", fontSize: "0.7rem", alignSelf: "center" }}>+{filtered.length - topEvents.length} more</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {affectedRegions.slice(0, 5).map(r => (
                      <span key={r} className="font-data" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#B8D4E8", fontSize: "0.6rem", padding: "2px 7px", letterSpacing: "0.06em" }}>
                        {REGION_DISPLAY_NAMES[r] ?? r}
                      </span>
                    ))}
                    {affectedRegions.length > 5 && (
                      <span className="font-data" style={{ color: "#7B9BB5", fontSize: "0.6rem", padding: "2px 4px" }}>+{affectedRegions.length - 5} regions</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right: refresh info + CTA */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="text-right hidden lg:block">
                <div className="font-data" style={{ color: "#7B9BB5", fontSize: "0.6rem", letterSpacing: "0.1em" }}>AUTO-REFRESHES EVERY 5 MIN</div>
                {lastUpdated && <div className="font-data" style={{ color: "#7B9BB5", fontSize: "0.6rem" }}>Updated {lastUpdated}</div>}
              </div>
              <div
                className="font-tactical font-bold px-5 py-2.5 flex items-center gap-2 transition-all duration-200 group-hover:gap-3"
                style={{ background: `${style.color}20`, border: `1px solid ${style.color}60`, color: style.color, fontSize: "0.75rem", letterSpacing: "0.12em", whiteSpace: "nowrap" }}
              >
                VIEW ADVISORIES <span style={{ fontSize: "1rem", lineHeight: 1 }}>›</span>
              </div>
            </div>
          </div>

          {/* Bottom gradient line */}
          <div style={{ height: 1, background: `linear-gradient(90deg, ${style.color}60, transparent 60%)` }} />
        </div>

        <style>{`
          @keyframes scanLine { 0% { left: -60%; } 100% { left: 160%; } }
          @keyframes ping { 75%, 100% { transform: scale(2.5); opacity: 0; } }
        `}</style>
      </div>
    </Link>
  );
}
