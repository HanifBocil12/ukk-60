"use client";

import { useState, useMemo } from "react";
import { Icon } from "@iconify/react";

// pilih collection (ringan & cukup banyak)
import mdi from "@iconify/json/json/mdi.json";
import tabler from "@iconify/json/json/tabler.json";
import ph from "@iconify/json/json/ph.json";

const collections = {
  mdi,
  tabler,
  ph,
};

export default function IconPicker({ value, onChange }) {
  const [search, setSearch] = useState("");

  const icons = useMemo(() => {
    const result = [];

    Object.keys(collections).forEach((prefix) => {
      const set = collections[prefix];

      Object.keys(set.icons).forEach((name) => {
        result.push(prefix + ":" + name);
      });
    });

    return result;
  }, []);

  const filtered = icons
    .filter((i) => i.includes(search))
    .slice(0, 300); // biar ga berat

  return (
    <div className="space-y-2">
      <input
        placeholder="Search icon..."
        className="border p-2 w-full"
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-8 gap-2 h-64 overflow-auto border p-2">
        {filtered.map((icon) => (
          <button
            key={icon}
            type="button"
            onClick={() => onChange(icon)}
            className={`p-2 rounded hover:bg-gray-200 ${
              value === icon ? "bg-gray-300" : ""
            }`}
          >
            <Icon icon={icon} width="22" />
          </button>
        ))}
      </div>
    </div>
  );
}