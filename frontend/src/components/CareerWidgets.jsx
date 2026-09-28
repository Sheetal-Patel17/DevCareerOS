import { ArrowUpRight, CheckCircle2, Clock3, FolderGit2 } from "lucide-react";

const projects = [
  {
    name: "DevCareerOS",
    stack: "React · Node · MongoDB",
    progress: 35,
  },
  {
    name: "DermaVision AI",
    stack: "Python · YOLO · Streamlit",
    progress: 100,
  },
  {
    name: "LuxeBite",
    stack: "React · Express · MongoDB",
    progress: 72,
  },
];

function ProjectList() {
  return (
    <div className="panel">
      <div className="panel-heading">
        <div>
          <h2>Recent Projects</h2>
          <p>Projects you're actively building.</p>
        </div>

        <button type="button" className="text-button">
          View all
        </button>
      </div>

      <div className="project-list">
        {projects.map((project) => (
          <div className="project-row" key={project.name}>
            <div className="project-icon">
              <FolderGit2 size={17} />
            </div>

            <div className="project-info">
              <strong>{project.name}</strong>
              <span>{project.stack}</span>
            </div>

            <div className="project-progress">
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <span>{project.progress}%</span>
            </div>

            <ArrowUpRight size={16} className="row-arrow" />
          </div>
        ))}
      </div>
    </div>
  );
}

function GoalCard() {
  return (
    <div className="panel">
      <div className="panel-heading">
        <div>
          <h2>Career Goals</h2>
          <p>Stay focused on the next milestones.</p>
        </div>
      </div>

      <div className="goal-list">
        <div className="goal-item completed">
          <CheckCircle2 size={17} />
          <span>Finish portfolio project</span>
        </div>

        <div className="goal-item">
          <Clock3 size={17} />
          <span>Apply to 10 jobs this week</span>
        </div>

        <div className="goal-item">
          <Clock3 size={17} />
          <span>Complete 5 DSA problems</span>
        </div>

        <div className="goal-item">
          <Clock3 size={17} />
          <span>Practice 2 mock interviews</span>
        </div>
      </div>
    </div>
  );
}

export { ProjectList, GoalCard };
