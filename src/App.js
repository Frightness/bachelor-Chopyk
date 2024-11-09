import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainPage from "./Pages/MainPage/MainPage.js";
import AuthPage from "./Pages/AuthPage/AuthPage.js";
import ProfilePage from "./Pages/ProfilePage/ProfilePage.js";
import PrivateRoute from "./PrivateRoutes.js";

export default function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/auth" element={<AuthPage />} />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}
