// CrossingPlanner — Captain's Charter Weather
// Gulf Stream and Bahamas crossing window planner
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { msToKnots, mToFt, cToF, degToCompass, getConditionStatus, STATUS_CONFIG } from "@/lib/data";

interface CrossingRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  distance: string;
  lat: number;
  lon: number;
  notes: string;
}

const CROSSING_ROUTES: CrossingRoute[] = [
  { id: "ft-laud-bimini", name: "Ft. Lauderdale to Bimini", from: "Fort Lauderdale", to: "Bimini, Bahamas", distance: "48 nm", lat: 25.9, lon: -79.5, notes: "Classic Gulf Stream crossing. Best in NW-NE winds under 15 kt." },
  { id: "miami-bimini", name: "Miami to Bimini", from: "Miami", to: "Bimini, Bahamas", distance: "50 nm", lat: 25.7, lon: -79.5, notes: "Popular crossing. Watch for afternoon SE sea breeze buildup." },
  { id: "miami-nassau", name: "Miami to Nassau", from: "Miami", to: "Nassau, Bahamas", distance: "180 nm", lat: 25.1, lon: -78.5, notes: "Overnight passage. Gulf Stream and NE swell are primary concerns." },
  { id: "palm-beach-freeport", name: "Palm Beach to Freeport", from: "Palm Beach", to: "Freeport, Grand Bahama", distance: "75 nm", lat: 26.5, lon: -79.2, notes: "Shorter Gulf Stream crossing. Good option in light NE winds." },
  { id: "key-west-cuba", name: "Key West to Havana", from: "Key West", to: "Havana, Cuba", distance: "90 nm", lat: 24.2, lon: -81.5, notes: "Florida Straits crossing. Strong current, shipping traffic." },
  { id: "marathon-bimini", name: "Marathon to Bimini", from: "Marathon, FL Keys", to: "Bimini, Bahamas", distance: "100 nm", lat: 25.0, lon: -80.5, notes: "Longer Keys crossing. Requires favorable 2-day window." },
];

interface CrossingConditions {
  windKnots: number;
  windDir: string;
  waveFt: number;
  currentKnots: number;
  status: "go" | "caution" | "hold";
  loading: boolean;
}

function useCrossingConditions(route: CrossingRoute): CrossingConditions {
  const [data, setData] = useState<CrossingConditions>({ windKnots: 0, windDir: "--", waveFt: 0, currentKnots: 0, status: "go", loading: true });

  useEffect(() => {
    async function fetch_() {
      try {
        const [wxRes, marineRes] = await Promise.all([
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${route.lat}&longitude=${route.lon}&current=wind_speed_10m,wind_direction_10m&wind_speed_unit=ms&timezone=auto`),
          fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${route.lat}&longitude=${route.lon}&current=wave_height,ocean_current_velocity&timezone=auto`).catch(() => null),
        ]);
        const wx = await wxRes.json();
        const marine = marineRes ? await marineRes.json().catch(() => null) : null;
        const windKnots = msToKnots(wx.current.wind_speed_10m);
        const windDir = degToCompass(wx.current.wind_direction_10m);
        let waveFt = 0, currentKnots = 0;
        if (marine?.current) {
          if (marine.current.wave_height != null) waveFt = mToFt(marine.current.wave_height);
          if (marine.current.ocean_current_velocity != null) currentKnots = Math.round(msToKnots(marine.current.ocean_current_velocity) * 10) / 10;
        }
        setData({ windKnots, windDir, waveFt, currentKnots, status: getConditionStatus(windKnots, waveFt), loading: false });
      } catch {
        setData(prev => ({ ...prev, loading: false }));
      }
    }
    fetch_();
  }, [route.lat, route.lon]);

  return data;
}

function CrossingCard({ route }: { route: CrossingRoute }) {
  const cond = useCrossingConditions(route);
  const cfg = STATUS_CONFIG[cond.status];

  return (
    <div style={{ border: "1px solid #1A2D42", background: "rgba(13,21,32,0.8)" }}>
      <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)`, opacity: 0.6 }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="font-tactical text-white mb-1" style={{ fontSize: "1rem", fontWeight: 700 }}>{route.name}</div>
            <div className="font-data" style={{ fontSize: "0.62rem", color: "#7B9BB5" }}>{route.from} &rarr; {route.to}</div>
            <div className="font-data" style={{ fontSize: "0.62rem", color: "#7B9BB5" }}>{route.distance}</div>
          </div>
          <div
            className="flex-shrink-0 font-tactical font-bold px-2 py-1"
            style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
          >
            {cond.loading ? "..." : cfg.label}
          </div>
        </div>

        {!cond.loading && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="p-2" style={{ background: "rgba(10,14,20,0.6)", border: "1px solid #1A2D42" }}>
              <div className="font-data text-white" style={{ fontSize: "0.9rem", fontWeight: 600 }}>{cond.windKnots} kt</div>
              <div className="data-label">{cond.windDir} WIND</div>
            </div>
            <div className="p-2" style={{ background: "rgba(10,14,20,0.6)", border: "1px solid #1A2D42" }}>
              <div className="font-data text-white" style={{ fontSize: "0.9rem", fontWeight: 600 }}>{cond.waveFt} ft</div>
              <div className="data-label">WAVE HT</div>
            </div>
            <div className="p-2" style={{ background: "rgba(10,14,20,0.6)", border: "1px solid #1A2D42" }}>
              <div className="font-data text-white" style={{ fontSize: "0.9rem", fontWeight: 600 }}>{cond.currentKnots > 0 ? `${cond.currentKnots} kt` : "--"}</div>
              <div className="data-label">CURRENT</div>
            </div>
          </div>
        )}

        <div className="font-data" style={{ fontSize: "0.65rem", color: "#7B9BB5", lineHeight: 1.6 }}>{route.notes}</div>
      </div>
    </div>
  );
}

export default function CrossingPlanner() {
  return (
    <div style={{ paddingTop: "3.5rem" }}>
      <div className="py-12" style={{ background: "linear-gradient(180deg, #0D1520 0%, #0A0E14 100%)", borderBottom: "1px solid #1A2D42" }}>
        <div className="container">
          <div className="font-data mb-2" style={{ fontSize: "0.6rem", color: "#FF8C00", letterSpacing: "0.25em" }}>OFFSHORE PLANNING</div>
          <h1 className="font-tactical text-white mb-3" style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "0.05em" }}>CROSSING PLANNER</h1>
          <p className="font-data" style={{ fontSize: "0.75rem", color: "#7B9BB5", maxWidth: "520px", lineHeight: 1.7 }}>
            Live Go/No-Go conditions for Gulf Stream and Bahamas crossings. Data refreshes every 10 minutes.
          </p>
        </div>
      </div>

      <div className="py-12" style={{ background: "#0A0E14" }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {CROSSING_ROUTES.map(route => (
              <CrossingCard key={route.id} route={route} />
            ))}
          </div>

          <div className="mt-12 p-6" style={{ background: "rgba(13,21,32,0.8)", border: "1px solid #1A2D42" }}>
            <div className="font-data mb-3" style={{ fontSize: "0.6rem", color: "#FF8C00", letterSpacing: "0.2em" }}>NEED A PERSONALIZED CROSSING FORECAST?</div>
            <div className="font-tactical text-white mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>Book a Briefing with James Van Fleet</div>
            <div className="font-data mb-4" style={{ fontSize: "0.72rem", color: "#7B9BB5", lineHeight: 1.7 }}>
              Get a detailed, route-specific weather briefing before your Bahamas crossing or offshore passage.
            </div>
            <Link href="/book-briefing">
              <span
                className="font-tactical font-bold uppercase tracking-widest px-5 py-2 cursor-pointer transition-all duration-200"
                style={{ background: "#00D4FF", color: "#0A0E14", fontSize: "0.75rem", letterSpacing: "0.12em", display: "inline-block" }}
              >
                Book Now
              </span>
            </Link>
          </div>
        </div>
      </div>

      <footer className="py-8" style={{ background: "#0A0E14", borderTop: "1px solid #1A2D42" }}>
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-data" style={{ fontSize: "0.6rem", color: "#7B9BB5", letterSpacing: "0.1em" }}>
            CAPTAIN'S CHARTER WEATHER &copy; {new Date().getFullYear()}
          </div>
          <Link href="/">
            <span className="font-data cursor-pointer" style={{ fontSize: "0.6rem", color: "#00D4FF", letterSpacing: "0.1em" }}>&larr; HOME</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
