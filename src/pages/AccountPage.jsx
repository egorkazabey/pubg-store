import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import cardImg from "../assets/card-img.png";

import BuyModal from "../components/ui/modals/buyModal";
import ProductTags from "../components/ProductTags";

const isYouTubeUrl = (url) =>
  typeof url === "string" &&
  (url.includes("youtube.com") || url.includes("youtu.be"));

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  if (url.includes("youtu.be"))
    return `https://www.youtube.com/embed/${url.split("youtu.be/")[1].split("?")[0]}`;
  if (url.includes("watch?v="))
    return `https://www.youtube.com/embed/${new URL(url).searchParams.get("v")}`;
  return null;
};

const AccountPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadAccount = async () => {
      try {
        const docRef = doc(db, "accounts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setAccount({ id: docSnap.id, ...docSnap.data() });
      } finally {
        setLoading(false);
      }
    };
    loadAccount();
  }, [id]);

  if (loading) return <div className="p-6 text-white">Загрузка...</div>;
  if (!account) return <div className="p-6 text-white">Не найдено</div>;

  const images = account.images?.length ? account.images : [cardImg];

  return (
    <div className="min-h-screen bg-[#0b0f16] text-white">
      {/* Назад */}
      <div className="max-w-6xl mx-auto px-6 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          ← Назад к каталогу
        </button>
      </div>

      {/* Основной блок */}
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Галерея */}
        <div className="space-y-4">
          <div className="w-full h-[420px] flex items-center justify-center rounded-xl overflow-hidden border border-gray-800 bg-[#101217]">
            <img
              src={images[activeImage]}
              className="w-full h-full object-contain cursor-zoom-in"
              onClick={() => setPreviewImage(images[activeImage])}
              alt="Основное изображение"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`
                  shrink-0 h-20 w-28 rounded-lg overflow-hidden cursor-pointer
                  border
                  ${
                    activeImage === idx
                      ? "border-blue-500"
                      : "border-gray-700 opacity-70 hover:opacity-100"
                  }
                `}
              >
                <img src={img} className="w-full h-full object-contain" />
              </div>
            ))}
          </div>
        </div>

        {/* Инфо */}
        <div className="space-y-5 bg-[#101217] border border-gray-800 rounded-xl p-6">
          <h1 className="text-2xl font-semibold">{account.title}</h1>

          <div className="text-3xl font-bold text-white">
            ₽ {account.price}
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-lg transition"
            onClick={() => setIsModalOpen(true)}
          >
            Купить
          </button>

          {account.tags && <ProductTags tags={account.tags} />}
        </div>
      </div>

      {/* Видео / доп. контент */}
      {account.extraImage && (
        <div className="w-full flex justify-center mt-10 px-4">
          {isYouTubeUrl(account.extraImage) ? (
            <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden border border-gray-800">
              <iframe
                src={getYouTubeEmbedUrl(account.extraImage)}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          ) : (
            <img
              src={account.extraImage}
              className="w-full max-w-4xl object-contain rounded-xl border border-gray-800"
              alt="Дополнительный контент"
            />
          )}
        </div>
      )}

      {isModalOpen && <BuyModal setIsModalOpen={setIsModalOpen} />}

      {/* Просмотр изображения */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl"
            alt="Превью"
          />
        </div>
      )}
    </div>
  );
};

export default AccountPage;
