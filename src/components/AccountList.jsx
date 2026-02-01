import { Link } from "react-router-dom";
import cardImg from "../assets/card-img.png";

const AccountList = ({ accounts }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {accounts.map((acc) => (
        <Link key={acc.id} to={`/account/${acc.id}`}>
          <div className="bg-[#141a25] border border-gray-700 rounded-xl hover:scale-[1.03] transition overflow-hidden flex flex-col h-100 shadow-lg">

            {/* Изображение */}
            <div className="h-40 w-full shrink-0 relative">
              <img
                src={acc.images?.[0] || cardImg}
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = cardImg)}
              />
              <div className="absolute top-2 left-2 bg-green-600 text-xs px-2 py-1 rounded">
                Проверено
              </div>
            </div>

            {/* Контент */}
            <div className="p-4 flex flex-col flex-1 text-white">

              {/* Заголовок */}
              <p className="font-semibold text-sm mb-2 line-clamp-2">
                {acc.title}
              </p>

              {/* Бейджи */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Послепродажное обслуживание
                </span>
                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                  Круглосуточная поддержка
                </span>
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                  Пожизненная гарантия
                </span>
              </div>

              <div className="flex-1" />

              {/* Цена */}
              <p className="text-white font-bold text-xl">
                {acc.price} ₽
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default AccountList;
