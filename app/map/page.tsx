"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Spot, Category } from "@/lib/types";
import BottomNav from "@/components/BottomNav";
import CategoryFilter from "@/components/CategoryFilter";
import SpotPopup from "@/components/SpotPopup";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-sky-100">
      <div className="text-gray-400 text-sm">Loading map...</div>
    </div>
  ),
});

export default function MapPage() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [heartedSpots, setHeartedSpots] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Load spots from Supabase
  useEffect(() => {
    const loadSpots = async () => {
      const { data, error } = await supabase
        .from("spots")
        .select("*")
        .order("name");

      if (!error && data) {
        setSpots(data as Spot[]);
      }
      setLoading(false);
    };

    loadSpots();
  }, []);

  // Load user's hearted spots
  useEffect(() => {
    const loadHearts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("hearts")
        .select("spot_id")
        .eq("user_id", user.id);

      if (data) {
        setHeartedSpots(new Set(data.map((h) => h.spot_id)));
      }
    };

    loadHearts();
  }, []);

  const filteredSpots = spots.filter((spot) => {
    const matchesCategory = !selectedCategory || spot.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.state?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleHeartToggle = useCallback((spotId: string) => {
    setHeartedSpots((prev) => {
      const next = new Set(prev);
      if (next.has(spotId)) {
        next.delete(spotId);
      } else {
        next.add(spotId);
      }
      return next;
    });
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="z-10 shadow-sm" style={{ background: "linear-gradient(180deg, #87CEEB 0%, #B8DCF0 100%)" }}>
        <div className="px-4 pt-10 pb-2">
          {/* Logo */}
          <div className="flex justify-center mb-3">
            <img src="/logo.png" alt="Wanderlist" className="h-8 w-auto drop-shadow" />
          </div>

          {/* Search bar */}
          <div className="relative mb-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search spots, cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl text-sm border border-white/50 focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm"
            />
          </div>
        </div>

        {/* Category filter */}
        <CategoryFilter
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      {/* Map */}
      <div className="flex-1 relative" style={{ marginBottom: "60px" }}>
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-sky-50">
            <div className="text-center">
              <div className="text-3xl mb-2">🗺️</div>
              <div className="text-gray-500 text-sm">Loading your spots...</div>
            </div>
          </div>
        ) : (
          <MapView
            spots={filteredSpots}
            onSpotClick={setSelectedSpot}
            selectedCategory={selectedCategory}
          />
        )}

        {/* Spot count badge */}
        <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
          <span className="text-xs font-medium text-gray-600">
            {filteredSpots.length} spots
          </span>
        </div>
      </div>

      {/* Spot Popup */}
      {selectedSpot && (
        <SpotPopup
          spot={selectedSpot}
          onClose={() => setSelectedSpot(null)}
          isHearted={heartedSpots.has(selectedSpot.id)}
          onHeartToggle={() => selectedSpot && handleHeartToggle(selectedSpot.id)}
        />
      )}

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}
