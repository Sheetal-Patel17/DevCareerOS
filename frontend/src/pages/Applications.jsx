import { BriefcaseBusiness } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function Applications() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-area">
        <Topbar />

        <div className="dashboard-content">
          <section className="page-heading">
            <div className="page-heading-with-icon">
              <div className="page-icon">
                <BriefcaseBusiness size={20} />
              </div>

              <div>
                <h1>Job Applications</h1>
                <p>
                  Track every opportunity from application to final outcome.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Applications;
