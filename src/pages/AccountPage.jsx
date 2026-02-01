import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import cardImg from "../assets/card-img.png";

import BuyModal from "../components/ui/modals/buyModal";

const isYouTubeUrl = (url) =>
  typeof url === "string" &&
  (url.includes("youtube.com") || url.includes("youtu.be"));

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;

  if (url.includes("youtu.be")) {
    const id = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  if (url.includes("watch?v=")) {
    const id = new URL(url).searchParams.get("v");
    return `https://www.youtube.com/embed/${id}`;
  }

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

        if (docSnap.exists()) {
          setAccount({ id: docSnap.id, ...docSnap.data() });
        }
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
      <div className="max-w-6xl mx-auto px-6 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          ← Назад к каталогу
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="w-full h-105 flex items-center justify-center rounded overflow-hidden">
            <img
              src={images[activeImage]}
              className="w-full h-full object-contain cursor-zoom-in"
              alt={`Главное фото ${activeImage + 1}`}
              onClick={() => setPreviewImage(images[activeImage])}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`shrink-0 h-20 w-28 border rounded cursor-pointer overflow-hidden
                ${
                  activeImage === idx
                    ? "border-blue-500"
                    : "border-gray-700 opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`Превью ${idx + 1}`}
                  className="w-full h-full object-contain"
                  onClick={() => {
                    setActiveImage(idx);
                    setPreviewImage(img);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">{account.title}</h1>
          <div className="text-3xl font-bold">₽ {account.price}</div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded text-lg"
            onClick={() => setIsModalOpen(true)}
          >
            Купить
          </button>

          {account.description && (
            <div className="bg-[#141a25] border border-gray-700 rounded p-4 text-sm text-gray-300">
              {account.description}
            </div>
          )}
        </div>
      </div>

      {account.extraImage && (
        <div className="w-full flex justify-center mt-10 px-4">
          {isYouTubeUrl(account.extraImage) ? (
            <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden border border-gray-700">
              <iframe
                src={getYouTubeEmbedUrl(account.extraImage)}
                title="YouTube video"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <img
              src={account.extraImage}
              className="w-full max-w-4xl object-contain rounded-xl"
              alt="Дополнительный контент"
            />
          )}
        </div>
      )}

      {isModalOpen && <BuyModal setIsModalOpen={setIsModalOpen}/>}

      {previewImage && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute -top-4 -right-4 bg-black bg-opacity-70
              text-white w-10 h-10 rounded-full flex items-center justify-center
              text-2xl"
              onClick={() => setPreviewImage(null)}
            >
              &times;
            </button>

            <img
              src={previewImage}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl"
              alt="Увеличенное фото"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
