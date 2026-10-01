import {
  CheckCircle2,
  Clock3,
  FolderKanban,
  PauseCircle,
} from "lucide-react";

function ProjectStats({ projects }) {
  const total = projects.length;

  const completed = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const inProgress = projects.filter(
    (project) => project.status === "In Progress"
  ).length;

  const onHold = projects.filter(
    (project) => project.status === "On Hold"
  ).length;

  const stats = [
    {
      label: "Total Projects",
      value: total,
      icon: FolderKanban,
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: Clock3,
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
    },
    {
      label: "On Hold",
      value: onHold,
      icon: PauseCircle,
    },
  ];

  return (
    <section className="project-stats">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article className="project-stat-card" key={stat.label}>
            <div className="project-stat-icon">
              <Icon size={18} />
            </div>

            <div>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default ProjectStats;
