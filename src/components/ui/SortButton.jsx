import { useState } from "react";

const SortButton = ({ value, children }) => {


  const [sort, setSort] = useState("default");
  const [accounts, setAccounts] = useState([]);

  return (
    <button
      onClick={() => setSort(value)}
      className={`px-4 py-2 rounded-lg text-sm
        ${
          sort === value
            ? "bg-green-500 text-black"
            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
        }
      `}
    >
      {children}
    </button>
  );
};

export default SortButton;
