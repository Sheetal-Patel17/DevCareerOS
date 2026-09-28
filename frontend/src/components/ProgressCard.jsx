function ProgressCard({ title, value, label }) {
  return (
    <article className="progress-card">
      <div className="section-title-row">
        <div>
          <h3>{title}</h3>
          <p>{label}</p>
        </div>

        <strong>{value}%</strong>
      </div>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${value}%` }} />
      </div>
    </article>
  );
}

export default ProgressCard;
