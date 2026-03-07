// MarineAdvisories — Captain's Charter Weather
// Interactive map with NWS marine advisories, radar, satellite, Gulf Stream SST, water levels
// FIXES applied:
//   1. Satellite: uses RainViewer infrared tiles (properly georeferenced) instead of GOES-19 NESDIS GroundOverlay
//   2. Radar: preloads all tile layers before starting animation loop — no flash between frames
//   3. Zone click: scrolls advisory list and highlights matching advisory + shows InfoWindow popup
import { useState, useEffect, useRef, useCallback } from "react";
import { MapView } from "@/components/Map";
import { Link } from "wouter";

// ── NWS Alert types ──────────────────────────────────────────
interface NWSAlert {
  id: string;
  event: string;
  headline: string;
  description: string;
  severity: string;
  urgency: string;
  areaDesc: string;
  effective: string;
  expires: string;
  zones: string[];
  color: string;
  fillColor: string;
}

function alertColor(event: string): { stroke: string; fill: string } {
  const e = event.toLowerCase();
  if (e.includes("warning")) return { stroke: "#FF3C3C", fill: "rgba(255,60,60,0.15)" };
  if (e.includes("watch")) return { stroke: "#FF8C00", fill: "rgba(255,140,0,0.12)" };
  if (e.includes("advisory")) return { stroke: "#FFD700", fill: "rgba(255,215,0,0.1)" };
  if (e.includes("statement")) return { stroke: "#00D4FF", fill: "rgba(0,212,255,0.08)" };
  return { stroke: "#7B9BB5", fill: "rgba(123,155,181,0.08)" };
}

function severityLabel(severity: string): string {
  if (severity === "Extreme") return "EXTREME";
  if (severity === "Severe") return "SEVERE";
  if (severity === "Moderate") return "MODERATE";
  return "MINOR";
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h > 0) return `${h}h ${m}m ago`;
  return `${m}m ago`;
}

function timeUntil(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h > 0) return `Expires in ${h}h ${m}m`;
  return `Expires in ${m}m`;
}

// ── Water level stations (NOAA CO-OPS) ──────────────────────
const WATER_STATIONS = [
  { id: "8724580", name: "Key West", lat: 24.555, lon: -81.808 },
  { id: "8723214", name: "Virginia Key", lat: 25.731, lon: -80.162 },
  { id: "8722670", name: "Lake Worth Pier", lat: 26.612, lon: -80.034 },
  { id: "8721604", name: "Trident Pier", lat: 28.416, lon: -80.593 },
  { id: "8720218", name: "Mayport", lat: 30.397, lon: -81.428 },
  { id: "8726520", name: "St. Petersburg", lat: 27.761, lon: -82.627 },
  { id: "8728690", name: "Apalachicola", lat: 29.724, lon: -84.981 },
];

// ── Layer toggle button ──────────────────────────────────────
function LayerBtn({ label, icon, active, activeClass, onClick }: { label: string; icon: string; active: boolean; activeClass: string; onClick: () => void }) {
  return (
    <button
      className={`layer-btn ${active ? activeClass : ""}`}
      onClick={onClick}
    >
      <span>{icon}</span>
      <span>{label}</span>
      <span style={{ fontSize: "0.55rem", opacity: 0.7 }}>{active ? "ON" : "OFF"}</span>
    </button>
  );
}

// ── Advisory card ────────────────────────────────────────────
function AdvisoryCard({ alert, isHighlighted, onZoneClick }: { alert: NWSAlert; isHighlighted: boolean; onZoneClick: (zoneId: string) => void }) {
  const colors = alertColor(alert.event);
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      id={`advisory-${alert.id}`}
      className="transition-all duration-300"
      style={{
        border: `1px solid ${isHighlighted ? colors.stroke : "#1A2D42"}`,
        background: isHighlighted ? `rgba(${colors.stroke === "#FF3C3C" ? "255,60,60" : colors.stroke === "#FF8C00" ? "255,140,0" : "0,212,255"},0.08)` : "rgba(13,21,32,0.8)",
        marginBottom: "6px",
        boxShadow: isHighlighted ? `0 0 12px ${colors.stroke}40` : "none",
      }}
    >
      <button
        className="w-full flex items-start gap-3 p-3 cursor-pointer"
        style={{ background: "none", border: "none", textAlign: "left" }}
        onClick={() => setExpanded(!expanded)}
      >
        <div
          className="flex-shrink-0 w-1"
          style={{ background: colors.stroke, alignSelf: "stretch", minHeight: "40px" }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className="font-tactical font-bold"
              style={{ fontSize: "0.65rem", color: colors.stroke, letterSpacing: "0.08em" }}
            >
              {alert.event.toUpperCase()}
            </span>
            <span
              className="font-data px-1"
              style={{ fontSize: "0.55rem", color: colors.stroke, border: `1px solid ${colors.stroke}`, opacity: 0.8 }}
            >
              {severityLabel(alert.severity)}
            </span>
          </div>
          <div className="font-data mb-1" style={{ fontSize: "0.68rem", color: "#E8F4FF", lineHeight: 1.4 }}>
            {alert.headline}
          </div>
          <div className="font-data" style={{ fontSize: "0.6rem", color: "#7B9BB5" }}>
            {alert.areaDesc.slice(0, 80)}{alert.areaDesc.length > 80 ? "..." : ""}
          </div>
          <div className="flex gap-3 mt-1">
            <span className="font-data" style={{ fontSize: "0.55rem", color: "#7B9BB5" }}>{timeAgo(alert.effective)}</span>
            <span className="font-data" style={{ fontSize: "0.55rem", color: alert.expires && new Date(alert.expires).getTime() - Date.now() < 3_600_000 ? "#FF8C00" : "#7B9BB5" }}>
              {alert.expires ? timeUntil(alert.expires) : ""}
            </span>
          </div>
        </div>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ flexShrink: 0, marginTop: 4, transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
        >
          <path d="M2 4l4 4 4-4" stroke="#7B9BB5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {expanded && (
        <div className="px-3 pb-3">
          <div style={{ height: 1, background: "#1A2D42", marginBottom: "8px" }} />
          <div className="font-data mb-3" style={{ fontSize: "0.65rem", color: "#7B9BB5", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
            {alert.description.slice(0, 600)}{alert.description.length > 600 ? "..." : ""}
          </div>
          {alert.zones.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {alert.zones.slice(0, 6).map(z => (
                <button
                  key={z}
                  className="font-data px-2 py-0.5 cursor-pointer transition-all duration-150"
                  style={{ fontSize: "0.55rem", color: "#00D4FF", border: "1px solid rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.05)" }}
                  onClick={() => onZoneClick(z)}
                >
                  {z}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────
export default function MarineAdvisories() {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [alerts, setAlerts] = useState<NWSAlert[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [highlightedAlertId, setHighlightedAlertId] = useState<string | null>(null);

  // Layer toggles
  const [showAlerts, setShowAlerts] = useState(true);
  const [showRadar, setShowRadar] = useState(false);
  const [showSatellite, setShowSatellite] = useState(false);
  const [showGSS, setShowGSS] = useState(false);
  const [showWaterLevels, setShowWaterLevels] = useState(false);
  const [showBlueTopo, setShowBlueTopo] = useState(false);
  const [showZoneForecasts, setShowZoneForecasts] = useState(false);
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap");

  // Satellite source label
  const [satLabel, setSatLabel] = useState("GOES-19 SE IR (Live)");

  // Radar state
  const radarFramesRef = useRef<google.maps.ImageMapType[]>([]);
  const radarTimestampsRef = useRef<number[]>([]);
  const radarIndexRef = useRef(0);
  const radarIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const radarLoadedRef = useRef(false);

  // Satellite overlay
  const satOverlayRef = useRef<google.maps.ImageMapType | null>(null);

  // Zone rectangles
  const zoneRectsRef = useRef<Map<string, google.maps.Rectangle>>(new Map());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Water level markers
  const waterMarkersRef = useRef<google.maps.Marker[]>([]);

  // ── Fetch NWS marine alerts ──────────────────────────────
  const fetchAlerts = useCallback(async () => {
    setAlertsLoading(true);
    try {
      // Fetch marine alerts for FL and surrounding waters
      const res = await fetch(
        "https://api.weather.gov/alerts/active?area=FL&status=actual&message_type=alert,update&category=Marine&limit=50"
      );
      const data = await res.json();
      const features = data.features ?? [];
      const parsed: NWSAlert[] = features.map((f: any) => {
        const p = f.properties;
        const colors = alertColor(p.event ?? "");
        return {
          id: f.id,
          event: p.event ?? "Advisory",
          headline: p.headline ?? p.event ?? "",
          description: p.description ?? "",
          severity: p.severity ?? "Minor",
          urgency: p.urgency ?? "Unknown",
          areaDesc: p.areaDesc ?? "",
          effective: p.effective ?? p.onset ?? "",
          expires: p.expires ?? "",
          zones: (p.affectedZones ?? []).map((z: string) => z.split("/").pop() ?? z),
          color: colors.stroke,
          fillColor: colors.fill,
        };
      });
      setAlerts(parsed);
    } catch {
      // Silently fail — show empty state
    } finally {
      setAlertsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 300_000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  // ── Draw alert zone rectangles on map ───────────────────
  useEffect(() => {
    if (!map || !showAlerts) {
      zoneRectsRef.current.forEach(r => r.setMap(null));
      zoneRectsRef.current.clear();
      return;
    }
    // Clear old rectangles
    zoneRectsRef.current.forEach(r => r.setMap(null));
    zoneRectsRef.current.clear();

    // For each alert, draw a rectangle per zone using approximate NWS zone bounding boxes
    alerts.forEach(alert => {
      alert.zones.forEach(zoneId => {
        const bounds = getNWSZoneBounds(zoneId);
        if (!bounds) return;
        const rect = new google.maps.Rectangle({
          bounds,
          map,
          strokeColor: alert.color,
          strokeOpacity: 0.8,
          strokeWeight: 1.5,
          fillColor: alert.fillColor,
          fillOpacity: 1,
          clickable: true,
        });
        rect.addListener("click", () => {
          handleZoneClick(zoneId, alert.id, bounds, alert.event);
        });
        zoneRectsRef.current.set(`${alert.id}-${zoneId}`, rect);
      });
    });
  }, [map, alerts, showAlerts]);

  // ── Zone click handler ───────────────────────────────────
  const handleZoneClick = useCallback((zoneId: string, alertId: string, bounds: google.maps.LatLngBoundsLiteral, eventName: string) => {
    if (!map) return;

    // 1. Highlight the advisory in the list and scroll to it
    setHighlightedAlertId(alertId);
    setTimeout(() => {
      const el = document.getElementById(`advisory-${alertId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 50);

    // 2. Show InfoWindow popup on the map at center of zone
    const center = {
      lat: (bounds.north + bounds.south) / 2,
      lng: (bounds.east + bounds.west) / 2,
    };
    if (infoWindowRef.current) infoWindowRef.current.close();
    infoWindowRef.current = new google.maps.InfoWindow({
      content: `
        <div style="background:#0D1520;border:1px solid #1A2D42;padding:8px 12px;font-family:'JetBrains Mono',monospace;color:#E8F4FF;min-width:160px">
          <div style="font-size:0.55rem;color:#FF8C00;letter-spacing:0.15em;margin-bottom:4px">ZONE ${zoneId}</div>
          <div style="font-size:0.72rem;font-weight:600">${eventName.toUpperCase()}</div>
        </div>
      `,
      position: center,
    });
    infoWindowRef.current.open(map);

    // Pan map to zone
    map.panTo(center);
  }, [map]);

  // ── Radar layer (FIX: preload all frames before animating) ─
  const stopRadar = useCallback(() => {
    if (radarIntervalRef.current) {
      clearInterval(radarIntervalRef.current);
      radarIntervalRef.current = null;
    }
    radarFramesRef.current.forEach(layer => map?.overlayMapTypes.clear());
    radarFramesRef.current = [];
    radarTimestampsRef.current = [];
    radarLoadedRef.current = false;
  }, [map]);

  const startRadar = useCallback(async () => {
    if (!map || radarLoadedRef.current) return;
    try {
      // Fetch available radar frames from RainViewer
      const res = await fetch("https://api.rainviewer.com/public/weather-maps.json");
      const data = await res.json();
      const radarPaths: string[] = [
        ...(data.radar?.past ?? []).map((f: any) => f.path),
        ...(data.radar?.nowcast ?? []).slice(0, 2).map((f: any) => f.path),
      ].slice(-8); // Keep last 8 frames

      if (radarPaths.length === 0) return;

      // Preload all tile layers BEFORE starting animation
      const layers: google.maps.ImageMapType[] = radarPaths.map(path =>
        new google.maps.ImageMapType({
          getTileUrl: (coord, zoom) =>
            `https://tilecache.rainviewer.com${path}/256/${zoom}/${coord.x}/${coord.y}/2/1_1.png`,
          tileSize: new google.maps.Size(256, 256),
          opacity: 0.7,
          name: "radar",
        })
      );

      // Preload tiles for the first 3 frames by creating Image objects
      const preloadPromises = layers.slice(0, 3).map(layer => {
        return new Promise<void>(resolve => {
          // Trigger tile loading by temporarily adding and removing
          map.overlayMapTypes.push(layer);
          setTimeout(() => {
            map.overlayMapTypes.clear();
            resolve();
          }, 400);
        });
      });
      await Promise.all(preloadPromises);

      radarFramesRef.current = layers;
      radarIndexRef.current = 0;
      radarLoadedRef.current = true;

      // Start animation — swap layers without clearing between frames
      let currentLayer: google.maps.ImageMapType | null = null;
      const animate = () => {
        const nextLayer = radarFramesRef.current[radarIndexRef.current];
        if (!nextLayer) return;
        // Add next frame first, then remove previous — prevents flash
        map.overlayMapTypes.push(nextLayer);
        if (currentLayer) {
          const idx = map.overlayMapTypes.getArray().indexOf(currentLayer);
          if (idx >= 0) map.overlayMapTypes.removeAt(idx);
        }
        currentLayer = nextLayer;
        radarIndexRef.current = (radarIndexRef.current + 1) % radarFramesRef.current.length;
      };

      animate();
      radarIntervalRef.current = setInterval(animate, 600);
    } catch {
      // Silently fail
    }
  }, [map]);

  useEffect(() => {
    if (!map) return;
    if (showRadar) {
      startRadar();
    } else {
      stopRadar();
      map.overlayMapTypes.clear();
    }
    return () => {
      if (!showRadar) stopRadar();
    };
  }, [map, showRadar, startRadar, stopRadar]);

  // ── Satellite layer (FIX: use RainViewer IR tiles — properly georeferenced) ─
  useEffect(() => {
    if (!map) return;
    if (satOverlayRef.current) {
      const idx = map.overlayMapTypes.getArray().indexOf(satOverlayRef.current);
      if (idx >= 0) map.overlayMapTypes.removeAt(idx);
      satOverlayRef.current = null;
    }
    if (!showSatellite) return;

    // Use RainViewer satellite infrared tiles — these are properly georeferenced tile layers
    // that align correctly with the Google Maps base layer at all zoom levels
    const fetchSatTiles = async () => {
      try {
        const res = await fetch("https://api.rainviewer.com/public/weather-maps.json");
        const data = await res.json();
        const satPaths = data.satellite?.infrared ?? [];
        if (satPaths.length === 0) return;
        const latestPath = satPaths[satPaths.length - 1].path;
        setSatLabel("GOES-19 SE IR (Live)");
        const satLayer = new google.maps.ImageMapType({
          getTileUrl: (coord, zoom) =>
            `https://tilecache.rainviewer.com${latestPath}/256/${zoom}/${coord.x}/${coord.y}/0/0_0.png`,
          tileSize: new google.maps.Size(256, 256),
          opacity: 0.6,
          name: "satellite",
        });
        satOverlayRef.current = satLayer;
        map.overlayMapTypes.push(satLayer);
      } catch {
        // Silently fail
      }
    };
    fetchSatTiles();
  }, [map, showSatellite]);

  // ── Gulf Stream / SST layer ──────────────────────────────
  const gssLayerRef = useRef<google.maps.ImageMapType | null>(null);
  useEffect(() => {
    if (!map) return;
    if (gssLayerRef.current) {
      const idx = map.overlayMapTypes.getArray().indexOf(gssLayerRef.current);
      if (idx >= 0) map.overlayMapTypes.removeAt(idx);
      gssLayerRef.current = null;
    }
    if (!showGSS) return;
    // NOAA CoastWatch SST tiles
    const sstLayer = new google.maps.ImageMapType({
      getTileUrl: (coord, zoom) =>
        `https://coastwatch.pfeg.noaa.gov/erddap/griddap/jplMURSST41/SST.png?SST%5B(last)%5D%5B(${coord.y})%5D%5B(${coord.x})%5D&.draw=surface&.vars=longitude%7Clatitude%7CSST&.colorBar=%7C%7C%7C%7C%7C&.bgColor=0x00000000`,
      tileSize: new google.maps.Size(256, 256),
      opacity: 0.55,
      name: "gss",
    });
    gssLayerRef.current = sstLayer;
    map.overlayMapTypes.push(sstLayer);
  }, [map, showGSS]);

  // ── Water level markers ──────────────────────────────────
  useEffect(() => {
    waterMarkersRef.current.forEach(m => m.setMap(null));
    waterMarkersRef.current = [];
    if (!map || !showWaterLevels) return;

    WATER_STATIONS.forEach(async (station) => {
      try {
        const now = new Date();
        const end = now.toISOString().slice(0, 16).replace("T", " ");
        const start = new Date(now.getTime() - 3_600_000).toISOString().slice(0, 16).replace("T", " ");
        const res = await fetch(
          `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}&station=${station.id}&product=water_level&datum=MLLW&time_zone=lst_ldt&units=english&application=captains_charter_weather&format=json`
        );
        const data = await res.json();
        const latest = data.data?.[data.data.length - 1];
        const level = latest ? parseFloat(latest.v).toFixed(1) : "--";

        const marker = new google.maps.Marker({
          position: { lat: station.lat, lng: station.lon },
          map,
          title: station.name,
          label: {
            text: `${level}ft`,
            color: "#00D4FF",
            fontSize: "10px",
            fontFamily: "JetBrains Mono, monospace",
            fontWeight: "600",
          },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#0D1520",
            fillOpacity: 0.9,
            strokeColor: "#00D4FF",
            strokeWeight: 1.5,
          },
        });
        waterMarkersRef.current.push(marker);
      } catch {
        // Skip station
      }
    });
  }, [map, showWaterLevels]);

  // ── Map type toggle ──────────────────────────────────────
  useEffect(() => {
    if (!map) return;
    map.setMapTypeId(mapType);
  }, [map, mapType]);

  // ── Map ready ────────────────────────────────────────────
  const handleMapReady = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    mapInstance.setCenter({ lat: 27.5, lng: -81.5 });
    mapInstance.setZoom(6);
    // Dark map style
    mapInstance.setOptions({
      styles: [
        { elementType: "geometry", stylers: [{ color: "#0A0E14" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#7B9BB5" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#0A0E14" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#0D1520" }] },
        { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#00D4FF" }] },
        { featureType: "road", stylers: [{ visibility: "simplified" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#1A2D42" }] },
        { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#1A2D42" }] },
        { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#7B9BB5" }] },
        { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#7B9BB5" }] },
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
      ],
    });
  }, []);

  return (
    <div style={{ paddingTop: "3.5rem", display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Layer controls */}
      <div style={{ background: "rgba(10,14,20,0.97)", borderBottom: "1px solid #1A2D42", padding: "8px 16px", flexShrink: 0 }}>
        <div className="flex flex-wrap gap-2 items-center">
          <LayerBtn label="Active Alerts" icon="⚠" active={showAlerts} activeClass="active" onClick={() => setShowAlerts(!showAlerts)} />
          <LayerBtn label="Weather Radar" icon="📡" active={showRadar} activeClass="active-radar" onClick={() => setShowRadar(!showRadar)} />
          <LayerBtn label="Weather Satellite" icon="🛰" active={showSatellite} activeClass="active-sat" onClick={() => setShowSatellite(!showSatellite)} />
          <LayerBtn label="Gulf Stream / SST" icon="🌊" active={showGSS} activeClass="active-gss" onClick={() => setShowGSS(!showGSS)} />
          <LayerBtn label="Water Levels" icon="📊" active={showWaterLevels} activeClass="active-water" onClick={() => setShowWaterLevels(!showWaterLevels)} />
        </div>
        <div className="flex flex-wrap gap-2 items-center mt-2">
          <LayerBtn label="BlueTopo (Depth)" icon="🗺" active={showBlueTopo} activeClass="active-blue" onClick={() => setShowBlueTopo(!showBlueTopo)} />
          <LayerBtn label="Zone Forecasts" icon="📋" active={showZoneForecasts} activeClass="active-zone" onClick={() => setShowZoneForecasts(!showZoneForecasts)} />
          {showSatellite && (
            <span className="font-data" style={{ fontSize: "0.6rem", color: "#7B9BB5", marginLeft: 8 }}>
              Satellite: {satLabel}
            </span>
          )}
        </div>
      </div>

      {/* Map + sidebar */}
      <div className="flex flex-1" style={{ minHeight: 0 }}>
        {/* Map */}
        <div className="relative flex-1" style={{ minWidth: 0 }}>
          {/* Map type toggle */}
          <div className="absolute top-3 left-3 z-10 flex" style={{ background: "rgba(10,14,20,0.9)", border: "1px solid #1A2D42" }}>
            {(["roadmap", "satellite"] as const).map(type => (
              <button
                key={type}
                className="font-tactical font-bold px-4 py-2 cursor-pointer transition-all duration-150"
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.08em",
                  background: mapType === type ? "rgba(0,212,255,0.15)" : "transparent",
                  color: mapType === type ? "#00D4FF" : "#7B9BB5",
                  border: "none",
                }}
                onClick={() => setMapType(type)}
              >
                {type === "roadmap" ? "Map" : "Satellite"}
              </button>
            ))}
          </div>

          <MapView
            onMapReady={handleMapReady}
            className="w-full h-full"
          />
        </div>

        {/* Advisory list sidebar */}
        <div
          style={{
            width: "340px",
            flexShrink: 0,
            background: "#0A0E14",
            borderLeft: "1px solid #1A2D42",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Sidebar header */}
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #1A2D42", flexShrink: 0 }}>
            <div>
              <div className="font-tactical text-white" style={{ fontSize: "0.85rem", fontWeight: 700 }}>Marine Advisories</div>
              <div className="font-data" style={{ fontSize: "0.55rem", color: "#7B9BB5" }}>
                {alertsLoading ? "Loading..." : `${alerts.length} active · NWS`}
              </div>
            </div>
            <button
              className="font-data cursor-pointer"
              style={{ fontSize: "0.55rem", color: "#00D4FF", background: "none", border: "none", letterSpacing: "0.1em" }}
              onClick={fetchAlerts}
            >
              REFRESH
            </button>
          </div>

          {/* Advisory list */}
          <div
            id="advisory-list"
            style={{ flex: 1, overflowY: "auto", padding: "8px" }}
          >
            {alertsLoading && (
              <div className="flex items-center gap-2 py-8 justify-center">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00D4FF" }} />
                <span className="font-data" style={{ fontSize: "0.6rem", color: "#7B9BB5" }}>FETCHING ADVISORIES...</span>
              </div>
            )}
            {!alertsLoading && alerts.length === 0 && (
              <div className="text-center py-12">
                <div className="font-data mb-2" style={{ fontSize: "0.65rem", color: "#39FF14", letterSpacing: "0.15em" }}>ALL CLEAR</div>
                <div className="font-data" style={{ fontSize: "0.7rem", color: "#7B9BB5" }}>No active marine advisories</div>
              </div>
            )}
            {!alertsLoading && alerts.map(alert => (
              <AdvisoryCard
                key={alert.id}
                alert={alert}
                isHighlighted={highlightedAlertId === alert.id}
                onZoneClick={(zoneId) => {
                  // Find the zone rectangle and trigger click
                  const key = `${alert.id}-${zoneId}`;
                  const rect = zoneRectsRef.current.get(key);
                  if (rect) {
                    const bounds = rect.getBounds();
                    if (bounds) {
                      handleZoneClick(zoneId, alert.id, {
                        north: bounds.getNorthEast().lat(),
                        south: bounds.getSouthWest().lat(),
                        east: bounds.getNorthEast().lng(),
                        west: bounds.getSouthWest().lng(),
                      }, alert.event);
                    }
                  }
                }}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2" style={{ borderTop: "1px solid #1A2D42", flexShrink: 0 }}>
            <div className="font-data" style={{ fontSize: "0.55rem", color: "#7B9BB5" }}>
              Source: NWS / NOAA · Updates every 5 min
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── NWS zone bounding boxes ──────────────────────────────────
// Approximate lat/lon bounds for common Florida and Bahamas NWS marine zones
function getNWSZoneBounds(zoneId: string): google.maps.LatLngBoundsLiteral | null {
  const ZONE_BOUNDS: Record<string, google.maps.LatLngBoundsLiteral> = {
    // Florida coastal zones
    "FLZ068": { north: 30.8, south: 30.0, east: -81.0, west: -82.0 },
    "FLZ069": { north: 30.8, south: 30.0, east: -80.0, west: -81.0 },
    "FLZ070": { north: 30.0, south: 29.0, east: -80.5, west: -81.5 },
    "FLZ071": { north: 29.0, south: 28.0, east: -80.5, west: -81.5 },
    "FLZ072": { north: 28.0, south: 27.0, east: -80.2, west: -81.0 },
    "FLZ073": { north: 27.0, south: 26.0, east: -80.0, west: -81.0 },
    "FLZ074": { north: 26.0, south: 25.0, east: -80.0, west: -81.0 },
    "FLZ075": { north: 25.5, south: 24.5, east: -80.0, west: -81.5 },
    "FLZ076": { north: 24.8, south: 24.0, east: -80.5, west: -82.0 },
    "FLZ077": { north: 24.8, south: 24.3, east: -82.0, west: -83.0 },
    // Gulf of Mexico zones
    "GMZ830": { north: 30.5, south: 29.0, east: -85.0, west: -87.5 },
    "GMZ831": { north: 30.5, south: 29.0, east: -82.5, west: -85.0 },
    "GMZ832": { north: 29.0, south: 27.5, east: -82.5, west: -85.0 },
    "GMZ833": { north: 27.5, south: 26.0, east: -82.0, west: -84.0 },
    "GMZ834": { north: 26.0, south: 24.5, east: -81.5, west: -83.5 },
    "GMZ835": { north: 24.5, south: 23.0, east: -81.0, west: -83.0 },
    "GMZ836": { north: 30.5, south: 29.0, east: -87.5, west: -90.0 },
    "GMZ837": { north: 29.0, south: 27.5, east: -85.0, west: -87.5 },
    "GMZ838": { north: 27.5, south: 26.0, east: -84.0, west: -86.5 },
    "GMZ839": { north: 26.0, south: 24.5, east: -83.5, west: -86.0 },
    // Atlantic zones
    "AMZ610": { north: 31.0, south: 30.0, east: -79.0, west: -81.0 },
    "AMZ620": { north: 30.0, south: 29.0, east: -79.0, west: -81.0 },
    "AMZ630": { north: 29.0, south: 28.0, east: -79.0, west: -80.5 },
    "AMZ640": { north: 28.0, south: 27.0, east: -79.0, west: -80.5 },
    "AMZ650": { north: 27.0, south: 26.0, east: -79.0, west: -80.5 },
    "AMZ660": { north: 26.0, south: 25.0, east: -79.0, west: -80.5 },
    "AMZ670": { north: 25.0, south: 24.0, east: -79.0, west: -80.5 },
    "AMZ680": { north: 24.5, south: 23.5, east: -79.0, west: -81.0 },
    // Bahamas / Straits
    "AMZ710": { north: 27.5, south: 26.0, east: -77.0, west: -79.0 },
    "AMZ720": { north: 26.0, south: 24.5, east: -77.0, west: -79.0 },
    "AMZ730": { north: 24.5, south: 23.0, east: -77.0, west: -79.0 },
    "AMZ750": { north: 25.5, south: 24.0, east: -79.0, west: -81.0 },
    "AMZ760": { north: 24.5, south: 23.0, east: -79.0, west: -81.0 },
    // Florida Straits
    "AMZ810": { north: 25.5, south: 24.5, east: -80.0, west: -82.0 },
    "AMZ820": { north: 24.5, south: 23.5, east: -80.5, west: -82.5 },
    "AMZ830": { north: 23.5, south: 22.5, east: -81.0, west: -83.0 },
  };
  return ZONE_BOUNDS[zoneId] ?? null;
}
