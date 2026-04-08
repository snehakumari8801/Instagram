import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../src/components/Login";
import Register from "./components/Register";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ChatApp from "./components/ChatApp";
import Home from "./components/Home";
import ProfileView from "./components/ProfileView";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<ChatApp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
