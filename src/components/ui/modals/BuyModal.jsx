import { useState } from "react";
import qrtg from "../../../assets/tg-qr.jpg";

export default function BuyModal({ setIsModalOpen }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className="bg-[#141a25] rounded-2xl p-6 w-full max-w-sm relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 text-2xl"
          onClick={() => setIsModalOpen(false)}
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">
          Связаться с продавцом
        </h2>

        <p className="text-center my-2 underline">
          <a href="https://discord.gg/CDGEn6ERNb">Discord</a>
        </p>
        <p className="text-green-500 text-center mb-2">Telegram: @caseapiaa</p>

        <div className="flex justify-center">
          <img src={qrtg} className="w-48 h-48 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
