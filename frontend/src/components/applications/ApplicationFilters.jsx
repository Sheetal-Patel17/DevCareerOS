import { Search, SlidersHorizontal } from "lucide-react";
import { applicationStatuses } from "../../data/applicationData";

function ApplicationFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) {
  return (
    <section className="application-filters">
      <div className="application-search">
        <Search size={17} />

        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search company or role..."
          aria-label="Search applications"
        />
      </div>

      <div className="application-status-filter">
        <SlidersHorizontal size={16} />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter applications by status"
        >
          {applicationStatuses.map((status) => (
            <option value={status} key={status}>
              {status === "All" ? "All statuses" : status}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

export default ApplicationFilters;
