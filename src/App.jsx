import "./App.css";
import AccountPage from "./components/AccountPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase"; // твой импорт Firebase auth

function App() {
  // Защищённый маршрут
  function PrivateRoute({ children }) {
    const [user, loading] = useAuthState(auth);

    if (loading) return <div>Загрузка...</div>;
    if (!user) return <Navigate to="/login" />;

    return children;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account/:id" element={<AccountPage />} />

        {/* Защищённая админка */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
