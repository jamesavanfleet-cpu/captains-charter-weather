// ForecastHoverPanel — Captain's Charter Weather
// Fetches and displays a 7-day marine forecast for a region on hover
// Uses the first port lat/lon for the region as the representative point
import { useState, useEffect, useRef } from "react";
import { PORTS } from "@/lib/data";

interface DayForecast {
  date: string;
  dayLabel: string;
  windKnots: number;
  windDir: string;
  waveFt: number;
  maxTempF: number;
  minTempF: number;
  code: number;
}

function weatherIcon(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 2) return "⛅";
  if (code <= 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 57) return "🌦️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌧️";
  if (code <= 86) return "🌨️";
  if (code <= 99) return "⛈️";
  return "🌡️";
}

function degToCompass(deg: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

function windColor(knots: number): string {
  if (knots <= 10) return "#39FF14";
  if (knots <= 15) return "#00D4FF";
  if (knots <= 20) return "#FF8C00";
  return "#FF3C3C";
}

function waveColor(ft: number): string {
  if (ft <= 2) return "#39FF14";
  if (ft <= 4) return "#00D4FF";
  if (ft <= 6) return "#FF8C00";
  return "#FF3C3C";
}

interface Props {
  regionId: string;
  visible: boolean;
}

export default function ForecastHoverPanel({ regionId, visible }: Props) {
  const [days, setDays] = useState<DayForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const fetchedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!visible || fetchedFor.current === regionId) return;
    fetchedFor.current = regionId;

    const port = PORTS.find(p => p.regionId === regionId);
    if (!port) return;

    setLoading(true);
    setError(false);

    const wxUrl = `https://api.open-meteo.com/v1/forecast?latitude=${port.lat}&longitude=${port.lon}&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_direction_10m_dominant,weather_code&wind_speed_unit=ms&temperature_unit=fahrenheit&timezone=auto&forecast_days=7`;
    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${port.lat}&longitude=${port.lon}&daily=wave_height_max&timezone=auto&forecast_days=7`;

    Promise.all([
      fetch(wxUrl).then(r => r.json()),
      fetch(marineUrl).then(r => r.json()).catch(() => null),
    ]).then(([wx, marine]) => {
      const result: DayForecast[] = wx.daily.time.map((dateStr: string, i: number) => {
        const d = new Date(dateStr + "T12:00:00");
        const dayLabel = i === 0 ? "TODAY" : i === 1 ? "TMW" : d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
        const windMs = wx.daily.wind_speed_10m_max[i] ?? 0;
        const windKnots = Math.round(windMs * 1.94384);
        const windDeg = wx.daily.wind_direction_10m_dominant[i] ?? 0;
        const waveM = marine?.daily?.wave_height_max?.[i] ?? 0;
        const waveFt = Math.round(waveM * 3.28084 * 10) / 10;
        return {
          date: dateStr,
          dayLabel,
          windKnots,
          windDir: degToCompass(windDeg),
          waveFt,
          maxTempF: Math.round(wx.daily.temperature_2m_max[i] ?? 0),
          minTempF: Math.round(wx.daily.temperature_2m_min[i] ?? 0),
          code: wx.daily.weather_code[i] ?? 0,
        };
      });
      setDays(result);
    }).catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [visible, regionId]);

  if (!visible) return null;

  return (
    <div
      className="absolute left-0 right-0 z-50"
      style={{
        top: "calc(100% + 4px)",
        background: "#0A1520",
        border: "1px solid rgba(0,212,255,0.25)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.08)",
        padding: "12px",
        pointerEvents: "none",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="font-data text-xs" style={{ color: "#00D4FF", letterSpacing: "0.15em" }}>7-DAY MARINE FORECAST</div>
        <div className="font-data" style={{ fontSize: "0.55rem", color: "#4A6A82", letterSpacing: "0.08em" }}>OPEN-METEO</div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 py-3">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00D4FF" }} />
          <span className="font-data" style={{ fontSize: "0.6rem", color: "#7B9BB5" }}>LOADING FORECAST...</span>
        </div>
      )}

      {error && (
        <div className="font-data py-2" style={{ fontSize: "0.6rem", color: "#FF3C3C" }}>FORECAST UNAVAILABLE</div>
      )}

      {!loading && !error && days.length > 0 && (
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => (
            <div key={day.date} className="flex flex-col items-center gap-0.5" style={{ minWidth: 0 }}>
              {/* Day label */}
              <div className="font-data text-center" style={{ fontSize: "0.55rem", color: "#7B9BB5", letterSpacing: "0.06em" }}>{day.dayLabel}</div>
              {/* Weather icon */}
              <div style={{ fontSize: "0.9rem", lineHeight: 1 }}>{weatherIcon(day.code)}</div>
              {/* Temp */}
              <div className="font-data text-center" style={{ fontSize: "0.6rem", color: "#E8F4FF" }}>{day.maxTempF}°</div>
              {/* Wind */}
              <div className="font-data text-center" style={{ fontSize: "0.6rem", color: windColor(day.windKnots), letterSpacing: "0.02em" }}>{day.windKnots}kt</div>
              <div className="font-data text-center" style={{ fontSize: "0.5rem", color: "#4A6A82" }}>{day.windDir}</div>
              {/* Wave */}
              <div className="font-data text-center" style={{ fontSize: "0.6rem", color: waveColor(day.waveFt) }}>{day.waveFt}ft</div>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      {!loading && !error && days.length > 0 && (
        <div className="flex gap-3 mt-2 pt-2" style={{ borderTop: "1px solid rgba(0,212,255,0.08)" }}>
          <div className="font-data" style={{ fontSize: "0.5rem", color: "#4A6A82" }}>WIND (kt) · WAVE (ft)</div>
          <div className="flex gap-2 ml-auto">
            {[{ label: "GO", color: "#39FF14" }, { label: "CAUTION", color: "#FF8C00" }, { label: "NO-GO", color: "#FF3C3C" }].map(s => (
              <div key={s.label} className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                <span className="font-data" style={{ fontSize: "0.48rem", color: "#4A6A82" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
