import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CareerAssistant from "./components/CareerAssistant";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./Dashboard";
import Applications from "./pages/Applications";
import CareerAnalytics from "./pages/CareerAnalytics";
import DsaTracker from "./pages/DsaTracker";
import GithubActivity from "./pages/GithubActivity";
import Goals from "./pages/Goals";
import Interviews from "./pages/Interviews";
import Login from "./pages/Login";
import ProfileSettings from "./pages/ProfileSettings";
import Projects from "./pages/Projects";
import Register from "./pages/Register";
import ResumeManager from "./pages/ResumeManager";
import Skills from "./pages/Skills";
import "./index.css";
import "./styles/dashboard.css";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("devcareer_token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function SharedCareerLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-area">
        <Topbar />
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CareerAssistant />
      <Routes>
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
        <Route path="/skills" element={<ProtectedRoute><Skills /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/dsa" element={<ProtectedRoute><SharedCareerLayout><DsaTracker /></SharedCareerLayout></ProtectedRoute>} />
        <Route path="/interviews" element={<ProtectedRoute><SharedCareerLayout><Interviews /></SharedCareerLayout></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="/resumes" element={<ProtectedRoute><ResumeManager /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><SharedCareerLayout><CareerAnalytics /></SharedCareerLayout></ProtectedRoute>} />
        <Route path="/github" element={<ProtectedRoute><SharedCareerLayout><GithubActivity /></SharedCareerLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SharedCareerLayout><ProfileSettings /></SharedCareerLayout></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
