import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "@/pages/Home";
import { GamePage } from "@/pages/GamePage";
import { SignupPage } from "@/pages/SignupPage";
import { LoginPage } from "@/pages/LoginPage";
import { OTPPage } from "@/pages/OTPPage";
import { TribePage } from "@/pages/TribePage";
import { AuthProvider, useAuth } from "@/context/AuthContext";

// Protects routes: must be logged in AND have chosen a tribe
function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  // Not logged in → send to signup, remember where they wanted to go
  if (!user) {
    return <Navigate to="/signup" state={{ from: location.pathname }} replace />;
  }

  // Logged in but no tribe selected → send to tribe page
  const tribe = localStorage.getItem("gridsports_tribe");
  if (!tribe && location.pathname !== "/tribe") {
    return <Navigate to="/tribe" state={{ from: location.pathname }} replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/otp" element={<OTPPage />} />
          <Route path="/tribe" element={<ProtectedRoute><TribePage /></ProtectedRoute>} />
          <Route path="/" element={<Home />} />
          <Route path="/game/f1" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
          {/* Catch-all: redirect unknown routes to home (which is protected) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
