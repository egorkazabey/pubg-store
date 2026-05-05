import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useSearchParams } from "react-router-dom";

import FiltersBar from "../components/FiltersBar";
import TagsFilter from "../components/TagsFilter";
import AccountList from "../components/AccountList";
import background from "../assets/szhato.gif";
import Pagination from "../components/ui/pagination/pagination";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [accounts, setAccounts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // ===== состояния инпутов =====
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "new");
  const [selectedTags, setSelectedTags] = useState(
    searchParams.get("tags")?.split(",").filter(Boolean) || [],
  );

  // ===== активные фильтры =====
  const [activeFilters, setActiveFilters] = useState({
    search,
    minPrice,
    maxPrice,
    sort,
    selectedTags,
  });

  // ===== пагинация =====
  const itemsPerPage = 20;

  // ===== загрузка данных =====
  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "accounts"));
      setAccounts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    load();
  }, []);

  // ===== применяем фильтры из URL при первом входе =====
  useEffect(() => {
    setActiveFilters({
      search,
      minPrice,
      maxPrice,
      sort,
      selectedTags,
    });
    // eslint-disable-next-line
  }, []);

  // ===== сброс страницы при изменении фильтров =====
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters]);

  // ===== кнопка "Поиск" =====
  const handleApplyFilters = () => {
    const params = {};

    if (search) params.search = search;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (sort) params.sort = sort;
    if (selectedTags.length) params.tags = selectedTags.join(",");

    setSearchParams(params);

    setActiveFilters({
      search,
      minPrice,
      maxPrice,
      sort,
      selectedTags,
    });
  };

  // ===== сброс =====
  const resetFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setSort("new");
    setSelectedTags([]);
    setSearchParams({});

    setActiveFilters({
      search: "",
      minPrice: "",
      maxPrice: "",
      sort: "new",
      selectedTags: [],
    });
  };

  // ===== фильтрация + сортировка =====
  const filteredAccounts = useMemo(() => {
    let data = [...accounts];
    const f = activeFilters;

    if (f.search)
      data = data.filter((a) =>
        a.title?.toLowerCase().includes(f.search.toLowerCase()),
      );

    if (f.minPrice) data = data.filter((a) => a.price >= Number(f.minPrice));
    if (f.maxPrice) data = data.filter((a) => a.price <= Number(f.maxPrice));

    if (f.selectedTags.length)
      data = data.filter((a) =>
        f.selectedTags.every((tag) => a.tags?.includes(tag)),
      );

    if (f.sort === "priceAsc") {
      data.sort((a, b) => a.price - b.price);
    }

    if (f.sort === "priceDesc") {
      data.sort((a, b) => b.price - a.price);
    }

    if (f.sort === "new") {
      data.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
    }

    return data;
  }, [accounts, activeFilters]);

  // ===== пагинация =====
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const currentItems = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative">
        <img
          src={background}
          alt=""
          className="w-full object-contain h-auto sm:object-cover sm:h-200 opacity-80"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black to-transparent" />
        <div className="absolute bottom-10 left-10">
          <h1 className="text-4xl font-bold text-white">888 SHOP</h1>
          <p className="text-gray-300 mt-2">Проверенные игровые аккаунты</p>
        </div>
      </div>

      <div className="container max-w-387.5 mx-auto px-4">
        <div className="bg-[#101217] border border-gray-800 rounded-2xl p-4 my-6 text-sm text-gray-300 shadow-md">
          <p>
            Если вы не нашли аккаунт который нужен именно вам — напишите мне в
            личные сообщения discord/telegram
          </p>
        </div>

        <div className="bg-[#101217] border border-gray-800 rounded-2xl p-4 my-6 text-sm text-gray-300 shadow-md">
          <a href="https://discord.gg/CDGEn6ERNb">
            Наш <span className="underline">DISCORD</span> Сервер
          </a>
        </div>

        <div className="bg-[#101217] p-6 rounded-2xl my-8 border border-gray-800">
          <h2 className="text-lg mb-3 font-semibold text-white">Фильтры</h2>

          <TagsFilter
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />

          <FiltersBar
            search={search}
            setSearch={setSearch}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            sort={sort}
            setSort={setSort}
            onReset={resetFilters}
            onSearch={handleApplyFilters}
          />
        </div>

        {filteredAccounts.length === 0 ? (
          <div className="text-center text-gray-400 text-lg my-10">
            Товары не найдены 😕
          </div>
        ) : (
          <AccountList accounts={currentItems} />
        )}

        <Pagination
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}
