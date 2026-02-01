import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FILTER_GROUPS } from "../filters";

export default function Admin() {
  const [accounts, setAccounts] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [imagesText, setImagesText] = useState("");
  const [extraImage, setExtraImage] = useState("");
  const [description, setDescription] = useState("");
  const [isTop, setIsTop] = useState(false);
  const [tags, setTags] = useState([]);

  const navigate = useNavigate();
  const accountsRef = collection(db, "accounts");

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    const snap = await getDocs(accountsRef);
    setAccounts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setPrice("");
    setImagesText("");
    setExtraImage("");
    setDescription("");
    setIsTop(false);
    setTags([]);
  };

  const saveAccount = async () => {
    if (!title || !price) return alert("Заполни название и цену");

    const images = imagesText
      .split("\n")
      .map((i) => i.trim())
      .filter(Boolean);

    if (editingId) {
      await updateDoc(doc(db, "accounts", editingId), {
        title,
        price: Number(price),
        images,
        extraImage,
        description,
        isTop,
        tags,
      });
    } else {
      await addDoc(accountsRef, {
        title,
        price: Number(price),
        images,
        extraImage,
        description,
        isTop,
        tags,
        createdAt: serverTimestamp(),
      });
    }

    resetForm();
    loadAccounts();
  };

  const editAccount = (acc) => {
    setEditingId(acc.id);
    setTitle(acc.title || "");
    setPrice(acc.price || "");
    setImagesText((acc.images || []).join("\n"));
    setExtraImage(acc.extraImage || "");
    setDescription(acc.description || "");
    setTags(acc.tags || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeAccount = async (id) => {
    if (!confirm("Удалить товар?")) return;
    await deleteDoc(doc(db, "accounts", id));
    loadAccounts();
  };

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0b0f16] text-white p-8">
      <div className="flex justify-between items-center mb-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">
          {editingId ? "Редактирование товара" : "Админка"}
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
        >
          Выйти
        </button>
      </div>

      {/* ===== ФОРМА ===== */}
      <div className="bg-[#141a25] p-6 rounded-2xl max-w-7xl mx-auto mb-10 space-y-6">
        <input
          className="bg-[#0b0f16] p-3 rounded-lg w-full border border-gray-700"
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="bg-[#0b0f16] p-3 rounded-lg w-full border border-gray-700"
          placeholder="Цена"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <textarea
          className="bg-[#0b0f16] p-3 rounded-lg w-full min-h-24 border border-gray-700"
          placeholder="Ссылки на картинки (каждая с новой строки)"
          value={imagesText}
          onChange={(e) => setImagesText(e.target.value)}
        />

        <input
          className="bg-[#0b0f16] p-3 rounded-lg w-full border border-gray-700"
          placeholder="Дополнительное длинное фото"
          value={extraImage}
          onChange={(e) => setExtraImage(e.target.value)}
        />

        <textarea
          className="bg-[#0b0f16] p-3 rounded-lg w-full min-h-20 border border-gray-700"
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isTop}
            onChange={(e) => setIsTop(e.target.checked)}
          />
          Топ товар
        </label>

        {Object.values(FILTER_GROUPS).map((group) => (
          <div key={group.label}>
            <p className="text-sm text-gray-400 mb-2">{group.label}</p>

            {group.list && (
              <TagGrid items={group.list} tags={tags} toggleTag={toggleTag} />
            )}

            {group.weapons &&
              Object.entries(group.weapons).map(([type, items]) => (
                <div key={type} className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">{type}</p>
                  <TagGrid items={items} tags={tags} toggleTag={toggleTag} />
                </div>
              ))}
          </div>
        ))}

        <div className="flex gap-3">
          <button
            onClick={saveAccount}
            className={`flex-1 py-3 rounded-lg font-semibold ${
              editingId
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {editingId ? "Сохранить изменения" : "Добавить товар"}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              className="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-700"
            >
              Отмена
            </button>
          )}
        </div>
      </div>

      {/* ===== СПИСОК ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {accounts.map((acc) => (
          <div key={acc.id} className="bg-[#141a25] p-4 rounded-2xl">
            {acc.images?.[0] && (
              <img
                src={acc.images[0]}
                className="rounded-lg mb-3 h-40 w-full object-cover"
              />
            )}

            <h3 className="font-semibold">{acc.title}</h3>
            <p className="text-green-400">{acc.price} ₽</p>

            <div className="flex flex-wrap gap-1 mt-2">
              {acc.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-[#0b0f16] rounded"
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => editAccount(acc)}
              className="mt-3 w-full bg-blue-500/20 text-blue-400 py-2 rounded-lg"
            >
              Редактировать
            </button>

            <button
              onClick={() => removeAccount(acc.id)}
              className="mt-2 w-full bg-red-500/20 text-red-400 py-2 rounded-lg"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TagGrid({ items, tags, toggleTag }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => toggleTag(item)}
          className={`px-3 py-1 rounded border text-xs ${
            tags.includes(item)
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-[#0b0f16] border-gray-700"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
