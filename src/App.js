import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainPage from "./pages/MainPage/MainPage.js";
import AuthPage from "./pages/AuthPage/AuthPage.js";
import ProfilePage from "./pages/ProfilePage/ProfilePage.js";
import PrivateRoute from "./PrivateRoutes.js";
import SettingsPage from "./pages/SettingsPage/Settings.js";
import RoomsPage from "./pages/RoomsPage/RoomsPage.js";
import ChatPage from "./pages/ChatPage/ChatPage.js";
import RoomPage from "./pages/RoomPage/RoomPage.js";

export default function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<MainPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/room/:roomID" element={<RoomPage />} />
        </Routes>
      </Router>
    </div>
  );
}