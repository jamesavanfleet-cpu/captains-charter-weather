// useAdvisories.ts — Captain's Charter Weather
// Fetches live NWS marine alerts for Florida and Bahamas zones
import { useState, useCallback, useEffect, useRef } from "react";
import {
  MARINE_ZONES, ZONE_IDS, ALERT_CONFIG, DEFAULT_ALERT_CONFIG,
  SEVERITY_ORDER, MarineAlert, AlertSeverity,
} from "@/lib/advisoryData";

function getAlertConfig(event: string) {
  return ALERT_CONFIG[event] ?? DEFAULT_ALERT_CONFIG;
}

function getExpiryStatus(expiresIso: string): { status: "active" | "expiring_soon" | "expired"; minutesUntilExpiry: number } {
  const remaining = new Date(expiresIso).getTime() - Date.now();
  const minutes = Math.round(remaining / 60_000);
  if (remaining <= 0) return { status: "expired", minutesUntilExpiry: 0 };
  if (minutes <= 60) return { status: "expiring_soon", minutesUntilExpiry: minutes };
  return { status: "active", minutesUntilExpiry: minutes };
}

function parseAlert(feature: Record<string, unknown>): MarineAlert | null {
  const props = feature.properties as Record<string, unknown> | undefined;
  if (!props) return null;
  const event = (props.event as string) ?? "Unknown";
  const cfg = getAlertConfig(event);
  const expires = (props.expires as string) ?? (props.ends as string) ?? "";
  const { status, minutesUntilExpiry } = getExpiryStatus(expires);
  if (status === "expired") return null;
  const zoneUrls = (props.affectedZones as string[]) ?? [];
  const zoneIds = zoneUrls.map(url => { const parts = url.split("/"); return parts[parts.length - 1]; });
  const affectedZones = MARINE_ZONES.filter(z => zoneIds.includes(z.id));
  const affectedRegions = Array.from(new Set(affectedZones.map(z => z.region)));
  return {
    id: (feature.id as string) ?? (props.id as string) ?? Math.random().toString(),
    event,
    headline: (props.headline as string) ?? "",
    description: (props.description as string) ?? "",
    instruction: (props.instruction as string) ?? "",
    severity: cfg.severity,
    certainty: (props.certainty as string) ?? "",
    urgency: (props.urgency as string) ?? "",
    onset: (props.onset as string) ?? (props.effective as string) ?? "",
    expires,
    affectedZoneIds: zoneIds,
    affectedZones,
    affectedRegions,
    status,
    minutesUntilExpiry,
    color: cfg.color,
    bgColor: cfg.bgColor,
    borderColor: cfg.borderColor,
    icon: cfg.icon,
  };
}

export function useAdvisories() {
  const [alerts, setAlerts] = useState<MarineAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    try {
      const url = `https://api.weather.gov/alerts/active?zone=${ZONE_IDS}&status=actual`;
      const res = await fetch(url, { headers: { "User-Agent": "CaptainsCharterWeather/1.0 (jamesavanfleet@gmail.com)" } });
      if (!res.ok) throw new Error(`NOAA API error: ${res.status}`);
      const data = await res.json();
      const parsed = ((data.features ?? []) as Record<string, unknown>[])
        .map(parseAlert)
        .filter((a): a is MarineAlert => a !== null)
        .sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity));
      setAlerts(parsed);
      setLastUpdated(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" }));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch marine alerts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    intervalRef.current = setInterval(refresh, 300_000); // every 5 min
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [refresh]);

  const alertsByZone = new Map<string, MarineAlert[]>();
  const alertsByRegion = new Map<string, MarineAlert[]>();
  for (const alert of alerts) {
    for (const zoneId of alert.affectedZoneIds) {
      if (!alertsByZone.has(zoneId)) alertsByZone.set(zoneId, []);
      alertsByZone.get(zoneId)!.push(alert);
    }
    for (const region of alert.affectedRegions) {
      if (!alertsByRegion.has(region)) alertsByRegion.set(region, []);
      alertsByRegion.get(region)!.push(alert);
    }
  }

  const highestSeverity: AlertSeverity | null = alerts.length > 0
    ? (SEVERITY_ORDER.find(s => alerts.some(a => a.severity === s)) ?? null)
    : null;

  return { alerts, loading, error, lastUpdated, refresh, alertsByZone, alertsByRegion, activeCount: alerts.length, highestSeverity };
}
