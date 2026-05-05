import qrtg from "../../../assets/tg-qr.jpg";

export default function BuyModal({ setIsModalOpen }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className="bg-[#101217] border border-gray-800 rounded-2xl p-6 w-full max-w-sm relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Закрыть */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl transition"
          onClick={() => setIsModalOpen(false)}
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center text-white">
          Связаться с продавцом
        </h2>

        <p className="text-center my-2">
          <a
            href="https://discord.gg/CDGEn6ERNb"
            className="text-blue-400 hover:text-blue-500 underline transition"
          >
            Discord
          </a>
        </p>

        <p className="text-green-500 text-center mb-4">
          Telegram: <span className="font-semibold">@caseapiaa</span>
        </p>

        <div className="flex justify-center">
          <img
            src={qrtg}
            alt="Telegram QR"
            className="w-48 h-48 rounded-2xl border border-gray-700"
          />
        </div>
      </div>
    </div>
  );
}
