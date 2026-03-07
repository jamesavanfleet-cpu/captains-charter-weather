// Florida.tsx — Captain's Charter Weather
// Full Florida marine weather overview: 7 regions + Gulf Offshore
// Restored from original bundle (fx function) with BestDaysCallout, AdvisoryBanner, Region Intelligence Notes
import { Link } from "wouter";
import { useAllRegionSummaries } from "@/hooks/useWeather";
import RegionCard from "@/components/RegionCard";
import AdvisoryBanner from "@/components/AdvisoryBanner";
import BestDaysCallout from "@/components/BestDaysCallout";
import { FLORIDA_REGIONS } from "@/lib/data";

const REGION_NOTES: Record<string, string> = {
  "nw-florida": "The Emerald Coast stretches from Pensacola to Apalachicola, offering some of the Gulf's finest offshore fishing for red snapper, amberjack, and king mackerel. Summer brings calm Gulf conditions; winter fronts can shut things down fast.",
  "ne-florida": "Jacksonville to New Smyrna Beach along the Atlantic coast. The Gulf Stream runs within 30 miles offshore, making this prime territory for mahi, wahoo, and sailfish. Inlet fishing for redfish and flounder is world-class.",
  "central-west-florida": "Tampa Bay, Clearwater, and the Nature Coast offer legendary inshore fishing for redfish, snook, and tarpon on the flats, plus nearshore reef fishing for grouper and snapper. Protected bay waters make day charters reliable.",
  "central-east-florida": "The Space Coast and Treasure Coast sit adjacent to the Gulf Stream. Sebastian Inlet and Fort Pierce are legendary for their inlet fishing. Offshore, expect mahi, sailfish, and wahoo when conditions cooperate.",
  "sw-florida": "Sarasota to Naples and the Ten Thousand Islands. One of the most productive inshore fisheries in the world for snook, redfish, and tarpon. Naples and Fort Myers offer excellent nearshore and offshore charter options.",
  "se-florida": "The Gold Coast from Palm Beach to Miami sits right on the Gulf Stream. Fort Lauderdale and Miami are major charter hubs with quick access to deep water. Expect sailfish, mahi, and tuna within 10 miles offshore.",
  "florida-keys": "The Keys are the crown jewel of Florida fishing. Backcountry flats for permit, bonefish, and tarpon. Reef fishing for grouper and snapper. Offshore for billfish and tuna. Key West is the southernmost point, with access to both the Atlantic and Gulf.",
  "gulf-offshore": "The deep Gulf of Mexico offshore waters beyond the shelf edge. Prime territory for blue marlin, yellowfin tuna, and wahoo. These waters require careful passage planning and monitoring of Gulf Loop Current eddies.",
};

const GULF_OFFSHORE_REGION = {
  id: "gulf-offshore",
  name: "Gulf Offshore",
  shortName: "Gulf Offshore",
  description: "Deep Gulf waters beyond the shelf — blue marlin, tuna, wahoo",
  group: "florida" as const,
};

export default function Florida() {
  const summaries = useAllRegionSummaries("florida");
  const allRegions = [...FLORIDA_REGIONS, GULF_OFFSHORE_REGION];

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
            <span style={{ color: "#00D4FF" }}>Florida</span>
          </div>

          <div className="font-data text-xs mb-2" style={{ color: "#00D4FF", letterSpacing: "0.2em" }}>OPERATIONAL ZONE ALPHA</div>
          <h1 className="font-tactical text-white leading-none mb-4" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900 }}>
            FLORIDA MARINE WEATHER
          </h1>
          <p style={{ color: "#B8D4E8", maxWidth: 700, fontSize: "1rem", lineHeight: 1.6 }}>
            Seven regions covering the entire Florida coastline, from the Panhandle's Emerald Coast to the Florida Keys. Live conditions updated every 10 minutes. Click any region for full port-by-port detail.
          </p>

          {/* Stats bar */}
          <div className="flex gap-8 mt-8">
            {[{ value: "7", label: "Regions" }, { value: "28", label: "Ports Monitored" }, { value: "Live", label: "Data Feed" }].map(stat => (
              <div key={stat.label}>
                <div className="font-data font-bold glow-cyan" style={{ color: "#00D4FF", fontSize: "1.5rem", lineHeight: 1 }}>{stat.value}</div>
                <div className="data-label mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advisory banner + BestDays + Region cards */}
      <div className="container py-12">
        {/* Advisory banner */}
        <div className="mb-6">
          <div className="font-data text-xs mb-3" style={{ color: "#FF8C00", letterSpacing: "0.2em" }}>NOAA MARINE ADVISORIES · FLORIDA WATERS</div>
          <AdvisoryBanner filter="florida" />
        </div>

        {/* Best days callout */}
        <BestDaysCallout group="florida" />

        {/* Region cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {allRegions.map(region => {
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
                group="florida"
              />
            );
          })}
        </div>

        {/* Region Intelligence Notes */}
        <div className="mt-8" style={{ borderTop: "1px solid #1A2D42", paddingTop: "3rem" }}>
          <div className="font-data text-xs mb-6" style={{ color: "#00D4FF", letterSpacing: "0.2em" }}>REGION INTELLIGENCE NOTES</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allRegions.map(region => (
              <Link key={region.id} href={`/florida/${region.id}`}>
                <div
                  className="p-5 cursor-pointer transition-all duration-200"
                  style={{ background: "#0D1520", border: "1px solid #1A2D42" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,212,255,0.3)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#1A2D42"; }}
                >
                  <div className="font-tactical text-white font-bold mb-2" style={{ fontSize: "1rem" }}>{region.name}</div>
                  <p style={{ color: "#7B9BB5", fontSize: "0.85rem", lineHeight: 1.6 }}>{REGION_NOTES[region.id]}</p>
                  <div className="mt-3 font-tactical text-xs font-bold" style={{ color: "#00D4FF", fontSize: "0.65rem", letterSpacing: "0.1em" }}>VIEW LIVE CONDITIONS &rsaquo;</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
