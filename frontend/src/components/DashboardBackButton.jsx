import { ArrowLeft, House } from "lucide-react";
import { Link } from "react-router-dom";

function DashboardBackButton() {
  return (
    <Link className="dashboard-back-link" to="/" aria-label="Back to Dashboard">
      <ArrowLeft size={16} />
      <House size={16} />
      <span>Back to Dashboard</span>
    </Link>
  );
}

export default DashboardBackButton;
