import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "@/pages/Home";
import WeekendPage from "@/pages/WeekendPage";
import RaceDetails from "@/pages/RaceDetails";
import UploadChallenge from "@/pages/UploadChallenge";
import UploadSuccess from "@/pages/UploadSuccess";
import EditProfile from "@/pages/EditProfile";
import ProfilePage from "@/pages/ProfilePage";

import { GamePage } from "@/pages/GamePage";
import { SignupPage } from "@/pages/SignupPage";
import { LoginPage } from "@/pages/LoginPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { OTPPage } from "@/pages/OTPPage";
import { TribePage } from "@/pages/TribePage";
import ChallengeDetails from "@/pages/ChallengeDetails";
import { ChallengeEntries } from "@/pages/ChallengeEntries";
import Raceboard from "@/pages/Raceboard"; // Import Raceboard
import Tribes from "@/pages/Tribes"; // Import Tribes
import SubmissionFeed from "@/pages/SubmissionFeed";
import Notifications from "@/pages/Notifications"; // Import Notifications
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
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/otp" element={<OTPPage />} />
          <Route path="/tribe" element={<ProtectedRoute><TribePage /></ProtectedRoute>} />
          <Route path="/" element={<Home />} />

          <Route path="/race/:raceId" element={<ProtectedRoute><RaceDetails /></ProtectedRoute>} />
          <Route path="/upload/:challengeId" element={<ProtectedRoute><UploadChallenge /></ProtectedRoute>} />
          <Route path="/upload/success" element={<ProtectedRoute><UploadSuccess /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/game/f1" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
          <Route path="/weekend/:weekendId" element={<ProtectedRoute><WeekendPage /></ProtectedRoute>} />
          <Route path="/challenge-details/:challengeId" element={<ProtectedRoute><ChallengeDetails /></ProtectedRoute>} />
          <Route path="/raceboard" element={<ProtectedRoute><Raceboard /></ProtectedRoute>} />
          <Route path="/tribes" element={<ProtectedRoute><Tribes /></ProtectedRoute>} />

          {/* Catch-all: redirect unknown routes to home (which is protected) */}
          <Route path="/challenge/entries" element={<Navigate to="/challenge/feed" replace />} />
          <Route path="/challenge/feed/:postId" element={<ProtectedRoute><SubmissionFeed /></ProtectedRoute>} />
          <Route path="/challenge/feed" element={<ProtectedRoute><SubmissionFeed /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
