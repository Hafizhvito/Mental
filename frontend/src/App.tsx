import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RespondentForm from "./pages/RespondentForm";
import Questionnaire from "./pages/Questionnaire";
import Results from "./pages/Results";
import Dashboard from "./pages/Dashboard";
import ResultRoute from "./routes/ResultsRoutes";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import RespondentRoute from "./routes/RespondentRoute";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        {/* Halaman utama (LandingPage) */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />

        {/* Form responden */}
        <Route path="/form" element={<RespondentForm />} />

        {/* Questionnaire hanya bisa diakses kalau sudah isi form */}
        <Route
          path="/questionnaire"
          element={
            <RespondentRoute>
              <Questionnaire />
            </RespondentRoute>
          }
        />

        {/* Hasil responden */}
        <Route
          path="/results"
          element={
            <ResultRoute>
              <Results />
            </ResultRoute>
          }
        />

        {/* Dashboard dokter → hanya jika login */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
