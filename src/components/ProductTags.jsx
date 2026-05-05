import { FILTER_GROUPS } from "../filters";
import TagButton from "./ui/buttons/TagButton";

export default function ProductTags({ tags = [] }) {
  if (!tags.length) return null;

  return (
    <div className="bg-[#101217] border border-gray-800 rounded-xl p-5 space-y-5">
      {Object.values(FILTER_GROUPS).map((group) => {
        const matched = [];

        // list
        if (group.list) {
          matched.push(...group.list.filter((item) => tags.includes(item)));
        }

        // weapons
        if (group.weapons) {
          Object.values(group.weapons).forEach((items) => {
            matched.push(...items.filter((item) => tags.includes(item)));
          });
        }

        if (!matched.length) return null;

        return (
          <div key={group.label}>
            <h3 className="text-sm font-semibold text-gray-300 mb-2">
              {group.label}
            </h3>

            <div className="flex flex-wrap gap-2">
              {matched.map((item) => (
                <TagButton key={item}>
                  {item}
                </TagButton>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
