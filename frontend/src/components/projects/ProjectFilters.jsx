import { Search, SlidersHorizontal } from "lucide-react";
import { projectStatuses } from "../../data/projectData";

function ProjectFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) {
  return (
    <section className="project-filters">
      <div className="project-search">
        <Search size={17} />

        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search projects..."
          aria-label="Search projects"
        />
      </div>

      <div className="project-status-filter">
        <SlidersHorizontal size={16} />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter projects by status"
        >
          {projectStatuses.map((status) => (
            <option value={status} key={status}>
              {status === "All" ? "All statuses" : status}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

export default ProjectFilters;
