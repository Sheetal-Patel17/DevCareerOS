import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Applications from "./pages/Applications";
import "./index.css";
import "./styles/dashboard.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
