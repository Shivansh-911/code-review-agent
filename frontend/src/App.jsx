import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";
import { LoginPage }     from "./pages/LoginPage";
import { RegisterPage }  from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ToastProvider } from "./components/Toast";

const Protected = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/login" replace />;
};

const Public = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  return !token ? children : <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Landing page — login */}
          <Route path="/"          element={<Navigate to="/login" replace />} />
          <Route path="/login"     element={<Public><LoginPage /></Public>} />
          <Route path="/register"  element={<Public><RegisterPage /></Public>} />
          <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
          {/* Any unknown route → login */}
          <Route path="*"          element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}