import type React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import LoginPage from "./pages/Login";
import HomePage from "./pages/HomePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import { UserPage } from "./pages/UserPage";
import { Toaster} from "sonner";

const App: React.FC = () => {
  return (
    <BrowserRouter>
    <Toaster richColors position="top-right" closeButton />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/users" element={<UserPage/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;