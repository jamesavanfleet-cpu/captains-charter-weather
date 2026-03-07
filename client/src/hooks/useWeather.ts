import { useState, useCallback, useEffect } from "react";
import {
  PORTS, ALL_REGIONS, FLORIDA_REGIONS, BAHAMAS_REGIONS,
  PortWeather, ConditionStatus,
  degToCompass, msToKnots, mToFt, cToF, hPaToInHg,
  getConditionStatus, getConditionLabel,
} from "@/lib/data";

export interface RegionSummary {
  regionId: string;
  overallStatus: ConditionStatus;
  avgWindKnots: number;
  avgWaveFt: number;
  avgSstF: number;
  loading: boolean;
}

// Fetch weather for all ports in a region
export function useRegionWeather(regionId: string) {
  const [ports, setPorts] = useState<PortWeather[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetch_ = useCallback(async () => {
    const regionPorts = PORTS.filter(p => p.regionId === regionId);
    if (regionPorts.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        regionPorts.map(async (port) => {
          try {
            const wxUrl = `https://api.open-meteo.com/v1/forecast?latitude=${port.lat}&longitude=${port.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure,weather_code&wind_speed_unit=ms&timezone=auto&forecast_days=1`;
            const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${port.lat}&longitude=${port.lon}&current=wave_height,wave_period,sea_surface_temperature&timezone=auto`;
            const [wxRes, marineRes] = await Promise.all([
              fetch(wxUrl),
              fetch(marineUrl).catch(() => null),
            ]);
            const wx = await wxRes.json();
            const marine = marineRes ? await marineRes.json().catch(() => null) : null;
            const tempF = cToF(wx.current.temperature_2m);
            const windKnots = msToKnots(wx.current.wind_speed_10m);
            const windDeg = wx.current.wind_direction_10m;
            const pressureInHg = hPaToInHg(wx.current.surface_pressure);
            const humidity = wx.current.relative_humidity_2m;
            let waveFt = 0, wavePeriod = 0, sstF = 0;
            if (marine?.current) {
              if (marine.current.wave_height != null) waveFt = mToFt(marine.current.wave_height);
              if (marine.current.wave_period != null) wavePeriod = marine.current.wave_period;
              if (marine.current.sea_surface_temperature != null) sstF = cToF(marine.current.sea_surface_temperature);
            }
            return {
              portName: port.portName,
              region: port.region,
              lat: port.lat,
              lon: port.lon,
              tempF,
              windSpeedKnots: windKnots,
              windDirDeg: windDeg,
              windDirLabel: degToCompass(windDeg),
              waveHeightFt: waveFt,
              wavePeriodSec: Math.round(wavePeriod),
              pressureInHg,
              humidity,
              visibility: "10+ nm",
              condition: getConditionLabel(windKnots, waveFt),
              conditionStatus: getConditionStatus(windKnots, waveFt),
              sstF,
              updatedAt: new Date().toISOString(),
              loading: false,
              error: false,
            } as PortWeather;
          } catch {
            return {
              portName: port.portName,
              region: port.region,
              lat: port.lat,
              lon: port.lon,
              tempF: 0, windSpeedKnots: 0, windDirDeg: 0, windDirLabel: "--",
              waveHeightFt: 0, wavePeriodSec: 0, pressureInHg: 0, humidity: 0,
              visibility: "--", condition: "Data Unavailable", conditionStatus: "caution" as ConditionStatus,
              sstF: 0, updatedAt: new Date().toISOString(), loading: false, error: true,
            } as PortWeather;
          }
        })
      );
      setPorts(results);
      setLastUpdated(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" }));
    } catch {
      setError("Failed to load weather data");
    } finally {
      setLoading(false);
    }
  }, [regionId]);

  useEffect(() => {
    fetch_();
    const interval = setInterval(fetch_, 600_000);
    return () => clearInterval(interval);
  }, [fetch_]);

  return { ports, loading, error, lastUpdated, refresh: fetch_ };
}

// Fetch summary for all regions (for Florida/Bahamas overview pages)
export function useAllRegionSummaries(group: "florida" | "bahamas") {
  const regions = group === "florida" ? FLORIDA_REGIONS : BAHAMAS_REGIONS;
  const [summaries, setSummaries] = useState<RegionSummary[]>(
    regions.map(r => ({ regionId: r.id, overallStatus: "go", avgWindKnots: 0, avgWaveFt: 0, avgSstF: 0, loading: true }))
  );

  useEffect(() => {
    regions.forEach(async (region) => {
      const regionPorts = PORTS.filter(p => p.regionId === region.id);
      if (regionPorts.length === 0) return;
      try {
        const results = await Promise.all(
          regionPorts.map(async (port) => {
            try {
              const wxUrl = `https://api.open-meteo.com/v1/forecast?latitude=${port.lat}&longitude=${port.lon}&current=wind_speed_10m&wind_speed_unit=ms&timezone=auto&forecast_days=1`;
              const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${port.lat}&longitude=${port.lon}&current=wave_height,sea_surface_temperature&timezone=auto`;
              const [wxRes, marineRes] = await Promise.all([
                fetch(wxUrl),
                fetch(marineUrl).catch(() => null),
              ]);
              const wx = await wxRes.json();
              const marine = marineRes ? await marineRes.json().catch(() => null) : null;
              const windKnots = msToKnots(wx.current.wind_speed_10m);
              let waveFt = 0, sstF = 0;
              if (marine?.current) {
                if (marine.current.wave_height != null) waveFt = mToFt(marine.current.wave_height);
                if (marine.current.sea_surface_temperature != null) sstF = cToF(marine.current.sea_surface_temperature);
              }
              return { windKnots, waveFt, sstF };
            } catch {
              return { windKnots: 0, waveFt: 0, sstF: 0 };
            }
          })
        );
        const avgWind = results.reduce((s, r) => s + r.windKnots, 0) / results.length;
        const avgWave = results.reduce((s, r) => s + r.waveFt, 0) / results.length;
        const avgSst = results.reduce((s, r) => s + r.sstF, 0) / results.length;
        setSummaries(prev => prev.map(s =>
          s.regionId === region.id
            ? { ...s, overallStatus: getConditionStatus(avgWind, avgWave), avgWindKnots: Math.round(avgWind), avgWaveFt: Math.round(avgWave * 10) / 10, avgSstF: Math.round(avgSst), loading: false }
            : s
        ));
      } catch {
        setSummaries(prev => prev.map(s =>
          s.regionId === region.id ? { ...s, loading: false } : s
        ));
      }
    });
  }, [group]);

  return summaries;
}
