import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import cardImg from "../assets/card-img.png";

const AccountPage = () => {
  const { id } = useParams(); // id из URL
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAccount = async () => {
      try {
        const docRef = doc(db, "accounts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAccount({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("Аккаунт не найден");
        }
      } catch (err) {
        console.error("Ошибка загрузки аккаунта:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAccount();
  }, [id]);

  if (loading) return <p className="p-4">Загрузка...</p>;
  if (!account) return <p className="p-4">Аккаунт не найден</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{account.title}</h1>

      {/* Слайдер или галерея изображений */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {account.images?.map((img, idx) => (
          <img
            key={idx}
            src={img || cardImg}
            alt={`${account.title} ${idx + 1}`}
            className="w-full h-64 object-cover rounded-lg"
            onError={(e) => (e.target.src = cardImg)}
          />
        ))}
      </div>

      {/* Цена и ТОП */}
      <p className="text-2xl font-semibold text-red-500 mb-2">
        {account.price} руб
      </p>
      {account.isTop && (
        <span className="text-yellow-400 font-bold text-lg">ТОП</span>
      )}

      {/* Преимущества (как в карточке) */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="bg-red-400 px-2 rounded text-white">Послепродажное обслуживание</div>
        <div className="bg-blue-400 px-2 rounded text-white">Круглосуточная поддержка</div>
        <div className="bg-purple-400 px-2 rounded text-white">Пожизненная гарантия</div>
      </div>

      {/* Дополнительная информация */}
      {account.description && (
        <p className="mt-4 text-gray-700">{account.description}</p>
      )}
    </div>
  );
};

export default AccountPage;
