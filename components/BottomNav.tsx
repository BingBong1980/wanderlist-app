"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Heart, Compass, User } from "lucide-react";

const navItems = [
  { href: "/map", icon: Home, label: "Home" },
  { href: "/map/explore", icon: Compass, label: "Explore" },
  { href: "/map", icon: Map, label: "Map", main: true },
  { href: "/map/saved", icon: Heart, label: "Saved" },
  { href: "/map/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.main) {
            return (
              <Link key={item.label} href={item.href} className="flex flex-col items-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg -mt-4"
                  style={{ background: "linear-gradient(135deg, #F97316, #EA580C)" }}
                >
                  <Icon size={20} className="text-white" />
                </div>
                <span className="text-xs mt-1 text-gray-500">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link key={item.label} href={item.href} className="flex flex-col items-center px-3 py-1">
              <Icon
                size={20}
                className={isActive ? "text-orange-500" : "text-gray-400"}
              />
              <span className={`text-xs mt-1 ${isActive ? "text-orange-500 font-medium" : "text-gray-400"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
