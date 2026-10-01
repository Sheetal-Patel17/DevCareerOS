import {
  ExternalLink,
  GitBranch,
  Pencil,
  Trash2,
} from "lucide-react";
import TechnologyTags from "./TechnologyTags";

function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <article className="project-card">
      <div className="project-card-header">
        <div className="project-card-icon">
          <GitBranch size={19} />
        </div>

        <span
          className={`project-status project-status-${project.status
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          {project.status}
        </span>
      </div>

      <div className="project-card-body">
        <h3>{project.name}</h3>

        <p>{project.description}</p>

        <TechnologyTags technologies={project.technologies} />

        <div className="project-progress-heading">
          <span>Project progress</span>
          <strong>{project.progress}%</strong>
        </div>

        <div className="progress-track project-progress-track">
          <div
            className="progress-fill"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="project-card-links">
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            <GitBranch size={14} />
            GitHub
          </a>
        ) : (
          <span className="disabled-link">
            <GitBranch size={14} />
            GitHub
          </span>
        )}

        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={14} />
            Live Demo
          </a>
        ) : (
          <span className="disabled-link">
            <ExternalLink size={14} />
            Live Demo
          </span>
        )}
      </div>

      <div className="project-card-actions">
        <button type="button" onClick={() => onEdit(project)}>
          <Pencil size={14} />
          Edit
        </button>

        <button type="button" onClick={() => onDelete(project.id)}>
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </article>
  );
}

export default ProjectCard;
