import {
  Award,
  BookOpenCheck,
  Layers3,
  TrendingUp,
} from "lucide-react";

function SkillStats({ skills }) {
  const averageProgress =
    skills.length === 0
      ? 0
      : Math.round(
          skills.reduce((sum, skill) => sum + skill.progress, 0) /
            skills.length
        );

  const advancedSkills = skills.filter(
    (skill) => skill.level === "Advanced"
  ).length;

  const categories = new Set(skills.map((skill) => skill.category)).size;

  const stats = [
    {
      label: "Total Skills",
      value: skills.length,
      icon: Layers3,
    },
    {
      label: "Average Progress",
      value: `${averageProgress}%`,
      icon: TrendingUp,
    },
    {
      label: "Advanced Skills",
      value: advancedSkills,
      icon: Award,
    },
    {
      label: "Categories",
      value: categories,
      icon: BookOpenCheck,
    },
  ];

  return (
    <section className="skill-stats">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article className="skill-stat-card" key={stat.label}>
            <div className="skill-stat-icon">
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

export default SkillStats;
