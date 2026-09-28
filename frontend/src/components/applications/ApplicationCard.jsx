import {
  Building2,
  CalendarDays,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";

function ApplicationCard({ application, onEdit, onDelete }) {
  return (
    <article className="application-card">
      <div className="application-company-icon">
        <Building2 size={19} />
      </div>

      <div className="application-main">
        <div className="application-title-row">
          <div>
            <h3>{application.company}</h3>
            <p>{application.role}</p>
          </div>

          <span
            className={`status-badge status-${application.status.toLowerCase()}`}
          >
            {application.status}
          </span>
        </div>

        <div className="application-meta">
          <span>
            <MapPin size={14} />
            {application.location}
          </span>

          <span>
            <CalendarDays size={14} />
            {application.dateApplied}
          </span>

          <span>{application.type}</span>

          <span>{application.salary}</span>
        </div>
      </div>

      <div className="application-actions">
        <button type="button" onClick={() => onEdit(application)}>
          <Pencil size={15} />
          Edit
        </button>

        <button type="button" onClick={() => onDelete(application.id)}>
          <Trash2 size={15} />
          Delete
        </button>
      </div>
    </article>
  );
}

export default ApplicationCard;
