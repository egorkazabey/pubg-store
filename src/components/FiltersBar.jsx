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
    <div className="bg-[#101217] border border-gray-800 rounded-xl p-5 mb-6 flex flex-col gap-4 items-start">
      {/* Поиск */}
      <input
        className="bg-[#101217] border border-gray-700 text-white rounded-lg px-3 py-2 placeholder-gray-400 w-full max-w-xs"
        placeholder="Поиск аккаунта"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Ценовой диапазон */}
      <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
        <span className="text-sm text-gray-300">Ценовой диапазон:</span>
        <div className="flex gap-2 w-full flex-wrap">
          <input
            type="number"
            placeholder="Цена от"
            className="flex-1 min-w-0 bg-[#101217] border border-gray-700 text-white rounded-lg px-3 py-2 placeholder-gray-400"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="text-gray-400 flex items-center">-</span>
          <input
            type="number"
            placeholder="Цена до"
            className="flex-1 min-w-0 bg-[#101217] border border-gray-700 text-white rounded-lg px-3 py-2 placeholder-gray-400"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Нижняя строка: селект, поиск и сброс */}
      <div className="flex flex-wrap gap-3 items-center w-full max-w-xs">
        <select
          className="bg-[#101217] border border-gray-700 text-white rounded-lg px-3 py-2 flex-1 min-w-[120px]"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="new">Новые</option>
          <option value="priceAsc">Цена ↑</option>
          <option value="priceDesc">Цена ↓</option>
        </select>

        <button
          onClick={onSearch}
          className="bg-blue-600 hover:bg-blue-700 transition p-2 text-white rounded-lg flex-1 min-w-[80px]"
        >
          Поиск
        </button>

        <button
          onClick={onReset}
          className="bg-red-600 hover:bg-red-700 transition p-2 text-white rounded-lg flex-1 min-w-[80px]"
        >
          Сбросить
        </button>
      </div>
    </div>
  );
}
