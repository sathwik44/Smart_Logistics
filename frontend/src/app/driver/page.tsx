"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const MapComponent = dynamic(() => import("../../components/MapComponent"), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-[#03101E] text-xs font-mono text-[#91A9C2]">LOADING DRIVER GPS...</div>,
});

export default function DriverPortalPage() {
  const [driverName, setDriverName] = useState("Rahul Sharma");
  const [auth, setAuth] = useState(false);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<any | null>(null);
  const [trackingData, setTrackingData] = useState<any | null>(null);
  const [reportModal, setReportModal] = useState(false);
  const [incidentForm, setIncidentForm] = useState({ incident_type: "Road Blockage", severity: "High", description: "", location_name: "En route" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuth(true);
    loadDriverDeliveries();
  };

  const loadDriverDeliveries = async () => {
    try {
      const res = await fetch(`https://smart-logistics-backend.onrender.com/api/driver/my-deliveries?driver_name=${encodeURIComponent(driverName)}`);
      if (res.ok) {
        const data = await res.json();
        setDeliveries(data);
        if (data.length > 0 && !selectedDelivery) setSelectedDelivery(data[0]);
      }
    } catch {}
  };

  useEffect(() => {
    if (!selectedDelivery) return;
    const fetchTrip = async () => {
      try {
        const res = await fetch(`https://smart-logistics-backend.onrender.com/api/tracking/${selectedDelivery.id}`);
        if (res.ok) setTrackingData(await res.json());
      } catch {}
    };
    fetchTrip();
    const interval = setInterval(fetchTrip, 3000);
    return () => clearInterval(interval);
  }, [selectedDelivery]);

  const handleIncidentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("https://smart-logistics-backend.onrender.com/api/incidents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(incidentForm) });
    setReportModal(false);
    alert("Hazard reported to central dispatcher.");
  };

  if (!auth) {
    return (
      <div className="h-screen w-screen bg-[#03101E] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm p-6 rounded-2xl bg-[#06182A] border border-[#19D8F2]/30 space-y-4 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-white uppercase">Driver Terminal</h2>
            <p className="text-xs text-[#91A9C2]">Authenticate to access assignments</p>
          </div>
          <div><label className="text-[10px] text-[#91A9C2] uppercase block mb-1">Driver Name</label><input type="text" value={driverName} onChange={(e) => setDriverName(e.target.value)} className="w-full bg-[#03101E] border border-[#19D8F2]/30 rounded-lg p-2.5 text-xs text-white" /></div>
          <button type="submit" className="w-full py-2.5 rounded-lg bg-[#19D8F2] text-[#03101E] text-xs font-bold shadow-lg mt-4">Authenticate Session</button>
          <Link href="/" className="w-full block text-center py-2.5 text-xs text-[#91A9C2] hover:text-white">Return to Admin Dashboard</Link>
        </form>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#03101E] text-white flex flex-col overflow-hidden font-sans">
      <header className="h-14 px-4 bg-[#06182A] border-b border-[#19D8F2]/20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm text-[#19D8F2]">DRIVER TERMINAL</span>
          <span className="text-xs text-slate-300">Logged in: <b>{driverName}</b></span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setReportModal(true)} className="px-3 py-1.5 rounded-lg bg-[#FF4568]/20 border border-[#FF4568] text-[#FF4568] text-xs font-bold">⚠ Report Hazard Ahead</button>
          <button onClick={() => setAuth(false)} className="text-xs text-[#91A9C2] hover:text-white">Sign Out</button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-3 p-3 min-h-0 overflow-hidden">
        <div className="col-span-12 md:col-span-4 flex flex-col gap-3 overflow-y-auto pr-1">
          <h3 className="text-xs font-bold text-[#91A9C2] uppercase">My Assigned Dispatches</h3>
          {deliveries.map((del) => (
            <div key={del.id} onClick={() => setSelectedDelivery(del)} className={`p-3.5 rounded-xl border cursor-pointer ${selectedDelivery?.id === del.id ? "bg-[#19D8F2]/15 border-[#19D8F2]" : "bg-[#06182A]/70 border-[#19D8F2]/20"}`}>
              <div className="flex justify-between items-start mb-1.5"><span className="font-bold text-sm text-white">#{del.id} {del.goods}</span><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${del.status === "In Transit" ? "bg-[#16D6B0]/20 text-[#16D6B0]" : "bg-[#FFB547]/20 text-[#FFB547]"}`}>{del.status}</span></div>
              <div className="text-xs text-[#91A9C2] mb-3">{del.source} → {del.destination}</div>
              {del.status === "Pending" && (
                <button onClick={async (e) => { e.stopPropagation(); await fetch(`https://smart-logistics-backend.onrender.com/api/driver/start-trip/${del.id}`, { method: "POST" }); loadDriverDeliveries(); }} className="w-full py-2 rounded-lg bg-[#16D6B0] text-[#03101E] font-bold text-xs">Start Trip</button>
              )}
              {del.status === "In Transit" && (
                <button onClick={async (e) => { e.stopPropagation(); await fetch(`https://smart-logistics-backend.onrender.com/api/deliveries/${del.id}/complete`, { method: "POST" }); loadDriverDeliveries(); }} className="w-full py-2 rounded-lg bg-[#19D8F2] text-[#03101E] font-bold text-xs">Complete Delivery</button>
              )}
            </div>
          ))}
        </div>

        <div className="col-span-12 md:col-span-8 flex flex-col gap-3 min-h-0">
          <div className="flex-1 rounded-xl overflow-hidden border border-[#19D8F2]/25 relative">
            {selectedDelivery && (
              <MapComponent
                vehicles={[{ id: 999, vehicle_number: selectedDelivery.vehicle_number, status: selectedDelivery.status, latitude: selectedDelivery.vehicle_lat, longitude: selectedDelivery.vehicle_lng }]}
                routes={[{ id: 999, source: selectedDelivery.source, destination: selectedDelivery.destination, distance_km: selectedDelivery.distance_km, eta_hours: selectedDelivery.eta_hours }]}
                showHudControls={false}
              />
            )}
          </div>
          {trackingData?.corridor_hazards?.length > 0 && (
            <div className="p-3 rounded-xl bg-[#FF4568]/20 border border-[#FF4568] flex items-center justify-between animate-pulse">
              <span className="text-xs font-bold text-white">⚠ {trackingData.corridor_hazards[0].incident_type} reported {trackingData.corridor_hazards[0].distance_from_vehicle_km} km ahead!</span>
            </div>
          )}
        </div>
      </div>

      {reportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleIncidentSubmit} className="w-full max-w-md p-5 rounded-xl bg-[#06182A] border border-[#FF4568] space-y-3">
            <h3 className="text-sm font-bold text-white">Broadcast Road Hazard</h3>
            <select value={incidentForm.incident_type} onChange={(e) => setIncidentForm({ ...incidentForm, incident_type: e.target.value })} className="w-full bg-[#03101E] border border-slate-700 rounded p-2 text-xs text-white">
              <option>Road Blockage</option><option>Flood</option><option>Landslide</option><option>Accident</option>
            </select>
            <input type="text" placeholder="Location description" value={incidentForm.location_name} onChange={(e) => setIncidentForm({ ...incidentForm, location_name: e.target.value })} className="w-full bg-[#03101E] border border-slate-700 rounded p-2 text-xs text-white" />
            <textarea placeholder="Incident notes..." value={incidentForm.description} onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })} className="w-full bg-[#03101E] border border-slate-700 rounded p-2 text-xs text-white" />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setReportModal(false)} className="px-3 py-1.5 text-xs text-slate-400">Cancel</button>
              <button type="submit" className="px-4 py-1.5 rounded bg-[#FF4568] text-white text-xs font-bold">Broadcast</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}