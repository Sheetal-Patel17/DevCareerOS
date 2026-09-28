import ProgressCard from "./ProgressCard";

function ProgressSection() {
  return (
    <section className="progress-grid">
      <div className="panel">
        <div className="panel-heading">
          <div>
            <h2>Skill Progress</h2>
            <p>Keep your technical skills moving forward.</p>
          </div>

          <button type="button" className="text-button">
            View all
          </button>
        </div>

        <div className="progress-list">
          <ProgressCard title="Python" value={78} label="Data & AI" />
          <ProgressCard title="React" value={68} label="Frontend" />
          <ProgressCard title="Node.js" value={56} label="Backend" />
        </div>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <div>
            <h2>DSA Progress</h2>
            <p>Track your problem-solving journey.</p>
          </div>

          <button type="button" className="text-button">
            View all
          </button>
        </div>

        <div className="progress-list">
          <ProgressCard title="Arrays" value={100} label="10 / 10 completed" />
          <ProgressCard title="Trees" value={100} label="10 / 10 completed" />
          <ProgressCard title="Graphs" value={30} label="3 / 10 completed" />
        </div>
      </div>
    </section>
  );
}

export default ProgressSection;
