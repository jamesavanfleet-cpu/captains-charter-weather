// advisoryData.ts — Captain's Charter Weather
// NWS marine zone definitions, alert severity config, and advisory hook

// ── Marine zones ─────────────────────────────────────────────
export interface MarineZone {
  id: string;
  name: string;
  shortName: string;
  region: string;
  lat: number;
  lon: number;
}

export const MARINE_ZONES: MarineZone[] = [
  { id: "GMZ634", name: "Pensacola Bay Area including Santa Rosa Sound", shortName: "Pensacola Bay", region: "nw-florida", lat: 30.4, lon: -87.2 },
  { id: "GMZ655", name: "Coastal waters from Okaloosa-Walton County Line to Pensacola FL out 20 NM", shortName: "Pensacola Coastal", region: "nw-florida", lat: 30.3, lon: -86.8 },
  { id: "GMZ675", name: "Waters from Okaloosa-Walton County Line to Pensacola FL from 20 to 60 NM", shortName: "Pensacola Offshore", region: "nw-florida", lat: 30, lon: -86.8 },
  { id: "GMZ650", name: "Coastal waters from Pensacola FL to Pascagoula MS out 20 NM", shortName: "Pensacola-Pascagoula", region: "nw-florida", lat: 30.2, lon: -87.5 },
  { id: "GMZ670", name: "Waters from Pensacola FL to Pascagoula MS from 20 to 60 NM", shortName: "Pensacola-Pascagoula Offshore", region: "nw-florida", lat: 29.9, lon: -87.5 },
  { id: "GMZ735", name: "St. Andrews Bay Waterways", shortName: "St. Andrews Bay", region: "nw-florida", lat: 30.15, lon: -85.7 },
  { id: "GMZ751", name: "Coastal waters from Okaloosa-Walton County Line to Mexico Beach out 20 NM", shortName: "Destin-Mexico Beach", region: "nw-florida", lat: 30.1, lon: -86.3 },
  { id: "GMZ752", name: "Coastal Waters from Mexico Beach to Apalachicola out 20 NM", shortName: "Mexico Beach-Apalachicola", region: "nw-florida", lat: 29.9, lon: -85.5 },
  { id: "GMZ770", name: "Waters from Okaloosa-Walton County Line to Mexico Beach from 20 to 60 NM", shortName: "Destin Offshore", region: "nw-florida", lat: 29.7, lon: -86.3 },
  { id: "GMZ772", name: "Waters from Mexico Beach to Apalachicola FL from 20 to 60 NM", shortName: "Apalachicola Offshore", region: "nw-florida", lat: 29.6, lon: -85.5 },
  { id: "GMZ755", name: "Coastal Waters From Ochlockonee River to Apalachicola FL out to 20 Nm", shortName: "Ochlockonee-Apalachicola", region: "nw-florida", lat: 29.85, lon: -84.9 },
  { id: "GMZ730", name: "Apalachee Bay or Coastal Waters From Keaton Beach to Ochlockonee River FL out to 20 Nm", shortName: "Apalachee Bay", region: "nw-florida", lat: 29.9, lon: -84.2 },
  { id: "AMZ450", name: "Coastal waters from Altamaha Sound to Fernandina Beach FL out 20 NM", shortName: "Fernandina Beach Coastal", region: "ne-florida", lat: 30.6, lon: -81.2 },
  { id: "AMZ452", name: "Coastal waters from Fernandina Beach to St. Augustine FL out 20 NM", shortName: "Jacksonville Coastal", region: "ne-florida", lat: 30.2, lon: -81.1 },
  { id: "AMZ454", name: "Coastal waters from St. Augustine to Flagler Beach FL out 20 NM", shortName: "St. Augustine Coastal", region: "ne-florida", lat: 29.8, lon: -81.1 },
  { id: "AMZ470", name: "Waters from Altamaha Sound GA to Fernandina Beach FL from 20 to 60 NM", shortName: "Fernandina Offshore", region: "ne-florida", lat: 30.5, lon: -80.7 },
  { id: "AMZ472", name: "Waters from Fernandina Beach to St. Augustine FL from 20 to 60 NM", shortName: "Jacksonville Offshore", region: "ne-florida", lat: 30.1, lon: -80.7 },
  { id: "AMZ474", name: "Waters from St. Augustine to Flagler Beach FL from 20 to 60 NM", shortName: "St. Augustine Offshore", region: "ne-florida", lat: 29.7, lon: -80.7 },
  { id: "AMZ550", name: "Flagler Beach to Volusia-Brevard County Line 0-20 nm", shortName: "Daytona Coastal", region: "ne-florida", lat: 29.2, lon: -80.9 },
  { id: "AMZ570", name: "Flagler Beach to Volusia-Brevard County Line 20-60 nm", shortName: "Daytona Offshore", region: "ne-florida", lat: 29.1, lon: -80.5 },
  { id: "GMZ830", name: "Tampa Bay waters", shortName: "Tampa Bay", region: "central-west-florida", lat: 27.8, lon: -82.5 },
  { id: "GMZ850", name: "Coastal waters from Tarpon Springs to Suwannee River FL out 20 NM", shortName: "Nature Coast Coastal", region: "central-west-florida", lat: 29, lon: -83.2 },
  { id: "GMZ870", name: "Waters from Tarpon Springs to Suwannee River FL out 20 to 60 NM", shortName: "Nature Coast Offshore", region: "central-west-florida", lat: 28.8, lon: -83.7 },
  { id: "GMZ853", name: "Coastal waters from Englewood to Tarpon Springs FL out 20 NM", shortName: "Tampa-Clearwater Coastal", region: "central-west-florida", lat: 27.5, lon: -82.8 },
  { id: "GMZ873", name: "Waters from Englewood to Tarpon Springs FL out 20 to 60 NM", shortName: "Tampa-Clearwater Offshore", region: "central-west-florida", lat: 27.3, lon: -83.3 },
  { id: "GMZ765", name: "Coastal waters from Suwannee River to Keaton Beach out 20 NM", shortName: "Suwannee-Keaton Coastal", region: "central-west-florida", lat: 29.3, lon: -83.1 },
  { id: "GMZ775", name: "Waters from Suwannee River to Apalachicola FL from 20 to 60 NM", shortName: "Big Bend Offshore", region: "central-west-florida", lat: 29.2, lon: -83.8 },
  { id: "AMZ552", name: "Volusia-Brevard County Line to Sebastian Inlet 0-20 nm", shortName: "Space Coast Coastal", region: "central-east-florida", lat: 28.5, lon: -80.6 },
  { id: "AMZ555", name: "Sebastian Inlet to Jupiter Inlet 0-20 nm", shortName: "Treasure Coast Coastal", region: "central-east-florida", lat: 27.5, lon: -80.3 },
  { id: "AMZ572", name: "Volusia-Brevard County Line to Sebastian Inlet 20-60 nm", shortName: "Space Coast Offshore", region: "central-east-florida", lat: 28.4, lon: -80.1 },
  { id: "AMZ575", name: "Sebastian Inlet to Jupiter Inlet 20-60 nm", shortName: "Treasure Coast Offshore", region: "central-east-florida", lat: 27.4, lon: -79.9 },
  { id: "GMZ836", name: "Charlotte Harbor and Pine Island Sound", shortName: "Charlotte Harbor", region: "sw-florida", lat: 26.9, lon: -82.1 },
  { id: "GMZ856", name: "Coastal waters from Bonita Beach to Englewood FL out 20 NM", shortName: "Naples-Sarasota Coastal", region: "sw-florida", lat: 26.7, lon: -82.5 },
  { id: "GMZ876", name: "Waters from Bonita Beach to Englewood FL out 20 to 60 NM", shortName: "Naples-Sarasota Offshore", region: "sw-florida", lat: 26.5, lon: -83 },
  { id: "GMZ656", name: "Coastal waters from Chokoloskee to Bonita Beach FL out 20 NM", shortName: "Ten Thousand Islands Coastal", region: "sw-florida", lat: 26, lon: -81.8 },
  { id: "GMZ676", name: "Waters from Chokoloskee to Bonita Beach FL from 20 to 60 NM", shortName: "Ten Thousand Islands Offshore", region: "sw-florida", lat: 25.8, lon: -82.3 },
  { id: "AMZ650", name: "Coastal waters from Jupiter Inlet to Deerfield Beach FL out 20 NM", shortName: "Palm Beach Coastal", region: "se-florida", lat: 26.8, lon: -80 },
  { id: "AMZ651", name: "Coastal waters from Deerfield Beach to Ocean Reef FL out 20 NM", shortName: "Fort Lauderdale-Miami Coastal", region: "se-florida", lat: 26, lon: -80 },
  { id: "AMZ670", name: "Waters from Jupiter Inlet to Deerfield Beach FL from 20 to 60 NM", shortName: "Palm Beach Offshore", region: "se-florida", lat: 26.7, lon: -79.6 },
  { id: "AMZ671", name: "Waters from Deerfield Beach to Ocean Reef FL from 20 to 60 NM", shortName: "Miami Offshore", region: "se-florida", lat: 25.8, lon: -79.6 },
  { id: "AMZ630", name: "Biscayne Bay", shortName: "Biscayne Bay", region: "se-florida", lat: 25.5, lon: -80.2 },
  { id: "GMZ031", name: "Florida Bay including Barnes Sound, Blackwater Sound, and Buttonwood Sound", shortName: "Florida Bay", region: "florida-keys", lat: 25.1, lon: -80.8 },
  { id: "GMZ032", name: "Bayside and Gulfside from Craig Key to West End of Seven Mile Bridge", shortName: "Middle Keys Bayside", region: "florida-keys", lat: 24.9, lon: -81 },
  { id: "GMZ033", name: "Gulf of America from East Cape Sable to Chokoloskee 20 to 60 NM out and beyond 5 fathoms", shortName: "Cape Sable Offshore", region: "florida-keys", lat: 24.8, lon: -81.5 },
  { id: "GMZ034", name: "Gulf of America including Dry Tortugas and Rebecca Shoal Channel", shortName: "Dry Tortugas", region: "florida-keys", lat: 24.6, lon: -82.9 },
  { id: "GMZ035", name: "Gulf of America from West End of Seven Mile Bridge to Halfmoon Shoal out to 5 Fathoms", shortName: "Lower Keys Gulf", region: "florida-keys", lat: 24.7, lon: -81.7 },
  { id: "GMZ052", name: "Straits of Florida from Ocean Reef to Craig Key out 20 NM", shortName: "Upper Keys Straits", region: "florida-keys", lat: 25, lon: -80.6 },
  { id: "GMZ053", name: "Straits of Florida from Craig Key to west end of Seven Mile Bridge out 20 NM", shortName: "Middle Keys Straits", region: "florida-keys", lat: 24.85, lon: -81.1 },
  { id: "GMZ054", name: "Straits of Florida from west end of Seven Mile Bridge to south of Halfmoon Shoal out 20 NM", shortName: "Lower Keys Straits", region: "florida-keys", lat: 24.65, lon: -81.8 },
  { id: "GMZ055", name: "Straits of Florida from Halfmoon Shoal to 20 NM west of Dry Tortugas out 20 NM", shortName: "Dry Tortugas Straits", region: "florida-keys", lat: 24.5, lon: -82.5 },
  { id: "GMZ072", name: "Straits of Florida from Ocean Reef to Craig Key 20 to 60 NM out", shortName: "Upper Keys Offshore", region: "florida-keys", lat: 24.8, lon: -80.5 },
  { id: "GMZ073", name: "Straits of Florida from Craig Key to west end of Seven Mile Bridge 20 to 60 NM out", shortName: "Middle Keys Offshore", region: "florida-keys", lat: 24.6, lon: -81.1 },
  { id: "GMZ074", name: "Straits of Florida from west end of Seven Mile Bridge to south of Halfmoon Shoal 20 to 60 NM out", shortName: "Lower Keys Offshore", region: "florida-keys", lat: 24.4, lon: -81.8 },
  { id: "GMZ075", name: "Straits of Florida from Halfmoon Shoal to 20 NM west of Dry Tortugas 20 to 60 NM out", shortName: "Tortugas Offshore", region: "florida-keys", lat: 24.3, lon: -82.5 },
  { id: "GMZ657", name: "Coastal waters from East Cape Sable to Chokoloskee FL out 20 NM", shortName: "Cape Sable Coastal", region: "florida-keys", lat: 25.1, lon: -81.4 },
  { id: "AMZ075", name: "Northern Bahamas from 24N to 27N", shortName: "Northern Bahamas", region: "northern-bahamas", lat: 25.5, lon: -77.5 },
  { id: "AMZ076", name: "Atlantic from 22N to 27N E of Bahamas to 70W", shortName: "N Bahamas Atlantic", region: "northern-bahamas", lat: 25, lon: -74 },
  { id: "AMZ080", name: "Central Bahamas including Cay Sal Bank", shortName: "Central Bahamas", region: "central-bahamas", lat: 23.5, lon: -78.5 },
  { id: "AMZ081", name: "Atlantic from 22N to 25N E of Bahamas to 70W", shortName: "S Bahamas Atlantic", region: "southern-bahamas", lat: 23, lon: -74 },
  { id: "AMZ045", name: "Gulf of Honduras", shortName: "Gulf of Honduras", region: "southern-bahamas", lat: 16.5, lon: -87 },
  { id: "GMZ040", name: "NW Gulf of America including Stetson Bank", shortName: "NW Gulf Offshore", region: "gulf-offshore", lat: 28.5, lon: -89 },
  { id: "GMZ047", name: "SE Gulf of America from 22N to 26N E of 87W including Straits of Florida", shortName: "SE Gulf Offshore", region: "gulf-offshore", lat: 24, lon: -85 },
  { id: "GMZ056", name: "N Central Gulf of America Offshore Waters", shortName: "N Central Gulf", region: "gulf-offshore", lat: 27, lon: -88 },
  { id: "GMZ057", name: "NE Gulf of America N of 26N E of 87W", shortName: "NE Gulf Offshore", region: "gulf-offshore", lat: 27.5, lon: -86 },
];

export const ZONE_IDS = MARINE_ZONES.map(z => z.id).join(",");

// ── Alert severity config ─────────────────────────────────────
export interface AlertSeverityConfig {
  severity: "extreme" | "severe" | "moderate" | "minor" | "unknown";
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}

export const ALERT_CONFIG: Record<string, AlertSeverityConfig> = {
  "Hurricane Warning": { severity: "extreme", color: "#FF0000", bgColor: "rgba(13,21,32,0.95)", borderColor: "rgba(255,0,0,0.7)", icon: "🌀" },
  "Hurricane Watch": { severity: "extreme", color: "#FF3C3C", bgColor: "rgba(13,21,32,0.95)", borderColor: "rgba(255,60,60,0.6)", icon: "🌀" },
  "Tropical Storm Warning": { severity: "severe", color: "#FF6600", bgColor: "rgba(13,21,32,0.95)", borderColor: "rgba(255,102,0,0.6)", icon: "⛈" },
  "Tropical Storm Watch": { severity: "severe", color: "#FF8C00", bgColor: "rgba(13,21,32,0.95)", borderColor: "rgba(255,140,0,0.55)", icon: "⛈" },
  "Storm Warning": { severity: "severe", color: "#FF3C3C", bgColor: "rgba(13,21,32,0.95)", borderColor: "rgba(255,60,60,0.6)", icon: "⚡" },
  "Storm Watch": { severity: "severe", color: "#FF6600", bgColor: "rgba(13,21,32,0.95)", borderColor: "rgba(255,102,0,0.55)", icon: "⚡" },
  "Gale Warning": { severity: "moderate", color: "#FF8C00", bgColor: "rgba(13,21,32,0.95)", borderColor: "rgba(255,140,0,0.55)", icon: "💨" },
  "Gale Watch": { severity: "moderate", color: "#FFB347", bgColor: "rgba(13,21,32,0.95)", borderColor: "rgba(255,179,71,0.5)", icon: "💨" },
  "Small Craft Advisory": { severity: "minor", color: "#FFD700", bgColor: "rgba(13,21,32,0.95)", borderColor: "rgba(255,215,0,0.5)", icon: "⚠" },
  "Small Craft Advisory for Hazardous Seas": { severity: "moderate", color: "#FF8C00", bgColor: "rgba(13,21,32,0.95)", borderColor: "rgba(255,140,0,0.55)", icon: "🌊" },
  "Small Craft Advisory for Rough Bar": { severity: "minor", color: "#FFD700", bgColor: "rgba(13,21,32,0.95)", borderColor: "rgba(255,215,0,0.5)", icon: "⚠" },
  "Small Craft Advisory for Winds": { severity: "minor", color: "#FFD700", bgColor: "rgba(13,21,32,0.95)", borderColor: "rgba(255,215,0,0.5)", icon: "💨" },
  "Hazardous Seas Warning": { severity: "severe", color: "#FF6600", bgColor: "rgba(13,21,32,0.95)", borderColor: "rgba(255,102,0,0.6)", icon: "🌊" },
  "Hazardous Seas Watch": { severity: "moderate", color: "#FF8C00", bgColor: "rgba(13,21,32,0.95)", borderColor: "rgba(255,140,0,0.55)", icon: "🌊" },
  "Dense Fog Advisory": { severity: "minor", color: "#B8D4E8", bgColor: "rgba(13,21,32,0.95)", borderColor: "rgba(184,212,232,0.45)", icon: "🌫" },
  "Rip Current Statement": { severity: "minor", color: "#00D4FF", bgColor: "rgba(13,21,32,0.95)", borderColor: "rgba(0,212,255,0.45)", icon: "🌊" },
  "Special Marine Warning": { severity: "moderate", color: "#FF8C00", bgColor: "rgba(13,21,32,0.95)", borderColor: "rgba(255,140,0,0.55)", icon: "⚡" },
  "Marine Weather Statement": { severity: "minor", color: "#00D4FF", bgColor: "rgba(13,21,32,0.95)", borderColor: "rgba(0,212,255,0.45)", icon: "ℹ" },
};

export const DEFAULT_ALERT_CONFIG: AlertSeverityConfig = {
  severity: "unknown",
  color: "#7B9BB5",
  bgColor: "rgba(13,21,32,0.95)",
  borderColor: "rgba(123,155,181,0.4)",
  icon: "ℹ",
};

export const SEVERITY_ORDER = ["extreme", "severe", "moderate", "minor", "unknown"] as const;

export type AlertSeverity = typeof SEVERITY_ORDER[number];

// ── Alert type ────────────────────────────────────────────────
export interface MarineAlert {
  id: string;
  event: string;
  headline: string;
  description: string;
  instruction: string;
  severity: AlertSeverity;
  certainty: string;
  urgency: string;
  onset: string;
  expires: string;
  affectedZoneIds: string[];
  affectedZones: MarineZone[];
  affectedRegions: string[];
  status: "active" | "expiring_soon" | "expired";
  minutesUntilExpiry: number;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}

// ── Florida / Bahamas region ID lists ─────────────────────────
export const FLORIDA_REGION_IDS = ["nw-florida", "ne-florida", "central-west-florida", "central-east-florida", "sw-florida", "se-florida", "florida-keys", "gulf-offshore"];
export const BAHAMAS_REGION_IDS = ["northern-bahamas", "central-bahamas", "southern-bahamas"];

// ── Region display names ──────────────────────────────────────
export const REGION_DISPLAY_NAMES: Record<string, string> = {
  "nw-florida": "NW Florida",
  "ne-florida": "NE Florida",
  "central-west-florida": "Central West FL",
  "central-east-florida": "Central East FL",
  "sw-florida": "SW Florida",
  "se-florida": "SE Florida",
  "florida-keys": "Florida Keys",
  "northern-bahamas": "N Bahamas",
  "central-bahamas": "C Bahamas",
  "southern-bahamas": "S Bahamas",
  "gulf-offshore": "Gulf Offshore",
};
