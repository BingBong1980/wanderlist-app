"use client";

import { useEffect, useState } from "react";
import { Plus, Heart, MapPin, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { UserList, Spot } from "@/lib/types";
import BottomNav from "@/components/BottomNav";

export default function SavedPage() {
  const [lists, setLists] = useState<UserList[]>([]);
  const [newListName, setNewListName] = useState("");
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("user_lists")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setLists(data as UserList[]);
  };

  const createList = async () => {
    if (!newListName.trim()) return;
    setCreating(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("user_lists").insert({
      user_id: user.id,
      name: newListName.trim(),
    });

    if (!error) {
      setNewListName("");
      setShowCreate(false);
      loadLists();
    }

    setCreating(false);
  };

  const deleteList = async (listId: string) => {
    await supabase.from("list_spots").delete().eq("list_id", listId);
    await supabase.from("user_lists").delete().eq("id", listId);
    loadLists();
  };

  return (
    <div className="flex flex-col h-screen" style={{ background: "linear-gradient(180deg, #87CEEB 0%, #B8DCF0 30%, #F5F0E8 100%)" }}>
      {/* Header */}
      <div className="px-4 pt-10 pb-4">
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="Wanderlist" className="h-8 w-auto drop-shadow" />
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Saved Places</h1>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md"
            style={{ background: "#F97316" }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Create list form */}
      {showCreate && (
        <div className="mx-4 mb-4 spot-card p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">New list name</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="e.g. Florida Road Trip"
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50"
              onKeyDown={(e) => e.key === "Enter" && createList()}
            />
            <button
              onClick={createList}
              disabled={creating || !newListName.trim()}
              className="px-4 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-50"
              style={{ background: "#F97316" }}
            >
              Create
            </button>
          </div>
        </div>
      )}

      {/* Lists */}
      <div className="flex-1 overflow-y-auto px-4 pb-20 space-y-3">
        {lists.length === 0 ? (
          <div className="spot-card p-8 text-center">
            <Heart size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No lists yet</p>
            <p className="text-gray-400 text-xs mt-1">Tap + to create your first list</p>
          </div>
        ) : (
          lists.map((list) => (
            <div key={list.id} className="spot-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{list.name}</h3>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                    <MapPin size={10} />
                    <span>{list.spot_count || 0} spots</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteList(list.id)}
                  className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
