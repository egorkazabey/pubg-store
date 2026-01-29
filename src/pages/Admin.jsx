import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";
import { FILTER_GROUPS } from "../filters";

export default function Admin() {
  const [accounts, setAccounts] = useState([]);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [imagesText, setImagesText] = useState("");
  const [isTop, setIsTop] = useState(false);
  const [tags, setTags] = useState([]);

  const accountsRef = collection(db, "accounts");

  // ===== ЗАГРУЗКА =====
  const loadAccounts = async () => {
    const snap = await getDocs(accountsRef);
    setAccounts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  // ===== TAGS =====
  const toggleTag = (tag) => {
    setTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // ===== ADD =====
  const addAccount = async () => {
    if (!title || !price) {
      alert("Заполни название и цену");
      return;
    }

    const images = imagesText
      .split("\n")
      .map(i => i.trim())
      .filter(Boolean);

    await addDoc(accountsRef, {
      title,
      price: Number(price),
      images,
      isTop,
      tags,
      createdAt: serverTimestamp()
    });

    setTitle("");
    setPrice("");
    setImagesText("");
    setIsTop(false);
    setTags([]);

    loadAccounts();
  };

  // ===== DELETE =====
  const removeAccount = async (id) => {
    if (!confirm("Удалить аккаунт?")) return;
    await deleteDoc(doc(db, "accounts", id));
    loadAccounts();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Админка</h1>

      {/* ================= FORM ================= */}
      <div className="bg-zinc-900 p-6 rounded-xl mb-10 space-y-6">
        <input
          className="bg-zinc-800 p-3 rounded-lg w-full"
          placeholder="Название"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <input
          className="bg-zinc-800 p-3 rounded-lg w-full"
          placeholder="Цена"
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />

        <textarea
          className="bg-zinc-800 p-3 rounded-lg min-h-[100px] w-full"
          placeholder="Ссылки на картинки (каждая с новой строки)"
          value={imagesText}
          onChange={e => setImagesText(e.target.value)}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isTop}
            onChange={e => setIsTop(e.target.checked)}
          />
          Топ аккаунт
        </label>

        {/* ================= TAGS ================= */}
        <div className="space-y-6">
          <h2 className="font-semibold text-lg">Фильтры / теги</h2>

          {Object.values(FILTER_GROUPS).map(group => (
            <div key={group.label}>
              <p className="mb-2 text-sm text-gray-400">{group.label}</p>

              {/* SIMPLE LIST */}
              {group.list && (
                <TagGrid
                  items={group.list}
                  tags={tags}
                  toggleTag={toggleTag}
                />
              )}

              {/* WEAPONS */}
              {group.weapons &&
                Object.entries(group.weapons).map(([type, items]) => (
                  <div key={type} className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">{type}</p>
                    <TagGrid
                      items={items}
                      tags={tags}
                      toggleTag={toggleTag}
                    />
                  </div>
                ))}
            </div>
          ))}
        </div>

        <button
          onClick={addAccount}
          className="bg-green-500 text-black py-3 rounded-lg font-semibold w-full"
        >
          Добавить аккаунт
        </button>
      </div>

      {/* ================= LIST ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-zinc-900 p-4 rounded-xl">
            <img
              src={acc.images?.[0]}
              className="rounded-lg mb-3 h-40 w-full object-cover"
              onError={e => (e.target.style.display = "none")}
            />

            <h3 className="font-semibold">{acc.title}</h3>
            <p className="text-green-400">{acc.price} ₽</p>

            {acc.isTop && (
              <span className="text-xs text-yellow-400">ТОП</span>
            )}

            <div className="flex flex-wrap gap-1 mt-2">
              {acc.tags?.map(tag => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-zinc-800 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => removeAccount(acc.id)}
              className="mt-3 w-full bg-red-500/20 text-red-400 py-2 rounded-lg"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= TAG GRID ================= */

function TagGrid({ items, tags, toggleTag }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(item => (
        <button
          key={item}
          onClick={() => toggleTag(item)}
          className={`px-3 py-1 rounded border text-xs transition
            ${
              tags.includes(item)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
            }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
