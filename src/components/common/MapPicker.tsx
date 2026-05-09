"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, AlertCircle } from "lucide-react";

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  defaultLocation?: { lat: number; lng: number };
}

// Kota Tegal sebagai pusat layanan
const TEGAL_CENTER = { lat: -6.8697, lng: 109.1257 };
const MAX_RADIUS_KM = 10;

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function MapPicker({ onLocationSelect, defaultLocation }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [outOfRange, setOutOfRange] = useState(false);

  const initialCenter = defaultLocation || TEGAL_CENTER;

  const isWithinRange = (lat: number, lng: number) => {
    return getDistanceKm(TEGAL_CENTER.lat, TEGAL_CENTER.lng, lat, lng) <= MAX_RADIUS_KM;
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      // Guard: jika container sudah punya map Leaflet, skip
      if ((mapRef.current as any)?._leaflet_id) return;

      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        // Batasi zoom agar tidak bisa zoom out terlalu jauh
        minZoom: 12,
        maxZoom: 19,
      }).setView([TEGAL_CENTER.lat, TEGAL_CENTER.lng], 13);

      // Batasi area pan ke sekitar Tegal (bounding box ~15km)
      const bounds = L.latLngBounds(
        [TEGAL_CENTER.lat - 0.135, TEGAL_CENTER.lng - 0.145],
        [TEGAL_CENTER.lat + 0.135, TEGAL_CENTER.lng + 0.145]
      );
      map.setMaxBounds(bounds);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Gambar lingkaran radius 10km
      L.circle([TEGAL_CENTER.lat, TEGAL_CENTER.lng], {
        radius: MAX_RADIUS_KM * 1000,
        color: "#2563eb",
        fillColor: "#3b82f6",
        fillOpacity: 0.07,
        weight: 2,
        dashArray: "6, 4",
      }).addTo(map);

      // Marker pusat kota (tidak draggable, hanya penanda)
      L.circleMarker([TEGAL_CENTER.lat, TEGAL_CENTER.lng], {
        radius: 5,
        color: "#2563eb",
        fillColor: "#2563eb",
        fillOpacity: 1,
        weight: 2,
      }).addTo(map).bindTooltip("Pusat Kota Tegal", { permanent: false });

      // Marker pilihan user
      const marker = L.marker([initialCenter.lat, initialCenter.lng], {
        draggable: true,
      }).addTo(map);

      mapInstanceRef.current = map;
      markerRef.current = marker;

      const reverseGeocode = async (lat: number, lng: number) => {
        if (!isWithinRange(lat, lng)) {
          setOutOfRange(true);
          return false;
        }
        setOutOfRange(false);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await res.json();
          const addr = data.display_name || "";
          setAddress(addr);
          setCoords({ lat, lng });
          onLocationSelect(lat, lng, addr);
        } catch {
          setCoords({ lat, lng });
          onLocationSelect(lat, lng, "");
        }
        return true;
      };

      // Handle marker drag
      marker.on("dragend", async () => {
        const pos = marker.getLatLng();
        const valid = await reverseGeocode(pos.lat, pos.lng);
        if (!valid) {
          // Kembalikan marker ke posisi terakhir yang valid atau pusat
          marker.setLatLng([TEGAL_CENTER.lat, TEGAL_CENTER.lng]);
        }
      });

      // Handle map click
      map.on("click", async (e: any) => {
        const { lat, lng } = e.latlng;
        if (!isWithinRange(lat, lng)) {
          setOutOfRange(true);
          return;
        }
        marker.setLatLng(e.latlng);
        await reverseGeocode(lat, lng);
      });
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const query = (e.target as HTMLInputElement).value;
    if (!query.trim() || !mapInstanceRef.current || !markerRef.current) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + " Tegal")}&format=json&limit=1`
      );
      const data = await res.json();
      if (data[0]) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);

        if (!isWithinRange(lat, lng)) {
          setOutOfRange(true);
          return;
        }

        const addr = data[0].display_name;
        mapInstanceRef.current.setView([lat, lng], 16);
        markerRef.current.setLatLng([lat, lng]);
        setAddress(addr);
        setCoords({ lat, lng });
        setOutOfRange(false);
        onLocationSelect(lat, lng, addr);
      } else {
        setOutOfRange(true);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
        <MapPin className="w-3 h-3 shrink-0" />
        <span>Layanan tersedia dalam radius <strong>10 km</strong> dari Kota Tegal</span>
      </div>

      <input
        type="text"
        placeholder="Cari nama jalan / kelurahan di Tegal, lalu tekan Enter..."
        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        onKeyDown={handleSearch}
      />

      <div
        ref={mapRef}
        className="w-full h-[320px] rounded-lg border border-slate-200 shadow-sm overflow-hidden z-0"
      />

      {outOfRange && (
        <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 border border-red-100">
          <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
          <span>Lokasi di luar jangkauan layanan (radius 10 km Kota Tegal). Silakan pilih lokasi lain.</span>
        </div>
      )}

      {coords && !outOfRange && (
        <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
          <MapPin className="w-3 h-3 mt-0.5 shrink-0 text-blue-500" />
          <span className="line-clamp-2">{address || `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`}</span>
        </div>
      )}

      <p className="text-xs text-slate-400">
        💡 Klik peta atau seret <span className="font-medium">marker biru</span> untuk menentukan lokasi tepat.
      </p>
    </div>
  );
}
