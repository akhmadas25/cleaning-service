"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface OrderMapPreviewProps {
  lat: number;
  lng: number;
}

export default function OrderMapPreview({ lat, lng }: OrderMapPreviewProps) {
  const [mounted, setMounted] = useState(false);
  const [icon, setIcon] = useState<L.Icon | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setIcon(L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    }));
  }, []);

  if (!mounted || !icon) return <div className="w-full h-full bg-slate-100 animate-pulse" />;

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        zoomControl={false}
        dragging={false}
        touchZoom={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        boxZoom={false}
        keyboard={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={icon} />
      </MapContainer>
      <div className="absolute inset-0 z-10" /> {/* Layer to prevent interaction */}
    </div>
  );
}
