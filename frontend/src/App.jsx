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
import Raceboard from "@/pages/Raceboard";
import SubmissionFeed from "@/pages/SubmissionFeed";
import Notifications from "@/pages/Notifications";
import NotFound from "@/pages/NotFound";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import Disclaimer from "@/pages/Disclaimer";
import { GlobalFooter } from "@/components/GlobalFooter";
import ScrollToTop from "@/components/ScrollToTop";
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

// Redirects logged-in users away from auth pages (login, signup, etc.)
function GuestRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (user) {
    // If they already have a tribe, go to home. Otherwise go to tribe selection.
    const tribe = localStorage.getItem("gridsports_tribe");
    return <Navigate to={tribe ? "/" : "/tribe"} state={{ from: location.pathname }} replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
          <Route path="/otp" element={<GuestRoute><OTPPage /></GuestRoute>} />
          <Route path="/tribe" element={<ProtectedRoute><TribePage /></ProtectedRoute>} />
          <Route path="/" element={<Home />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/disclaimer" element={<Disclaimer />} />

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

          {/* Catch-all: redirect unknown routes to home (which is protected) */}
          <Route path="/challenge/entries" element={<Navigate to="/challenge/feed" replace />} />
          <Route path="/challenge/feed/:postId" element={<SubmissionFeed />} />
          <Route path="/challenge/feed" element={<ProtectedRoute><SubmissionFeed /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <GlobalFooter />
      </Router>
    </AuthProvider>
  );
}

export default App;
