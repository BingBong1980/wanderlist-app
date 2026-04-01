"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Heart, Navigation } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #87CEEB 0%, #B8DCF0 40%, #F5F0E8 100%)" }}>
      {/* Cloud + Logo Header */}
      <div className="cloud-container relative pt-12 pb-8 px-6 text-center">
        {/* Clouds */}
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="cloud cloud-3" />

        {/* Logo */}
        <div className="relative z-10 flex justify-center mb-2">
          <img
            src="/logo.png"
            alt="Wanderlist"
            className="w-48 h-auto drop-shadow-lg"
          />
        </div>
        <p className="text-white/90 text-sm font-medium drop-shadow">
          Your Curated Travel Map
        </p>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-8">
        {/* Hero Card */}
        <div className="spot-card p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Discover Real Places Worth Visiting
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-4">
            Hundreds of personally curated spots across the US — restaurants, hidden gems, parks, nightlife, and more. No algorithms. Just real recommendations.
          </p>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#F97316" }}>
                <MapPin size={14} className="text-white" />
              </div>
              <span className="text-sm text-gray-700">500+ curated spots across the US</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#F97316" }}>
                <Star size={14} className="text-white" />
              </div>
              <span className="text-sm text-gray-700">6 categories — food, outdoors, nightlife & more</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#F97316" }}>
                <Heart size={14} className="text-white" />
              </div>
              <span className="text-sm text-gray-700">Save spots to your personal lists</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#F97316" }}>
                <Navigation size={14} className="text-white" />
              </div>
              <span className="text-sm text-gray-700">One tap to navigate with Google Maps</span>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="mb-2">
              <span className="text-3xl font-bold text-gray-800">$4.99</span>
              <span className="text-gray-500 text-sm ml-2">one-time · lifetime access</span>
            </div>
            <p className="text-xs text-gray-400 mb-4">🚀 Introductory price — will increase as we grow</p>
            <button
              className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg, #F97316, #EA580C)" }}
              onClick={() => alert("Stripe coming soon! Check back shortly.")}
            >
              Get Access — $4.99
            </button>
            <Link href="/auth/login" className="block mt-3 text-sm text-gray-500 underline">
              Already have access? Sign in
            </Link>
          </div>
        </div>

        {/* Category Preview */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-700 mb-3">Explore by Category</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { emoji: "🍽️", label: "Food", color: "#1A237E" },
              { emoji: "🍸", label: "Drinks & Nightlife", color: "#C2185B" },
              { emoji: "🌲", label: "Outdoors", color: "#097138" },
              { emoji: "🐾", label: "Furry Friends", color: "#F57C00" },
              { emoji: "🎡", label: "Entertainment", color: "#0288D1" },
              { emoji: "🔮", label: "Weird & Wonderful", color: "#9C27B0" },
            ].map((cat) => (
              <div
                key={cat.label}
                className="spot-card p-3 text-center"
                style={{ borderTop: `3px solid ${cat.color}` }}
              >
                <div className="text-2xl mb-1">{cat.emoji}</div>
                <div className="text-xs font-medium text-gray-600 leading-tight">{cat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 pb-4">
          <p>wanderlist.to · Made with ❤️ for travelers</p>
        </div>
      </div>
    </div>
  );
}
