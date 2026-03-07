// BestDaysCallout.tsx — Captain's Charter Weather
// 7-day outlook scored by regional conditions, with DayBar sub-component
// Restored from original bundle: ix (useBestDays), cx (DayBar), og (BestDaysCallout)
import { useState, useEffect } from "react";

// ── Types ────────────────────────────────────────────────────
interface DayData {
  date: string;
  dayLabel: string;
  goRegions: string[];
  cautionRegions: string[];
  holdRegions: string[];
  overallScore: number;
  overallStatus: "go" | "caution" | "hold";
  avgWindKnots: number;
  avgWaveFt: number;
}

// ── Region representative points ────────────────────────────
const REGION_POINTS = [
  { regionId: "nw-florida", regionName: "NW Florida", lat: 30.393, lon: -86.496 },
  { regionId: "ne-florida", regionName: "NE Florida", lat: 29.895, lon: -81.313 },
  { regionId: "central-west-florida", regionName: "Central West FL", lat: 27.965, lon: -82.8 },
  { regionId: "central-east-florida", regionName: "Central East FL", lat: 28.392, lon: -80.604 },
  { regionId: "sw-florida", regionName: "SW Florida", lat: 26.64, lon: -81.872 },
  { regionId: "se-florida", regionName: "SE Florida", lat: 26.122, lon: -80.143 },
  { regionId: "florida-keys", regionName: "The Keys", lat: 24.721, lon: -81.05 },
  { regionId: "northern-bahamas", regionName: "N. Bahamas", lat: 25.727, lon: -79.298 },
  { regionId: "central-bahamas", regionName: "C. Bahamas", lat: 25.048, lon: -77.353 },
  { regionId: "southern-bahamas", regionName: "S. Bahamas", lat: 23.2, lon: -75.1 },
];

// ── Helper functions ─────────────────────────────────────────
function msToKnots(ms: number): number {
  return Math.round(ms * 1.94384);
}
function mToFt(m: number): number {
  return Math.round(m * 3.28084 * 10) / 10;
}
function getStatus(windKnots: number, waveFt: number): "go" | "caution" | "hold" {
  return windKnots >= 25 || waveFt >= 6 ? "hold" : windKnots >= 15 || waveFt >= 3.5 ? "caution" : "go";
}
function getDayLabel(dateStr: string, idx: number): string {
  if (idx === 0) return "Today";
  if (idx === 1) return "Tomorrow";
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

// ── Status config ────────────────────────────────────────────
const STATUS_CFG = {
  go: { label: "GO", color: "#39FF14", bg: "rgba(57,255,20,0.10)", border: "rgba(57,255,20,0.35)", glow: "0 0 16px rgba(57,255,20,0.25)", barColor: "#39FF14" },
  caution: { label: "CAUTION", color: "#FF8C00", bg: "rgba(255,140,0,0.08)", border: "rgba(255,140,0,0.3)", glow: "0 0 12px rgba(255,140,0,0.15)", barColor: "#FF8C00" },
  hold: { label: "HOLD", color: "#FF3C3C", bg: "rgba(255,60,60,0.06)", border: "rgba(255,60,60,0.25)", glow: "none", barColor: "#FF3C3C" },
};

// ── useBestDays hook ─────────────────────────────────────────
function useBestDays(group: "florida" | "bahamas" | "all") {
  const [days, setDays] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const points = group === "florida"
        ? REGION_POINTS.filter(p => !p.regionId.includes("bahamas"))
        : group === "bahamas"
        ? REGION_POINTS.filter(p => p.regionId.includes("bahamas"))
        : REGION_POINTS;

      try {
        const allData = (await Promise.all(
          points.map(async (pt) => {
            try {
              const wxUrl = `https://api.open-meteo.com/v1/forecast?latitude=${pt.lat}&longitude=${pt.lon}&daily=wind_speed_10m_max&wind_speed_unit=ms&timezone=auto&forecast_days=7`;
              const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${pt.lat}&longitude=${pt.lon}&daily=wave_height_max&timezone=auto&forecast_days=7`;
              const [wxRes, marineRes] = await Promise.all([fetch(wxUrl), fetch(marineUrl).catch(() => null)]);
              const wx = await wxRes.json();
              const marine = marineRes ? await marineRes.json().catch(() => null) : null;
              return wx.daily.time.map((date: string, i: number) => {
                const windKnots = msToKnots(wx.daily.wind_speed_10m_max[i]);
                const waveFt = marine?.daily?.wave_height_max?.[i] ? mToFt(marine.daily.wave_height_max[i]) : 0;
                return { regionId: pt.regionId, regionName: pt.regionName, date, maxWindKnots: windKnots, maxWaveFt: waveFt, status: getStatus(windKnots, waveFt) };
              });
            } catch { return []; }
          })
        )).flat() as Array<{ regionId: string; regionName: string; date: string; maxWindKnots: number; maxWaveFt: number; status: "go" | "caution" | "hold" }>;

        const byDate: Record<string, typeof allData> = {};
        allData.forEach(d => { byDate[d.date] = byDate[d.date] || []; byDate[d.date].push(d); });

        const result: DayData[] = Object.keys(byDate).sort().map((date, idx) => {
          const entries = byDate[date];
          const goRegions = Array.from(new Set(entries.filter(e => e.status === "go").map(e => e.regionName)));
          const cautionRegions = Array.from(new Set(entries.filter(e => e.status === "caution").map(e => e.regionName)));
          const holdRegions = Array.from(new Set(entries.filter(e => e.status === "hold").map(e => e.regionName)));
          const avgWind = Math.round(entries.reduce((s, e) => s + e.maxWindKnots, 0) / entries.length);
          const avgWave = Math.round(entries.reduce((s, e) => s + e.maxWaveFt, 0) / entries.length * 10) / 10;
          const score = Math.round(entries.reduce((s, e) => s + (e.status === "go" ? 100 : e.status === "caution" ? 50 : 0), 0) / entries.length);
          const overallStatus: "go" | "caution" | "hold" = score >= 70 ? "go" : score >= 40 ? "caution" : "hold";
          return { date, dayLabel: getDayLabel(date, idx), goRegions, cautionRegions, holdRegions, overallScore: score, overallStatus, avgWindKnots: avgWind, avgWaveFt: avgWave };
        });

        setDays(result);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    })();
  }, [group]);

  return { days, loading };
}

// ── DayBar sub-component ─────────────────────────────────────
function DayBar({ day, isBest }: { day: DayData; isBest: boolean }) {
  const cfg = STATUS_CFG[day.overallStatus];
  return (
    <div
      className="flex-1 min-w-0 flex flex-col"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, boxShadow: isBest ? cfg.glow : "none", position: "relative", transition: "transform 0.15s ease" }}
    >
      {isBest && (
        <div className="absolute top-0 left-0 right-0 text-center font-data font-bold" style={{ background: cfg.color, color: "#0A0E14", fontSize: "0.5rem", letterSpacing: "0.15em", padding: "2px 0" }}>
          BEST DAY
        </div>
      )}
      <div className={`p-3 flex flex-col gap-2 ${isBest ? "pt-5" : ""}`}>
        <div>
          <div className="font-tactical text-white font-bold" style={{ fontSize: "0.75rem", lineHeight: 1.1 }}>{day.dayLabel}</div>
          <div className="font-data" style={{ color: "#7B9BB5", fontSize: "0.55rem" }}>{day.date}</div>
        </div>
        <div className="font-data font-bold px-2 py-0.5 text-center self-start" style={{ background: "transparent", border: `1px solid ${cfg.color}`, color: cfg.color, fontSize: "0.55rem", letterSpacing: "0.12em" }}>
          {cfg.label}
        </div>
        <div style={{ background: "#1A2D42", height: 3 }}>
          <div style={{ width: `${day.overallScore}%`, height: "100%", background: cfg.barColor, boxShadow: `0 0 6px ${cfg.barColor}50` }} />
        </div>
        <div className="flex gap-3">
          <div>
            <div className="data-label" style={{ fontSize: "0.5rem" }}>Wind</div>
            <div className="font-data font-bold" style={{ color: "#00D4FF", fontSize: "0.8rem", lineHeight: 1 }}>
              {day.avgWindKnots}<span style={{ fontSize: "0.5rem", color: "#7B9BB5" }}>kts</span>
            </div>
          </div>
          <div>
            <div className="data-label" style={{ fontSize: "0.5rem" }}>Seas</div>
            <div className="font-data font-bold" style={{ color: "#00D4FF", fontSize: "0.8rem", lineHeight: 1 }}>
              {day.avgWaveFt.toFixed(1)}<span style={{ fontSize: "0.5rem", color: "#7B9BB5" }}>ft</span>
            </div>
          </div>
        </div>
        {day.goRegions.length > 0 && (
          <div>
            <div className="data-label" style={{ fontSize: "0.5rem", color: "#39FF14" }}>GO</div>
            <div className="font-data" style={{ color: "#39FF14", fontSize: "0.55rem", lineHeight: 1.4 }}>{day.goRegions.join(", ")}</div>
          </div>
        )}
        {day.holdRegions.length > 0 && (
          <div>
            <div className="data-label" style={{ fontSize: "0.5rem", color: "#FF3C3C" }}>HOLD</div>
            <div className="font-data" style={{ color: "#FF3C3C", fontSize: "0.55rem", lineHeight: 1.4 }}>{day.holdRegions.join(", ")}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── BestDaysCallout main component ───────────────────────────
export default function BestDaysCallout({ group }: { group: "florida" | "bahamas" | "all" }) {
  const { days, loading } = useBestDays(group);
  const bestIdx = days.reduce((best, day, idx) => idx === 0 ? best : day.overallScore > (days[best]?.overallScore ?? -1) ? idx : best, 1);

  return (
    <div className="mt-10 mb-8">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <div className="font-data text-xs mb-1" style={{ color: "#FF8C00", letterSpacing: "0.2em", fontSize: "0.65rem" }}>OPERATIONAL INTELLIGENCE</div>
          <h2 className="font-tactical text-white font-bold" style={{ fontSize: "clamp(1.2rem, 3vw, 1.8rem)" }}>BEST DAYS THIS WEEK</h2>
          <p className="mt-1" style={{ color: "#7B9BB5", fontSize: "0.8rem" }}>
            7-day outlook scored by regional conditions. Avg wind and seas across all{" "}
            {group === "florida" ? "7 Florida" : group === "bahamas" ? "3 Bahamas" : "10"} regions.
          </p>
        </div>
        <div className="flex-shrink-0 font-data text-xs" style={{ color: "#7B9BB5", fontSize: "0.6rem", textAlign: "right" }}>
          <div style={{ color: "#39FF14" }}>GO = Wind &lt;15kts, Seas &lt;3.5ft</div>
          <div style={{ color: "#FF8C00" }}>CAUTION = 15-25kts or 3.5-6ft</div>
          <div style={{ color: "#FF3C3C" }}>HOLD = &gt;25kts or &gt;6ft</div>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 h-40" style={{ background: "#0D1520", border: "1px solid #1A2D42", animation: "pulse 2s infinite" }} />
          ))}
        </div>
      ) : (
        <div className="flex gap-2">
          {days.map((day, idx) => (
            <DayBar key={day.date} day={day} isBest={idx === bestIdx} />
          ))}
        </div>
      )}

      {!loading && days.length > 0 && (
        <div className="mt-3 p-3 flex items-center gap-3" style={{ background: "#0D1520", border: "1px solid #1A2D42" }}>
          <div className="flex-shrink-0 w-1.5 self-stretch" style={{ background: "#FF8C00", boxShadow: "0 0 6px rgba(255,140,0,0.5)" }} />
          <div>
            <span className="font-data font-bold" style={{ color: "#FF8C00", fontSize: "0.7rem", letterSpacing: "0.1em" }}>CAPTAIN'S RECOMMENDATION:</span>{" "}
            <span className="font-data" style={{ color: "#B8D4E8", fontSize: "0.75rem" }}>
              {days[bestIdx]
                ? `${days[bestIdx].dayLabel} looks like the best opportunity this week with avg winds of ${days[bestIdx].avgWindKnots} kts and seas at ${days[bestIdx].avgWaveFt.toFixed(1)} ft. ${days[bestIdx].goRegions.length} region${days[bestIdx].goRegions.length !== 1 ? "s" : ""} at GO status.`
                : "Check individual regions for the best departure windows."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
