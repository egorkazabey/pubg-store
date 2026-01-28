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

export default function Admin({accounts, setAccounts}) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [imagesText, setImagesText] = useState("");
  const [isTop, setIsTop] = useState(false);

  const accountsRef = collection(db, "accounts");

  // загрузка аккаунтов
  const loadAccounts = async () => {
    const snap = await getDocs(accountsRef);
    setAccounts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  // добавление
  const addAccount = async () => {
    if (!title || !price) return alert("Заполни поля");

    const images = imagesText
      .split("\n")
      .map(i => i.trim())
      .filter(Boolean);

    await addDoc(accountsRef, {
      title,
      price: Number(price),
      images,
      isTop,
      createdAt: serverTimestamp()
    });

    setTitle("");
    setPrice("");
    setImagesText("");
    setIsTop(false);

    loadAccounts();
  };

  // удаление
  const removeAccount = async (id) => {
    if (!confirm("Удалить аккаунт?")) return;
    await deleteDoc(doc(db, "accounts", id));
    loadAccounts();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Админка</h1>

      {/* ФОРМА */}
      <div className="bg-zinc-900 p-6 rounded-xl mb-10">
        <div className="grid gap-4">
          <input
            className="bg-zinc-800 p-3 rounded-lg"
            placeholder="Название"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <input
            className="bg-zinc-800 p-3 rounded-lg"
            placeholder="Цена"
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />

          <textarea
            className="bg-zinc-800 p-3 rounded-lg min-h-30"
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

          <button
            onClick={addAccount}
            className="bg-green-500 text-black py-3 rounded-lg font-semibold"
          >
            Добавить аккаунт
          </button>
        </div>
      </div>

      {/* СПИСОК */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-zinc-900 p-4 rounded-xl">
            <img
              src={acc.images?.[0]}
              className="rounded-lg mb-3 h-40 w-full object-cover"
              onError={e => e.target.style.display = "none"}
            />

            <h3 className="font-semibold">{acc.title}</h3>
            <p className="text-green-400">{acc.price} ₽</p>

            {acc.isTop && (
              <span className="text-xs text-yellow-400">ТОП</span>
            )}

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
