export default function FiltersBar({
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
  onReset
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">

        <input
          className="border rounded-lg px-3 py-2"
          placeholder="Поиск"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="border rounded-lg px-3 py-2"
          value={rarity}
          onChange={e => setRarity(e.target.value)}
        >
          <option value="">Все типы</option>
          <option value="progressive">Progressive</option>
          <option value="chroma">Chroma</option>
          <option value="gloves">Перчатки</option>
          <option value="hair">Причёски</option>
          <option value="car">Машины</option>
          <option value="smoke">Дым</option>
        </select>

        <select
          className="border rounded-lg px-3 py-2"
          value={weaponType}
          onChange={e => setWeaponType(e.target.value)}
        >
          <option value="">Все категории</option>
          <option value="AR">AR</option>
          <option value="DMR">DMR</option>
          <option value="SR">SR</option>
          <option value="SMG">SMG</option>
          <option value="LMG">LMG</option>
          <option value="SHOTGUN">Shotgun</option>
          <option value="Melee">Melee</option>
        </select>

        <input
          type="number"
          placeholder="Цена от"
          className="border rounded-lg px-3 py-2"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Цена до"
          className="border rounded-lg px-3 py-2"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
        />

        <select
          className="border rounded-lg px-3 py-2"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          <option value="">Без сортировки</option>
          <option value="priceAsc">Цена ↑</option>
          <option value="priceDesc">Цена ↓</option>
          <option value="new">Новые</option>
        </select>
      </div>

      <button
        onClick={onReset}
        className="mt-4 text-sm text-blue-600"
      >
        Сбросить фильтры
      </button>
    </div>
  );
}
