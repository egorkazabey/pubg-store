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
    <div className="text-white min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="bg-zinc-900 p-8 rounded-2xl w-90 shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Вход в админку</h1>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full bg-zinc-800 p-3 rounded mb-3 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          className="w-full bg-zinc-800 p-3 rounded mb-5 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={login}
          className="w-full bg-green-500 py-3 rounded-lg font-semibold hover:bg-green-400 transition"
        >
          Войти
        </button>
      </div>
    </div>
  );
}
