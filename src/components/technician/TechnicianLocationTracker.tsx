"use client";

import { useEffect, useRef } from "react";
import { updateTechnicianLocation } from "@/lib/actions/technician";

interface TechnicianLocationTrackerProps {
  orderId: string;
  isActive: boolean;
}

export function TechnicianLocationTracker({ orderId, isActive }: TechnicianLocationTrackerProps) {
  const watchId = useRef<number | null>(null);
  const lastUpdate = useRef<number>(0);

  useEffect(() => {
    if (isActive && "geolocation" in navigator) {
      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const now = Date.now();
          
          // Throttle updates to every 10 seconds to save battery/server
          if (now - lastUpdate.current > 10000) {
            updateTechnicianLocation(orderId, latitude, longitude);
            lastUpdate.current = now;
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [isActive, orderId]);

  return null; // Silent component
}
