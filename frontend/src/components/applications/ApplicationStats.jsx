import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

function ApplicationStats({ applications }) {
  const total = applications.length;
  const active = applications.filter(
    (application) =>
      application.status !== "Rejected" &&
      application.status !== "Offer"
  ).length;
  const interviews = applications.filter(
    (application) => application.status === "Interview"
  ).length;
  const rejected = applications.filter(
    (application) => application.status === "Rejected"
  ).length;

  const stats = [
    {
      label: "Total Applications",
      value: total,
      icon: BriefcaseBusiness,
    },
    {
      label: "Active",
      value: active,
      icon: Clock3,
    },
    {
      label: "Interviews",
      value: interviews,
      icon: CheckCircle2,
    },
    {
      label: "Rejected",
      value: rejected,
      icon: XCircle,
    },
  ];

  return (
    <section className="application-stats">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article className="application-stat-card" key={stat.label}>
            <div className="application-stat-icon">
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

export default ApplicationStats;
