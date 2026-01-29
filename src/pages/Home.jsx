import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import FiltersBar from "../components/FiltersBar";
import AccountList from "../components/AccountList";
import TagsFilter from "../components/TagsFilter";

export default function Home() {
  const [accounts, setAccounts] = useState([]);

  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rarity, setRarity] = useState("");
  const [weaponType, setWeaponType] = useState("");
  const [sort, setSort] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "accounts"));
      setAccounts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    load();
  }, []);

  const filteredAccounts = useMemo(() => {
    let data = [...accounts];

    if (search)
      data = data.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase())
      );

    if (rarity)
      data = data.filter(a => a.rarity === rarity);

    if (weaponType)
      data = data.filter(a => a.weaponType === weaponType);

    if (minPrice)
      data = data.filter(a => a.price >= Number(minPrice));

    if (maxPrice)
      data = data.filter(a => a.price <= Number(maxPrice));

    if (selectedTags.length)
      data = data.filter(a =>
        selectedTags.every(tag => a.tags?.includes(tag))
      );

    if (sort === "priceAsc")
      data.sort((a, b) => a.price - b.price);

    if (sort === "priceDesc")
      data.sort((a, b) => b.price - a.price);

    return data;
  }, [
    accounts,
    search,
    minPrice,
    maxPrice,
    rarity,
    weaponType,
    sort,
    selectedTags
  ]);

  const resetFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setRarity("");
    setWeaponType("");
    setSort("");
    setSelectedTags([]);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <FiltersBar {...{
        search, setSearch,
        minPrice, setMinPrice,
        maxPrice, setMaxPrice,
        rarity, setRarity,
        weaponType, setWeaponType,
        sort, setSort,
        onReset: resetFilters
      }} />

      <TagsFilter
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />

      <AccountList accounts={filteredAccounts} />
    </div>
  );
}
