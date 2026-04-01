"use client";

import { useState } from "react";
import { X, Heart, Navigation, MapPin, Plus } from "lucide-react";
import { Spot, CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_EMOJIS } from "@/lib/types";
import { supabase } from "@/lib/supabase";

interface SpotPopupProps {
  spot: Spot;
  onClose: () => void;
  isHearted: boolean;
  onHeartToggle: () => void;
}

export default function SpotPopup({ spot, onClose, isHearted, onHeartToggle }: SpotPopupProps) {
  const [hearted, setHearted] = useState(isHearted);
  const [heartCount, setHeartCount] = useState(spot.heart_count);
  const [loading, setLoading] = useState(false);

  const categoryColor = CATEGORY_COLORS[spot.category];
  const categoryLabel = CATEGORY_LABELS[spot.category];
  const categoryEmoji = CATEGORY_EMOJIS[spot.category];

  const handleHeart = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (hearted) {
        await supabase.from("hearts").delete().eq("spot_id", spot.id).eq("user_id", user.id);
        await supabase.from("spots").update({ heart_count: heartCount - 1 }).eq("id", spot.id);
        setHeartCount(c => c - 1);
      } else {
        await supabase.from("hearts").insert({ spot_id: spot.id, user_id: user.id });
        await supabase.from("spots").update({ heart_count: heartCount + 1 }).eq("id", spot.id);
        setHeartCount(c => c + 1);
      }

      setHearted(!hearted);
      onHeartToggle();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}&destination_place_id=${encodeURIComponent(spot.name)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Handle bar */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-gray-100">
          <X size={16} className="text-gray-500" />
        </button>

        {/* Category badge */}
        <div className="mb-3">
          <span
            className="category-pill text-xs"
            style={{ background: categoryColor }}
          >
            {categoryEmoji} {categoryLabel}
          </span>
        </div>

        {/* Name */}
        <h2 className="text-xl font-bold text-gray-800 mb-1 pr-8">{spot.name}</h2>

        {/* Location */}
        {(spot.city || spot.state) && (
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
            <MapPin size={12} />
            <span>{[spot.city, spot.state].filter(Boolean).join(", ")}</span>
          </div>
        )}

        {/* Description */}
        {spot.description && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{spot.description}</p>
        )}

        {/* Heart count */}
        <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
          <Heart size={14} className="text-red-400 fill-red-400" />
          <span>{heartCount} {heartCount === 1 ? "person" : "people"} saved this</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {/* Navigate button */}
          <button
            onClick={handleNavigate}
            className="flex-1 py-3 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg, #F97316, #EA580C)" }}
          >
            <Navigation size={16} />
            Take Me There
          </button>

          {/* Heart button */}
          <button
            onClick={handleHeart}
            disabled={loading}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all active:scale-95 ${
              hearted ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
            }`}
          >
            <Heart
              size={18}
              className={hearted ? "text-red-400 fill-red-400" : "text-gray-400"}
            />
          </button>

          {/* Save to list button */}
          <button
            className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-gray-200 bg-white active:scale-95 transition-transform"
          >
            <Plus size={18} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
