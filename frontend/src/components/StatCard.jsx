import {
  BriefcaseBusiness,
  FolderKanban,
  Target,
  Trophy,
} from "lucide-react";

const stats = [
  {
    label: "Applications",
    value: "24",
    change: "+4 this week",
    icon: BriefcaseBusiness,
  },
  {
    label: "Interviews",
    value: "6",
    change: "+2 this week",
    icon: Target,
  },
  {
    label: "Projects",
    value: "5",
    change: "2 in progress",
    icon: FolderKanban,
  },
  {
    label: "DSA Solved",
    value: "86",
    change: "+8 this month",
    icon: Trophy,
  },
];

function StatCard() {
  return (
    <section className="stats-grid">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article className="stat-card" key={stat.label}>
            <div className="stat-card-header">
              <span>{stat.label}</span>
              <div className="stat-icon">
                <Icon size={18} />
              </div>
            </div>

            <strong>{stat.value}</strong>
            <p>{stat.change}</p>
          </article>
        );
      })}
    </section>
  );
}

export default StatCard;
