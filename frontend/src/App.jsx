import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
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

function SharedCareerLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-area">
        <Topbar />
        <div className="career-route-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function ProtectedLayout() {
  const token = localStorage.getItem("devcareer_token");
  if (!token) return <Navigate to="/login" replace />;
  return <SharedCareerLayout />;
}

function App() {
  return (
    <BrowserRouter>
      <CareerAssistant />
      <Routes>
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/dsa" element={<DsaTracker />} />
          <Route path="/github" element={<GithubActivity />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/analytics" element={<CareerAnalytics />} />
          <Route path="/resumes" element={<ResumeManager />} />
          <Route path="/settings" element={<ProfileSettings />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
