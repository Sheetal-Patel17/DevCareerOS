import { Plus, Sparkles } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/skills.css";

function Skills() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-area">
        <Topbar />

        <div className="dashboard-content">
          <section className="skills-header">
            <div className="page-heading">
              <div className="page-heading-with-icon">
                <div className="page-icon">
                  <Sparkles size={20} />
                </div>

                <div>
                  <h1>Skills & Learning</h1>
                  <p>
                    Track the technologies you are learning and improve them
                    consistently.
                  </p>
                </div>
              </div>
            </div>

            <button type="button" className="primary-button">
              <Plus size={17} />
              Add Skill
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Skills;
