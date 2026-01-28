import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import { useState } from "react";
function App() {
  const [accounts, setAccounts] = useState([]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home accounts={accounts} setAccounts={setAccounts}/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin accounts={accounts} setAccounts={setAccounts}/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
