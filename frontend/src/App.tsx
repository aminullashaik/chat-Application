//Test changes by second dev
//Change made bu dev B

import type React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/signup";
import LoginPage from "./pages/login";
import HomePage from "./pages/homePage";
import { UserPage } from "./pages/user.page";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/users" element={<UserPage/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;