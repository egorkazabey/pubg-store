import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (e) {
      setError("Неверный email или пароль");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f16] text-white px-4">
      <div className="bg-[#141a25] p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Вход в админку</h1>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full bg-[#0b0f16] p-3 rounded-lg mb-3 outline-none border border-gray-700 focus:border-blue-500 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          className="w-full bg-[#0b0f16] p-3 rounded-lg mb-5 outline-none border border-gray-700 focus:border-blue-500 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold text-lg transition"
        >
          Войти
        </button>
      </div>
    </div>
  );
}
