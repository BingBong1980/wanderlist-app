"use client";

import { Category, CATEGORIES, CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_EMOJIS } from "@/lib/types";

interface CategoryFilterProps {
  selected: Category | null;
  onChange: (category: Category | null) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-2">
      {/* All button */}
      <button
        onClick={() => onChange(null)}
        className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium border transition-all ${
          selected === null
            ? "bg-gray-800 text-white border-gray-800"
            : "bg-white text-gray-600 border-gray-200"
        }`}
      >
        All
      </button>

      {CATEGORIES.map((cat) => {
        const isSelected = selected === cat;
        const color = CATEGORY_COLORS[cat];
        const emoji = CATEGORY_EMOJIS[cat];
        const label = CATEGORY_LABELS[cat];

        return (
          <button
            key={cat}
            onClick={() => onChange(isSelected ? null : cat)}
            className="flex-shrink-0 flex items-center gap-1 px-4 py-2 rounded-full text-xs font-medium border transition-all active:scale-95"
            style={{
              background: isSelected ? color : "white",
              color: isSelected ? "white" : "#4b5563",
              borderColor: isSelected ? color : "#e5e7eb",
            }}
          >
            <span>{emoji}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
