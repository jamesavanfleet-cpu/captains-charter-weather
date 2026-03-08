// RegionDetail — Captain's Charter Weather
// Each port card expands/collapses independently when clicked.
// No regression bars. Starts collapsed so the user taps to reveal data.
//
// ACCORDION CONTRACT -- DO NOT CHANGE WITHOUT READING THIS:
//   1. expandedPorts tracks individual port indices (not row indices).
//   2. Clicking a port header toggles ONLY that port.
//   3. The toggle handler uses a functional update (prev => ...) -- never a direct setState.
//   4. No useEffect resets expandedPorts after mount. If you need region-change reset,
//      use the useState initializer or a key prop on the parent, not useEffect.
import { useState } from "react";
import { Link, useParams } from "wouter";
import { useRegionWeather } from "@/hooks/useWeather";
import { ALL_REGIONS, STATUS_CONFIG, PortWeather } from "@/lib/data";
import WindArrow from "@/components/WindArrow";

interface PortCardProps {
  port: PortWeather;
  isExpanded: boolean;
  onToggle: () => void;
}

function PortCard({ port, isExpanded, onToggle }: PortCardProps) {
  const cfg = STATUS_CONFIG[port.conditionStatus];

  return (
    <div style={{ border: "1px solid #1A2D42", background: "rgba(13,21,32,0.8)" }}>
      {/* Header row — always visible, click to toggle */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
        style={{ background: "none", border: "none", textAlign: "left" }}
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <div>
          <div className="font-tactical text-white" style={{ fontSize: "0.95rem", fontWeight: 700 }}>{port.portName}</div>
          {port.loading ? (
            <div className="font-data" style={{ fontSize: "0.6rem", color: "#7B9BB5" }}>Loading...</div>
          ) : (
            <div className="font-data" style={{ fontSize: "0.6rem", color: cfg.color }}>{cfg.label}</div>
          )}
        </div>
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}
        >
          <path d="M3 6l5 5 5-5" stroke="#7B9BB5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Expanded content */}
      <div style={{ maxHeight: isExpanded ? "900px" : "0", overflow: "hidden", transition: "max-height 0.35s ease" }}>
        {port.loading && (
          <div className="px-4 pb-4">
            <div className="font-data text-center py-4" style={{ fontSize: "0.65rem", color: "#7B9BB5" }}>LOADING...</div>
          </div>
        )}
        {!port.loading && !port.error && (
          <div className="px-4 pb-4">
            {/* Condition tiles */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { label: "Temperature", value: `${port.tempF}°F` },
                { label: "Sea State", value: port.waveHeightFt > 0 ? `${port.waveHeightFt} ft` : "< 1 ft" },
                { label: "Wind", value: `${port.windDirLabel} ${port.windSpeedKnots} kt` },
                { label: "Rain Chance", value: "—" },
              ].map(tile => (
                <div key={tile.label} className="p-3" style={{ background: "rgba(10,14,20,0.6)", border: "1px solid #1A2D42" }}>
                  <div className="font-tactical text-white" style={{ fontSize: "1.1rem", fontWeight: 700 }}>{tile.value}</div>
                  <div className="data-label">{tile.label}</div>
                </div>
              ))}
            </div>

            {/* Wind arrow + extra stats */}
            <div className="flex items-center gap-4 mb-4">
              <WindArrow deg={port.windDirDeg} color="#00D4FF" size={28} />
              <div className="flex gap-4">
                <div>
                  <div className="font-data text-white" style={{ fontSize: "0.8rem" }}>{port.pressureInHg} inHg</div>
                  <div className="data-label">PRESSURE</div>
                </div>
                <div>
                  <div className="font-data text-white" style={{ fontSize: "0.8rem" }}>{port.humidity}%</div>
                  <div className="data-label">HUMIDITY</div>
                </div>
                {port.sstF > 0 && (
                  <div>
                    <div className="font-data text-white" style={{ fontSize: "0.8rem" }}>{port.sstF}°F</div>
                    <div className="data-label">SST</div>
                  </div>
                )}
              </div>
            </div>

            {/* Condition label */}
            <div
              className="font-data px-3 py-2 text-center"
              style={{ fontSize: "0.65rem", letterSpacing: "0.1em", color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
            >
              {port.condition}
            </div>
          </div>
        )}
        {port.error && (
          <div className="px-4 pb-4">
            <div className="font-data text-center py-4" style={{ fontSize: "0.65rem", color: "#FF8C00" }}>DATA UNAVAILABLE</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RegionDetail() {
  const params = useParams<{ regionId: string }>();
  const regionId = params.regionId ?? "";
  const region = ALL_REGIONS.find(r => r.id === regionId);
  const group = region?.group ?? "florida";

  const { ports, loading, lastUpdated, refresh } = useRegionWeather(regionId);

  // Track which individual ports are expanded by their index.
  // Starts empty (all collapsed) so the user taps to reveal data.
  const [expandedPorts, setExpandedPorts] = useState<Set<number>>(new Set());

  const togglePort = (portIndex: number) => {
    // IMPORTANT: always use functional update so we never close over stale state.
    setExpandedPorts(prev => {
      const next = new Set(prev);
      if (next.has(portIndex)) next.delete(portIndex);
      else next.add(portIndex);
      return next;
    });
  };

  // Group ports into rows of 3 for the grid layout
  const rows: { port: PortWeather; globalIndex: number }[][] = [];
  for (let i = 0; i < ports.length; i += 3) {
    rows.push(
      ports.slice(i, i + 3).map((port, j) => ({ port, globalIndex: i + j }))
    );
  }

  return (
    <div style={{ paddingTop: "3.5rem" }}>
      {/* Header */}
      <div className="py-10" style={{ background: "linear-gradient(180deg, #0D1520 0%, #0A0E14 100%)", borderBottom: "1px solid #1A2D42" }}>
        <div className="container">
          <div className="flex items-center gap-2 mb-2">
            <Link href={`/${group}`}>
              <span className="font-data cursor-pointer" style={{ fontSize: "0.6rem", color: "#7B9BB5", letterSpacing: "0.1em" }}>
                {group.toUpperCase()} &larr;
              </span>
            </Link>
          </div>
          <h1 className="font-tactical text-white mb-2" style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "0.05em" }}>
            {region?.name ?? regionId}
          </h1>
          <p className="font-data" style={{ fontSize: "0.7rem", color: "#7B9BB5" }}>{region?.description}</p>
          <div className="flex items-center gap-4 mt-3">
            <div className="font-data" style={{ fontSize: "0.6rem", color: "#7B9BB5", letterSpacing: "0.08em" }}>
              <span style={{ color: "#00D4FF" }}>MODEL RUN:</span>{" "}
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}{" "}
              {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" })}
            </div>
            {lastUpdated && (
              <div className="font-data" style={{ fontSize: "0.6rem", color: "#7B9BB5" }}>
                <span style={{ color: "#39FF14" }}>LIVE DATA:</span>{" "}{lastUpdated}
                <button
                  onClick={refresh}
                  className="ml-3 cursor-pointer"
                  style={{ color: "#00D4FF", background: "none", border: "none", fontSize: "0.6rem", fontFamily: "inherit" }}
                >
                  REFRESH
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Port accordion */}
      <div className="py-8" style={{ background: "#0A0E14" }}>
        <div className="container">
          {loading && ports.length === 0 ? (
            <div className="flex items-center gap-3 py-12">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00D4FF" }} />
              <span className="font-data" style={{ fontSize: "0.65rem", color: "#7B9BB5" }}>LOADING PORT DATA...</span>
            </div>
          ) : (
            <div className="flex flex-col gap-0">
              {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ borderBottom: "1px solid #1A2D42" }}>
                  {row.map(({ port, globalIndex }) => (
                    <PortCard
                      key={port.portName}
                      port={port}
                      isExpanded={expandedPorts.has(globalIndex)}
                      onToggle={() => togglePort(globalIndex)}
                    />
                  ))}
                  {/* Fill empty slots in last row */}
                  {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, i) => (
                    <div key={`empty-${i}`} style={{ border: "1px solid #1A2D42", background: "rgba(13,21,32,0.4)" }} />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8" style={{ background: "#0A0E14", borderTop: "1px solid #1A2D42" }}>
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-data" style={{ fontSize: "0.6rem", color: "#7B9BB5", letterSpacing: "0.1em" }}>
            CAPTAIN'S CHARTER WEATHER &copy; {new Date().getFullYear()}
          </div>
          <Link href={`/${group}`}>
            <span className="font-data cursor-pointer" style={{ fontSize: "0.6rem", color: "#00D4FF", letterSpacing: "0.1em" }}>&larr; BACK TO {group.toUpperCase()}</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
