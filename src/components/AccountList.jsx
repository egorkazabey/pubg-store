import { useEffect, useState } from "react";
import cardImg from "../assets/card-img.png";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const accountsRef = collection(db, "accounts");

  const loadAccounts = async () => {
    try {
      const snap = await getDocs(accountsRef);
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAccounts(data);
    } catch (err) {
      console.error("Ошибка загрузки аккаунтов:", err);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4">
      {accounts.map((acc) => (
        <div
          key={acc.id}
          className="account-card w-full bg-white text-white h-full rounded-xl overflow-hidden shadow-lg"
        >
          <div className="background-image h-40 w-full overflow-hidden">
            <img
              src={acc.images?.[0] || cardImg}
              alt={acc.title}
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = cardImg)}
            />
          </div>

          <div className="px-4 py-3 bg-white">
            <p className="title text-black font-semibold mb-2">{acc.title}</p>

            <div className="flex flex-col gap-1 mb-2">
              <div className="bg-red-400 px-2 rounded text-xs text-white">
                Послепродажное обслуживание
              </div>
              <div className="bg-blue-400 px-2 rounded text-xs text-white">
                Круглосуточная поддержка
              </div>
              <div className="bg-purple-400 px-2 rounded text-xs text-white">
                Пожизненная гарантия
              </div>
            </div>

            <p className="price text-red-500 font-bold">{acc.price} руб</p>

            {acc.isTop && (
              <span className="text-xs text-yellow-400 font-semibold">ТОП</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccountList;
