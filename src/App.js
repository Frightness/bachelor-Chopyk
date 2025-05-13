import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import MainPage from "./pages/MainPage/MainPage.js";
import AuthPage from "./pages/AuthPage/AuthPage.js";
import ProfilePage from "./pages/ProfilePage/ProfilePage.js";
import PrivateRoute from "./PrivateRoutes.js";
import SettingsPage from "./pages/SettingsPage/Settings.js";
import RoomsPage from "./pages/RoomsPage/RoomsPage.js";
import RoomPage from "./pages/RoomPage/RoomPage.js";

const privateRoutes = [
  { path: "/profile", element: <ProfilePage /> },
  { path: "/settings", element: <SettingsPage /> },
  { path: "/rooms", element: <RoomsPage /> },
  { path: "/room/:roomID", element: <RoomPage /> },
];

export default function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            {privateRoutes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={<PrivateRoute>{element}</PrivateRoute>}
              />
            ))}
            <Route path="/" element={<MainPage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}