import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import StatCard from "./components/StatCard";
import ProgressSection from "./components/ProgressSection";
import ApplicationTable from "./components/ApplicationTable";
import { GoalCard, ProjectList } from "./components/CareerWidgets";

function Dashboard() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-area">
        <Topbar />

        <div className="dashboard-content">
          <section className="page-heading">
            <h1>Good morning, Sheetal ??</h1>
            <p>
              Here's an overview of your career progress and current priorities.
            </p>
          </section>

          <StatCard />

          <ProgressSection />

          <ApplicationTable />

          <section className="dashboard-widgets">
            <ProjectList />
            <GoalCard />
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
