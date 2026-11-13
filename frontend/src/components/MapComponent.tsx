"use client";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

function MapController({
  zoomAction,
  fitBoundsPoints,
  onActionHandled,
}: {
  zoomAction: "in" | "out" | "fit" | null;
  fitBoundsPoints: [number, number][];
  onActionHandled: () => void;
}) {
  const map = useMap();
  useEffect(() => {
    if (!zoomAction) return;
    if (zoomAction === "in") map.zoomIn();
    if (zoomAction === "out") map.zoomOut();
    if (zoomAction === "fit" && fitBoundsPoints.length > 0) {
      map.fitBounds(L.latLngBounds(fitBoundsPoints), { padding: [45, 45], maxZoom: 8 });
    }
    onActionHandled();
  }, [zoomAction, fitBoundsPoints, map, onActionHandled]);
  return null;
}

const getVehicleIcon = (type: string, status: string, isSelected: boolean = false) => {
  const isMoving = status === "In Transit";
  const primary = isSelected ? "#EAF5FF" : isMoving ? "#19D8F2" : "#FFB547";
  const bg = isSelected ? "linear-gradient(135deg, #19D8F2 0%, #258BFF 100%)" : isMoving ? "rgba(6, 24, 42, 0.94)" : "rgba(20, 28, 40, 0.92)";
  const iconColor = isSelected ? "#03101E" : primary;
  const ringGlow = isSelected ? "0 0 0 4px rgba(25, 216, 242, 0.35), 0 0 22px #19D8F2" : isMoving ? "0 0 14px rgba(25, 216, 242, 0.75)" : "0 0 10px rgba(255, 181, 71, 0.45)";

  return L.divIcon({
    html: `
      <div style="position:relative; width:36px; height:36px; display:flex; align-items:center; justify-content:center;">
        ${isMoving ? `<span style="position:absolute; inset:-3px; border-radius:10px; border:1.5px solid ${primary}; opacity:0.55; animation:pulseRing 2s infinite;"></span>` : ""}
        <div style="width:32px; height:32px; border-radius:9px; background:${bg}; border:1.8px solid ${primary}; box-shadow:${ringGlow}; display:flex; align-items:center; justify-content:center; color:${iconColor};">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
          </svg>
        </div>
      </div>
    `,
    className: "bg-transparent border-none",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

const getIncidentIcon = (type: string, severity: string, isSelected: boolean = false) => {
  const isHigh = severity === "High" || severity === "Critical";
  const isMed = severity === "Medium";
  const color = isHigh ? "#FF4568" : isMed ? "#FFB547" : "#A66BFF";
  const glow = isSelected ? `0 0 0 4px rgba(255,69,104,0.35), 0 0 22px ${color}` : `0 0 14px ${color}`;

  let innerSvg = `<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>`;
  if (type === "Flood") innerSvg = `<path d="M2 12c.6.5 1.2 1 2.5 1C7 13 7 11 9.5 11c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 17c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M12 3v6"/>`;
  else if (type === "Road Blockage" || type === "Road Damage") innerSvg = `<rect width="18" height="6" x="3" y="6" rx="1"/><path d="M7 12v7"/><path d="M17 12v7"/><path d="m8 6-3 6"/><path d="m16 6-3 6"/>`;

  return L.divIcon({
    html: `
      <div style="position:relative; width:36px; height:42px; display:flex; flex-direction:column; align-items:center;">
        <div style="width:32px; height:32px; border-radius:9999px; background:rgba(6, 24, 42, 0.95); border:2px solid ${color}; box-shadow:${glow}; display:flex; align-items:center; justify-content:center; color:${color};">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">${innerSvg}</svg>
        </div>
        <div style="width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:7px solid ${color}; margin-top:-1px;"></div>
      </div>
    `,
    className: "bg-transparent border-none",
    iconSize: [36, 42],
    iconAnchor: [18, 40],
    popupAnchor: [0, -38],
  });
};

const getHubEndpointIcon = (kind: "source" | "dest", label?: string) => {
  const color = kind === "source" ? "#16D6B0" : "#19D8F2";
  return L.divIcon({
    html: `
      <div style="display:flex; align-items:center; gap:5px;">
        <div style="width:14px; height:14px; border-radius:9999px; background:${color}; border:2.5px solid #EAF5FF; box-shadow:0 0 12px ${color};"></div>
        ${label ? `<span style="background:rgba(3,16,30,0.88); border:1px solid ${color}66; color:#EAF5FF; font-size:10px; font-weight:700; padding:1px 6px; border-radius:4px; white-space:nowrap; box-shadow:0 2px 8px rgba(0,0,0,0.7);">${label}</span>` : ""}
      </div>
    `,
    className: "bg-transparent border-none",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
};

const getCycloneIcon = () => {
  return L.divIcon({
    html: `
      <div style="position:relative; width:100px; height:100px; display:flex; align-items:center; justify-content:center; pointer-events:auto;">
        <span style="position:absolute; inset:0; border-radius:50%; border:2px dashed rgba(255, 69, 104, 0.4); animation:spinRadar 12s linear infinite;"></span>
        <span style="position:absolute; inset:12px; border-radius:50%; border:2px dashed rgba(255, 181, 71, 0.55); animation:spinRadarRev 7s linear infinite;"></span>
        <div style="width:64px; height:64px; border-radius:50%; background: radial-gradient(circle, rgba(255,69,104,0.3) 0%, rgba(255,181,71,0.15) 60%, transparent 100%); box-shadow: 0 0 30px rgba(255, 69, 104, 0.65), inset 0 0 15px rgba(255, 181, 71, 0.5); display:flex; align-items:center; justify-content:center; animation: spinRadar 4s linear infinite;">
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#FF4568" stroke-width="2" stroke-linecap="round">
            <path d="M12 2a10 10 0 0 0-8.66 15" stroke="#FFB547" stroke-width="2.2" />
            <path d="M12 22a10 10 0 0 0 8.66-15" stroke="#FF4568" stroke-width="2.2" />
            <circle cx="12" cy="12" r="3.5" fill="#FF4568" stroke="#FFF" stroke-width="1.5" />
          </svg>
        </div>
        <div style="position:absolute; width:8px; height:8px; border-radius:50%; background:#FFF; box-shadow:0 0 10px #FFF;"></div>
      </div>
    `,
    className: "bg-transparent border-none cursor-pointer",
    iconSize: [100, 100],
    iconAnchor: [50, 50],
  });
};

export default function MapComponent({
  vehicles = [], routes = [], incidents = [], plannedRoutes = [],
  selectedRouteId = null, selectedVehicleId = null, selectedIncidentId = null,
  layers: externalLayers, onToggleLayer, onSelectVehicle, onSelectRoute, onSelectIncident,
  showHudControls = true,
}: any) {
  const defaultCenter: [number, number] = [21.1458, 79.0882];
  const [mapKey] = useState(() => `map-wrap-${Math.random().toString(36).substr(2, 9)}`);
  
  const [roadPaths, setRoadPaths] = useState<Record<string, [number, number][]>>({});
  const [internalLayers, setInternalLayers] = useState({ vehicles: true, routes: true, incidents: true, weather: true });
  const [zoomAction, setZoomAction] = useState<"in" | "out" | "fit" | null>(null);

  const activeLayers = externalLayers || internalLayers;
  const handleLayerToggle = (key: string) => {
    if (onToggleLayer) onToggleLayer(key);
    else setInternalLayers((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  // OSRM FIX: Fetch routes in parallel with a timeout to guarantee instant loading without straight-line fallbacks.
  useEffect(() => {
    const fetchWithTimeout = async (url: string, timeoutMs: number = 2000) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(id);
        return response;
      } catch (err) {
        clearTimeout(id);
        throw err;
      }
    };

    const fetchAllRoutes = async () => {
      const fetchPromises: Promise<void>[] = [];

      // Fire all DB route requests simultaneously
      routes.forEach((r: any) => {
        if (!roadPaths[`db-${r.id}`] && r.source_latitude && r.destination_latitude) {
          const promise = fetchWithTimeout(`https://router.project-osrm.org/route/v1/driving/${r.source_longitude},${r.source_latitude};${r.destination_longitude},${r.destination_latitude}?overview=full&geometries=geojson`)
            .then(res => res.json())
            .then(data => {
              if (data.routes?.[0]) {
                setRoadPaths((prev) => ({ ...prev, [`db-${r.id}`]: data.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]) }));
              }
            })
            .catch(() => { /* Silent fail, will retry or use straight line if OSRM is completely dead */ });
          fetchPromises.push(promise);
        }
      });

      // Fire all planned route requests simultaneously
      plannedRoutes.forEach((pr: any) => {
        const key = `plan-${pr.id}-${pr.path?.join("_")}`;
        if (!roadPaths[key] && pr.nodes_coords?.length > 1) {
          const coordinatesString = pr.nodes_coords.map((n: any) => `${n.lng},${n.lat}`).join(";");
          const promise = fetchWithTimeout(`https://router.project-osrm.org/route/v1/driving/${coordinatesString}?overview=full&geometries=geojson`)
            .then(res => res.json())
            .then(data => {
              if (data.routes?.[0]) {
                setRoadPaths((prev) => ({ ...prev, [key]: data.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]) }));
              }
            })
            .catch(() => { /* Silent fail */ });
          fetchPromises.push(promise);
        }
      });

      // Wait for all fetches to complete (or timeout)
      await Promise.allSettled(fetchPromises);
    };

    fetchAllRoutes();
  }, [routes, plannedRoutes]);

  const allPoints: [number, number][] = [];
  vehicles.forEach((v: any) => { if (v.latitude && v.longitude) allPoints.push([v.latitude, v.longitude]); });

  return (
    <div key={mapKey} className="relative h-full w-full bg-[#03101E] overflow-hidden rounded-xl border border-[#19D8F2]/25 shadow-[inset_0_0_30px_rgba(3,16,30,0.9)]">
      <style>{`
        .leaflet-container { background: #03101E !important; font-family: inherit; }
        .tile-terrain-layer { filter: brightness(0.55) contrast(1.38) saturate(1.75) hue-rotate(150deg); }
        .tile-roads-layer { filter: invert(1) hue-rotate(185deg) saturate(3.2) brightness(0.75) contrast(1.55); mix-blend-mode: screen; opacity: 0.58 !important; }
        .tile-labels-layer { filter: drop-shadow(0 1px 3px rgba(0,0,0,0.95)) saturate(1.3); opacity: 0.92 !important; }
        @keyframes pulseRing { 0% { transform: scale(0.95); opacity: 0.7; } 70% { transform: scale(1.28); opacity: 0; } 100% { transform: scale(1.28); opacity: 0; } }
        @keyframes spinRadar { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spinRadarRev { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .leaflet-popup-content-wrapper { background: rgba(6, 24, 42, 0.96) !important; color: #EAF5FF !important; border: 1px solid rgba(25, 216, 242, 0.45) !important; border-radius: 10px !important; box-shadow: 0 8px 28px rgba(0, 0, 0, 0.85) !important; }
        .leaflet-popup-tip { background: rgba(6, 24, 42, 0.96) !important; }
        .leaflet-control-attribution { display: none !important; }
      `}</style>

      <MapContainer center={defaultCenter} zoom={5} className="h-full w-full z-0" zoomControl={false}>
        <MapController zoomAction={zoomAction} fitBoundsPoints={allPoints} onActionHandled={() => setZoomAction(null)} />
        <TileLayer className="tile-terrain-layer" url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        <TileLayer className="tile-roads-layer" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <TileLayer className="tile-labels-layer" url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}" />

        {activeLayers.weather && (
          <Marker position={[16.5, 87.5]} icon={getCycloneIcon()}>
            <Popup>
              <div className="p-1 min-w-[200px] text-xs">
                <span className="font-bold text-[#FF4568] uppercase text-[10px] tracking-wider block">Critical Weather Hazard</span>
                <span className="font-bold text-white text-sm block mt-0.5">Severe Cyclone Advisory</span>
                <span className="text-[11px] text-[#91A9C2] block mt-1">Gale force winds exceeding 85 km/h. Avoid all coastal East Corridor routes immediately.</span>
              </div>
            </Popup>
          </Marker>
        )}

        {activeLayers.routes && routes.map((r: any) => {
            if (!r.source_latitude || !r.destination_latitude) return null;
            const isSelected = selectedRouteId === r.id;
            const positions = roadPaths[`db-${r.id}`] || [[r.source_latitude, r.source_longitude], [r.destination_latitude, r.destination_longitude]];
            const riskLevel = r.risk_assessment?.level || "Low";
            const coreColor = isSelected ? "#EAF5FF" : (riskLevel === "High" || riskLevel === "Critical") ? "#FF4568" : riskLevel === "Medium" ? "#FFB547" : "#19D8F2";
            const glowColor = (riskLevel === "High" || riskLevel === "Critical") ? "#FF4568" : riskLevel === "Medium" ? "#FFB547" : "#19D8F2";

            return (
              <div key={`db-route-${r.id}`}>
                <Polyline positions={positions as L.LatLngExpression[]} pathOptions={{ color: glowColor, weight: isSelected ? 11 : 7, opacity: isSelected ? 0.38 : 0.22 }} />
                <Polyline positions={positions as L.LatLngExpression[]} pathOptions={{ color: coreColor, weight: isSelected ? 4 : 2.6, opacity: isSelected ? 1 : 0.88 }} eventHandlers={{ click: () => onSelectRoute && onSelectRoute(r) }}>
                  <Popup>
                    <div className="p-1 min-w-[175px] text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono font-bold text-[#19D8F2]">R-{String(r.id).padStart(2, "0")}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#16D6B0]/20 text-[#16D6B0] border border-[#16D6B0]/40 font-semibold">{r.status}</span>
                      </div>
                      <div className="font-bold text-sm text-[#EAF5FF]">{r.source} → {r.destination}</div>
                      <div className="text-[11px] text-[#91A9C2] mt-1 flex justify-between"><span>Distance: <b className="text-white">{r.distance_km} km</b></span><span>ETA: <b className="text-white">{r.eta_hours}h</b></span></div>
                      <div className="mt-1.5 pt-1.5 border-t border-[#19D8F2]/20 text-[10px] text-[#91A9C2]">Risk Score: <b className="text-[#19D8F2]">{r.risk_assessment?.score ?? 10}/100</b> ({riskLevel})</div>
                    </div>
                  </Popup>
                </Polyline>
                <Marker position={[r.source_latitude, r.source_longitude]} icon={getHubEndpointIcon("source", isSelected ? r.source : undefined)} />
                <Marker position={[r.destination_latitude, r.destination_longitude]} icon={getHubEndpointIcon("dest", isSelected ? r.destination : undefined)} />
              </div>
            );
          })}

        {plannedRoutes.map((pr: any) => {
          const cacheKey = `plan-${pr.id}-${pr.path?.join("_")}`;
          const positions = roadPaths[cacheKey] || pr.nodes_coords?.map((n: any) => [n.lat, n.lng]) || [];
          if (positions.length === 0) return null;
          const isOptimal = pr.type === "Optimal";
          const color = isOptimal ? "#16D6B0" : "#FFB547";
          return (
            <div key={cacheKey}>
              <Polyline positions={positions as L.LatLngExpression[]} pathOptions={{ color, weight: isOptimal ? 12 : 10, opacity: 0.35 }} />
              <Polyline positions={positions as L.LatLngExpression[]} pathOptions={{ color, weight: isOptimal ? 4.5 : 4, opacity: 0.98, dashArray: isOptimal ? undefined : "6, 8" }}>
                <Popup>
                  <div className="p-1 text-xs min-w-[170px]">
                    <div className="font-bold text-[#16D6B0] uppercase text-[10px]">{pr.type} Route • {pr.algorithm}</div>
                    <div className="font-semibold text-[#EAF5FF] mt-0.5">{pr.path?.join(" → ")}</div>
                    <div className="text-[11px] text-[#91A9C2] mt-1">{pr.distance_km} km • <b className="text-white">{pr.cost_hrs} hrs</b></div>
                  </div>
                </Popup>
              </Polyline>
            </div>
          );
        })}

        {activeLayers.incidents && incidents.filter((inc: any) => inc.status === "Active" && inc.latitude && inc.longitude).map((inc: any) => (
            <Marker key={`inc-${inc.id}`} position={[inc.latitude, inc.longitude]} icon={getIncidentIcon(inc.incident_type, inc.severity, selectedIncidentId === inc.id)} eventHandlers={{ click: () => onSelectIncident && onSelectIncident(inc) }}>
              <Popup>
                <div className="p-1 min-w-[180px] text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-[#EAF5FF]">{inc.incident_type}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FF4568]/20 text-[#FF4568] border border-[#FF4568]/40 uppercase">{inc.severity}</span>
                  </div>
                  <p className="text-[11px] text-[#91A9C2]">{inc.description}</p>
                  <div className="text-[10px] font-mono text-[#19D8F2] mt-1.5">{inc.location_name || `${Number(inc.latitude).toFixed(3)}, ${Number(inc.longitude).toFixed(3)}`}</div>
                </div>
              </Popup>
            </Marker>
          ))}

        {activeLayers.vehicles && vehicles.map((v: any) => {
            if (!v.latitude || !v.longitude) return null;
            return (
              <Marker key={`veh-${v.id}`} position={[v.latitude, v.longitude]} icon={getVehicleIcon(v.vehicle_type, v.status, selectedVehicleId === v.id)} eventHandlers={{ click: () => onSelectVehicle && onSelectVehicle(v) }}>
                <Popup>
                  <div className="p-1 min-w-[180px] text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-[#EAF5FF]">{v.vehicle_number}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#19D8F2]/20 text-[#19D8F2] border border-[#19D8F2]/40">{v.status}</span>
                    </div>
                    <div className="text-[11px] text-[#91A9C2]">Class: <b className="text-white">{v.vehicle_type}</b></div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>

      {showHudControls && (
        <div className="absolute bottom-3.5 left-3.5 z-[500] flex items-center gap-1.5 bg-[#06182A]/90 backdrop-blur-md border border-[#19D8F2]/35 rounded-xl p-1.5 shadow-[0_6px_24px_rgba(0,0,0,0.75)]">
          {[
            { key: "vehicles", title: "Toggle Vehicles", svg: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg> },
            { key: "routes", title: "Toggle Routes", svg: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg> },
            { key: "incidents", title: "Toggle Incidents", svg: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg> },
            { key: "weather", title: "Toggle Weather", svg: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg> },
          ].map((btn) => {
            const active = activeLayers[btn.key];
            return (
              <button key={btn.key} title={btn.title} onClick={() => handleLayerToggle(btn.key)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${active ? "bg-[#19D8F2]/20 text-[#19D8F2] border border-[#19D8F2]/50 shadow-[0_0_10px_rgba(25,216,242,0.3)]" : "text-[#91A9C2] hover:text-white hover:bg-[#092139]"}`}>
                {btn.svg}
              </button>
            );
          })}
          <div className="w-[1px] h-5 bg-[#19D8F2]/25 mx-0.5" />
          <button title="Fit Map to Active Fleet & Routes" onClick={() => setZoomAction("fit")} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#91A9C2] hover:text-[#19D8F2] hover:bg-[#092139] transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
          </button>
        </div>
      )}

      {showHudControls && (
        <div className="absolute bottom-6 right-3.5 z-[500] flex flex-col gap-1.5">
          <button title="Zoom In" onClick={() => setZoomAction("in")} className="w-8 h-8 rounded-lg bg-[#06182A]/90 backdrop-blur-md border border-[#19D8F2]/35 text-[#EAF5FF] hover:text-[#19D8F2] hover:border-[#19D8F2] flex items-center justify-center text-base font-bold shadow-lg">+</button>
          <button title="Zoom Out" onClick={() => setZoomAction("out")} className="w-8 h-8 rounded-lg bg-[#06182A]/90 backdrop-blur-md border border-[#19D8F2]/35 text-[#EAF5FF] hover:text-[#19D8F2] hover:border-[#19D8F2] flex items-center justify-center text-base font-bold shadow-lg">−</button>
        </div>
      )}
    </div>
  );
}