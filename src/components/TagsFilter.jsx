import { useState } from "react";
import { FILTER_GROUPS } from "../filters";
import TagButton from "./ui/buttons/TagButton";
export default function TagsFilter({ selectedTags = [], setSelectedTags }) {
  const [showAll, setShowAll] = useState(false);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const groups = Object.values(FILTER_GROUPS);
  const visibleGroups = showAll ? groups : groups.slice(0, 0.5);

  return (
    <div className="space-y-6 mb-6">
      {visibleGroups.map((group) => (
        <div key={group.label}>
          <h3 className="text-white font-semibold mb-3">{group.label}</h3>

          {group.list && (
            <div className="flex flex-wrap gap-2 mb-4">
              {group.list.map((item) => (
                <TagButton
                  key={item}
                  active={selectedTags.includes(item)}
                  onClick={() => toggleTag(item)}
                >
                  {item}
                </TagButton>
              ))}
            </div>
          )}

          {group.weapons &&
            Object.entries(group.weapons).map(([type, items]) => (
              <div key={type} className="mb-4">
                <p className="text-sm text-gray-400 mb-2">{type}</p>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <TagButton
                      key={item}
                      active={selectedTags.includes(item)}
                      onClick={() => toggleTag(item)}
                    >
                      {item}
                    </TagButton>
                  ))}
                </div>
              </div>
            ))}
        </div>
      ))}

      {groups.length > 1 && (
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="px-4 py-2 rounded bg-[#1e2636] text-white hover:bg-blue-600 transition"
        >
          {showAll ? "Скрыть фильтры" : "Показать все фильтры"}
        </button>
      )}
    </div>
  );
}


