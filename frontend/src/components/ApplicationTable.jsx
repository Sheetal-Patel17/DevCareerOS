const applications = [
  {
    company: "TechNova",
    role: "Software Developer Intern",
    date: "Sep 24, 2026",
    status: "Interview",
  },
  {
    company: "DataSphere",
    role: "Junior Data Engineer",
    date: "Sep 22, 2026",
    status: "Applied",
  },
  {
    company: "CloudPeak",
    role: "Backend Developer",
    date: "Sep 20, 2026",
    status: "Shortlisted",
  },
  {
    company: "Innovexa",
    role: "AI/ML Intern",
    date: "Sep 18, 2026",
    status: "Applied",
  },
];

function ApplicationTable() {
  return (
    <section className="panel applications-panel">
      <div className="panel-heading">
        <div>
          <h2>Recent Applications</h2>
          <p>Your latest job application activity.</p>
        </div>

        <button type="button" className="text-button">
          View all
        </button>
      </div>

      <div className="table-wrapper">
        <table className="application-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((application) => (
              <tr key={`${application.company}-${application.role}`}>
                <td>{application.company}</td>
                <td>{application.role}</td>
                <td>{application.date}</td>
                <td>
                  <span
                    className={`status-badge status-${application.status
                      .toLowerCase()
                      .replace("/", "-")}`}
                  >
                    {application.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ApplicationTable;
