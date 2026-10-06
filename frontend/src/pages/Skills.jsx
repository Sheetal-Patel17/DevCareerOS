import { Plus, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import SkillStats from "../components/skills/SkillStats";
import SkillFilters from "../components/skills/SkillFilters";
import SkillCard from "../components/skills/SkillCard";
import SkillForm from "../components/skills/SkillForm";
import { getSkills, createSkill, updateSkill, deleteSkill } from "../services/skillService";
import "../styles/skills.css";

function Skills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    getSkills().then((data) => setSkills(data.skills || [])).catch((error) => console.error("Skill loading error:", error));
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  const filteredSkills = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return skills.filter((skill) => {
      const matchesSearch =
        !search || skill.name.toLowerCase().includes(search);

      const matchesCategory =
        categoryFilter === "All" || skill.category === categoryFilter;

      const matchesLevel =
        levelFilter === "All" || skill.level === levelFilter;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [skills, searchTerm, categoryFilter, levelFilter]);

  function handleSave(skill) {
    if (skill.id) {
      updateSkill(skill.id, skill).then((data) => setSkills((current) => current.map((item) => item._id === skill._id ? data.skill : item))).catch((error) => console.error(error));
    } else {
      createSkill(skill).then((data) => setSkills((current) => [data.skill, ...current])).catch((error) => console.error(error));
    }

    setShowForm(false);
    setEditingSkill(null);
  }

  function handleEdit(skill) {
    setEditingSkill(skill);
    setShowForm(true);
  }

  function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmed) {
      return;
    }

    deleteSkill(id).then(() => setSkills((current) => current.filter((skill) => skill._id !== id))).catch((error) => console.error(error));
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingSkill(null);
  }

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-area">
        <Topbar />

        <div className="dashboard-content">
          <section className="skills-header">
            <div className="page-heading">
              <div className="page-heading-with-icon">
                <div className="page-icon">
                  <Sparkles size={20} />
                </div>

                <div>
                  <h1>Skills & Learning</h1>
                  <p>
                    Track the technologies you are learning and improve them
                    consistently.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="primary-button"
              onClick={() => {
                setEditingSkill(null);
                setShowForm(true);
              }}
            >
              <Plus size={17} />
              Add Skill
            </button>
          </section>

          <SkillStats skills={skills} />

          <SkillFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            levelFilter={levelFilter}
            setLevelFilter={setLevelFilter}
          />

          <section className="skills-panel">
            <div className="skills-list-header">
              <div>
                <h2>Your Skills</h2>
                <p>
                  Showing {filteredSkills.length} of {skills.length} skills
                </p>
              </div>
            </div>

            {filteredSkills.length > 0 ? (
              <div className="skills-grid">
                {filteredSkills.map((skill) => (
                  <SkillCard
                    skill={skill}
                    key={skill._id}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-skills">
                <h3>No skills found</h3>
                <p>Try another search or filter.</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {showForm && (
        <SkillForm
          skill={editingSkill}
          onClose={handleCloseForm}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default Skills;
