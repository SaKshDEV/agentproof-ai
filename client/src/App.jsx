import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoutes";
import AgentsPage from "./pages/AgentsPage";
import EvaluationsPage from "./pages/EvaluationsPage";
import DatasetsPage from "./pages/DatasetsPage";
import DatasetDetailPage from "./pages/DatasetDetailPage";

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/agents"
        element={
          <ProtectedRoute>
            <AgentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/evaluations"
        element={
          <ProtectedRoute>
            <EvaluationsPage />
          </ProtectedRoute>
        }

      />
      <Route
        path="/datasets"
        element={
          <ProtectedRoute>
            <DatasetsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/datasets/:id"
        element={
          <ProtectedRoute>
            <DatasetDetailPage />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}
export default App;