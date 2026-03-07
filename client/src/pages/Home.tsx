// Home — Captain's Charter Weather
// Hero section, Florida/Bahamas region overview cards, About James teaser
import { Link } from "wouter";
import { useAllRegionSummaries } from "@/hooks/useWeather";
import RegionCard from "@/components/RegionCard";
import { FLORIDA_REGIONS, BAHAMAS_REGIONS } from "@/lib/data";

function HeroSection() {
  return (
    <section
      className="relative flex flex-col justify-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0A0E14 0%, #0D1520 60%, #0A0E14 100%)",
        paddingTop: "5rem",
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="container relative z-10">
        <div className="max-w-3xl">
          <div className="font-data mb-4" style={{ fontSize: "0.65rem", color: "#FF8C00", letterSpacing: "0.25em" }}>
            PROFESSIONAL MARINE WEATHER INTELLIGENCE
          </div>
          <h1 className="font-tactical text-white mb-6" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "0.02em" }}>
            CAPTAIN'S<br />CHARTER WEATHER
          </h1>
          <p className="font-data mb-8" style={{ fontSize: "0.85rem", color: "#7B9BB5", lineHeight: 1.7, maxWidth: "520px" }}>
            Precision marine forecasts for Florida and Bahamas charter captains, yacht owners, and offshore anglers — by James Van Fleet, former Chief Meteorologist of Royal Caribbean.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/florida">
              <span
                className="font-tactical font-bold uppercase tracking-widest px-6 py-3 cursor-pointer transition-all duration-200"
                style={{ background: "#00D4FF", color: "#0A0E14", fontSize: "0.8rem", letterSpacing: "0.12em", display: "inline-block" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#33DDFF"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#00D4FF"; }}
              >
                Florida Conditions
              </span>
            </Link>
            <Link href="/bahamas">
              <span
                className="font-tactical font-bold uppercase tracking-widest px-6 py-3 cursor-pointer transition-all duration-200"
                style={{ background: "transparent", border: "1px solid rgba(0,212,255,0.4)", color: "#00D4FF", fontSize: "0.8rem", letterSpacing: "0.12em", display: "inline-block" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,212,255,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                Bahamas Conditions
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="font-data" style={{ fontSize: "0.55rem", color: "#7B9BB5", letterSpacing: "0.2em" }}>SCROLL</div>
        <div className="w-px h-8" style={{ background: "linear-gradient(180deg, #00D4FF, transparent)" }} />
      </div>
    </section>
  );
}

function FloridaSection() {
  const summaries = useAllRegionSummaries("florida");
  return (
    <section className="py-20" style={{ background: "#0A0E14" }}>
      <div className="container">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <div className="font-data mb-2" style={{ fontSize: "0.6rem", color: "#FF8C00", letterSpacing: "0.25em" }}>COVERAGE AREA</div>
            <h2 className="font-tactical text-white" style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "0.05em" }}>FLORIDA</h2>
          </div>
          <Link href="/florida">
            <span className="font-data cursor-pointer" style={{ fontSize: "0.65rem", color: "#00D4FF", letterSpacing: "0.1em" }}>VIEW ALL REGIONS &rarr;</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {FLORIDA_REGIONS.map((region, i) => {
            const summary = summaries.find(s => s.regionId === region.id);
            return (
              <RegionCard
                key={region.id}
                id={region.id}
                name={region.name}
                shortName={region.shortName}
                description={region.description}
                overallStatus={summary?.overallStatus ?? "go"}
                avgWindKnots={summary?.avgWindKnots ?? 0}
                avgWaveFt={summary?.avgWaveFt ?? 0}
                loading={summary?.loading ?? true}
                group="florida"
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BahamasSection() {
  const summaries = useAllRegionSummaries("bahamas");
  return (
    <section className="py-20" style={{ background: "#0D1520" }}>
      <div className="container">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <div className="font-data mb-2" style={{ fontSize: "0.6rem", color: "#FF8C00", letterSpacing: "0.25em" }}>COVERAGE AREA</div>
            <h2 className="font-tactical text-white" style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "0.05em" }}>BAHAMAS</h2>
          </div>
          <Link href="/bahamas">
            <span className="font-data cursor-pointer" style={{ fontSize: "0.65rem", color: "#00D4FF", letterSpacing: "0.1em" }}>VIEW ALL REGIONS &rarr;</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BAHAMAS_REGIONS.map((region) => {
            const summary = summaries.find(s => s.regionId === region.id);
            return (
              <RegionCard
                key={region.id}
                id={region.id}
                name={region.name}
                shortName={region.shortName}
                description={region.description}
                overallStatus={summary?.overallStatus ?? "go"}
                avgWindKnots={summary?.avgWindKnots ?? 0}
                avgWaveFt={summary?.avgWaveFt ?? 0}
                loading={summary?.loading ?? true}
                group="bahamas"
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    { icon: "⚓", title: "Go / No-Go Decisions", desc: "Color-coded stoplight system — green, caution, or hold — for every region based on real-time wind and wave data.", href: "/florida" },
    { icon: "🗺️", title: "Crossing Planner", desc: "Gulf Stream and Bahamas crossing windows with optimal departure timing and sea state forecasts.", href: "/crossing-planner" },
    { icon: "📡", title: "Marine Advisories", desc: "Live NWS marine warnings, watches, and advisories overlaid on an interactive map.", href: "/advisories" },
    { icon: "📋", title: "Personal Briefing", desc: "One-on-one weather briefing with James Van Fleet before your offshore trip or Bahamas crossing.", href: "/book-briefing" },
  ];
  return (
    <section className="py-20" style={{ background: "#0A0E14", borderTop: "1px solid #1A2D42" }}>
      <div className="container">
        <div className="font-data mb-2 text-center" style={{ fontSize: "0.6rem", color: "#FF8C00", letterSpacing: "0.25em" }}>WHAT WE OFFER</div>
        <h2 className="font-tactical text-white text-center mb-12" style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "0.05em" }}>SERVICES</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map(s => (
            <Link key={s.title} href={s.href}>
              <div
                className="p-6 cursor-pointer transition-all duration-200"
                style={{ background: "rgba(13,21,32,0.8)", border: "1px solid #1A2D42" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.3)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#1A2D42"; }}
              >
                <div className="text-2xl mb-3">{s.icon}</div>
                <div className="font-tactical text-white mb-2" style={{ fontSize: "1rem", fontWeight: 700 }}>{s.title}</div>
                <div className="font-data" style={{ fontSize: "0.68rem", color: "#7B9BB5", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutTeaser() {
  return (
    <section className="py-20" style={{ background: "#0D1520", borderTop: "1px solid #1A2D42" }}>
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <div className="font-data mb-2" style={{ fontSize: "0.6rem", color: "#FF8C00", letterSpacing: "0.25em" }}>YOUR METEOROLOGIST</div>
          <h2 className="font-tactical text-white mb-6" style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "0.05em" }}>JAMES VAN FLEET</h2>
          <p className="font-data mb-6" style={{ fontSize: "0.8rem", color: "#7B9BB5", lineHeight: 1.8 }}>
            Former Chief Meteorologist of Royal Caribbean International. 20+ years of marine weather experience covering Florida, the Bahamas, and the Caribbean. Now providing the same professional-grade forecasts to private charter captains and yacht owners.
          </p>
          <Link href="/about">
            <span className="font-data cursor-pointer" style={{ fontSize: "0.65rem", color: "#00D4FF", letterSpacing: "0.1em" }}>LEARN MORE &rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-8" style={{ background: "#0A0E14", borderTop: "1px solid #1A2D42" }}>
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="font-data" style={{ fontSize: "0.6rem", color: "#7B9BB5", letterSpacing: "0.1em" }}>
          CAPTAIN'S CHARTER WEATHER &copy; {new Date().getFullYear()}
        </div>
        <div className="font-data" style={{ fontSize: "0.6rem", color: "#7B9BB5", letterSpacing: "0.08em" }}>
          WEATHER DATA: OPEN-METEO · NWS · RAINVIEWER
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FloridaSection />
      <BahamasSection />
      <ServicesSection />
      <AboutTeaser />
      <Footer />
    </div>
  );
}
