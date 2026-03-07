// Bahamas.tsx — Captain's Charter Weather
// Full Bahamas marine weather overview: 3 regions
// Restored from original bundle (hx function) with BestDaysCallout, AdvisoryBanner, Crossing Advisory, Region Intelligence Notes
import { Link } from "wouter";
import { useAllRegionSummaries } from "@/hooks/useWeather";
import RegionCard from "@/components/RegionCard";
import AdvisoryBanner from "@/components/AdvisoryBanner";
import BestDaysCallout from "@/components/BestDaysCallout";
import { BAHAMAS_REGIONS } from "@/lib/data";

const REGION_NOTES: Record<string, string> = {
  "northern-bahamas": "Grand Bahama, the Abacos, and Bimini form the gateway to the Bahamas for Florida boaters. Bimini is just 50 miles from Miami, making it a popular overnight run. The Abacos offer protected cruising in the Sea of Abaco with world-class reef fishing and blue water just offshore. The Gulf Stream crossing requires careful weather planning.",
  "central-bahamas": "Nassau and New Providence are the hub of Bahamian charter activity. The Exuma Cays offer some of the most spectacular cruising and fishing in the world, with the Exuma Sound dropping to 6,000 feet just east of the cays. Eleuthera and Harbour Island are known for pink sand beaches and excellent bonefishing. The Tongue of the Ocean near Andros offers deep-water fishing for blue marlin.",
  "southern-bahamas": "The Southern Out Islands are the most remote and least visited part of the Bahamas. Long Island, Cat Island, and San Salvador offer pristine fishing grounds with minimal boat traffic. San Salvador is famous as Columbus's first landfall and offers exceptional wall diving and blue water fishing. These islands require careful passage planning and self-sufficiency.",
};

export default function Bahamas() {
  const summaries = useAllRegionSummaries("bahamas");

  const getSummary = (id: string) =>
    summaries.find(s => s.regionId === id) ?? { regionId: id, overallStatus: "go" as const, avgWindKnots: 0, avgWaveFt: 0, avgSstF: 0, loading: true };

  return (
    <div style={{ background: "#0A0E14", minHeight: "100vh" }}>
      {/* Header */}
      <div className="pt-20 pb-12" style={{ background: "linear-gradient(180deg, #0D1520 0%, #0A0E14 100%)", borderBottom: "1px solid #1A2D42" }}>
        <div className="container">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4 font-data text-xs" style={{ color: "#7B9BB5", fontSize: "0.7rem" }}>
            <Link href="/"><span className="cursor-pointer hover:text-white transition-colors">Home</span></Link>
            <span style={{ color: "#1A2D42" }}>/</span>
            <span style={{ color: "#FF8C00" }}>Bahamas</span>
          </div>

          <div className="font-data text-xs mb-2" style={{ color: "#FF8C00", letterSpacing: "0.2em" }}>OPERATIONAL ZONE BRAVO</div>
          <h1 className="font-tactical text-white leading-none mb-4" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900 }}>
            BAHAMAS MARINE WEATHER
          </h1>
          <p style={{ color: "#B8D4E8", maxWidth: 700, fontSize: "1rem", lineHeight: 1.6 }}>
            Three regions covering the Bahamas from Grand Bahama and Bimini in the north to the Southern Out Islands. Critical weather intelligence for Gulf Stream crossings, passage planning, and day charter operations. Live data updated every 10 minutes.
          </p>

          {/* Stats bar */}
          <div className="flex gap-8 mt-8">
            {[{ value: "3", label: "Regions" }, { value: "12", label: "Ports Monitored" }, { value: "50mi", label: "Bimini Crossing" }].map(stat => (
              <div key={stat.label}>
                <div className="font-data font-bold" style={{ color: "#FF8C00", fontSize: "1.5rem", lineHeight: 1, textShadow: "0 0 12px rgba(255,140,0,0.6)" }}>{stat.value}</div>
                <div className="data-label mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Crossing Advisory */}
      <div className="container pt-8">
        <div className="p-4 mb-8" style={{ background: "rgba(255,140,0,0.06)", border: "1px solid rgba(255,140,0,0.25)" }}>
          <div className="flex items-start gap-3">
            <div className="font-data font-bold flex-shrink-0" style={{ color: "#FF8C00", fontSize: "0.75rem", letterSpacing: "0.1em" }}>CROSSING ADVISORY</div>
            <p style={{ color: "#B8D4E8", fontSize: "0.85rem", lineHeight: 1.6 }}>
              The Gulf Stream between Florida and the Bahamas requires careful weather planning. North winds opposing the northward-flowing Gulf Stream create steep, dangerous seas. Always check conditions at both departure and destination ports before crossing. Ideal crossing conditions: winds from the south or east, below 15 knots.
            </p>
          </div>
        </div>
      </div>

      {/* Advisory banner + BestDays + Region cards */}
      <div className="container pb-12">
        {/* Advisory banner */}
        <div className="mb-6">
          <div className="font-data text-xs mb-3" style={{ color: "#FF8C00", letterSpacing: "0.2em" }}>NOAA MARINE ADVISORIES · BAHAMAS WATERS</div>
          <AdvisoryBanner filter="bahamas" />
        </div>

        {/* Best days callout */}
        <BestDaysCallout group="bahamas" />

        {/* Region cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {BAHAMAS_REGIONS.map(region => {
            const s = getSummary(region.id);
            return (
              <RegionCard
                key={region.id}
                id={region.id}
                name={region.name}
                shortName={region.shortName}
                description={region.description}
                overallStatus={s.overallStatus}
                avgWindKnots={s.avgWindKnots}
                avgWaveFt={s.avgWaveFt}
                loading={s.loading}
                group="bahamas"
              />
            );
          })}
        </div>

        {/* Region Intelligence Notes */}
        <div className="mt-8" style={{ borderTop: "1px solid #1A2D42", paddingTop: "3rem" }}>
          <div className="font-data text-xs mb-6" style={{ color: "#FF8C00", letterSpacing: "0.2em" }}>REGION INTELLIGENCE NOTES</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BAHAMAS_REGIONS.map(region => (
              <Link key={region.id} href={`/bahamas/${region.id}`}>
                <div
                  className="p-5 cursor-pointer transition-all duration-200"
                  style={{ background: "#0D1520", border: "1px solid #1A2D42" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,140,0,0.3)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#1A2D42"; }}
                >
                  <div className="font-tactical text-white font-bold mb-2" style={{ fontSize: "1rem" }}>{region.name}</div>
                  <p style={{ color: "#7B9BB5", fontSize: "0.85rem", lineHeight: 1.6 }}>{REGION_NOTES[region.id]}</p>
                  <div className="mt-3 font-tactical text-xs font-bold" style={{ color: "#FF8C00", fontSize: "0.65rem", letterSpacing: "0.1em" }}>VIEW LIVE CONDITIONS &rsaquo;</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
