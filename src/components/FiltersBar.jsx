export default function FiltersBar({
  search,
  setSearch,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sort,
  setSort,
  onReset,
  onSearch,
}) {
  return (
    <div className="bg-[#141a25] border border-gray-700 rounded-xl p-5 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <input
          className="bg-[#141a25] border border-gray-600 text-white rounded-lg px-3 py-2 placeholder-gray-400"
          placeholder="Поиск аккаунта"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="number"
          placeholder="Цена от"
          className="bg-[#141a25] border border-gray-600 text-white rounded-lg px-3 py-2 placeholder-gray-400"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Цена до"
          className="bg-[#141a25] border border-gray-600 text-white rounded-lg px-3 py-2 placeholder-gray-400"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <select
          className="bg-[#141a25] border border-gray-600 text-white rounded-lg px-3 py-2"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Без сортировки</option>
          <option value="priceAsc">Цена ↑</option>
          <option value="priceDesc">Цена ↓</option>
          <option value="new">Новые</option>
        </select>

        <button
          onClick={onSearch}
          className="bg-blue-600 hover:bg-blue-700 transition p-3 text-white rounded-lg"
        >
          Поиск
        </button>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-400">
          Используйте фильтры для быстрого поиска
        </span>

        <button
          onClick={onReset}
          className="text-sm text-red-400 hover:text-red-300 transition"
        >
          Сбросить фильтры
        </button>
      </div>
    </div>
  );
}
