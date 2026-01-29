import { Link } from "react-router-dom";
import cardImg from "../assets/card-img.png";

const AccountList = ({ accounts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {accounts.map(acc => (
        <Link key={acc.id} to={`/account/${acc.id}`}>
          <div className="bg-white rounded-xl shadow hover:scale-[1.02] transition overflow-hidden">

            <div className="h-40">
              <img
                src={acc.images?.[0] || cardImg}
                className="w-full h-full object-cover"
                onError={e => e.currentTarget.src = cardImg}
              />
            </div>

            <div className="p-4">
              <p className="font-semibold mb-2">{acc.title}</p>
              <p className="text-red-500 font-bold">{acc.price} ₽</p>

              {acc.isTop && (
                <span className="text-xs text-yellow-500 font-semibold">
                  ТОП
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default AccountList;
