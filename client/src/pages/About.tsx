// About — Captain's Charter Weather
// Bio of James Van Fleet, credentials, and services
import { Link } from "wouter";

export default function About() {
  return (
    <div style={{ paddingTop: "3.5rem" }}>
      <div className="py-12" style={{ background: "linear-gradient(180deg, #0D1520 0%, #0A0E14 100%)", borderBottom: "1px solid #1A2D42" }}>
        <div className="container">
          <div className="font-data mb-2" style={{ fontSize: "0.6rem", color: "#FF8C00", letterSpacing: "0.25em" }}>YOUR METEOROLOGIST</div>
          <h1 className="font-tactical text-white" style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "0.05em" }}>JAMES VAN FLEET</h1>
        </div>
      </div>

      <div className="py-16" style={{ background: "#0A0E14" }}>
        <div className="container max-w-3xl">
          <div className="font-data mb-8" style={{ fontSize: "0.85rem", color: "#7B9BB5", lineHeight: 1.9 }}>
            <p className="mb-6">
              James Van Fleet served as Chief Meteorologist for Royal Caribbean International, where he was responsible for routing and weather safety for a fleet of cruise ships operating throughout the Caribbean, Bahamas, and Florida waters.
            </p>
            <p className="mb-6">
              With over 20 years of marine weather experience, James now provides the same professional-grade forecasting services to private charter captains, yacht owners, and offshore anglers operating in Florida and the Bahamas.
            </p>
            <p className="mb-6">
              His forecasts are built on a combination of NWS model data, real-time buoy observations, satellite imagery, and decades of firsthand experience reading the unique meteorological patterns of South Florida and the Bahamas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {[
              { label: "20+", desc: "Years Marine Experience" },
              { label: "RCI", desc: "Chief Meteorologist" },
              { label: "FL & BS", desc: "Coverage Area" },
            ].map(stat => (
              <div key={stat.label} className="p-6 text-center" style={{ background: "rgba(13,21,32,0.8)", border: "1px solid #1A2D42" }}>
                <div className="font-tactical text-white mb-1" style={{ fontSize: "2rem", fontWeight: 800, color: "#00D4FF" }}>{stat.label}</div>
                <div className="data-label">{stat.desc}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Link href="/book-briefing">
              <span
                className="font-tactical font-bold uppercase tracking-widest px-6 py-3 cursor-pointer transition-all duration-200"
                style={{ background: "#00D4FF", color: "#0A0E14", fontSize: "0.8rem", letterSpacing: "0.12em", display: "inline-block" }}
              >
                Book a Briefing
              </span>
            </Link>
            <Link href="/">
              <span className="font-data cursor-pointer" style={{ fontSize: "0.65rem", color: "#00D4FF", letterSpacing: "0.1em", lineHeight: "3rem" }}>&larr; HOME</span>
            </Link>
          </div>
        </div>
      </div>

      <footer className="py-8" style={{ background: "#0A0E14", borderTop: "1px solid #1A2D42" }}>
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-data" style={{ fontSize: "0.6rem", color: "#7B9BB5", letterSpacing: "0.1em" }}>
            CAPTAIN'S CHARTER WEATHER &copy; {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
}
