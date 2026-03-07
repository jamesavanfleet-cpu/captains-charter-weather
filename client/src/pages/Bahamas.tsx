// Bahamas — Captain's Charter Weather
// Overview of all Bahamas regions with Go/No-Go status cards
import { Link } from "wouter";
import { useAllRegionSummaries } from "@/hooks/useWeather";
import RegionCard from "@/components/RegionCard";
import { BAHAMAS_REGIONS } from "@/lib/data";

export default function Bahamas() {
  const summaries = useAllRegionSummaries("bahamas");

  return (
    <div style={{ paddingTop: "3.5rem" }}>
      {/* Header */}
      <div className="py-12" style={{ background: "linear-gradient(180deg, #0D1520 0%, #0A0E14 100%)", borderBottom: "1px solid #1A2D42" }}>
        <div className="container">
          <div className="font-data mb-2" style={{ fontSize: "0.6rem", color: "#FF8C00", letterSpacing: "0.25em" }}>COVERAGE AREA</div>
          <h1 className="font-tactical text-white mb-3" style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "0.05em" }}>BAHAMAS</h1>
          <p className="font-data" style={{ fontSize: "0.75rem", color: "#7B9BB5", maxWidth: "480px", lineHeight: 1.7 }}>
            Select a region to view live port conditions, Go/No-Go status, and detailed marine forecasts.
          </p>
        </div>
      </div>

      {/* Region grid */}
      <div className="py-12" style={{ background: "#0A0E14" }}>
        <div className="container">
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
      </div>

      {/* Footer */}
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
