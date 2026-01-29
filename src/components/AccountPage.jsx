import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import cardImg from "../assets/card-img.png";
import qrtg from '../assets/tg-qr.jpg'
const AccountPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
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

      {/* Кнопка назад */}
      <div className="max-w-6xl mx-auto px-6 pt-4">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          ← Назад к каталогу
        </button>
      </div>

      {/* Основной блок с галереей и инфо */}
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Левая колонка: Галерея */}
        <div className="space-y-4">
          {/* Главное фото */}
          <div className="w-full h-[420px] flex items-center justify-center border border-gray-700 rounded overflow-hidden">
            <img
              src={images[activeImage]}
              className="w-full h-full object-contain"
              alt={`Главное фото ${activeImage + 1}`}
            />
          </div>

          {/* Превью */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`flex-shrink-0 h-20 w-28 border rounded cursor-pointer overflow-hidden
                  ${activeImage === idx ? "border-blue-500" : "border-gray-700 opacity-70 hover:opacity-100"}`}
                onClick={() => setActiveImage(idx)}
              >
                <img
                  src={img}
                  alt={`Превью ${idx + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Правая колонка: Информация */}
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold leading-snug">{account.title}</h1>

          <div className="text-3xl text-white font-bold">₽ {account.price}</div>

          {/* Кнопка Купить */}
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded text-lg transition"
            onClick={() => setIsModalOpen(true)}
          >
            Купить
          </button>



          {/* Описание продукта */}
          {account.description && (
            <div className="bg-[#141a25] border border-gray-700 rounded p-4 text-sm text-gray-300 leading-relaxed">
              {account.description}
            </div>
          )}
        </div>
      </div>

      {/* Длинное фото под обе колонки, центрированное и не растягивается на всю ширину экрана */}
      {account.extraImage && (
        <div className="w-full flex justify-center mt-6">
          <img
            src={account.extraImage}
            className="w-full max-w-4xl object-contain"
            style={{ height: 'auto' }}
            alt="Дополнительное фото"
          />
        </div>
      )}

      {/* Модальное окно Купить */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[#141a25] bg-opacity-95 rounded-2xl p-6 w-full max-w-sm relative shadow-2xl pointer-events-auto transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl font-bold"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold mb-4 text-center text-white">
              Связаться с продавцом
            </h2>

            <p className="text-green-500 text-center">
              Продавец находится в сети и с удовольствием ответит на ваши вопросы.
            </p>

            <p className="text-center my-2">Добавить через QR-код Telegram</p>

            <div className="flex justify-center">
              <img
                className="w-48 h-48 rounded-xl"
                src={qrtg}
                alt="QR код"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AccountPage;
