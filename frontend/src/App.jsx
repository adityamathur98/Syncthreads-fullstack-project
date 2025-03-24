import { Routes, Route } from "react-router-dom";

import Signup from "./components/Signup";
import LoginForm from "./components/LoginForm";
import NotFound from "./components/NotFound";
import Dashboard from "./components/Dashboard";
import MapComponent from "./components/MapComponent";

import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";

import Cookies from "js-cookie";

function App() {
  const token = Cookies.get("token");

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={token ? "/api/dashboard" : "/api/login"} />}
      />
      <Route path="/api/register" element={<Signup />} />
      <Route path="/api/login" element={<LoginForm />} />
      <Route
        path="/api/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/api/map"
        element={
          <ProtectedRoute>
            <MapComponent />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
