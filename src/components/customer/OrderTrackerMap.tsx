"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


// Icons
import { getOrderLocation } from "@/lib/actions/order";

interface OrderTrackerMapProps {
  orderId: string;
  destLat: number;
  destLng: number;
  initialTechLat: number | null;
  initialTechLng: number | null;
}

function MapAutoBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length < 2) {
      if (points.length === 1) map.setView(points[0], 15);
      return;
    }
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
  }, [points, map]);
  return null;
}

export default function OrderTrackerMap({ orderId, destLat, destLng, initialTechLat, initialTechLng }: OrderTrackerMapProps) {
  const [mounted, setMounted] = useState(false);
  const [icons, setIcons] = useState<{ dest: L.Icon, tech: L.DivIcon } | null>(null);
  const [techPos, setTechPos] = useState<{ lat: number | null, lng: number | null }>({
    lat: initialTechLat,
    lng: initialTechLng
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setIcons({
      dest: L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }),
      tech: L.divIcon({
        html: `<div class="bg-blue-600 p-2 rounded-full border-2 border-white shadow-lg animate-pulse">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
               </div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })
    });

    // Polling for location updates every 5 seconds
    const interval = setInterval(async () => {
      const res = await getOrderLocation(orderId);
      if (res.success) {
        setTechPos({
          lat: res.success.technicianLat,
          lng: res.success.technicianLng
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

  if (!mounted || !icons) return <div className="w-full h-60 bg-slate-100 animate-pulse rounded-2xl" />;

  const { lat: techLat, lng: techLng } = techPos;
  const points: [number, number][] = [[destLat, destLng]];
  if (techLat && techLng) points.push([techLat, techLng]);

  return (
    <div className="w-full h-60 rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative">
      <MapContainer
        center={[destLat, destLng]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[destLat, destLng]} icon={icons.dest} />
        {techLat && techLng && (
          <>
            <Marker position={[techLat, techLng]} icon={icons.tech} />
            <Polyline positions={[[techLat, techLng], [destLat, destLng]]} color="#2563eb" dashArray="10, 10" weight={3} opacity={0.6} />
          </>
        )}
        <MapAutoBounds points={points} />
      </MapContainer>

      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-slate-200 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-[10px] font-bold uppercase text-slate-700">Tujuan</span>
        </div>
        {techLat && (
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-slate-200 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase text-slate-700">Teknisi (OTW)</span>
          </div>
        )}
      </div>
    </div>
  );
}
