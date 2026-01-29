import { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FILTER_GROUPS } from "../filters";

export default function Admin() {
  const [accounts, setAccounts] = useState([]);
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
    setAccounts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const toggleTag = (tag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const addAccount = async () => {
    if (!title || !price) return alert("Заполни название и цену");

    const images = imagesText.split("\n").map(i => i.trim()).filter(Boolean);

    await addDoc(accountsRef, { 
      title, 
      price: Number(price), 
      images, 
      extraImage, 
      description, 
      isTop, 
      tags, 
      createdAt: serverTimestamp() 
    });

    setTitle(""); 
    setPrice(""); 
    setImagesText(""); 
    setExtraImage(""); 
    setDescription(""); 
    setIsTop(false); 
    setTags([]);
    loadAccounts();
  };

  const removeAccount = async (id) => {
    if (!confirm("Удалить аккаунт?")) return;
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
        <h1 className="text-2xl font-bold">Админка</h1>
        <button 
          onClick={logout} 
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Выйти
        </button>
      </div>

      {/* ===== ФОРМА ===== */}
      <div className="bg-[#141a25] p-6 rounded-2xl max-w-7xl mx-auto mb-10 space-y-6 shadow-lg">
        <input 
          className="bg-[#0b0f16] p-3 rounded-lg w-full border border-gray-700 focus:border-blue-500 outline-none transition" 
          placeholder="Название" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
        />
        <input 
          className="bg-[#0b0f16] p-3 rounded-lg w-full border border-gray-700 focus:border-blue-500 outline-none transition" 
          placeholder="Цена" 
          type="number" 
          value={price} 
          onChange={e => setPrice(e.target.value)} 
        />
        <textarea 
          className="bg-[#0b0f16] p-3 rounded-lg min-h-[100px] w-full border border-gray-700 focus:border-blue-500 outline-none transition" 
          placeholder="Ссылки на картинки (каждая с новой строки)" 
          value={imagesText} 
          onChange={e => setImagesText(e.target.value)} 
        />
        <input
          className="bg-[#0b0f16] p-3 rounded-lg w-full border border-gray-700 focus:border-blue-500 outline-none transition"
          placeholder="Ссылка на дополнительное длинное фото"
          value={extraImage}
          onChange={e => setExtraImage(e.target.value)}
        />
        <textarea
          className="bg-[#0b0f16] p-3 rounded-lg min-h-[80px] w-full border border-gray-700 focus:border-blue-500 outline-none transition"
          placeholder="Описание продукта"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isTop} onChange={e => setIsTop(e.target.checked)} className="accent-blue-500"/>
          Топ аккаунт
        </label>

        {Object.values(FILTER_GROUPS).map(group => (
          <div key={group.label}>
            <p className="mb-2 text-sm text-gray-400">{group.label}</p>
            {group.list && <TagGrid items={group.list} tags={tags} toggleTag={toggleTag} />}
            {group.weapons && Object.entries(group.weapons).map(([type, items]) => (
              <div key={type} className="mb-3">
                <p className="text-xs text-gray-500 mb-1">{type}</p>
                <TagGrid items={items} tags={tags} toggleTag={toggleTag} />
              </div>
            ))}
          </div>
        ))}

        <button 
          onClick={addAccount} 
          className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold w-full transition"
        >
          Добавить аккаунт
        </button>
      </div>

      {/* ===== СПИСОК АККАУНТОВ ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-[#141a25] p-4 rounded-2xl shadow-lg">
            {acc.images?.[0] && (
              <img 
                src={acc.images[0]} 
                className="rounded-lg mb-3 h-40 w-full object-cover" 
                onError={e => (e.target.style.display = "none")} 
              />
            )}
            <h3 className="font-semibold">{acc.title}</h3>
            <p className="text-green-400">{acc.price} ₽</p>
            {acc.isTop && <span className="text-xs text-yellow-400">ТОП</span>}
            {acc.description && (
              <p className="text-sm text-gray-300 mt-2">{acc.description}</p>
            )}
            {acc.extraImage && (
              <img 
                src={acc.extraImage} 
                className="mt-2 rounded-lg h-32 w-full object-cover"
                alt="Extra"
                onError={e => (e.target.style.display = "none")}
              />
            )}
            <div className="flex flex-wrap gap-1 mt-2">
              {acc.tags?.map(tag => <span key={tag} className="text-xs px-2 py-1 bg-[#0b0f16] rounded">{tag}</span>)}
            </div>
            <button 
              onClick={() => removeAccount(acc.id)} 
              className="mt-3 w-full bg-red-500/20 text-red-400 py-2 rounded-lg hover:bg-red-500/40 transition"
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
      {items.map(item => (
        <button 
          key={item} 
          onClick={() => toggleTag(item)} 
          className={`px-3 py-1 rounded border text-xs transition ${tags.includes(item) ? "bg-blue-600 text-white border-blue-600" : "bg-[#0b0f16] border-gray-700 hover:bg-[#1a1f2a]"}`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
