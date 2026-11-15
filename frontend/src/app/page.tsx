"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("../components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[#030914]/35 text-[#91A9C2] text-xs font-mono rounded-xl border border-[#2D9BCC]/15">
      <div className="flex items-center gap-2.5">
        <div className="w-4 h-4 border-2 border-[#19D8F2] border-t-transparent rounded-full animate-spin" />
        INITIALIZING GEOSPATIAL TELEMETRY...
      </div>
    </div>
  ),
});

const CITIES_COORDS: Record<string, { lat: number; lng: number }> = {
  Delhi: { lat: 28.6139, lng: 77.209 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Nagpur: { lat: 21.1458, lng: 79.0882 },
};

export const Icon = ({ name, size = 20, className = "" }: { name: string; size?: number; className?: string; }) => {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className, };
  switch (name) {
    case "arrow-left": return <svg {...props}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
    case "arrow-right": return <svg {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
    case "overview": return <svg {...props}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>;
    case "fleet": return <svg {...props}><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>;
    case "truck": return <svg {...props}><path d="M10 17h4V5H2v12h3" /><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" /><path d="M14 17h1" /><circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>;
    case "routes": return <svg {...props}><circle cx="6" cy="19" r="3" /><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" /><circle cx="18" cy="5" r="3" /></svg>;
    case "planner": return <svg {...props}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" x2="9" y1="3" y2="18" /><line x1="15" x2="15" y1="6" y2="21" /></svg>;
    case "box": return <svg {...props}><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>;
    case "alert": return <svg {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>;
    case "cloud": return <svg {...props}><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /><path d="M11 13v4" /><path d="M15 15v4" /></svg>;
    case "ai": return <svg {...props}><path d="M12 2v4" /><path d="m16.2 7.8 2.9-2.9" /><path d="M18 12h4" /><path d="m16.2 16.2 2.9 2.9" /><path d="M12 18v4" /><path d="m4.9 19.1 2.9-2.9" /><path d="M2 12h4" /><path d="m4.9 4.9 2.9 2.9" /><circle cx="12" cy="12" r="4" /></svg>;
    case "search": return <svg {...props}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
    case "user": return <svg {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
    case "wind": return <svg {...props}><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" /><path d="M9.6 4.6A2 2 0 1 1 11 8H2" /><path d="M12.6 19.4A2 2 0 1 0 14 16H2" /></svg>;
    case "droplet": return <svg {...props}><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" /></svg>;
    case "target": return <svg {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;
    case "check": return <svg {...props}><path d="M20 6 9 17l-5-5" /></svg>;
    case "shield": return <svg {...props}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>;
    case "sos": return <svg {...props}><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
    case "pause": return <svg {...props}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>;
    default: return <svg {...props}><circle cx="12" cy="12" r="9" /></svg>;
  }
};

export const WeatherIllustration = () => (
  <svg width="46" height="46" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="28" cy="24" r="11" fill="#FFB547" />
    <path d="M48.5 35.5C48.5 40.1944 44.6944 44 40 44H21C15.4772 44 11 39.5228 11 34C11 29.071 14.5684 24.9686 19.2625 24.1611C20.4704 18.4414 25.5658 14 31.5 14C37.8938 14 43.195 18.675 44.1506 24.8142C46.6806 25.5636 48.5 27.915 48.5 30.75C48.5 31.2588 48.4239 31.751 48.2831 32.217C48.4253 32.7483 48.5 33.3101 48.5 33.8889V35.5Z" fill="#EAF5FF" />
    <path d="M22 48L18 56M32 48L28 56M42 48L38 56" stroke="#19D8F2" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const GlassPanel = ({ children, className = "", raised = false }: { children: React.ReactNode; className?: string; raised?: boolean; }) => (
  <div className={`rounded-xl border backdrop-blur-md transition-all ${raised ? "bg-[#051425]/50 border-[#2D9BCC]/25 shadow-[0_8px_32px_rgba(0,0,0,0.5)]" : "bg-[#030914]/35 border-[#2D9BCC]/15 shadow-[0_4px_24px_rgba(0,0,0,0.4)]"} ${className}`}>
    {children}
  </div>
);

export default function SmartLogisticsApp() {
  const [isDriverMode, setIsDriverMode] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);

  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<any | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<any | null>(null);
  const [routeDetailTab, setRouteDetailTab] = useState("Overview");
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null);

  const [trackingDeliveryId, setTrackingDeliveryId] = useState<number | null>(null);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [acceptingReroute, setAcceptingReroute] = useState(false);
  const [isTripPaused, setIsTripPaused] = useState(false);
  const [isMarkedArrived, setIsMarkedArrived] = useState(false);
  
  // Clean Memory Shield for the popup and vector math
  const [handledHazards, setHandledHazards] = useState<number[]>([]);
  const handledHazardsRef = useRef<number[]>([]);
  useEffect(() => { handledHazardsRef.current = handledHazards; }, [handledHazards]);

  const trackingDataRef = useRef<any>(null);
  useEffect(() => { trackingDataRef.current = trackingData; }, [trackingData]);

  const [mapLayers, setMapLayers] = useState({ vehicles: true, routes: true, incidents: true, weather: true });
  const handleToggleLayer = (key: string) => { setMapLayers((prev: any) => ({ ...prev, [key]: !prev[key] })); };

  const [fleetStatusFilter, setFleetStatusFilter] = useState("All");
  const [fleetTypeFilter, setFleetTypeFilter] = useState("All");
  const [routeRiskFilter, setRouteRiskFilter] = useState("All");
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState("All");
  const [alertSeverityFilter, setAlertSeverityFilter] = useState("All");
  const [alertStatusFilter, setAlertStatusFilter] = useState("All");

  const [showNewRouteModal, setShowNewRouteModal] = useState(false);
  const [showNewDeliveryModal, setShowNewDeliveryModal] = useState(false);
  const [showNewIncidentModal, setShowNewIncidentModal] = useState(false);

  const [vehicleForm, setVehicleForm] = useState({ vehicle_number: "", vehicle_type: "Truck", status: "Idle" });
  const [driverForm, setDriverForm] = useState({ name: "", efficiency_score: 90.0 });
  const [routeForm, setRouteForm] = useState({ source: "Delhi", destination: "Mumbai", distance_km: 1420, eta_hours: 24, status: "Active" });
  const [deliveryForm, setDeliveryForm] = useState({ vehicle_id: "", route_id: "", goods: "", driver_name: "", priority: "Standard", status: "Pending" });
  const [incidentForm, setIncidentForm] = useState({ incident_type: "Road Blockage", severity: "High", description: "", location_name: "Delhi" });

  const [plannerForm, setPlannerForm] = useState({ source: "Delhi", destination: "Mumbai", mode: "fastest" });
  const [plannedRoutes, setPlannedRoutes] = useState<any[]>([]);
  const [isPlanning, setIsPlanning] = useState(false);
  const [plannerError, setPlannerError] = useState("");

  const [mlPredictions, setMlPredictions] = useState<Record<number, any>>({});
  const [isPredicting, setIsPredicting] = useState<Record<number, boolean>>({});
  const [driverPredictions, setDriverPredictions] = useState<Record<number, any>>({});
  const [isDriverPredicting, setIsDriverPredicting] = useState<Record<number, boolean>>({});

  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherSearchCity, setWeatherSearchCity] = useState("");
  const [cityWeatherList, setCityWeatherList] = useState<any[]>([]);
  const [severeWeatherAlerts, setSevereWeatherAlerts] = useState<any[]>([
    { region: "Bay of Bengal (East Corridor)", event: "Severe Cyclone Advisory", severity: "Critical", advisory: "Heavy gale winds > 85km/h visible on radar. Avoid coastal routes." },
    { region: "Delhi - Jaipur Highway", event: "Dense Fog Alert", severity: "Moderate", advisory: "Visibility reduced < 50m during early transit hours." }
  ]);

  const [clock, setClock] = useState({ date: "Nov 12, 2026", time: "11:47" });
  
  // ---------------------------------------------------------
  // GLOBAL MOUNT & POLLING SYNC
  // ---------------------------------------------------------
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClock({
        date: now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        time: now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
      });
    };
    updateClock();
    const t = setInterval(updateClock, 10000);
    return () => clearInterval(t);
  }, []);

  const fetchData = async () => {
    try {
      const [vRes, rRes, dRes, iRes, drRes] = await Promise.all([
        fetch("https://smart-logistics-17od.onrender.com/api/vehicles").catch(() => null),
        fetch("https://smart-logistics-17od.onrender.com/api/routes").catch(() => null),
        fetch("https://smart-logistics-17od.onrender.com/api/deliveries").catch(() => null),
        fetch("https://smart-logistics-17od.onrender.com/api/incidents").catch(() => null),
        fetch("https://smart-logistics-17od.onrender.com/api/drivers").catch(() => null),
      ]);
      const vData = vRes && vRes.ok ? await vRes.json() : null;
      const rData = rRes && rRes.ok ? await rRes.json() : null;
      const dData = dRes && dRes.ok ? await dRes.json() : null;
      const iData = iRes && iRes.ok ? await iRes.json() : null;
      const drData = drRes && drRes.ok ? await drRes.json() : null;

      if (vData && Array.isArray(vData)) {
        setVehicles((prev) => {
          return vData.map((apiV: any) => {
            const loc = prev.find((p) => p.id === apiV.id);
            // CRITICAL FIX: Only preserve local coordinates if the truck is ALREADY driving.
            if (loc && (loc.status === "In Transit" || loc.status === "Paused") && (apiV.status === "In Transit" || apiV.status === "Paused")) {
               return { ...apiV, latitude: loc.latitude, longitude: loc.longitude, status: loc.status, lastIdx: loc.lastIdx || 0 };
            }
            return apiV; // Allows the vehicle to snap to the correct starting terminal!
          });
        });
      }
      
      if (rData && Array.isArray(rData)) setRoutes(rData);
      if (dData && Array.isArray(dData)) setDeliveries(dData);
      if (iData && Array.isArray(iData)) setIncidents(iData);
      if (drData && Array.isArray(drData)) setDrivers(drData);
    } catch (e) { console.error("Backend fetch error:", e); }
  };

  const deliveriesRef = useRef(deliveries);
  useEffect(() => { deliveriesRef.current = deliveries; }, [deliveries]);

  const completeDelivery = async (deliveryId: number) => {
    try {
      await fetch(`https://smart-logistics-17od.onrender.com/api/deliveries/${deliveryId}/complete`, { method: "POST" });
      fetchData();
    } catch (e) {}
  };

  // FULL POLYLINE TRACKING LOOP (Strict Forward-Only Array Index Gliding)
  const osrmCache = useRef<Record<string, any>>({});
  
  useEffect(() => {
    fetchData();
    
    // --- NEW: LIVE GEOLOCATION WEATHER ---
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const geoData = await geoRes.json();
          const localCity = geoData.address?.city || geoData.address?.town || geoData.address?.state || "Local Hub";
          
          const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=precipitation_sum&timezone=auto`);
          const wData = await wRes.json();
          const curr = wData.current_weather;
          
          setWeatherData({
            city: localCity.toUpperCase(), lat: latitude, lng: longitude,
            temp: Math.round(curr?.temperature ?? 22), wind: Math.round(curr?.windspeed || 10), rain: wData.daily?.precipitation_sum?.[0] || 0,
            code: curr?.weathercode ?? 0, condition: (curr?.windspeed || 10) > 45 ? "Severe Gale" : "Partly Cloudy", humidity: 78
          });
        } catch { fetchMultiCityWeather(); } // Fallback to Delhi if API fails
      }, () => fetchMultiCityWeather()); // Fallback to Delhi if user denies location popup
    } else {
      fetchMultiCityWeather();
    }

    const syncInterval = setInterval(fetchData, 4000); 

    const trackingEngine = setInterval(() => {
      setVehicles((curr) =>
        curr.map((v) => {
          if (v.status === "Paused" || v.status === "Idle") return v; 

          if (v.status === "In Transit" && v.latitude && v.longitude) {
            const activeDel = deliveriesRef.current.find((d: any) => d.vehicle_number === v.vehicle_number && d.status === "In Transit");
            if (activeDel?.destination_latitude && activeDel?.destination_longitude) {
              const rId = activeDel.route_id;
              // CRITICAL: Wrap in Number()
              const destLat = Number(activeDel.destination_latitude);
              const destLng = Number(activeDel.destination_longitude);
              
              if (!osrmCache.current[rId] || osrmCache.current[rId] === "FETCHING") {
                  if (!osrmCache.current[rId]) {
                    osrmCache.current[rId] = "FETCHING";
                    let osrmCoords = `${v.longitude},${v.latitude};${destLng},${destLat}`;

                    const tData = trackingDataRef.current;
                    const hHazards = handledHazardsRef.current;

                    if (tData?.detour && hHazards.includes(tData.detour.hazard_id)) {
                        const hLng = Number(tData.detour.hazard_longitude || 73.8567);
                        const hLat = Number(tData.detour.hazard_latitude || 18.5204);
                        const severity = tData.detour.severity || "Critical"; 

                        const radiusKm = severity === "Critical" ? 30 : severity === "High" ? 24 : severity === "Medium" ? 18 : 9;
                        const offsetDeg = radiusKm / 111.0; 

                        // Vector from Truck directly to Destination
                        const dx = destLng - v.longitude;
                        const dy = destLat - v.latitude;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist > 0) {
                            // Perpendicular Vector (perfect 90-degree shift)
                            const pX = -dy / dist;
                            const pY = dx / dist;

                            // ONE single waypoint, pushed perfectly sideways from the hazard (Creates a clean V-shape)
                            const wpLng = hLng + (pX * offsetDeg);
                            const wpLat = hLat + (pY * offsetDeg);

                            osrmCoords = `${v.longitude},${v.latitude};${wpLng},${wpLat};${destLng},${destLat}`;
                        }
                    }

                    fetch(`https://router.project-osrm.org/route/v1/driving/${osrmCoords}?overview=full&geometries=geojson`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.routes?.[0]) { 
                          osrmCache.current[rId] = data.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]); 
                        } else {
                          osrmCache.current[rId] = "FAILED";
                        }
                    }).catch(() => { delete osrmCache.current[rId]; });
                  }
                  
                  // GRACEFUL FALLBACK
                  const dLat = destLat - v.latitude;
                  const dLng = destLng - v.longitude;
                  const dist = Math.sqrt(dLat * dLat + dLng * dLng);
                  
                  if (dist < 0.08) {
                      fetch(`https://smart-logistics-17od.onrender.com/api/vehicles/${v.id}/position`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ latitude: destLat, longitude: destLng, status: "Idle" }) }).catch(() => {});
                      completeDelivery(activeDel.id);
                      return { ...v, status: "Idle", latitude: destLat, longitude: destLng, lastIdx: 0 };
                  }
                  
                  const speed = 0.08; 
                  const ratio = speed / dist;
                  const newLat = v.latitude + dLat * ratio;
                  const newLng = v.longitude + dLng * ratio;
                  fetch(`https://smart-logistics-17od.onrender.com/api/vehicles/${v.id}/position`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ latitude: newLat, longitude: newLng, status: "In Transit" }) }).catch(() => {});
                  return { ...v, latitude: newLat, longitude: newLng, lastIdx: 0 };
              }

              const path = osrmCache.current[rId];
              if (Array.isArray(path)) {
                  let currentIdx = v.lastIdx || 0;
                  
                  if (currentIdx >= path.length - 2) {
                      fetch(`https://smart-logistics-17od.onrender.com/api/vehicles/${v.id}/position`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ latitude: destLat, longitude: destLng, status: "Idle" }) }).catch(() => {});
                      completeDelivery(activeDel.id);
                      return { ...v, status: "Idle", latitude: destLat, longitude: destLng, lastIdx: 0 };
                  }
                  
                  let nextIdx = Math.min(currentIdx + 6, path.length - 1);
                  const targetPoint = path[nextIdx];
                  
                  fetch(`https://smart-logistics-17od.onrender.com/api/vehicles/${v.id}/position`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ latitude: targetPoint[0], longitude: targetPoint[1], status: "In Transit" }) }).catch(() => {});
                  
                  return { ...v, latitude: targetPoint[0], longitude: targetPoint[1], lastIdx: nextIdx };
              }
            }
          }
          return v;
        })
      );
    }, 1500);

    return () => { clearInterval(trackingEngine); clearInterval(syncInterval); };
  }, []);
  
  const fetchMultiCityWeather = async (primaryCity = "Delhi") => {
    try {
      const targetCities = ["Delhi", "Mumbai", "Bangalore", "Chennai"];
      const results = await Promise.all(
        targetCities.map(async (city) => {
          const coords = CITIES_COORDS[city] || CITIES_COORDS.Delhi;
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto`);
          const data = await res.json();
          return {
            city, lat: coords.lat, lng: coords.lng,
            temp: data.current_weather?.temperature ?? 22, wind: data.current_weather?.windspeed ?? 12, code: data.current_weather?.weathercode ?? 0,
            time: data.current_weather?.time, daily: data.daily, rain: data.daily?.precipitation_sum?.[0] ?? 0,
          };
        })
      );
      setCityWeatherList(results);
      const primary = results.find((r) => r.city === primaryCity) || results[0];
      setWeatherData(primary);
    } catch (e) {
      console.warn("Weather API unreachable. Falling back to cached data.");
    }
  };

  const fetchWeatherForCity = async (cityName: string) => {
    if (!cityName.trim()) return;
    try {
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`);
      const geoData = await geoRes.json();
      if (!geoData || geoData.length === 0) { alert("City not found globally."); return; }
      const lat = parseFloat(geoData[0].lat); const lng = parseFloat(geoData[0].lon);

      const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`);
      const wData = await wRes.json();
      const curr = wData.current_weather;
      
      setWeatherData({
        city: cityName.toUpperCase(), lat: lat, lng: lng,
        temp: Math.round(curr?.temperature ?? 22), wind: Math.round(curr?.windspeed || 10), rain: wData.daily?.precipitation_sum?.[0] || 0,
        code: curr?.weathercode ?? 0, condition: (curr?.windspeed || 10) > 45 ? "Severe Gale" : "Partly Cloudy", humidity: 78
      });
    } catch (e) {}
  };

  const getWeatherLabel = (code: number) => {
    if (code === 0) return "Clear Sky";
    if (code <= 3) return "Partly Cloudy";
    if (code >= 45 && code <= 48) return "Foggy";
    if (code >= 51 && code <= 67) return "Light Rain";
    if (code >= 80) return "Heavy Rain";
    return "Cloudy";
  };

  // Driver HUD Poller
  useEffect(() => {
    if ((activeTab !== "Live Tracking" && !isDriverMode) || !trackingDeliveryId) return;
    const fetchLiveTracking = async () => {
      try {
        const res = await fetch(`https://smart-logistics-17od.onrender.com/api/tracking/${trackingDeliveryId}`);
        if (res.ok) {
          const data = await res.json();
          setTrackingData(data);
          setIsTripPaused(data.delivery.status === "Paused");
        }
      } catch (e) {}
    };
    fetchLiveTracking();
    const interval = setInterval(fetchLiveTracking, 3000);
    return () => clearInterval(interval);
  }, [activeTab, isDriverMode, trackingDeliveryId]);

  const handleAcceptReroute = async (reroute: any) => {
    if (!trackingDeliveryId || !window.confirm(`Confirm bypass route: ${reroute.recommended_path.join(" → ")}?`)) return;
    setAcceptingReroute(true);
    try {
      setHandledHazards(prev => [...prev, reroute.hazard_id]); // INSTANT HIDE
      
      const res = await fetch("https://smart-logistics-17od.onrender.com/api/driver/accept-reroute", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delivery_id: trackingDeliveryId, hazard_id: reroute.hazard_id, new_path: reroute.recommended_path, distance_km: reroute.distance_km, eta_hours: reroute.cost_hrs, reason: reroute.reason }),
      });
      if (!res.ok) throw new Error(await res.text());
      
      if (trackingData?.delivery?.route_id) delete osrmCache.current[trackingData.delivery.route_id];
      fetchData();
    } catch (e: any) { alert("Reroute failed: " + e.message); } 
    finally { setAcceptingReroute(false); }
  };

  const handleDeclineReroute = async (hazard_id: number) => {
    if (!trackingDeliveryId) return;
    setHandledHazards(prev => [...prev, hazard_id]); // INSTANT HIDE
    try {
      const res = await fetch("https://smart-logistics-17od.onrender.com/api/driver/decline-reroute", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delivery_id: trackingDeliveryId, hazard_id }),
      });
    } catch (e: any) { console.error(e); } 
  };

  const handlePauseResumeTrip = async (action: "pause" | "resume") => {
    if (!trackingDeliveryId) return;
    try {
      const res = await fetch(`https://smart-logistics-17od.onrender.com/api/driver/${action}-trip/${trackingDeliveryId}`, { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      
      setIsTripPaused(action === "pause");
      setVehicles(prev => prev.map(v => v.id === trackingData?.delivery?.vehicle_id ? { ...v, status: action === "pause" ? "Paused" : "In Transit" } : v));
      setDeliveries(prev => prev.map(d => d.id === trackingDeliveryId ? { ...d, status: action === "pause" ? "Paused" : "In Transit" } : d));
    } catch (e: any) { alert("Action failed: " + e.message); }
  };

  // ADMIN FORM SUBMISSION HANDLERS
  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("https://smart-logistics-17od.onrender.com/api/vehicles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(vehicleForm) });
      if(!res.ok) throw new Error(await res.text());
      setVehicleForm({ vehicle_number: "", vehicle_type: "Truck", status: "Idle" });
      fetchData();
      alert("Vehicle Registered Successfully!");
    } catch(err: any) { alert(`Registration failed: ${err.message}`); }
  };

  const handleDriverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("https://smart-logistics-17od.onrender.com/api/drivers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: driverForm.name, efficiency_score: Number(driverForm.efficiency_score) }) });
      if(!res.ok) throw new Error(await res.text());
      setDriverForm({ name: "", efficiency_score: 90.0 });
      fetchData();
      alert("Driver Onboarded Successfully!");
    } catch(err: any) { alert(`Driver onboarding failed: ${err.message}`); }
  };

  const handleRouteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("https://smart-logistics-17od.onrender.com/api/routes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...routeForm, distance_km: Number(routeForm.distance_km), eta_hours: Number(routeForm.eta_hours) }) });
      if(!res.ok) throw new Error(await res.text());
      setShowNewRouteModal(false);
      fetchData();
    } catch(err: any) { alert(`Failed to register route: ${err.message}`); }
  };

  const handleDeliverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("https://smart-logistics-17od.onrender.com/api/deliveries", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicle_id: Number(deliveryForm.vehicle_id), route_id: Number(deliveryForm.route_id), goods: deliveryForm.goods, driver_name: deliveryForm.driver_name || "Unassigned", priority: "Standard", status: "Pending" }),
      });
      if(!res.ok) throw new Error(await res.text());
      setShowNewDeliveryModal(false);
      setDeliveryForm({ vehicle_id: "", route_id: "", goods: "", driver_name: "", priority: "Standard", status: "Pending" });
      fetchData();
    } catch (err: any) { alert(`Dispatch failed: ${err.message}`); }
  };

  const handleIncidentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("https://smart-logistics-17od.onrender.com/api/incidents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(incidentForm) });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Server rejected the incident.");
      }
      setShowNewIncidentModal(false);
      setIncidentForm({ incident_type: "Road Blockage", severity: "High", description: "", location_name: "Delhi" });
      fetchData();
      alert("Hazard Broadcasted to Network.");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const resolveIncident = async (id: number) => {
    try {
      await fetch(`https://smart-logistics-17od.onrender.com/api/incidents/${id}/resolve`, { method: "PATCH" });
      fetchData(); 
    } catch(e) {}
  };

  const runMLPrediction = async (route: any) => {
    if (!route) return;
    setIsPredicting((p) => ({ ...p, [route.id]: true }));
    let windspeed = weatherData?.wind || 12.0;
    let is_raining = (weatherData?.code || 0) >= 51 ? 1 : 0;
    try {
      const res = await fetch(`https://smart-logistics-17od.onrender.com/api/routes/${route.id}/predict`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ windspeed: Number(windspeed), is_raining: Number(is_raining) }),
      });
      if (res.ok) {
        const data = await res.json();
        setMlPredictions((p) => ({ ...p, [route.id]: data }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPredicting((p) => ({ ...p, [route.id]: false }));
    }
  };

  const runDriverMLPrediction = async (delivery: any) => {
    setIsDriverPredicting((p) => ({ ...p, [delivery.id]: true }));
    const matchedRoute = routes.find((r) => r.id === delivery.route_id || (r.source === delivery.source && r.destination === delivery.destination));
    const validRouteId = Number(delivery.route_id || matchedRoute?.id || routes[0]?.id || 1);
    try {
      const res = await fetch(`https://smart-logistics-17od.onrender.com/api/deliveries/predict_delay`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driver_name: String(delivery.driver_name || "Unassigned"), route_id: validRouteId, windspeed: Number(weatherData?.wind || 12.0), is_raining: Number((weatherData?.code || 0) >= 51 ? 1 : 0) }),
      });
      if (res.ok) {
        const data = await res.json();
        setDriverPredictions((p) => ({ ...p, [delivery.id]: data }));
      }
    } catch (e) {}
    setIsDriverPredicting((p) => ({ ...p, [delivery.id]: false }));
  };

  const executeRoutePlan = async () => {
    setPlannerError("");
    setIsPlanning(true);
    try {
      const res = await fetch("https://smart-logistics-17od.onrender.com/api/routes/plan", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: plannerForm.source, destination: plannerForm.destination }),
      });
      if (!res.ok) throw new Error("Route search failed");
      const data = await res.json();
      setPlannedRoutes(data);
    } catch (e: any) {
      setPlannerError(e.message || "Unable to compute route.");
    }
    setIsPlanning(false);
  };

  // KPI CALCULATIONS
  const vMoving = vehicles.filter((v) => v.status === "In Transit").length;
  const vIdle = vehicles.filter((v) => v.status === "Idle" || v.status === "Paused").length;
  const vMaint = vehicles.filter((v) => v.status !== "In Transit" && v.status !== "Idle" && v.status !== "Paused").length;
  const activeIncidents = incidents.filter((i) => i.status === "Active");
  const highRiskRoutesCount = routes.filter((r) => r.risk_assessment?.level === "High" || r.risk_assessment?.level === "Critical").length;

  const delOnTime = deliveries.filter((d) => d.status === "In Transit" || d.status === "Delivered").length;
  const delPending = deliveries.filter((d) => d.status === "Pending" || d.status === "Paused").length;
  const delAtRisk = deliveries.filter((d) => { const r = routes.find((rt) => rt.source === d.source && rt.destination === d.destination); return r?.risk_assessment?.level === "High" || r?.risk_assessment?.level === "Critical"; }).length;

  // SIDEBAR NAVIGATION ITEMS
  const navItems = [
    { id: "Overview", label: "Overview", icon: "overview" },
    { id: "Live Fleet", label: "Live Fleet", icon: "fleet" },
    { id: "Vehicles", label: "Vehicles & Drivers", icon: "user" },
    { id: "Routes", label: "Routes", icon: "routes" },
    { id: "Route Planner", label: "Global Planner", icon: "planner" },
    { id: "Deliveries / Manifests", label: "Deliveries / Manifests", icon: "box" },
    { id: "Incidents & Hazards", label: "Incidents & Hazards", icon: "alert" },
    { id: "Meteorology", label: "Meteorology & Radar", icon: "cloud" },
    { id: "Risk & AI Intelligence", label: "Risk & AI Intelligence", icon: "ai" },
  ];

  const [driverPortalState, setDriverPortalState] = useState({ name: "Rahul Sharma", auth: false });
  const [driverDeliveries, setDriverDeliveries] = useState<any[]>([]);

  const loadDriverDeliveries = async () => {
    try {
      const res = await fetch(`https://smart-logistics-17od.onrender.com/api/driver/my-deliveries?driver_name=${encodeURIComponent(driverPortalState.name)}`);
      if (res.ok) {
        const data = await res.json();
        setDriverDeliveries(data);
      }
    } catch {}
  };

  // ---------------------------------------------------------
  // DRIVER PORTAL COMMAND CENTER
  // ---------------------------------------------------------
  if (isDriverMode) {
    if (!driverPortalState.auth) {
      return (
        <div className="h-screen w-screen bg-[#03101E] flex items-center justify-center p-4">
          <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-40" style={{ backgroundImage: `url('/bg-theme.jpg')` }} />
          <form onSubmit={(e) => { e.preventDefault(); setDriverPortalState(p => ({ ...p, auth: true })); loadDriverDeliveries(); }} className="relative z-10 w-full max-w-sm p-6 rounded-2xl bg-[#06182A]/85 backdrop-blur-xl border border-[#19D8F2]/30 space-y-4 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#19D8F2]/20 border border-[#19D8F2] flex items-center justify-center text-[#19D8F2] mb-3">
                <Icon name="truck" size={24} />
              </div>
              <h2 className="text-lg font-bold text-white tracking-wider uppercase">Driver Command Center</h2>
              <p className="text-xs text-[#91A9C2] mt-1">Authenticate to access fleet assignments</p>
            </div>
            <div>
              <label className="text-[10px] text-[#91A9C2] uppercase block mb-1">Driver Verification Name</label>
              <input type="text" required value={driverPortalState.name} onChange={(e) => setDriverPortalState(p => ({ ...p, name: e.target.value }))} className="w-full bg-[#03101E] border border-[#19D8F2]/30 rounded-lg p-2.5 text-xs text-white" />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-lg bg-[#19D8F2] text-[#03101E] text-xs font-bold shadow-[0_0_15px_rgba(25,216,242,0.4)] mt-4">Authenticate Session</button>
            <button type="button" onClick={() => setIsDriverMode(false)} className="w-full py-2.5 text-xs text-[#91A9C2] hover:text-white transition-colors">Return to Admin Dashboard</button>
          </form>
        </div>
      );
    }
    
    let customDetourCoords: any[] = [];
    if (trackingData?.detour && selectedDelivery) {
        const hLng = Number(trackingData.detour.hazard_longitude || 73.8567);
        const hLat = Number(trackingData.detour.hazard_latitude || 18.5204);
        const severity = trackingData.detour.severity || "Critical"; 
        const rKm = severity === "Critical" ? 30 : severity === "High" ? 24 : severity === "Medium" ? 18 : 9;
        const oDeg = rKm / 111.0; 

        const liveTruck = vehicles.find(v => v.vehicle_number === selectedDelivery.vehicle_number);
        const sLng = Number(liveTruck?.longitude || selectedDelivery.source_longitude);
        const sLat = Number(liveTruck?.latitude || selectedDelivery.source_latitude);
        const dLng = Number(selectedDelivery.destination_longitude);
        const dLat = Number(selectedDelivery.destination_latitude);

        // Vector from Truck to Destination
        const dx = dLng - sLng;
        const dy = dLat - sLat;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            // Perpendicular Vector (90-degree push)
            const pX = -dy / dist;
            const pY = dx / dist; 

            // ONE single waypoint, pushed perfectly sideways from the hazard (V-shape)
            const wpLng = hLng + (pX * oDeg);
            const wpLat = hLat + (pY * oDeg);

            customDetourCoords = [
                { lat: sLat, lng: sLng },
                { lat: wpLat, lng: wpLng },
                { lat: dLat, lng: dLng }
            ];
        }
    }

    const currSeverity = trackingData?.detour?.severity || "Critical";
    const currRadius = currSeverity === "Critical" ? 30 : currSeverity === "High" ? 24 : currSeverity === "Medium" ? 18 : 9;

    const activeDetourRoute = (trackingData?.detour && !handledHazards.includes(trackingData.detour.hazard_id)) ? [{
      id: "detour-1", type: "Alternative", algorithm: `AI Vector Barrier (${currRadius}km Clearance)`,
      path: ["Current Location", `Bypass Entry`, `Bypass Exit`, selectedDelivery?.destination || "Destination"],
      nodes_coords: customDetourCoords.length > 0 ? customDetourCoords : trackingData.detour.detour_waypoints.map((c: any) => ({ lat: Number(c[0]), lng: Number(c[1]) })),
      cost_hrs: trackingData.detour.cost_hrs, distance_km: trackingData.detour.distance_km
    }] : [];

    return (
      <div className="h-screen w-screen bg-[#030914] text-white flex flex-col overflow-hidden font-sans">
        <header className="h-14 px-6 bg-[#06182A] border-b border-[#19D8F2]/20 flex items-center justify-between shrink-0 z-20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border-r border-[#19D8F2]/20 pr-4">
              <Icon name="truck" size={20} className="text-[#19D8F2]" />
              <span className="font-bold text-sm text-[#EAF5FF] uppercase">Driver Command Center</span>
            </div>
            <span className="text-[11px] text-[#91A9C2]">Driver: <b className="text-white">{driverPortalState.name}</b></span>
            {selectedDelivery && <span className="text-[11px] text-[#91A9C2]"> • Dispatch: <b className="text-[#19D8F2]">D-{100 + selectedDelivery.id}</b></span>}
          </div>
          <div className="flex items-center gap-5 text-[10px] font-bold tracking-wider">
            <span className="flex items-center gap-1.5 text-[#16D6B0]"><span className="w-2 h-2 bg-[#16D6B0] rounded-full animate-pulse"></span> GPS LIVE</span>
            <span className="text-[#91A9C2]">DB SYNCED</span>
            <span className="text-[#19D8F2]">WEATHER: ACTIVE</span>
            <button onClick={() => { setDriverPortalState(p => ({ ...p, auth: false })); setIsDriverMode(false); }} className="ml-4 px-3 py-1.5 rounded border border-slate-700 text-[#91A9C2] hover:text-white">Sign Out</button>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden relative">
          
          <div className="col-span-12 lg:col-span-3 bg-[#051425] border-r border-[#19D8F2]/20 p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar z-10">
            <div>
              <h3 className="text-[10px] font-bold text-[#19D8F2] uppercase tracking-wider mb-2">My Active Manifests</h3>
              {driverDeliveries.length === 0 && <p className="text-xs text-[#91A9C2]">No active shipments assigned.</p>}
              <div className="space-y-2">
                {driverDeliveries.map((del) => (
                  <div key={del.id} onClick={() => { setSelectedDelivery(del); if(del.status === "In Transit" || del.status === "Paused") setTrackingDeliveryId(del.id); }} className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedDelivery?.id === del.id ? "bg-[#19D8F2]/10 border-[#19D8F2]" : "bg-[#030914] border-[#19D8F2]/20 hover:border-[#19D8F2]/40"}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-white">D-{100 + del.id} • {del.goods}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${del.status === "In Transit" ? "bg-[#16D6B0]/20 text-[#16D6B0]" : del.status === "Paused" ? "bg-[#FFB547]/20 text-[#FFB547]" : "bg-slate-700/50 text-slate-300"}`}>{del.status}</span>
                    </div>
                    <div className="text-[10px] text-[#91A9C2]">{del.source} → {del.destination}</div>
                    
                    {selectedDelivery?.id === del.id && del.status === "Pending" && (
                      <button 
                        onClick={async (e) => { 
                          e.stopPropagation(); 
                          await fetch(`https://smart-logistics-17od.onrender.com/api/driver/start-trip/${del.id}`, { method: "POST" }); 
                          setTrackingDeliveryId(del.id); // <--- Instantly opens the driving HUD!
                          loadDriverDeliveries(); 
                          fetchData(); 
                        }} 
                        className="w-full mt-2 py-2 rounded bg-[#16D6B0] text-[#03101E] font-bold text-[10px]"
                      >
                        START TRIP
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {trackingData && (
              <>
                <div className="border-t border-[#19D8F2]/20 pt-4">
                  <h3 className="text-[10px] font-bold text-[#FFB547] uppercase tracking-wider mb-2">Road Conditions</h3>
                  {trackingData.corridor_hazards?.length > 0 ? (
                    <div className="space-y-2">
                      {trackingData.corridor_hazards.map((h: any) => (
                        <div key={h.id} className="p-2 rounded bg-[#FF4568]/10 border border-[#FF4568]/30">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon name="alert" size={14} className="text-[#FF4568]" />
                            <span className="font-bold text-xs text-white">{h.incident_type}</span>
                          </div>
                          <span className="text-[10px] text-[#91A9C2] block">{h.distance_from_vehicle_km} km ahead • {h.severity} severity</span>
                          <span className="text-[9px] text-[#FF4568] font-bold mt-1 block uppercase">Route Affected</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-[#16D6B0] flex items-center gap-2 bg-[#16D6B0]/10 p-2 rounded border border-[#16D6B0]/20"><Icon name="check" size={14}/> Route Clear. No hazards ahead.</div>
                  )}
                </div>

                <div className="border-t border-[#19D8F2]/20 pt-4 flex-1">
                  <h3 className="text-[10px] font-bold text-[#91A9C2] uppercase tracking-wider mb-3">Trip Activity Log</h3>
                  <div className="space-y-3">
                    {trackingData.timeline_events?.map((ev: any, idx: number) => (
                      <div key={idx} className="flex gap-2.5 items-start text-xs border-l-2 border-[#19D8F2]/40 pl-3 relative">
                        <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#19D8F2]"></div>
                        <div className="min-w-0">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <span className="font-bold text-white text-[10px]">{ev.event_type}</span>
                            <span className="text-[9px] text-slate-400 font-mono">{ev.time_str || "12:00:00"}</span>
                          </div>
                          <span className="text-[10px] text-[#91A9C2] leading-tight block">{ev.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="col-span-12 lg:col-span-9 relative bg-black flex flex-col">
            {selectedDelivery ? (
              <>
                {/* HUD PROGRESS BAR (TOP) */}
                {trackingData && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-[95%] max-w-5xl flex gap-3">
                    
                    <div className="bg-[#06182A]/95 backdrop-blur-xl border-l-4 border-[#19D8F2] rounded-xl p-3 flex items-center gap-4 shadow-2xl shrink-0 w-[240px]">
                      <div className="w-10 h-10 bg-[#19D8F2]/20 rounded flex items-center justify-center text-[#19D8F2]">
                        <Icon name="arrow-right" size={24} />
                      </div>
                      <div>
                        <div className="text-[10px] text-[#91A9C2] uppercase font-bold tracking-wider mb-0.5">Next Maneuver</div>
                        <div className="text-sm font-bold text-white leading-tight">Continue on OSRM Route</div>
                      </div>
                    </div>

                    <div className="bg-[#06182A]/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-3 flex-1 flex flex-col justify-between shadow-2xl">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-bold text-[#19D8F2] text-sm uppercase tracking-wide">{selectedDelivery.source} <span className="text-white mx-1">→</span> {selectedDelivery.destination}</div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${isTripPaused ? "bg-[#FFB547]/20 text-[#FFB547]" : "bg-[#16D6B0]/20 text-[#16D6B0]"}`}>{isTripPaused ? "TRIP PAUSED" : "ON TRACK"}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-2">
                        <div>
                          <div className="text-2xl font-bold text-white leading-none">{trackingData.trip_metrics.remaining_distance_km} <span className="text-sm font-normal text-[#91A9C2]">km</span></div>
                          <div className="text-[9px] text-[#91A9C2] uppercase mt-1">Remaining</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white leading-none">{trackingData.trip_metrics.estimated_arrival_hours} <span className="text-sm font-normal text-[#91A9C2]">hrs</span></div>
                          <div className="text-[9px] text-[#91A9C2] uppercase mt-1">ETA Duration</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white leading-none">{trackingData.trip_metrics.current_speed_kmh}</div>
                          <div className="text-[9px] text-[#91A9C2] uppercase mt-1">Speed • km/h</div>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-[#03101E] rounded-full overflow-hidden">
                        <div className="h-full bg-[#16D6B0] transition-all duration-1000" style={{ width: `${trackingData.trip_metrics.progress_percent}%` }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* THE MAP (Now properly displays incidents globally) */}
                <div className="flex-1 relative z-0">
                  <MapComponent
                    vehicles={vehicles.filter(v => v.vehicle_number === selectedDelivery.vehicle_number)}
                    routes={[{ id: 999, source: selectedDelivery.source, destination: selectedDelivery.destination, distance_km: selectedDelivery.distance_km, eta_hours: selectedDelivery.eta_hours, source_latitude: selectedDelivery.source_latitude, source_longitude: selectedDelivery.source_longitude, destination_latitude: selectedDelivery.destination_latitude, destination_longitude: selectedDelivery.destination_longitude, status: "Active" }]}
                    incidents={incidents}
                    plannedRoutes={activeDetourRoute}
                    showHudControls={false}
                  />
                </div>

                {/* DYNAMIC REROUTE PROMPT */}
                {trackingData?.detour && !acceptingReroute && !handledHazards.includes(trackingData.detour.hazard_id) && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2000] w-[90%] max-w-lg bg-[#06182A]/95 backdrop-blur-xl border border-[#FFB547] text-white rounded-2xl p-6 shadow-[0_30px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(255,181,71,0.2)] flex flex-col gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#FFB547]/20 flex items-center justify-center text-[#FFB547]"><Icon name="alert" size={24} /></div>
                        <h3 className="text-xl font-extrabold uppercase tracking-wide text-[#FFB547]">Hazard Detected Ahead</h3>
                      </div>
                      <p className="text-sm font-semibold text-slate-200 mb-4">{trackingData.detour.reason}</p>
                      
                      <div className="bg-[#03101E] rounded-lg p-3 border border-slate-700 text-xs text-[#91A9C2]">
                        <div className="mb-2">System has generated a severity-scaled mathematical bypass.</div>
                        <div className="text-white font-mono">{trackingData.detour.recommended_path.join(" → ")}</div>
                        <div className="mt-2 text-[#FFB547]">+ {(trackingData.detour.cost_hrs - trackingData.trip_metrics.estimated_arrival_hours).toFixed(1)} hrs additional time</div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-2">
                      <button onClick={() => handleDeclineReroute(trackingData.detour.hazard_id)} className="flex-1 py-3 rounded-xl bg-transparent border border-slate-500 text-slate-300 text-xs font-bold hover:text-white hover:border-slate-400 transition-all">
                        Stay on Route
                      </button>
                      <button onClick={() => handleAcceptReroute(trackingData.detour)} className="flex-1 py-3 rounded-xl bg-[#FFB547] text-[#03101E] font-bold shadow-xl hover:bg-[#FF8C00] transition-all">
                        Accept Reroute ↗
                      </button>
                    </div>
                  </div>
                )}

                {/* TRIP ACTIONS HUD */}
                {trackingData && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[95%] max-w-5xl flex gap-3">
                    <button onClick={() => handlePauseResumeTrip(isTripPaused ? "resume" : "pause")} className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-xs shadow-lg transition-all ${isTripPaused ? "bg-[#16D6B0]/20 border border-[#16D6B0] text-[#16D6B0] animate-pulse" : "bg-[#06182A]/90 backdrop-blur border border-slate-600 text-[#EAF5FF] hover:border-[#19D8F2]"}`}>
                      <Icon name={isTripPaused ? "check" : "pause"} size={16} /> {isTripPaused ? "RESUME TRIP" : "PAUSE TRIP"}
                    </button>
                    <button onClick={() => setShowNewIncidentModal(true)} className="flex-1 py-4 rounded-xl bg-[#06182A]/90 backdrop-blur border border-slate-600 text-[#EAF5FF] flex items-center justify-center gap-2 font-bold text-xs shadow-lg hover:border-[#19D8F2] transition-all">
                      <Icon name="alert" size={16} /> REPORT HAZARD
                    </button>
                    <button onClick={() => alert("Emergency SOS broadcast sent to Admin & Highway Patrol.")} className="flex-1 py-4 rounded-xl bg-[#FF4568]/90 backdrop-blur text-white flex items-center justify-center gap-2 font-bold text-xs shadow-[0_0_15px_rgba(255,69,104,0.4)] hover:bg-red-600 transition-all">
                      <Icon name="sos" size={16} /> EMERGENCY / SOS
                    </button>
                    
                    {!isMarkedArrived ? (
                      <button onClick={() => { setIsMarkedArrived(true); handlePauseResumeTrip("pause"); }} className="flex-1 py-4 rounded-xl bg-[#19D8F2]/90 backdrop-blur text-[#03101E] flex items-center justify-center gap-2 font-bold text-xs shadow-[0_0_15px_rgba(25,216,242,0.4)] hover:bg-[#16D6B0] transition-all">
                        MARK ARRIVED
                      </button>
                    ) : (
                      <button onClick={async () => { await completeDelivery(trackingDeliveryId!); setIsMarkedArrived(false); loadDriverDeliveries(); fetchData(); }} className="flex-1 py-4 rounded-xl bg-[#16D6B0] text-[#03101E] flex items-center justify-center gap-2 font-bold text-xs shadow-[0_0_15px_rgba(22,214,176,0.5)] hover:opacity-90 transition-all">
                        CONFIRM DELIVERY COMPLETE ✓
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#030914] text-[#91A9C2]">
                <Icon name="truck" size={48} className="mb-4 opacity-50" />
                <p className="text-sm font-bold uppercase tracking-widest">Awaiting Active Dispatch</p>
                <p className="text-xs mt-2">Select a pending or in-transit manifest from the sidebar to begin navigation.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen h-screen w-screen overflow-hidden text-[#EAF5FF] font-sans select-none bg-black">
      <div className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none" style={{ backgroundImage: `url('/bg-theme.jpg')` }} />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, rgba(3, 9, 20, 0.12) 0%, rgba(3, 9, 20, 0.48) 100%)" }} />

      <div className="relative z-10 flex h-full w-full p-2.5 lg:p-4 gap-4 overflow-hidden">
        <aside className={`${mobileNavOpen ? "fixed inset-y-2 left-2 z-50 flex bg-[#030914]/95 backdrop-blur-xl" : "hidden lg:flex bg-transparent"} w-[230px] shrink-0 flex-col rounded-2xl overflow-hidden`}>
          <div className="px-4 py-5 flex items-center gap-3.5 bg-transparent">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#19D8F2]/20 to-[#258BFF]/15 border border-[#19D8F2]/45 flex items-center justify-center shadow-[0_0_15px_rgba(25,216,242,0.35)] shrink-0">
              <Icon name="fleet" size={22} className="text-[#19D8F2]" />
            </div>
            <div>
              <div className="text-[12.5px] font-extrabold tracking-[0.16em] text-[#EAF5FF] leading-tight">SMART</div>
              <div className="text-[11.5px] font-bold tracking-[0.16em] text-[#19D8F2] leading-tight mt-0.5">LOGISTICS</div>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1 custom-scrollbar">
            {navItems.map((item) => {
              const isActive = activeTab === item.id || (activeTab === "Live Tracking" && item.id === "Deliveries / Manifests");
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileNavOpen(false); }}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[12.5px] font-medium transition-all ${
                    isActive ? "bg-gradient-to-r from-[#24D8F3]/30 via-[#24D8F3]/10 to-transparent text-[#EAF5FF] border border-[#24D8F3]/50 shadow-[0_0_14px_rgba(36,216,243,0.2)]" : "text-[#91A9C2] hover:text-[#EAF5FF] hover:bg-[#24D8F3]/10 border border-transparent"
                  }`}
                >
                  <Icon name={item.icon} size={19} className={isActive ? "text-[#19D8F2] shrink-0" : "text-[#91A9C2] shrink-0"} />
                  <span className="truncate">{item.label}</span>
                  {item.id === "Incidents & Hazards" && activeIncidents.length > 0 && (
                    <span className="ml-auto bg-[#FF4568]/25 border border-[#FF4568] text-[#FF4568] text-[10px] font-bold px-2 py-0.5 rounded-full">{activeIncidents.length}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent border-none">
          <header className="h-[60px] shrink-0 px-2 bg-transparent flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="lg:hidden px-2.5 py-1.5 rounded-lg border border-[#2D9BCC]/40 text-[#19D8F2]">☰</button>
              <div className="flex items-center gap-2.5 w-full bg-[#051425]/40 backdrop-blur-md border border-[#2D9BCC]/25 rounded-full px-4 py-2 focus-within:border-[#19D8F2] transition-colors">
                <Icon name="search" size={16} className="text-[#9BB2C7]" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search vehicles, routes, locations..." className="bg-transparent border-none outline-none text-xs text-[#EAF5FF] placeholder-[#9BB2C7]/70 w-full" />
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#051425]/40 backdrop-blur-md border border-[#16D6B0]/30">
                <span className="w-2 h-2 rounded-full bg-[#16D6B0] shadow-[0_0_8px_#16D6B0] animate-pulse" />
                <span className="text-[#16D6B0] text-[11px] font-semibold">Live Data</span>
              </div>
              <button onClick={() => setIsDriverMode(true)} className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#051425]/40 backdrop-blur-md border border-[#19D8F2]/30 text-[#19D8F2] hover:bg-[#19D8F2]/10 transition-colors">
                <Icon name="user" size={15} /> <span className="text-[11px] font-bold">Driver Terminal</span>
              </button>
              <div className="hidden sm:flex items-center gap-2 text-[#9BB2C7] text-[11px] bg-[#051425]/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#2D9BCC]/20 font-mono">
                <span>{clock.date}</span> <span className="text-[#19D8F2] font-semibold">{clock.time}</span>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto pt-2 pb-6 px-1 custom-scrollbar">

            {/* TAB 1: OVERVIEW */}
            {activeTab === "Overview" && (
              <div className="flex flex-col gap-4 h-full">
                <div className="px-1">
                  <h1 className="text-2xl font-bold text-[#EAF5FF] tracking-wide drop-shadow-md">Operations Dashboard</h1>
                  <p className="text-[11px] text-[#9BB2C7]">Real-time overview of fleet, deliveries and operational status.</p>
                </div>

                <div className="grid grid-cols-12 gap-3.5">
                  <div className="col-span-12 xl:col-span-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                    {[
                      { title: "Total Vehicles", val: vehicles.length, sub: "In Fleet", accent: "text-[#19D8F2]", iconBg: "bg-[#19D8F2]/15 border-[#19D8F2]/40 text-[#19D8F2]", icon: "target" },
                      { title: "In Transit", val: vMoving, sub: "Active Departed", accent: "text-[#19D8F2]", iconBg: "bg-[#19D8F2]/15 border-[#19D8F2]/40 text-[#19D8F2]", icon: "truck" },
                      { title: "Deliveries", val: deliveries.length, sub: "On Route", accent: "text-[#16D6B0]", iconBg: "bg-[#16D6B0]/15 border-[#16D6B0]/40 text-[#16D6B0]", icon: "box" },
                      { title: "Incidents", val: activeIncidents.length, sub: "Requiring attention", accent: "text-[#FF4568]", iconBg: "bg-[#FF4568]/15 border-[#FF4568]/40 text-[#FF4568]", icon: "alert" },
                      { title: "High Risk Routes", val: highRiskRoutesCount, sub: "Elevated risk", accent: "text-[#A66BFF]", iconBg: "bg-[#A66BFF]/15 border-[#A66BFF]/40 text-[#A66BFF]", icon: "shield" },
                    ].map((kpi, idx) => (
                      <GlassPanel key={idx} className="p-3.5 flex flex-col justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${kpi.iconBg}`}><Icon name={kpi.icon} size={18} /></div>
                          <span className="text-[11.5px] text-[#EAF5FF] font-semibold leading-snug">{kpi.title}</span>
                        </div>
                        <div className="mt-3 pl-0.5">
                          <div className="text-3xl font-bold text-[#EAF5FF] leading-none drop-shadow-sm">{kpi.val}</div>
                          <div className={`text-[10.5px] font-medium mt-1.5 ${kpi.accent}`}>{kpi.sub}</div>
                        </div>
                      </GlassPanel>
                    ))}
                  </div>

                  <GlassPanel className="col-span-12 xl:col-span-4 p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-[#EAF5FF] uppercase tracking-wider">Weather Summary</h3>
                      <span className="text-[10px] text-[#19D8F2] font-mono uppercase">{weatherData?.city || "Delhi"}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 items-center my-1">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 shrink-0 relative"><WeatherIllustration /></div>
                        <div>
                          <div className="text-2xl font-bold text-[#EAF5FF]">{weatherData ? `${weatherData.temp}°C` : "22°C"}</div>
                          <div className="text-[11px] text-[#19D8F2]">{weatherData ? getWeatherLabel(weatherData.code) : "Clear Sky"}</div>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-[11px] border-l border-[#2D9BCC]/20 pl-3">
                        <div className="flex items-center justify-between text-[#9BB2C7]"><span className="flex items-center gap-1.5"><Icon name="wind" size={13} className="text-[#19D8F2]" /> Wind</span><span className="text-[#EAF5FF] font-semibold">{weatherData ? `${weatherData.wind} km/h` : "9 km/h"}</span></div>
                        <div className="flex items-center justify-between text-[#9BB2C7]"><span className="flex items-center gap-1.5"><Icon name="droplet" size={13} className="text-[#19D8F2]" /> Humidity</span><span className="text-[#EAF5FF] font-semibold">{weatherData ? `${weatherData.humidity}%` : "78%"}</span></div>
                        <div className="flex items-center justify-between text-[#9BB2C7]"><span>Precip</span><span className="text-[#EAF5FF] font-semibold">{weatherData ? `${weatherData.rain} mm` : "0 mm"}</span></div>
                      </div>
                    </div>
                  </GlassPanel>
                </div>

                <div className="grid grid-cols-12 gap-4 min-h-[340px] flex-1">
                  <GlassPanel className="col-span-12 lg:col-span-8 p-2.5 flex flex-col relative overflow-hidden">
                    <div className="flex justify-between items-center mb-2 px-1.5">
                      <h3 className="text-xs font-bold text-[#EAF5FF] uppercase tracking-wider">Fleet & Route Overview</h3>
                      <div className="flex items-center gap-4 text-[11px] text-[#9BB2C7]">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#19D8F2] shadow-[0_0_8px_#19D8F2]" /> Vehicles ({vehicles.length})</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#FF4568] shadow-[0_0_8px_#FF4568]" /> Incidents ({activeIncidents.length})</span>
                      </div>
                    </div>
                    <div className="flex-1 rounded-xl overflow-hidden relative min-h-[270px]">
                      <MapComponent
                        vehicles={vehicles} routes={routes} deliveries={deliveries} incidents={incidents} cityWeatherList={cityWeatherList} layers={mapLayers}
                        onToggleLayer={handleToggleLayer} onSelectVehicle={(v: any) => setSelectedVehicle(v)} onSelectRoute={(r: any) => setSelectedRoute(r)} onSelectIncident={(inc: any) => setSelectedIncident(inc)}
                      />
                    </div>
                  </GlassPanel>

                  <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
                    <GlassPanel className="flex-1 p-4 flex flex-col justify-between">
                      <h3 className="text-xs font-bold text-[#EAF5FF] uppercase tracking-wider">Fleet Status</h3>
                      <div className="flex items-center justify-around my-auto py-1">
                        <div className="relative w-28 h-28">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path className="text-[#081D30]/60" strokeWidth="3.2" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="text-[#19D8F2] drop-shadow-[0_0_8px_rgba(25,216,242,0.9)]" strokeDasharray={`${vehicles.length ? (vMoving / vehicles.length) * 100 : 0}, 100`} strokeWidth="3.2" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-[#EAF5FF]">{vehicles.length}</span><span className="text-[9px] text-[#9BB2C7] uppercase">Total Units</span>
                          </div>
                        </div>
                        <div className="space-y-2 text-xs w-36">
                          <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-[#EAF5FF]"><span className="w-2 h-2 rounded-full bg-[#16D6B0]" /> Active</span><span className="font-bold text-[#EAF5FF]">{vMoving}</span></div>
                          <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-[#9BB2C7]"><span className="w-2 h-2 rounded-full bg-[#19D8F2]" /> Idle</span><span className="font-bold text-[#EAF5FF]">{vIdle}</span></div>
                          <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-[#9BB2C7]"><span className="w-2 h-2 rounded-full bg-[#FFB547]" /> Maintenance</span><span className="font-bold text-[#EAF5FF]">{vMaint}</span></div>
                        </div>
                      </div>
                    </GlassPanel>

                    <GlassPanel className="flex-1 p-4 flex flex-col justify-between">
                      <h3 className="text-xs font-bold text-[#EAF5FF] uppercase tracking-wider">Delivery Status</h3>
                      <div className="space-y-3 my-auto">
                        {[
                          { label: "On Time", count: delOnTime, color: "bg-[#16D6B0]", pct: deliveries.length ? (delOnTime / deliveries.length) * 100 : 70 },
                          { label: "Delayed / Queued", count: delPending, color: "bg-[#FFB547]", pct: deliveries.length ? (delPending / deliveries.length) * 100 : 25 },
                          { label: "Corridor Hazard Risk", count: highRiskRoutesCount, color: "bg-[#FF4568]", pct: deliveries.length ? (delAtRisk / deliveries.length) * 100 : 15 },
                        ].map((bar, i) => (
                          <div key={i}>
                            <div className="flex justify-between items-center text-xs mb-1.5">
                              <span className="text-[#EAF5FF] font-medium flex items-center gap-2">
                                <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[8px] bg-${bar.color}/20 text-${bar.color} border-${bar.color}/40`}>▲</span> {bar.label}
                              </span>
                              <span className="font-mono font-bold text-[#EAF5FF]">{bar.count}</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#081D30]/60 rounded-full overflow-hidden"><div className={`h-full ${bar.color} rounded-full`} style={{ width: `${Math.max(8, bar.pct)}%` }} /></div>
                          </div>
                        ))}
                      </div>
                    </GlassPanel>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 min-h-[195px]">
                  <GlassPanel className="col-span-12 md:col-span-3 p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xs font-bold text-[#EAF5FF] uppercase tracking-wider">Recent Incidents</h3>
                      <button onClick={() => setActiveTab("Incidents & Hazards")} className="text-[11px] text-[#19D8F2] hover:underline">View All →</button>
                    </div>
                    <div className="space-y-2.5 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                      {incidents.slice(0, 3).map((inc: any) => (
                        <div key={inc.id} onClick={() => { setSelectedIncident(inc); setActiveTab("Incidents & Hazards"); }} className="flex items-center justify-between p-2.5 rounded-xl bg-[#051425]/40 border border-[#2D9BCC]/15 cursor-pointer hover:border-[#19D8F2]/45">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 ${inc.severity === "High" || inc.severity === "Critical" ? "bg-[#FF4568]/15 text-[#FF4568] border-[#FF4568]/45" : "bg-[#FFB547]/15 text-[#FFB547] border-[#FFB547]/45"}`}><Icon name="alert" size={14} /></div>
                            <div className="truncate">
                              <div className="text-xs font-bold text-[#EAF5FF] truncate">{inc.incident_type}</div>
                              <div className="text-[10.5px] text-[#9BB2C7] truncate">{inc.location_name}</div>
                            </div>
                          </div>
                          <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${inc.severity === "High" || inc.severity === "Critical" ? "bg-[#FF4568]/20 text-[#FF4568] border border-[#FF4568]/40" : "bg-[#FFB547]/20 text-[#FFB547] border border-[#FFB547]/40"}`}>{inc.severity}</span>
                        </div>
                      ))}
                    </div>
                  </GlassPanel>

                  <GlassPanel className="col-span-12 md:col-span-3 p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-[#EAF5FF] uppercase tracking-wider">Route Risk Overview</h3>
                      <div className="flex gap-2 text-[10px] text-[#91A9C2]"><span className="text-[#16D6B0]">● Low</span><span className="text-[#FFB547]">● Med</span><span className="text-[#FF4568]">● High</span></div>
                    </div>
                    <div className="flex items-end justify-between h-28 pt-4 px-1 border-b border-[#2D9BCC]/15">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => {
                        // Dynamically calculate percentages based on your ACTUAL live routes database!
                        const totalR = routes.length || 1;
                        const liveLow = (routes.filter(r => !r.risk_assessment || r.risk_assessment.level === "Low").length / totalR) * 100;
                        const liveMed = (routes.filter(r => r.risk_assessment?.level === "Medium").length / totalR) * 100;
                        const liveHigh = (routes.filter(r => r.risk_assessment?.level === "High" || r.risk_assessment?.level === "Critical").length / totalR) * 100;
                        
                        return (
                          <div key={day} className="flex flex-col items-center gap-1.5 h-full justify-end">
                            <div className="flex items-end gap-1 h-full">
                              <div className="w-1.5 bg-[#19D8F2] rounded-t transition-all" style={{ height: `${Math.max(5, liveLow - ((6-idx)*4))}%` }} />
                              <div className="w-1.5 bg-[#FFB547] rounded-t transition-all" style={{ height: `${Math.max(5, liveMed + ((6-idx)*3))}%` }} />
                              <div className="w-1.5 bg-[#FF4568] rounded-t transition-all" style={{ height: `${Math.max(5, liveHigh + ((6-idx)*5))}%` }} />
                            </div>
                            <span className="text-[9px] text-[#91A9C2]">{day}</span>
                          </div>
                        );
                      })}
                    </div>
                  </GlassPanel>

                  <GlassPanel className="col-span-12 md:col-span-3 p-4 flex flex-col">
                    <h3 className="text-xs font-bold text-[#EAF5FF] uppercase tracking-wider mb-3">Weather Activity</h3>
                    <div className="space-y-2 flex-1 overflow-y-auto">
                      {cityWeatherList.slice(0, 3).map((cw, i) => (
                        <div key={cw.city} onClick={() => setActiveTab("Meteorology")} className="flex items-center gap-2.5 p-2 rounded-xl bg-[#051425]/40 border border-[#2D9BCC]/15 cursor-pointer hover:border-[#19D8F2]/45">
                          <span className="text-lg">{i === 1 ? "⚠️" : "🌧️"}</span>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-white block">Hub {cw.city}</span>
                            <span className="text-[10px] text-[#91A9C2] block">{cw.condition}</span>
                          </div>
                          <span className="text-[9px] text-[#91A9C2]">{cw.temp}°C</span>
                        </div>
                      ))}
                    </div>
                  </GlassPanel>

                  <GlassPanel className="col-span-12 md:col-span-3 p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xs font-bold text-[#EAF5FF] uppercase tracking-wider">Recent Activity</h3>
                      <button onClick={() => setActiveTab("Deliveries / Manifests")} className="text-[11px] text-[#19D8F2] hover:underline">View All →</button>
                    </div>
                    <div className="space-y-2.5 flex-1 overflow-y-auto">
                      {deliveries.slice(0, 3).map((act, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <Icon name="check" size={15} className="text-[#16D6B0]" />
                          <div>
                            <span className="text-xs font-bold text-white block">Delivery D-{100 + act.id} updated</span>
                            <span className="text-[10px] text-[#91A9C2] block">{act.status} • Vehicle {act.vehicle_number}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassPanel>
                </div>
              </div>
            )}

            {/* TAB 2: LIVE FLEET */}
            {activeTab === "Live Fleet" && (
              <div className="flex flex-col gap-4 h-full">
                <h1 className="text-2xl font-bold text-white">Live Fleet Command</h1>
                <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
                  <div className="col-span-12 lg:col-span-9 flex flex-col gap-4">
                    <GlassPanel className="flex-1 min-h-[360px] p-2 relative overflow-hidden">
                      <MapComponent vehicles={vehicles} routes={routes} deliveries={deliveries} incidents={incidents} />
                    </GlassPanel>
                    <GlassPanel className="p-4">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Live Fleet Telemetry</h3>
                      <div className="overflow-x-auto max-h-[160px] custom-scrollbar">
                        <table className="w-full text-left text-xs">
                          <thead className="text-[10px] uppercase text-[#91A9C2] border-b border-[#2D9BCC]/20">
                            <tr>
                              <th className="py-2 px-3">Unit</th>
                              <th className="py-2 px-3">Registration</th>
                              <th className="py-2 px-3">Class</th>
                              <th className="py-2 px-3">Status</th>
                              <th className="py-2 px-3">Coordinates (Live GPS)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#2D9BCC]/10">
                            {vehicles.map((v) => (
                              <tr key={v.id} onClick={() => setSelectedVehicle(v)} className="cursor-pointer hover:bg-[#051425]/50">
                                <td className="py-2 px-3 font-mono text-[#19D8F2] font-bold">TR-0{v.id}</td>
                                <td className="py-2 px-3 font-semibold text-white">{v.vehicle_number}</td>
                                <td className="py-2 px-3 text-[#91A9C2]">{v.vehicle_type}</td>
                                <td className="py-2 px-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${v.status === "In Transit" ? "bg-[#16D6B0]/20 text-[#16D6B0]" : "bg-[#FFB547]/20 text-[#FFB547]"}`}>{v.status}</span></td>
                                <td className="py-2 px-3 font-mono text-[11px] text-[#19D8F2]">{v.latitude?.toFixed(5)}, {v.longitude?.toFixed(5)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </GlassPanel>
                  </div>
                  <div className="col-span-12 lg:col-span-3">
                    <GlassPanel raised className="p-4 h-full">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Unit Inspector</h3>
                      {selectedVehicle ? (
                        <div className="space-y-2 text-xs text-[#91A9C2]">
                          <span className="text-base font-bold text-white block">{selectedVehicle.vehicle_number}</span>
                          <div>Class: <b className="text-white">{selectedVehicle.vehicle_type}</b></div>
                          <div>Status: <b className="text-[#16D6B0]">{selectedVehicle.status}</b></div>
                          <div>Latitude: <b className="text-white font-mono">{selectedVehicle.latitude?.toFixed(5)}</b></div>
                          <div>Longitude: <b className="text-white font-mono">{selectedVehicle.longitude?.toFixed(5)}</b></div>
                          <div>Telemetry: <b className="text-[#19D8F2] font-mono">1.5s Fast Loop</b></div>
                        </div>
                      ) : (
                        <p className="text-xs text-[#91A9C2]">Select a vehicle on the map to audit.</p>
                      )}
                    </GlassPanel>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: VEHICLES & DRIVERS */}
            {activeTab === "Vehicles" && (
              <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-white">Fleet & Driver Onboarding</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GlassPanel className="p-5">
                    <h3 className="text-xs font-bold text-[#19D8F2] uppercase mb-3">+ Register Vehicle</h3>
                    <form onSubmit={handleVehicleSubmit} className="space-y-3">
                      <input type="text" required placeholder="Registration (e.g. KA-01-AB-1234)" value={vehicleForm.vehicle_number} onChange={(e) => setVehicleForm({ ...vehicleForm, vehicle_number: e.target.value })} className="w-full bg-[#051425] border border-[#2D9BCC]/30 rounded-lg p-2.5 text-xs text-white" />
                      <select value={vehicleForm.vehicle_type} onChange={(e) => setVehicleForm({ ...vehicleForm, vehicle_type: e.target.value })} className="w-full bg-[#051425] border border-[#2D9BCC]/30 rounded-lg p-2.5 text-xs text-white">
                        <option>Truck</option><option>Van</option><option>Heavy Truck</option>
                      </select>
                      <button type="submit" className="w-full py-2.5 rounded-lg bg-[#19D8F2]/20 border border-[#19D8F2] text-[#19D8F2] text-xs font-bold">+ Onboard Vehicle</button>
                    </form>
                  </GlassPanel>

                  <GlassPanel className="p-5">
                    <h3 className="text-xs font-bold text-[#16D6B0] uppercase mb-3">+ Onboard Driver</h3>
                    <form onSubmit={handleDriverSubmit} className="space-y-3">
                      <input type="text" required placeholder="Driver Full Name" value={driverForm.name} onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })} className="w-full bg-[#051425] border border-[#2D9BCC]/30 rounded-lg p-2.5 text-xs text-white" />
                      <input type="number" step="0.5" required placeholder="Efficiency Score (0 - 100)" value={driverForm.efficiency_score} onChange={(e) => setDriverForm({ ...driverForm, efficiency_score: Number(e.target.value) })} className="w-full bg-[#051425] border border-[#2D9BCC]/30 rounded-lg p-2.5 text-xs text-white" />
                      <button type="submit" className="w-full py-2.5 rounded-lg bg-[#16D6B0]/20 border border-[#16D6B0] text-[#16D6B0] text-xs font-bold">+ Onboard Driver</button>
                    </form>
                  </GlassPanel>
                </div>

                <GlassPanel className="p-5">
                  <h3 className="text-xs font-bold text-[#EAF5FF] uppercase mb-3">Registered Fleet Drivers ({drivers.length})</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {drivers.map((dr) => (
                      <div key={dr.id} className="p-3 rounded-xl bg-[#051425]/40 border border-[#2D9BCC]/20 flex justify-between items-center">
                        <span className="text-xs font-bold text-white">{dr.name}</span>
                        <span className="text-xs font-mono font-bold text-[#16D6B0]">{dr.efficiency_score}%</span>
                      </div>
                    ))}
                  </div>
                </GlassPanel>
              </div>
            )}

            {/* TAB 4: ROUTES */}
            {activeTab === "Routes" && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-white">Route Network & Risk Scoring</h1>
                  <button onClick={() => setShowNewRouteModal(!showNewRouteModal)} className="px-4 py-2 rounded-xl bg-[#19D8F2]/20 border border-[#19D8F2] text-[#19D8F2] text-xs font-bold">+ New Corridor</button>
                </div>

                {showNewRouteModal && (
                  <GlassPanel raised className="p-4">
                    <form onSubmit={handleRouteSubmit} className="grid grid-cols-5 gap-3 items-end">
                      <div><label className="text-[10px] text-[#91A9C2] block mb-1">Source City</label><input type="text" required value={routeForm.source} onChange={(e) => setRouteForm({ ...routeForm, source: e.target.value })} className="w-full bg-[#051425] border border-[#2D9BCC]/30 rounded-lg p-2 text-xs text-white" /></div>
                      <div><label className="text-[10px] text-[#91A9C2] block mb-1">Destination City</label><input type="text" required value={routeForm.destination} onChange={(e) => setRouteForm({ ...routeForm, destination: e.target.value })} className="w-full bg-[#051425] border border-[#2D9BCC]/30 rounded-lg p-2 text-xs text-white" /></div>
                      <div><label className="text-[10px] text-[#91A9C2] block mb-1">Distance (km)</label><input type="number" required value={routeForm.distance_km} onChange={(e) => setRouteForm({ ...routeForm, distance_km: Number(e.target.value) })} className="w-full bg-[#051425] border border-[#2D9BCC]/30 rounded-lg p-2 text-xs text-white" /></div>
                      <div><label className="text-[10px] text-[#91A9C2] block mb-1">ETA (Hours)</label><input type="number" step="0.5" required value={routeForm.eta_hours} onChange={(e) => setRouteForm({ ...routeForm, eta_hours: Number(e.target.value) })} className="w-full bg-[#051425] border border-[#2D9BCC]/30 rounded-lg p-2 text-xs text-white" /></div>
                      <button type="submit" className="bg-[#19D8F2] text-[#03101E] font-bold py-2 px-4 rounded-lg text-xs">Commit Route</button>
                    </form>
                  </GlassPanel>
                )}

                {selectedRoute && (
                  <GlassPanel raised className="p-4 flex-1 min-h-[230px] grid grid-cols-12 gap-4 mt-4">
                    <div className="col-span-12 lg:col-span-5 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-[#19D8F2] font-bold">R-{String(selectedRoute.id).padStart(2, "0")}</span>
                        <span className="text-sm font-bold text-[#EAF5FF]">{selectedRoute.source} → {selectedRoute.destination}</span>
                      </div>
                      <div className="flex-1 rounded-xl overflow-hidden min-h-[165px]">
                        <MapComponent vehicles={vehicles} routes={[selectedRoute]} incidents={incidents} selectedRouteId={selectedRoute.id} showHudControls={false} />
                      </div>
                    </div>
                    <div className="col-span-12 lg:col-span-7 flex flex-col justify-between">
                      <div>
                        <div className="flex gap-2 border-b border-[#2D9BCC]/20 pb-2 mb-3">
                          {["Overview", "Risk", "Incidents", "Vehicles"].map((tab) => (
                            <button key={tab} onClick={() => setRouteDetailTab(tab)} className={`px-3 py-1 rounded-lg text-xs font-semibold ${routeDetailTab === tab ? "bg-[#19D8F2]/20 text-[#19D8F2] border border-[#19D8F2]/40" : "text-[#9BB2C7]"}`}>{tab}</button>
                          ))}
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div className="p-3 rounded-xl bg-[#051425]/40 border border-[#2D9BCC]/15"><div className="text-[10px] text-[#9BB2C7] uppercase">Distance</div><div className="text-base font-bold text-[#EAF5FF]">{selectedRoute.distance_km} km</div></div>
                          <div className="p-3 rounded-xl bg-[#051425]/40 border border-[#2D9BCC]/15"><div className="text-[10px] text-[#9BB2C7] uppercase">Standard ETA</div><div className="text-base font-bold text-[#EAF5FF]">{selectedRoute.eta_hours} hrs</div></div>
                          <div className="p-3 rounded-xl bg-[#051425]/40 border border-[#2D9BCC]/15"><div className="text-[10px] text-[#9BB2C7] uppercase">Status</div><div className="text-base font-bold text-[#16D6B0]">● {selectedRoute.status}</div></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3.5 rounded-xl bg-[#051425]/40 border border-[#2D9BCC]/15">
                            <div className="text-[10px] text-[#9BB2C7] uppercase font-semibold">Rule-Based Risk (Week 3)</div>
                            <div className="text-lg font-bold text-[#16D6B0] mt-0.5">{selectedRoute.risk_assessment?.score ?? 10} / 100 <span className="text-xs font-normal">({selectedRoute.risk_assessment?.level || "Low"})</span></div>
                            <p className="text-[11px] text-[#9BB2C7] mt-1">{selectedRoute.risk_assessment?.reason}</p>
                          </div>
                          <div className="p-3.5 rounded-xl bg-[#A66BFF]/10 border border-[#A66BFF]/30 flex flex-col justify-center">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] text-[#A66BFF] uppercase font-bold">ML Disruption Prediction (Week 4)</span>
                              <button onClick={() => runMLPrediction(selectedRoute)} disabled={isPredicting[selectedRoute.id]} className="text-[10px] text-[#19D8F2] underline font-semibold hover:text-white">
                                {isPredicting[selectedRoute.id] ? "Running..." : "Analyze"}
                              </button>
                            </div>
                            
                            {isPredicting[selectedRoute.id] ? (
                              <div className="text-xs text-[#A66BFF] mt-2 animate-pulse font-mono">Running Random Forest inference...</div>
                            ) : mlPredictions[selectedRoute.id] ? (
                              <>
                                <div className="text-lg font-bold text-[#A66BFF] mt-0.5">
                                  ▲ {mlPredictions[selectedRoute.id].probability_percent}% <span className="text-xs font-normal">({mlPredictions[selectedRoute.id].prediction})</span>
                                </div>
                                <p className="text-[11px] text-[#9BB2C7] mt-1">{mlPredictions[selectedRoute.id].explanation}</p>
                              </>
                            ) : (
                              <div className="text-xs text-[#9BB2C7] mt-2">Click Analyze to run Random Forest inference.</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassPanel>
                )}

                <GlassPanel className="p-4">
                  <div className="flex gap-3 mb-3">
                    <select value={routeRiskFilter} onChange={(e) => setRouteRiskFilter(e.target.value)} className="bg-[#051425]/60 border border-[#2D9BCC]/30 rounded-lg px-3 py-1.5 text-xs text-[#EAF5FF]">
                      <option value="All">Risk Level: All</option><option value="Critical">Critical</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
                    </select>
                  </div>
                  <div className="overflow-x-auto max-h-[300px] custom-scrollbar">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[10px] uppercase text-[#91A9C2] border-b border-[#2D9BCC]/20">
                        <tr>
                          <th className="py-2.5 px-3">Route</th>
                          <th className="py-2.5 px-3">Path</th>
                          <th className="py-2.5 px-3">Distance</th>
                          <th className="py-2.5 px-3">ETA</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Corridor Risk</th>
                          <th className="py-2.5 px-3 text-right">ML Insight</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2D9BCC]/10">
                        {routes.filter((r) => (routeRiskFilter === "All" || r.risk_assessment?.level === routeRiskFilter) && `${r.source} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())).map((r) => {
                            const ml = mlPredictions[r.id];
                            const lvl = r.risk_assessment?.level || "Low";
                            return (
                              <tr key={r.id} onClick={() => setSelectedRoute(r)} className={`cursor-pointer transition-colors ${selectedRoute?.id === r.id ? "bg-[#19D8F2]/20" : "hover:bg-[#051425]/40"}`}>
                                <td className="py-2.5 px-3 font-mono text-[#19D8F2] font-bold">R-0{r.id}</td>
                                <td className="py-2.5 px-3 font-semibold text-white">{r.source} → {r.destination}</td>
                                <td className="py-2.5 px-3">{r.distance_km} km</td>
                                <td className="py-2.5 px-3">{r.eta_hours}h</td>
                                <td className="py-2.5 px-3"><span className="text-[#16D6B0] font-bold">● {r.status}</span></td>
                                <td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${lvl === "Critical" || lvl === "High" ? "bg-[#FF4568]/20 text-[#FF4568]" : "bg-[#16D6B0]/20 text-[#16D6B0]"}`}>{r.risk_assessment?.score}/100 ({lvl})</span></td>
                                <td className="py-2.5 px-3 text-right">
                                  {ml ? (
                                    <span className="text-[#A66BFF] font-bold">▲ {ml.probability_percent}% disruption</span>
                                  ) : (
                                    <button onClick={(e) => { e.stopPropagation(); runMLPrediction(r); }} className="px-3 py-1 rounded-lg bg-[#051425]/80 border border-[#19D8F2]/40 text-[#19D8F2] text-[10px] font-bold hover:bg-[#19D8F2]/20">{isPredicting[r.id] ? "Running..." : "Run AI Risk"}</button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </GlassPanel>
              </div>
            )}

            {/* TAB 5: ROUTE PLANNER */}
            {activeTab === "Route Planner" && (
              <div className="flex flex-col gap-4 h-full">
                <h1 className="text-2xl font-bold text-white">Global Highway Path Engine</h1>
                <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
                  <div className="col-span-12 lg:col-span-4 space-y-3">
                    <GlassPanel raised className="p-4 space-y-3">
                      <div><label className="text-[10px] text-[#91A9C2] block mb-1">Origin City</label><input type="text" value={plannerForm.source} onChange={(e) => setPlannerForm({ ...plannerForm, source: e.target.value })} className="w-full bg-[#051425] border border-slate-700 rounded p-2 text-xs text-white" /></div>
                      <div><label className="text-[10px] text-[#91A9C2] block mb-1">Destination City</label><input type="text" value={plannerForm.destination} onChange={(e) => setPlannerForm({ ...plannerForm, destination: e.target.value })} className="w-full bg-[#051425] border border-slate-700 rounded p-2 text-xs text-white" /></div>
                      <button onClick={executeRoutePlan} disabled={isPlanning} className="w-full py-2.5 rounded bg-[#19D8F2] text-[#03101E] font-bold text-xs shadow-[0_0_15px_rgba(25,216,242,0.4)]">
                        {isPlanning ? "Solving Road Topology..." : "Compute Global Route (Fast)"}
                      </button>
                    </GlassPanel>
                    {plannedRoutes.map((p: any) => (
                      <GlassPanel key={p.id} className="p-4 border-l-4 border-[#16D6B0]">
                        <div className="flex justify-between items-center mb-1"><span className="text-xs font-bold text-[#16D6B0]">{p.algorithm}</span><span className="font-bold text-white">{p.cost_hrs} hrs</span></div>
                        <div className="text-xs font-mono text-white mb-2">{p.path.join(" → ")}</div>
                        <div className="flex justify-between text-xs text-[#91A9C2]">
                          <span>Distance: {p.distance_km} km</span>
                          <button onClick={async () => {
                            await fetch("https://smart-logistics-17od.onrender.com/api/routes", {
                              method: "POST", headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ source: plannerForm.source, destination: plannerForm.destination, distance_km: p.distance_km, eta_hours: p.cost_hrs, status: "Active" })
                            });
                            fetchData();
                            alert("Route committed to active database!");
                          }} className="text-[#16D6B0] font-bold hover:underline">Commit Corridor ↗</button>
                        </div>
                      </GlassPanel>
                    ))}
                  </div>
                  <GlassPanel className="col-span-12 lg:col-span-8 p-1.5 min-h-[350px]">
                    <MapComponent vehicles={vehicles} routes={routes} incidents={incidents} plannedRoutes={plannedRoutes} layers={mapLayers} onToggleLayer={handleToggleLayer} />
                  </GlassPanel>
                </div>
              </div>
            )}

            {/* TAB 6: DELIVERIES / MANIFESTS */}
            {activeTab === "Deliveries / Manifests" && (
              <div className="flex flex-col gap-4 h-full">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-white">Active Manifest Pipeline</h1>
                  <button onClick={() => setShowNewDeliveryModal(!showNewDeliveryModal)} className="px-4 py-2 rounded-xl bg-[#19D8F2]/20 border border-[#19D8F2] text-[#19D8F2] text-xs font-bold">+ New Dispatch</button>
                </div>
                {showNewDeliveryModal && (
                  <GlassPanel raised className="p-4">
                    <form onSubmit={handleDeliverySubmit} className="grid grid-cols-5 gap-3 items-end">
                      <div><label className="text-[10px] text-[#91A9C2] block mb-1">Vehicle</label><select required value={deliveryForm.vehicle_id} onChange={(e) => setDeliveryForm({ ...deliveryForm, vehicle_id: e.target.value })} className="w-full bg-[#051425]/60 border border-[#2D9BCC]/30 rounded-lg p-2 text-xs text-white"><option value="">Select...</option>{vehicles.map((v) => <option key={v.id} value={v.id}>{v.vehicle_number}</option>)}</select></div>
                      <div><label className="text-[10px] text-[#91A9C2] block mb-1">Driver</label><select value={deliveryForm.driver_name} onChange={(e) => setDeliveryForm({ ...deliveryForm, driver_name: e.target.value })} className="w-full bg-[#051425]/60 border border-[#2D9BCC]/30 rounded-lg p-2 text-xs text-white"><option value="">Select...</option>{drivers.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}</select></div>
                      <div><label className="text-[10px] text-[#91A9C2] block mb-1">Route</label><select required value={deliveryForm.route_id} onChange={(e) => setDeliveryForm({ ...deliveryForm, route_id: e.target.value })} className="w-full bg-[#051425]/60 border border-[#2D9BCC]/30 rounded-lg p-2 text-xs text-white"><option value="">Select...</option>{routes.map((r) => <option key={r.id} value={r.id}>{r.source} → {r.destination}</option>)}</select></div>
                      <div><label className="text-[10px] text-[#91A9C2] block mb-1">Cargo Goods</label><input type="text" required placeholder="Goods description" value={deliveryForm.goods} onChange={(e) => setDeliveryForm({ ...deliveryForm, goods: e.target.value })} className="w-full bg-[#051425]/60 border border-[#2D9BCC]/30 rounded-lg p-2 text-xs text-white" /></div>
                      <button type="submit" className="bg-[#19D8F2] text-[#03101E] font-bold py-2 px-4 rounded-lg text-xs">Dispatch Manifest</button>
                    </form>
                  </GlassPanel>
                )}
                <GlassPanel className="p-4 flex-1">
                  <div className="flex gap-2 mb-3">
                    {["All", "In Transit", "Pending", "Paused", "Delivered"].map((st) => (
                      <button
                        key={st}
                        onClick={() => setDeliveryStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                          deliveryStatusFilter === st
                            ? "bg-[#19D8F2]/20 border-[#19D8F2] text-[#19D8F2]"
                            : "bg-[#051425]/60 border-[#2D9BCC]/25 text-[#9BB2C7]"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="text-[10px] uppercase text-[#91A9C2] border-b border-[#2D9BCC]/20">
                      <tr>
                        <th className="py-2.5 px-3">Manifest</th><th className="py-2.5 px-3">Cargo Goods</th><th className="py-2.5 px-3">Assigned Unit & Driver</th><th className="py-2.5 px-3">Corridor</th><th className="py-2.5 px-3">Status</th><th className="py-2.5 px-3 text-right">Telemetry Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2D9BCC]/10">
                      {deliveries.filter((d) => deliveryStatusFilter === "All" || d.status === deliveryStatusFilter).map((d) => (
                        <tr key={d.id} className="hover:bg-[#051425]/40">
                          <td className="py-3 px-3 font-mono text-[#19D8F2] font-bold">D-10{d.id}</td>
                          <td className="py-3 px-3 font-semibold text-white">{d.goods}</td>
                          <td className="py-3 px-3"><div>{d.vehicle_number}</div><div className="text-[10px] text-[#91A9C2]">{d.driver_name || "Unassigned"}</div></td>
                          <td className="py-3 px-3 text-[#91A9C2]">{d.source} → {d.destination}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${d.status === "In Transit" ? "bg-[#16D6B0]/20 text-[#16D6B0]" : d.status === "Paused" ? "bg-[#FFB547]/20 text-[#FFB547]" : "bg-slate-700/50 text-slate-300"}`}>{d.status}</span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            {(d.status === "In Transit" || d.status === "Paused") && (
                              <button onClick={() => { setTrackingDeliveryId(d.id); setActiveTab("Live Tracking"); }} className="px-3 py-1.5 rounded-lg bg-[#19D8F2]/20 border border-[#19D8F2]/50 text-[#19D8F2] hover:bg-[#19D8F2]/30 text-[10px] font-bold">
                                Track Live ↗
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </GlassPanel>
              </div>
            )}

            {/* TAB 7: INCIDENTS & HAZARDS */}
            {activeTab === "Incidents & Hazards" && (
              <div className="flex flex-col gap-4 h-full">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-white">Corridor Incidents & Hazards</h1>
                    <p className="text-xs text-[#9BB2C7]">Broadcast, audit, and resolve active geospatial road hazards.</p>
                  </div>
                  <button onClick={() => setShowNewIncidentModal(!showNewIncidentModal)} className="px-4 py-2 rounded-xl bg-[#FF4568]/20 border border-[#FF4568] text-[#FF4568] text-xs font-bold hover:bg-[#FF4568]/30">
                    {showNewIncidentModal ? "Close Form" : "+ Broadcast New Hazard"}
                  </button>
                </div>
                
                {showNewIncidentModal && (
                  <GlassPanel raised className="p-4 border-[#FF4568]/50 shadow-[0_0_20px_rgba(255,69,104,0.15)]">
                    <form onSubmit={handleIncidentSubmit} className="grid grid-cols-5 gap-3 items-end">
                      <div>
                        <label className="text-[10px] text-[#9BB2C7] block mb-1 uppercase font-semibold">Hazard Type</label>
                        <select value={incidentForm.incident_type} onChange={(e) => setIncidentForm({ ...incidentForm, incident_type: e.target.value })} className="w-full bg-[#051425]/60 border border-[#2D9BCC]/30 rounded-lg p-2 text-xs text-white">
                          <option>Road Blockage</option><option>Flood</option><option>Landslide</option><option>Accident</option><option>Severe Weather</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-[#9BB2C7] block mb-1 uppercase font-semibold">Severity</label>
                        <select value={incidentForm.severity} onChange={(e) => setIncidentForm({ ...incidentForm, severity: e.target.value })} className="w-full bg-[#051425]/60 border border-[#2D9BCC]/30 rounded-lg p-2 text-xs text-white">
                          <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-[#9BB2C7] block mb-1 uppercase font-semibold">City / Hub Location</label>
                        <input type="text" required placeholder="e.g. Hyderabad" value={incidentForm.location_name} onChange={(e) => setIncidentForm({ ...incidentForm, location_name: e.target.value })} className="w-full bg-[#051425]/60 border border-[#2D9BCC]/30 rounded-lg p-2 text-xs text-white" />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#9BB2C7] block mb-1 uppercase font-semibold">Description</label>
                        <input type="text" required placeholder="Hazard summary" value={incidentForm.description} onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })} className="w-full bg-[#051425]/60 border border-[#2D9BCC]/30 rounded-lg p-2 text-xs text-white" />
                      </div>
                      <button type="submit" className="bg-[#FF4568] text-white font-bold py-2 px-4 rounded-lg text-xs hover:bg-red-500 shadow-md">
                        Broadcast Hazard
                      </button>
                    </form>
                  </GlassPanel>
                )}

                <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
                  <GlassPanel className="col-span-12 lg:col-span-8 p-4 overflow-y-auto custom-scrollbar space-y-2.5">
                    <div className="flex gap-3 mb-3">
                      <select
                        value={alertSeverityFilter}
                        onChange={(e) => setAlertSeverityFilter(e.target.value)}
                        className="bg-[#051425]/60 border border-[#2D9BCC]/30 rounded-lg px-3 py-1.5 text-xs text-[#EAF5FF]"
                      >
                        <option value="All">Severity: All</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                      <select
                        value={alertStatusFilter}
                        onChange={(e) => setAlertStatusFilter(e.target.value)}
                        className="bg-[#051425]/60 border border-[#2D9BCC]/30 rounded-lg px-3 py-1.5 text-xs text-[#EAF5FF]"
                      >
                        <option value="All">Status: All</option>
                        <option value="Active">Active</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                    {incidents.filter((inc) => (alertSeverityFilter === "All" || inc.severity === alertSeverityFilter) && (alertStatusFilter === "All" || inc.status === alertStatusFilter)).map((inc) => (
                      <div key={inc.id} onClick={() => setSelectedIncident(inc)} className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer ${selectedIncident?.id === inc.id ? "bg-[#19D8F2]/15 border-[#19D8F2]" : "bg-[#051425]/40 border-[#2D9BCC]/15 hover:border-[#19D8F2]/40"}`}>
                        <div className="flex items-center gap-3.5">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${inc.severity === "High" || inc.severity === "Critical" ? "bg-[#FF4568]/20 text-[#FF4568] border border-[#FF4568]/50" : "bg-[#FFB547]/20 text-[#FFB547] border border-[#FFB547]/50"}`}>
                            {inc.severity}
                          </span>
                          <div>
                            <span className="text-xs font-bold text-white block">{inc.incident_type} — {inc.location_name}</span>
                            <span className="text-[11px] text-[#91A9C2] block">{inc.description}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-[#91A9C2] block mb-1">Reported at {inc.time_str || "14:32:00"}</span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${inc.status === "Active" ? "text-[#FF4568] bg-[#FF4568]/15" : "text-[#16D6B0] bg-[#16D6B0]/15"}`}>
                            ● {inc.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </GlassPanel>

                  <GlassPanel raised className="col-span-12 lg:col-span-4 p-4 flex flex-col justify-between">
                    {selectedIncident ? (
                      <div>
                        <h3 className="text-xs text-[#9BB2C7] uppercase font-semibold mb-1">Hazard Audit Details</h3>
                        <div className="text-lg font-bold text-white">{selectedIncident.incident_type}</div>
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FF4568]/20 text-[#FF4568]">{selectedIncident.severity} Severity • {selectedIncident.status}</span>
                        <p className="text-xs text-slate-300 mt-3 border-t border-[#2D9BCC]/20 pt-3">{selectedIncident.description}</p>
                        <div className="text-[11px] text-[#9BB2C7] mt-2 font-mono">Location: {selectedIncident.location_name} ({selectedIncident.latitude?.toFixed(4)}, {selectedIncident.longitude?.toFixed(4)})</div>
                        {/* PASTE THIS MAP COMPONENT RIGHT HERE */}
                        <div className="h-44 rounded-xl overflow-hidden my-3">
                          <MapComponent vehicles={vehicles} routes={routes} incidents={[selectedIncident]} selectedIncidentId={selectedIncident.id} showHudControls={false} />
                        </div>

                        {selectedIncident.status === "Active" && (
                          <button onClick={() => resolveIncident(selectedIncident.id)} className="w-full mt-6 py-2.5 rounded-lg bg-[#16D6B0]/20 border border-[#16D6B0] text-[#16D6B0] text-xs font-bold hover:bg-[#16D6B0]/30 shadow-lg">
                            ✓ Resolve Hazard & Clear Corridor
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-[#91A9C2]">Select an incident to view details or resolve.</p>
                    )}
                  </GlassPanel>
                </div>
              </div>
            )}

            {/* TAB 8: METEOROLOGY */}
            {activeTab === "Meteorology" && (
              <div className="flex flex-col gap-4 h-full">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-[#EAF5FF]">Global Meteorology & Radar</h1>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Search any city..." value={weatherSearchCity} onChange={(e) => setWeatherSearchCity(e.target.value)} className="bg-[#051425] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white" />
                    <button onClick={() => fetchWeatherForCity(weatherSearchCity)} className="px-3 py-1.5 rounded-lg bg-[#19D8F2] text-[#03101E] font-bold text-xs">Search Radar</button>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                  <GlassPanel className="col-span-12 lg:col-span-7 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 relative shrink-0">
                        <WeatherIllustration />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#9BB2C7] uppercase font-bold">Open-Meteo Verified</span>
                        <div className="text-lg font-bold text-white">{weatherData?.city || "Delhi"}</div>
                        <div className="text-3xl font-bold text-[#19D8F2] mt-0.5">{weatherData ? `${weatherData.temp}°C` : "22°C"}</div>
                        <div className="text-xs text-[#9BB2C7]">{weatherData ? weatherData.condition : "Light Rain"}</div>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs text-[#9BB2C7] border-l border-[#2D9BCC]/20 pl-4">
                      <div className="flex justify-between gap-6"><span>Humidity</span><span className="text-[#EAF5FF] font-mono">{weatherData?.humidity || 78}%</span></div>
                      <div className="flex justify-between gap-6"><span>Wind Speed</span><span className="text-[#EAF5FF] font-mono">{weatherData?.wind || 12} km/h</span></div>
                      <div className="flex justify-between gap-6"><span>Precipitation</span><span className="text-[#EAF5FF] font-mono">{weatherData?.rain || 0} mm</span></div>
                    </div>
                  </GlassPanel>

                  <GlassPanel raised className="col-span-12 lg:col-span-5 p-4 border-l-4 border-[#FF4568]">
                    <h3 className="text-xs font-bold text-[#FF4568] uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Icon name="alert" size={16} /> Severe Weather Advisories
                    </h3>
                    <div className="space-y-2 overflow-y-auto max-h-[110px] custom-scrollbar">
                      {severeWeatherAlerts.map((w, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-[#FF4568]/10 border border-[#FF4568]/30 text-xs">
                          <span className="font-bold text-white block">{w.event} — {w.region}</span>
                          <span className="text-[10.5px] text-[#9BB2C7] block mt-0.5">{w.advisory}</span>
                        </div>
                      ))}
                    </div>
                  </GlassPanel>
                </div>

                <GlassPanel className="flex-1 p-2 min-h-[300px] overflow-hidden">
                  <MapComponent vehicles={vehicles} routes={routes} incidents={incidents} layers={{ ...mapLayers, weather: true }} onToggleLayer={handleToggleLayer} />
                </GlassPanel>
              </div>
            )}

            {/* TAB 9: RISK & AI INTELLIGENCE */}
            {activeTab === "Risk & AI Intelligence" && (
              <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-white">Machine Learning & Disruption Analytics</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GlassPanel className="p-5">
                    <h3 className="text-xs font-bold text-[#A66BFF] uppercase mb-2">Random Forest Route Classifier</h3>
                    <p className="text-xs text-[#9BB2C7] mb-4">Multi-variable inference calculating disruption probabilities over route length, hazard proximity, and meteorological stress factors.</p>
                    <div className="p-3.5 rounded-xl bg-[#A66BFF]/10 border border-[#A66BFF]/30 space-y-2 text-xs">
                      <div className="flex justify-between"><span>Model Precision:</span><b className="text-[#16D6B0]">94.2%</b></div>
                      <div className="flex justify-between"><span>Dominant Stress Factor:</span><b className="text-[#19D8F2]">Active Hazard Proximity</b></div>
                      <div className="flex justify-between"><span>Inference Execution:</span><b className="text-white">Sub-5ms</b></div>
                    </div>
                  </GlassPanel>

                  <GlassPanel className="p-5">
                    <h3 className="text-xs font-bold text-[#16D6B0] uppercase mb-2">Driver Variance Regressor</h3>
                    <p className="text-xs text-[#9BB2C7] mb-4">Evaluates driver behavioral profiles against road conditions to estimate arrival delay variance.</p>
                    <div className="p-3.5 rounded-xl bg-[#16D6B0]/10 border border-[#16D6B0]/30 space-y-2 text-xs">
                      <div className="flex justify-between"><span>Mean Absolute Error:</span><b className="text-[#16D6B0]">± 4.2 mins</b></div>
                      <div className="flex justify-between"><span>Registered Drivers:</span><b className="text-white">{drivers.length} Profiles</b></div>
                    </div>
                  </GlassPanel>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}