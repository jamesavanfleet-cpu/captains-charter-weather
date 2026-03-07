// ============================================================
// Captain's Charter Weather — Shared Data & Utilities
// All port coordinates, region definitions, and weather helpers
// ============================================================

export interface Port {
  portName: string;
  region: string;
  regionId: string;
  lat: number;
  lon: number;
}

export interface Region {
  id: string;
  name: string;
  shortName: string;
  description: string;
  group: "florida" | "bahamas";
}

export type ConditionStatus = "go" | "caution" | "hold";

export interface PortWeather {
  portName: string;
  region: string;
  lat: number;
  lon: number;
  tempF: number;
  windSpeedKnots: number;
  windDirDeg: number;
  windDirLabel: string;
  waveHeightFt: number;
  wavePeriodSec: number;
  pressureInHg: number;
  humidity: number;
  visibility: string;
  condition: string;
  conditionStatus: ConditionStatus;
  sstF: number;
  updatedAt: string;
  loading: boolean;
  error: boolean;
}

// ── Port data ────────────────────────────────────────────────
export const PORTS: Port[] = [
  { portName: "Pensacola", region: "Northwest Florida", regionId: "nw-florida", lat: 30.421, lon: -87.217 },
  { portName: "Destin", region: "Northwest Florida", regionId: "nw-florida", lat: 30.393, lon: -86.496 },
  { portName: "Panama City", region: "Northwest Florida", regionId: "nw-florida", lat: 30.158, lon: -85.66 },
  { portName: "Port St. Joe", region: "Northwest Florida", regionId: "nw-florida", lat: 29.812, lon: -85.3 },
  { portName: "Jacksonville", region: "Northeast Florida", regionId: "ne-florida", lat: 30.332, lon: -81.656 },
  { portName: "St. Augustine", region: "Northeast Florida", regionId: "ne-florida", lat: 29.895, lon: -81.313 },
  { portName: "Daytona Beach", region: "Northeast Florida", regionId: "ne-florida", lat: 29.211, lon: -81.023 },
  { portName: "New Smyrna Beach", region: "Northeast Florida", regionId: "ne-florida", lat: 29.025, lon: -80.927 },
  { portName: "Clearwater", region: "Central West Florida", regionId: "central-west-florida", lat: 27.965, lon: -82.8 },
  { portName: "Tampa Bay", region: "Central West Florida", regionId: "central-west-florida", lat: 27.77, lon: -82.638 },
  { portName: "St. Petersburg", region: "Central West Florida", regionId: "central-west-florida", lat: 27.773, lon: -82.64 },
  { portName: "Crystal River", region: "Central West Florida", regionId: "central-west-florida", lat: 28.902, lon: -82.593 },
  { portName: "Cape Canaveral", region: "Central East Florida", regionId: "central-east-florida", lat: 28.392, lon: -80.604 },
  { portName: "Sebastian Inlet", region: "Central East Florida", regionId: "central-east-florida", lat: 27.858, lon: -80.449 },
  { portName: "Fort Pierce", region: "Central East Florida", regionId: "central-east-florida", lat: 27.447, lon: -80.325 },
  { portName: "Stuart", region: "Central East Florida", regionId: "central-east-florida", lat: 27.197, lon: -80.253 },
  { portName: "Sarasota", region: "Southwest Florida", regionId: "sw-florida", lat: 27.336, lon: -82.531 },
  { portName: "Charlotte Harbor", region: "Southwest Florida", regionId: "sw-florida", lat: 26.975, lon: -82.09 },
  { portName: "Fort Myers", region: "Southwest Florida", regionId: "sw-florida", lat: 26.64, lon: -81.872 },
  { portName: "Naples", region: "Southwest Florida", regionId: "sw-florida", lat: 26.142, lon: -81.795 },
  { portName: "Palm Beach", region: "Southeast Florida", regionId: "se-florida", lat: 26.705, lon: -80.064 },
  { portName: "Fort Lauderdale", region: "Southeast Florida", regionId: "se-florida", lat: 26.122, lon: -80.143 },
  { portName: "Miami", region: "Southeast Florida", regionId: "se-florida", lat: 25.761, lon: -80.192 },
  { portName: "Biscayne Bay", region: "Southeast Florida", regionId: "se-florida", lat: 25.54, lon: -80.18 },
  { portName: "Key Largo", region: "Florida Keys", regionId: "florida-keys", lat: 25.086, lon: -80.448 },
  { portName: "Islamorada", region: "Florida Keys", regionId: "florida-keys", lat: 24.929, lon: -80.65 },
  { portName: "Marathon", region: "Florida Keys", regionId: "florida-keys", lat: 24.721, lon: -81.05 },
  { portName: "Key West", region: "Florida Keys", regionId: "florida-keys", lat: 24.555, lon: -81.779 },
  { portName: "Freeport / Grand Bahama", region: "Northern Bahamas", regionId: "northern-bahamas", lat: 26.533, lon: -78.7 },
  { portName: "Marsh Harbour / Abaco", region: "Northern Bahamas", regionId: "northern-bahamas", lat: 26.544, lon: -77.063 },
  { portName: "Green Turtle Cay", region: "Northern Bahamas", regionId: "northern-bahamas", lat: 26.774, lon: -77.33 },
  { portName: "Bimini", region: "Northern Bahamas", regionId: "northern-bahamas", lat: 25.727, lon: -79.298 },
  { portName: "Nassau / New Providence", region: "Central Bahamas", regionId: "central-bahamas", lat: 25.048, lon: -77.353 },
  { portName: "Eleuthera / Harbour Island", region: "Central Bahamas", regionId: "central-bahamas", lat: 25.5, lon: -76.64 },
  { portName: "Exuma / George Town", region: "Central Bahamas", regionId: "central-bahamas", lat: 23.512, lon: -75.769 },
  { portName: "Andros", region: "Central Bahamas", regionId: "central-bahamas", lat: 24.7, lon: -77.8 },
  { portName: "Long Island", region: "Southern Bahamas", regionId: "southern-bahamas", lat: 23.2, lon: -75.1 },
  { portName: "Cat Island", region: "Southern Bahamas", regionId: "southern-bahamas", lat: 24.1, lon: -75.5 },
  { portName: "San Salvador", region: "Southern Bahamas", regionId: "southern-bahamas", lat: 24.05, lon: -74.47 },
  { portName: "Crooked Island", region: "Southern Bahamas", regionId: "southern-bahamas", lat: 22.75, lon: -74.2 },
];

// ── Region definitions ───────────────────────────────────────
export const FLORIDA_REGIONS: Region[] = [
  { id: "nw-florida", name: "Northwest Florida", shortName: "NW Florida", description: "Pensacola to Apalachicola — Emerald Coast, Gulf fishing grounds", group: "florida" },
  { id: "ne-florida", name: "Northeast Florida", shortName: "NE Florida", description: "Jacksonville to New Smyrna — Atlantic coast, inshore and offshore", group: "florida" },
  { id: "central-west-florida", name: "Central West Florida", shortName: "Central West FL", description: "Tampa Bay to Crystal River — Gulf flats, nearshore reefs", group: "florida" },
  { id: "central-east-florida", name: "Central East Florida", shortName: "Central East FL", description: "Space Coast to Treasure Coast — Atlantic nearshore and offshore", group: "florida" },
  { id: "sw-florida", name: "Southwest Florida", shortName: "SW Florida", description: "Sarasota to Naples — Ten Thousand Islands, Gulf offshore", group: "florida" },
  { id: "se-florida", name: "Southeast Florida", shortName: "SE Florida", description: "Palm Beach to Miami — Gulf Stream, offshore reefs, inlets", group: "florida" },
  { id: "florida-keys", name: "Florida Keys", shortName: "The Keys", description: "Key Largo to Key West — Backcountry, reef, and offshore", group: "florida" },
];

export const BAHAMAS_REGIONS: Region[] = [
  { id: "northern-bahamas", name: "Northern Bahamas", shortName: "N. Bahamas", description: "Grand Bahama, Abaco, Bimini — Gulf Stream crossings, blue water", group: "bahamas" },
  { id: "central-bahamas", name: "Central Bahamas", shortName: "C. Bahamas", description: "Nassau, Exumas, Eleuthera — Turquoise banks, offshore canyons", group: "bahamas" },
  { id: "southern-bahamas", name: "Southern Bahamas", shortName: "S. Bahamas", description: "Long Island, Cat Island, San Salvador — Remote, deep water", group: "bahamas" },
];

export const ALL_REGIONS: Region[] = [...FLORIDA_REGIONS, ...BAHAMAS_REGIONS];

// ── Status config ────────────────────────────────────────────
export const STATUS_CONFIG = {
  go: { label: "GO", color: "#39FF14", bg: "rgba(57,255,20,0.08)", border: "rgba(57,255,20,0.3)", desc: "Favorable" },
  caution: { label: "CAUTION", color: "#FF8C00", bg: "rgba(255,140,0,0.08)", border: "rgba(255,140,0,0.3)", desc: "Moderate" },
  hold: { label: "HOLD", color: "#FF3C3C", bg: "rgba(255,60,60,0.08)", border: "rgba(255,60,60,0.3)", desc: "Rough" },
};

// ── Utility functions ────────────────────────────────────────
export function degToCompass(deg: number): string {
  return ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"][Math.round(deg / 22.5) % 16];
}

export function msToKnots(ms: number): number {
  return Math.round(ms * 1.94384);
}

export function mToFt(m: number): number {
  return Math.round(m * 3.28084 * 10) / 10;
}

export function cToF(c: number): number {
  return Math.round(c * 9 / 5 + 32);
}

export function hPaToInHg(hpa: number): number {
  return Math.round(hpa * 0.02953 * 100) / 100;
}

export function getConditionStatus(windKnots: number, waveFt: number): ConditionStatus {
  if (windKnots >= 25 || waveFt >= 6) return "hold";
  if (windKnots >= 15 || waveFt >= 3.5) return "caution";
  return "go";
}

export function getConditionLabel(windKnots: number, waveFt: number): string {
  if (windKnots >= 25 || waveFt >= 6) return "Rough — Stay In";
  if (windKnots >= 20 || waveFt >= 5) return "Rough — Experienced Only";
  if (windKnots >= 15 || waveFt >= 3.5) return "Moderate — Use Caution";
  if (windKnots >= 10 || waveFt >= 2) return "Moderate — Good Conditions";
  return "Calm — Excellent Conditions";
}
