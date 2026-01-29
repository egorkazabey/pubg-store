import { FILTER_GROUPS } from "../filters";

export default function TagsFilter({ selectedTags = [], setSelectedTags }) {
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="space-y-8">
      {Object.values(FILTER_GROUPS).map((group) => (
        <div key={group.label}>
          <h3 className="font-semibold mb-3">{group.label}</h3>

          {/* 🔹 ПРОСТОЙ СПИСОК */}
          {group.list && (
            <div className="flex flex-wrap gap-2">
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

          {/* 🔹 ОРУЖИЕ */}
          {group.weapons &&
            Object.entries(group.weapons).map(([type, items]) => (
              <div key={type} className="mb-4">
                <p className="text-sm text-gray-500 mb-2">{type}</p>

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
    </div>
  );
}

function TagButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded border text-sm transition
        ${
          active
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white hover:bg-gray-100"
        }`}
    >
      {children}
    </button>
  );
}
