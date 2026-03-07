// Home — Captain's Charter Weather
// Hero section with radar animation, advisory banner, station cards, region grids, James bio, footer
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAllRegionSummaries } from "@/hooks/useWeather";
import RegionCard from "@/components/RegionCard";
import RadarAnimation from "@/components/RadarAnimation";
import AdvisoryBanner from "@/components/AdvisoryBanner";
import { FLORIDA_REGIONS, BAHAMAS_REGIONS } from "@/lib/data";

// Original CDN image URLs from the deployed site
const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663406926581/XwqGkC8enbjiHeGw5kN7dR/ccw-hero-5Kv7STFi8kKjdDSC9zwjBQ.webp";
const FISHING_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663406926581/XwqGkC8enbjiHeGw5kN7dR/ccw-fishing-VjyA5MqV6Z98Fi2QkgFCcV.webp";
const CHARTER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663406926581/XwqGkC8enbjiHeGw5kN7dR/ccw-charter-CS64yaXzcujFbNEgXaihxE.webp";
const YACHT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663406926581/XwqGkC8enbjiHeGw5kN7dR/ccw-yacht-7ceL6BSdYc8c3Hj6sCU8Rg.webp";
const FLORIDA_MAP_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663406926581/XwqGkC8enbjiHeGw5kN7dR/ccw-florida-map-MfpyjztKsWPoMYbttgPwGm.webp";

function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="font-data" style={{ color: "#00D4FF" }}>{time}</span>;
}

export default function Home() {
  const floridaSummaries = useAllRegionSummaries("florida");
  const bahamasSummaries = useAllRegionSummaries("bahamas");

  const getSummary = (regionId: string) => {
    const s = [...floridaSummaries, ...bahamasSummaries].find(x => x.regionId === regionId);
    return s ?? { regionId, overallStatus: "go" as const, avgWindKnots: 0, avgWaveFt: 0, avgSstF: 0, loading: true };
  };

  return (
    <div style={{ background: "#0A0E14", minHeight: "100vh" }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: "calc(100vh - 200px)", maxHeight: "78vh", display: "flex", alignItems: "center" }}
      >
        {/* Hero background image */}
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "center 40%", backgroundRepeat: "no-repeat" }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 hero-overlay" />
        {/* Scanlines */}
        <div className="absolute inset-0 scanlines" />

        <div className="container relative z-10 pt-12">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left: text */}
            <div className="flex-1 text-left">
              <div className="flex items-center gap-4 mb-4">
                <span className="status-live">Live Data Active</span>
                <span className="font-data text-xs" style={{ color: "#7B9BB5", fontSize: "0.65rem" }}>
                  <LiveClock />
                </span>
              </div>
              <h1 className="font-tactical text-white leading-none mb-4" style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)", fontWeight: 900, letterSpacing: "0.02em" }}>
                <span className="block">WEATHER INTELLIGENCE</span>
                <span className="block glow-cyan" style={{ color: "#00D4FF" }}>FOR CAPTAINS</span>
                <span className="block text-white" style={{ opacity: 0.9 }}>WHO NEED TO KNOW</span>
              </h1>
              <p className="mb-5 max-w-xl" style={{ color: "#B8D4E8", fontSize: "clamp(0.95rem, 2vw, 1.15rem)", lineHeight: 1.6, fontWeight: 300 }}>
                Professional marine weather intelligence for Florida and the Bahamas. Tailored for fishing captains, charter operators, yacht owners, and anyone planning time on the water. By{" "}
                <strong style={{ color: "#E8F4FD", fontWeight: 600 }}>James Van Fleet</strong>, former Chief Meteorologist of Royal Caribbean.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/florida">
                  <button
                    className="font-tactical font-bold uppercase tracking-widest px-6 py-3 transition-all duration-200"
                    style={{ background: "#00D4FF", color: "#0A0E14", fontSize: "0.85rem", letterSpacing: "0.12em", border: "none" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#33DDFF"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#00D4FF"; }}
                  >
                    Florida Forecast
                  </button>
                </Link>
                <Link href="/bahamas">
                  <button
                    className="font-tactical font-bold uppercase tracking-widest px-6 py-3 transition-all duration-200"
                    style={{ background: "transparent", color: "#00D4FF", fontSize: "0.85rem", letterSpacing: "0.12em", border: "1px solid rgba(0,212,255,0.5)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,212,255,0.1)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    Bahamas Forecast
                  </button>
                </Link>
              </div>
              {/* Stats row */}
              <div className="flex gap-8 mt-6">
                {[{ value: "10", unit: "Regions", label: "FL + Bahamas" }, { value: "40+", unit: "Ports", label: "Live Data" }, { value: "2x", unit: "Daily", label: "Briefings" }].map(s => (
                  <div key={s.label}>
                    <div className="font-data font-bold" style={{ color: "#00D4FF", fontSize: "1.4rem", lineHeight: 1 }}>{s.value}</div>
                    <div className="font-tactical text-white" style={{ fontSize: "0.75rem", fontWeight: 600 }}>{s.unit}</div>
                    <div className="data-label" style={{ fontSize: "0.6rem" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: radar animation */}
            <div className="flex-shrink-0 hidden lg:block">
              <RadarAnimation size={280} />
              <div className="text-center mt-3 font-data text-xs" style={{ color: "#7B9BB5", fontSize: "0.6rem", letterSpacing: "0.15em" }}>
                MARINE SURVEILLANCE ACTIVE
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10">
          <div className="font-data text-xs" style={{ color: "#7B9BB5", fontSize: "0.6rem", letterSpacing: "0.15em" }}>SCROLL FOR INTEL</div>
          <div className="w-px h-8" style={{ background: "linear-gradient(to bottom, rgba(0,212,255,0.5), transparent)" }} />
        </div>
      </section>

      {/* ── Advisory Banner ──────────────────────────────────── */}
      <section style={{ background: "#0A0E14", padding: "0" }}>
        <div className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
          <div className="font-data text-xs mb-3" style={{ color: "#FF8C00", letterSpacing: "0.2em" }}>NOAA MARINE ADVISORIES · LIVE</div>
          <AdvisoryBanner />
        </div>
      </section>

      {/* ── Station Cards ─────────────────────────────────────── */}
      <section className="py-20" style={{ background: "#0A0E14" }}>
        <div className="container">
          <div className="mb-10">
            <div className="font-data text-xs mb-2" style={{ color: "#00D4FF", letterSpacing: "0.2em" }}>SELECT YOUR STATION</div>
            <h2 className="font-tactical text-white" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800 }}>WHO ARE YOU ON THE WATER?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Station 01 — Fishing Captains */}
            <Link href="/florida">
              <div className="station-card h-full cursor-pointer">
                <div className="relative overflow-hidden" style={{ height: 200 }}>
                  <img
                    src={FISHING_IMG}
                    alt="Offshore fishing"
                    className="w-full h-full object-cover"
                    style={{ transition: "transform 0.4s ease" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,21,32,0.95) 0%, rgba(13,21,32,0.2) 60%)" }} />
                  <div className="absolute bottom-3 left-4">
                    <div className="font-data text-xs mb-1" style={{ color: "#FF8C00", fontSize: "0.6rem", letterSpacing: "0.15em" }}>STATION 01</div>
                    <div className="font-tactical text-white font-bold" style={{ fontSize: "1.2rem" }}>Fishing Captains</div>
                  </div>
                </div>
                <div className="p-4">
                  <p style={{ color: "#7B9BB5", fontSize: "0.85rem", lineHeight: 1.5 }}>Offshore conditions, Gulf Stream position, sea surface temps, and go/no-go assessments for your grounds.</p>
                  <div className="mt-3 font-tactical text-xs font-bold" style={{ color: "#00D4FF", fontSize: "0.7rem", letterSpacing: "0.1em" }}>CHECK CONDITIONS ›</div>
                </div>
              </div>
            </Link>

            {/* Station 02 — Day Charter Captains */}
            <Link href="/florida">
              <div className="station-card h-full cursor-pointer">
                <div className="relative overflow-hidden" style={{ height: 200 }}>
                  <img
                    src={CHARTER_IMG}
                    alt="Day charter catamaran"
                    className="w-full h-full object-cover"
                    style={{ transition: "transform 0.4s ease" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,21,32,0.95) 0%, rgba(13,21,32,0.2) 60%)" }} />
                  <div className="absolute bottom-3 left-4">
                    <div className="font-data text-xs mb-1" style={{ color: "#FF8C00", fontSize: "0.6rem", letterSpacing: "0.15em" }}>STATION 02</div>
                    <div className="font-tactical text-white font-bold" style={{ fontSize: "1.2rem" }}>Day Charter Captains</div>
                  </div>
                </div>
                <div className="p-4">
                  <p style={{ color: "#7B9BB5", fontSize: "0.85rem", lineHeight: 1.5 }}>Passenger comfort forecasts, sea state assessments, and hourly breakdowns for planning your day trips.</p>
                  <div className="mt-3 font-tactical text-xs font-bold" style={{ color: "#00D4FF", fontSize: "0.7rem", letterSpacing: "0.1em" }}>CHECK CONDITIONS ›</div>
                </div>
              </div>
            </Link>

            {/* Station 03 — Yacht Owners */}
            <Link href="/florida">
              <div className="station-card h-full cursor-pointer">
                <div className="relative overflow-hidden" style={{ height: 200 }}>
                  <img
                    src={YACHT_IMG}
                    alt="Superyacht underway"
                    className="w-full h-full object-cover"
                    style={{ transition: "transform 0.4s ease" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,21,32,0.95) 0%, rgba(13,21,32,0.2) 60%)" }} />
                  <div className="absolute bottom-3 left-4">
                    <div className="font-data text-xs mb-1" style={{ color: "#FF8C00", fontSize: "0.6rem", letterSpacing: "0.15em" }}>STATION 03</div>
                    <div className="font-tactical text-white font-bold" style={{ fontSize: "1.2rem" }}>Yacht Owners</div>
                  </div>
                </div>
                <div className="p-4">
                  <p style={{ color: "#7B9BB5", fontSize: "0.85rem", lineHeight: 1.5 }}>Passage planning, anchorage conditions, and multi-day forecasts for Florida and Bahamas transits.</p>
                  <div className="mt-3 font-tactical text-xs font-bold" style={{ color: "#00D4FF", fontSize: "0.7rem", letterSpacing: "0.1em" }}>CHECK CONDITIONS ›</div>
                </div>
              </div>
            </Link>

            {/* Station 04 — Book a Charter */}
            <div className="station-card h-full cursor-pointer" style={{ border: "1px solid rgba(0,212,255,0.25)" }}>
              <div className="relative overflow-hidden flex flex-col items-center justify-center" style={{ height: 200, background: "linear-gradient(135deg, #0D1520 0%, #0A1828 100%)" }}>
                <svg viewBox="0 0 200 200" width="160" height="160" style={{ opacity: 0.15, position: "absolute" }}>
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#00D4FF" strokeWidth="1" />
                  <circle cx="100" cy="100" r="60" fill="none" stroke="#00D4FF" strokeWidth="1" />
                  <circle cx="100" cy="100" r="30" fill="none" stroke="#00D4FF" strokeWidth="1" />
                  <line x1="100" y1="10" x2="100" y2="190" stroke="#00D4FF" strokeWidth="0.5" />
                  <line x1="10" y1="100" x2="190" y2="100" stroke="#00D4FF" strokeWidth="0.5" />
                </svg>
                <div className="relative z-10 text-center px-4">
                  <div className="font-data text-xs mb-2" style={{ color: "#FF8C00", fontSize: "0.6rem", letterSpacing: "0.15em" }}>STATION 04</div>
                  <div className="font-tactical text-white font-bold" style={{ fontSize: "1.2rem" }}>Book a Charter</div>
                  <div className="font-data text-xs mt-2" style={{ color: "#7B9BB5", fontSize: "0.7rem" }}>Know before you go</div>
                </div>
              </div>
              <div className="p-4">
                <p style={{ color: "#7B9BB5", fontSize: "0.85rem", lineHeight: 1.5 }}>Planning a charter trip? Get a personalized weather briefing before you book to ensure ideal conditions.</p>
                <a
                  href="mailto:james@captainscharterweather.com"
                  className="mt-3 font-tactical text-xs font-bold block"
                  style={{ color: "#00D4FF", fontSize: "0.7rem", letterSpacing: "0.1em" }}
                >
                  REQUEST BRIEFING ›
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Florida & Bahamas map banner ─────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: 320 }}>
        <img src={FLORIDA_MAP_IMG} alt="Florida and Bahamas tactical chart" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.6 }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(10,14,20,0.9) 0%, rgba(10,14,20,0.5) 50%, rgba(10,14,20,0.9) 100%)" }} />
        <div className="container relative z-10 py-16 flex flex-col items-center text-center">
          <div className="font-data text-xs mb-3" style={{ color: "#FF8C00", letterSpacing: "0.2em" }}>OPERATIONAL AREA</div>
          <h2 className="font-tactical text-white mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900 }}>FLORIDA &amp; THE BAHAMAS</h2>
          <p style={{ color: "#B8D4E8", maxWidth: 600, fontSize: "1rem", lineHeight: 1.6 }}>
            Seven Florida regions from the Panhandle to the Keys, plus comprehensive Bahamas coverage from Bimini to the Southern Out Islands. Real-time data updated every 10 minutes.
          </p>
          <div className="flex gap-6 mt-8">
            {[{ n: "7", label: "Florida Regions" }, { n: "3", label: "Bahamas Regions" }, { n: "40+", label: "Live Ports" }].map((s, i) => (
              <div key={s.label} className="flex items-center gap-6">
                {i > 0 && <div style={{ width: 1, background: "#1A2D42", height: 40 }} />}
                <div className="text-center">
                  <div className="font-data font-bold glow-cyan" style={{ color: "#00D4FF", fontSize: "2rem" }}>{s.n}</div>
                  <div className="data-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Florida Regions ───────────────────────────────────── */}
      <section className="py-20" style={{ background: "#0A0E14" }}>
        <div className="container">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <div className="font-data text-xs mb-2" style={{ color: "#00D4FF", letterSpacing: "0.2em" }}>OPERATIONAL ZONE ALPHA</div>
              <h2 className="font-tactical text-white" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800 }}>FLORIDA REGIONS</h2>
              <p className="mt-2" style={{ color: "#7B9BB5", fontSize: "0.9rem" }}>Panhandle to the Keys — Atlantic and Gulf coasts</p>
            </div>
            <Link href="/florida">
              <button
                className="font-tactical font-bold uppercase tracking-widest px-5 py-2.5 flex-shrink-0 transition-all duration-200"
                style={{ background: "transparent", border: "1px solid rgba(0,212,255,0.35)", color: "#00D4FF", fontSize: "0.75rem", letterSpacing: "0.12em" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,212,255,0.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                All Florida
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {FLORIDA_REGIONS.map(r => {
              const s = getSummary(r.id);
              return (
                <RegionCard
                  key={r.id}
                  id={r.id}
                  name={r.name}
                  shortName={r.shortName}
                  description={r.description}
                  overallStatus={s.overallStatus}
                  avgWindKnots={s.avgWindKnots}
                  avgWaveFt={s.avgWaveFt}
                  loading={s.loading}
                  group="florida"
                />
              );
            })}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── Bahamas Regions ───────────────────────────────────── */}
      <section className="py-20" style={{ background: "#0A0E14" }}>
        <div className="container">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <div className="font-data text-xs mb-2" style={{ color: "#FF8C00", letterSpacing: "0.2em" }}>OPERATIONAL ZONE BRAVO</div>
              <h2 className="font-tactical text-white" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800 }}>THE BAHAMAS</h2>
              <p className="mt-2" style={{ color: "#7B9BB5", fontSize: "0.9rem" }}>Grand Bahama to the Southern Out Islands</p>
            </div>
            <Link href="/bahamas">
              <button
                className="font-tactical font-bold uppercase tracking-widest px-5 py-2.5 flex-shrink-0 transition-all duration-200"
                style={{ background: "transparent", border: "1px solid rgba(255,140,0,0.35)", color: "#FF8C00", fontSize: "0.75rem", letterSpacing: "0.12em" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,140,0,0.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                All Bahamas
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BAHAMAS_REGIONS.map(r => {
              const s = getSummary(r.id);
              return (
                <RegionCard
                  key={r.id}
                  id={r.id}
                  name={r.name}
                  shortName={r.shortName}
                  description={r.description}
                  overallStatus={s.overallStatus}
                  avgWindKnots={s.avgWindKnots}
                  avgWaveFt={s.avgWaveFt}
                  loading={s.loading}
                  group="bahamas"
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ── James Van Fleet bio ───────────────────────────────── */}
      <section className="py-20" style={{ background: "#0D1520", borderTop: "1px solid #1A2D42" }}>
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="font-data text-xs mb-3" style={{ color: "#00D4FF", letterSpacing: "0.2em" }}>YOUR METEOROLOGIST</div>
            <h2 className="font-tactical text-white mb-6" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800 }}>JAMES VAN FLEET</h2>
            <p style={{ color: "#B8D4E8", fontSize: "1rem", lineHeight: 1.8, marginBottom: "1.5rem" }}>
              Former Chief Meteorologist of Royal Caribbean International, James Van Fleet brings decades of professional marine meteorology to Florida and Bahamas charter operations. His forecasts are built for captains who need actionable intelligence, not just data.
            </p>
            <p style={{ color: "#7B9BB5", fontSize: "0.9rem", lineHeight: 1.7 }}>
              Whether you're running offshore for billfish, taking guests on a day charter through the Exumas, or planning a Bahamas passage aboard your yacht, James delivers the weather picture with the precision and clarity that professional mariners demand.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              {[
                { label: "Royal Caribbean", sub: "Chief Meteorologist" },
                { label: "Marine Forecasting", sub: "20+ Years Experience" },
                { label: "Florida & Bahamas", sub: "Specialist Coverage" },
              ].map(c => (
                <div key={c.label} className="px-6 py-4 text-center" style={{ border: "1px solid #1A2D42", background: "#0A0E14" }}>
                  <div className="font-tactical text-white font-bold" style={{ fontSize: "0.9rem" }}>{c.label}</div>
                  <div className="data-label mt-1">{c.sub}</div>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <a
                href="mailto:james@captainscharterweather.com"
                className="font-tactical font-bold uppercase tracking-widest px-8 py-3 inline-block transition-all duration-200"
                style={{ background: "#00D4FF", color: "#0A0E14", fontSize: "0.85rem", letterSpacing: "0.12em" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#33DDFF"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#00D4FF"; }}
              >
                Request a Briefing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="py-8" style={{ background: "#0A0E14", borderTop: "1px solid #1A2D42" }}>
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-tactical text-white font-bold" style={{ fontSize: "0.9rem" }}>Captain's Charter Weather</div>
              <div className="font-data text-xs mt-1" style={{ color: "#7B9BB5", fontSize: "0.65rem" }}>Marine Intelligence for Florida &amp; the Bahamas</div>
            </div>
            <div className="font-data text-xs text-center" style={{ color: "#7B9BB5", fontSize: "0.65rem" }}>
              Weather data provided by Open-Meteo. For entertainment and planning purposes only.<br />
              Always consult official NOAA forecasts before getting underway.
            </div>
            <div className="font-data text-xs" style={{ color: "#7B9BB5", fontSize: "0.65rem" }}>
              &copy; {new Date().getFullYear()} James Van Fleet
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
