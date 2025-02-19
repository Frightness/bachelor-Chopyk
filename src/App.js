import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainPage from "./Pages/MainPage/MainPage.js";
import AuthPage from "./Pages/AuthPage/AuthPage.js";
import ProfilePage from "./Pages/ProfilePage/ProfilePage.js";
import PrivateRoute from "./PrivateRoutes.js";
import SettingsPage from "./Pages/SettingsPage/Settings.js";
import RoomsPage from "./Pages/RoomsPage/RoomsPage.js";
import ChatPage from "./Pages/ChatPage/ChatPage.js";
import RoomPage from "./Pages/RoomPage/RoomPage.js";

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