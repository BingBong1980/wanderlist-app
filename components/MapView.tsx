"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Spot, Category, CATEGORY_COLORS } from "@/lib/types";

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((m) => m.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

interface MapViewProps {
  spots: Spot[];
  onSpotClick: (spot: Spot) => void;
  selectedCategory: Category | null;
}

export default function MapView({ spots, onSpotClick, selectedCategory }: MapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredSpots = selectedCategory
    ? spots.filter((s) => s.category === selectedCategory)
    : spots;

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-sky-100">
        <div className="text-gray-400 text-sm">Loading map...</div>
      </div>
    );
  }

  return (
    <MapContainer
      center={[39.5, -98.35]}
      zoom={4}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {filteredSpots.map((spot) => (
        <CircleMarker
          key={spot.id}
          center={[spot.latitude, spot.longitude]}
          radius={8}
          pathOptions={{
            fillColor: CATEGORY_COLORS[spot.category],
            fillOpacity: 0.9,
            color: "white",
            weight: 2,
          }}
          eventHandlers={{
            click: () => onSpotClick(spot),
          }}
        />
      ))}
    </MapContainer>
  );
}
