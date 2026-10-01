import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import SkillLevelBadge from "./SkillLevelBadge";

function SkillCard({ skill, onEdit, onDelete }) {
  return (
    <article className="skill-card">
      <div className="skill-card-top">
        <div>
          <span className="skill-category">{skill.category}</span>
          <h3>{skill.name}</h3>
        </div>

        <SkillLevelBadge level={skill.level} />
      </div>

      <div className="skill-progress-header">
        <span>Current progress</span>
        <strong>{skill.progress}%</strong>
      </div>

      <div className="progress-track skill-progress-track">
        <div
          className="progress-fill"
          style={{ width: `${skill.progress}%` }}
        />
      </div>

      <div className="skill-target">
        <span>Target: {skill.target}%</span>

        <span>
          <CalendarDays size={13} />
          Updated {skill.lastUpdated}
        </span>
      </div>

      <div className="skill-card-actions">
        <button type="button" onClick={() => onEdit(skill)}>
          <Pencil size={14} />
          Edit
        </button>

        <button type="button" onClick={() => onDelete(skill.id)}>
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </article>
  );
}

export default SkillCard;
