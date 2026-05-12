import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import useAuthStore from "./store/useAuthStore";
import { connectSocket, disconnectSocket } from "./hooks/useSocket";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Logs from "./pages/Logs";
import Alerts from "./pages/Alerts";
import Incidents from "./pages/Incidents";
import AIAnalysis from "./pages/AIAnalysis";
import Rules from "./pages/Rules";
import Settings from "./pages/Settings";

function ProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
}

export default function App() {
  const user = useAuthStore((state) => state.user);
  const loadMe = useAuthStore((state) => state.loadMe);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  useEffect(() => {
    if (user) {
      connectSocket();
      return;
    }

    disconnectSocket();
  }, [user]);

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />

      <Route
        path="/dashboard"
        element={(
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )}
      />

      <Route
        path="/logs"
        element={(
          <ProtectedRoute>
            <Logs />
          </ProtectedRoute>
        )}
      />

      <Route
        path="/alerts"
        element={(
          <ProtectedRoute>
            <Alerts />
          </ProtectedRoute>
        )}
      />

      <Route
        path="/incidents"
        element={(
          <ProtectedRoute>
            <Incidents />
          </ProtectedRoute>
        )}
      />

      <Route
        path="/ai-analysis"
        element={(
          <ProtectedRoute>
            <AIAnalysis />
          </ProtectedRoute>
        )}
      />

      <Route
        path="/rules"
        element={(
          <ProtectedRoute>
            <Rules />
          </ProtectedRoute>
        )}
      />

      <Route
        path="/settings"
        element={(
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        )}
      />

      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}