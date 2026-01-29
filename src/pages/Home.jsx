import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import FiltersBar from "../components/FiltersBar";
import AccountList from "../components/AccountList";
import TagsFilter from "../components/TagsFilter";
import background from "../assets/background1.jpg";

export default function Home() {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rarity, setRarity] = useState("");
  const [weaponType, setWeaponType] = useState("");
  const [sort, setSort] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "accounts"));
      setAccounts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    load();
  }, []);

  // Сброс страницы при изменении фильтров
  useEffect(() => {
    setCurrentPage(1);
  }, [search, minPrice, maxPrice, rarity, weaponType, selectedTags]);

  const filteredAccounts = useMemo(() => {
    let data = [...accounts];

    if (search)
      data = data.filter((a) =>
        a.title.toLowerCase().includes(search.toLowerCase()),
      );

    if (rarity) data = data.filter((a) => a.rarity === rarity);
    if (weaponType) data = data.filter((a) => a.weaponType === weaponType);
    if (minPrice) data = data.filter((a) => a.price >= Number(minPrice));
    if (maxPrice) data = data.filter((a) => a.price <= Number(maxPrice));

    if (selectedTags.length)
      data = data.filter((a) =>
        selectedTags.every((tag) => a.tags?.includes(tag)),
      );

    if (sort === "priceAsc") data.sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") data.sort((a, b) => b.price - a.price);

    return data;
  }, [
    accounts,
    search,
    minPrice,
    maxPrice,
    rarity,
    weaponType,
    sort,
    selectedTags,
  ]);

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

  const currentItems = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const resetFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setRarity("");
    setWeaponType("");
    setSort("");
    setSelectedTags([]);
  };

  const goToPage = (page) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 rounded border ${
            i === currentPage
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-[#141a25] text-gray-300 border-gray-700 hover:bg-[#1e2636]"
          }`}
        >
          {i}
        </button>,
      );
    }

    return (
      <div className="flex flex-wrap gap-2 justify-center mt-6">
        <button
          onClick={() => goToPage(currentPage - 5)}
          className="px-3 py-1 rounded bg-[#141a25] text-gray-300 border border-gray-700 hover:bg-[#1e2636]"
        >
          {"<<"}
        </button>
        <button
          onClick={() => goToPage(currentPage - 1)}
          className="px-3 py-1 rounded bg-[#141a25] text-gray-300 border border-gray-700 hover:bg-[#1e2636]"
        >
          {"<"}
        </button>
        {pages}
        <button
          onClick={() => goToPage(currentPage + 1)}
          className="px-3 py-1 rounded bg-[#141a25] text-gray-300 border border-gray-700 hover:bg-[#1e2636]"
        >
          {">"}
        </button>
        <button
          onClick={() => goToPage(currentPage + 5)}
          className="px-3 py-1 rounded bg-[#141a25] text-gray-300 border border-gray-700 hover:bg-[#1e2636]"
        >
          {">>"}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0f16] text-white">
      <div className="container mx-auto px-4">
        {/* Баннер */}
        <div className="relative">
          <img
            src={background}
            className="w-full  object-cover opacity-80"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f16] to-transparent" />
          <div className="absolute bottom-10 left-10">
            <h1 className="text-4xl font-bold text-white">888 SHOP</h1>
            <p className="text-gray-300 mt-2">
              Проверенные игровые аккаунты с гарантией
            </p>
          </div>
        </div>
        {/* Уведомление */}
        <div className="bg-[#141a25] border border-gray-700 rounded-2xl p-4 my-6 text-sm text-gray-300 shadow-md">
          ⚠ Все аккаунты проверяются вручную. Возврат средств при проблемах.
        </div>

        {/* Фильтры */}
        <div className="bg-[#141a25] p-6 rounded-2xl mb-8 border border-gray-700 shadow-md">
          <h2 className="text-lg mb-3 font-semibold text-white">Фильтры</h2>

          <TagsFilter
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />

          <FiltersBar
            {...{
              search,
              setSearch,
              minPrice,
              setMinPrice,
              maxPrice,
              setMaxPrice,
              rarity,
              setRarity,
              weaponType,
              setWeaponType,
              sort,
              setSort,
              onReset: resetFilters,
            }}
          />
        </div>

        {/* Сетка товаров */}
        <AccountList accounts={currentItems} />

        {/* Пагинация */}
        {renderPagination()}
      </div>
    </div>
  );
}
