import { Search, SlidersHorizontal } from "lucide-react";
import { skillCategories, skillLevels } from "../../data/skillData";

function SkillFilters({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  levelFilter,
  setLevelFilter,
}) {
  return (
    <section className="skill-filters">
      <div className="skill-search">
        <Search size={17} />

        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search skills..."
          aria-label="Search skills"
        />
      </div>

      <div className="skill-filter">
        <SlidersHorizontal size={16} />

        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          aria-label="Filter skills by category"
        >
          {skillCategories.map((category) => (
            <option value={category} key={category}>
              {category === "All" ? "All categories" : category}
            </option>
          ))}
        </select>
      </div>

      <div className="skill-filter">
        <select
          value={levelFilter}
          onChange={(event) => setLevelFilter(event.target.value)}
          aria-label="Filter skills by proficiency"
        >
          {skillLevels.map((level) => (
            <option value={level} key={level}>
              {level === "All" ? "All levels" : level}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

export default SkillFilters;
