import React, { useEffect, useState } from "react";
import { getProfile } from "../services/profileService";
import { getGithubActivity } from "../services/githubActivityService";
import "../styles/githubActivity.css";
import DashboardBackButton from "../components/DashboardBackButton";

const getGithubUsername = (githubUrl) => {
  if (!githubUrl) {
    return "";
  }

  try {
    const url = new URL(githubUrl);
    const parts = url.pathname.split("/").filter(Boolean);

    return parts[0] || "";
  } catch {
    return githubUrl
      .replace("https://github.com/", "")
      .replace("http://github.com/", "")
      .replace(/\/+$/, "")
      .split("/")[0];
  }
};

function GithubActivity() {
  const [username, setUsername] = useState("");
  const [github, setGithub] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadActivity = async (targetUsername) => {
    try {
      setLoading(true);
      setError("");

      const data = await getGithubActivity(targetUsername);

      setGithub(data);
    } catch (err) {
      console.error("GitHub activity page error:", err);
      setError(
        err.message || "Failed to load GitHub activity"
      );
      setGithub(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadProfileAndGithub = async () => {
      try {
        const profileData = await getProfile();

        const githubLink =
          profileData.user?.links?.github || "";

        const profileUsername = getGithubUsername(githubLink);

        if (!profileUsername) {
          setLoading(false);
          return;
        }

        setUsername(profileUsername);

        await loadActivity(profileUsername);
      } catch (err) {
        console.error("GitHub profile loading error:", err);

        setLoading(false);
        setError(
          "Add your GitHub profile link in Settings to load GitHub Activity."
        );
      }
    };

    loadProfileAndGithub();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanUsername = username.trim();

    if (!cleanUsername) {
      setError("Enter a GitHub username.");
      return;
    }

    await loadActivity(cleanUsername);
  };

  if (loading) {
    return (
      <main className="github-page">
        <DashboardBackButton />
        <div className="github-header">
          <p className="github-eyebrow">Developer Activity</p>

          <h1>GitHub Activity</h1>

          <p className="github-description">
            Connect your public GitHub profile and track your coding activity.
          </p>
        </div>

        <div className="github-state-card">
          <p>Loading GitHub activity...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="github-page">
        <DashboardBackButton />
      <div className="github-header">
        <div>
          <p className="github-eyebrow">Developer Activity</p>

          <h1>GitHub Activity</h1>

          <p className="github-description">
            Review your public repositories, stars, forks, languages,
            and recent public activity.
          </p>
        </div>

        {github && (
          <a
            href={github.profile.htmlUrl}
            target="_blank"
            rel="noreferrer"
            className="github-profile-button"
          >
            View GitHub Profile
          </a>
        )}
      </div>

      <section className="github-search-card">
        <form onSubmit={handleSubmit} className="github-search-form">
          <div>
            <label htmlFor="github-username">
              GitHub Username
            </label>

            <input
              id="github-username"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="e.g. octocat"
            />
          </div>

          <button
            type="submit"
            className="github-primary-button"
          >
            Load Activity
          </button>
        </form>
      </section>

      {error && (
        <div className="github-message github-error">
          {error}
        </div>
      )}

      {github && (
        <>
          <section className="github-profile-card">
            <div className="github-profile-main">
              {github.profile.avatarUrl && (
                <img
                  src={github.profile.avatarUrl}
                  alt={github.profile.name}
                  className="github-avatar"
                />
              )}

              <div>
                <span className="github-profile-login">
                  @{github.profile.login}
                </span>

                <h2>{github.profile.name}</h2>

                {github.profile.bio && (
                  <p>{github.profile.bio}</p>
                )}

                <div className="github-profile-meta">
                  {github.profile.location && (
                    <span>{github.profile.location}</span>
                  )}

                  {github.profile.company && (
                    <span>{github.profile.company}</span>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="github-stats-grid">
            <article className="github-stat-card">
              <span>Public Repositories</span>
              <strong>{github.summary.publicRepos}</strong>
            </article>

            <article className="github-stat-card">
              <span>Stars</span>
              <strong>{github.summary.stars}</strong>
            </article>

            <article className="github-stat-card">
              <span>Forks</span>
              <strong>{github.summary.forks}</strong>
            </article>

            <article className="github-stat-card">
              <span>Followers</span>
              <strong>{github.summary.followers}</strong>
            </article>
          </section>

          <section className="github-stats-grid">
            <article className="github-stat-card">
              <span>Recent Public Events</span>
              <strong>{github.summary.recentEvents}</strong>
              <small>Recent public activity returned by GitHub</small>
            </article>

            <article className="github-stat-card">
              <span>Push Events</span>
              <strong>{github.summary.pushEvents}</strong>
            </article>

            <article className="github-stat-card">
              <span>Pull Request Events</span>
              <strong>{github.summary.pullRequestEvents}</strong>
            </article>

            <article className="github-stat-card">
              <span>Issue Events</span>
              <strong>{github.summary.issueEvents}</strong>
            </article>
          </section>

          <div className="github-content-grid">
            <section className="github-section-card">
              <div className="github-section-header">
                <div>
                  <h2>Languages</h2>
                  <p>
                    Programming languages detected across public repositories.
                  </p>
                </div>
              </div>

              <div className="github-bars">
                {Object.keys(github.languages || {}).length === 0 ? (
                  <p className="github-muted">
                    No language data available.
                  </p>
                ) : (
                  Object.entries(github.languages)
                    .sort((first, second) => second[1] - first[1])
                    .map(([language, count]) => {
                      const totalLanguages = Object.values(
                        github.languages
                      ).reduce(
                        (total, value) => total + value,
                        0
                      );

                      const percentage =
                        totalLanguages === 0
                          ? 0
                          : Math.round(
                              (count / totalLanguages) * 100
                            );

                      return (
                        <div
                          className="github-bar-row"
                          key={language}
                        >
                          <div className="github-bar-label">
                            <span>{language}</span>
                            <strong>
                              {count} repo
                              {count === 1 ? "" : "s"}
                            </strong>
                          </div>

                          <div className="github-bar-track">
                            <div
                              className="github-bar-fill"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </section>

            <section className="github-section-card">
              <div className="github-section-header">
                <div>
                  <h2>Activity Summary</h2>
                  <p>Recent public GitHub activity categories.</p>
                </div>
              </div>

              <div className="github-activity-summary">
                <div>
                  <span>Repository Activity</span>
                  <strong>
                    {github.summary.repositoryActivity}
                  </strong>
                </div>

                <div>
                  <span>Following</span>
                  <strong>{github.profile.following}</strong>
                </div>

                <div>
                  <span>Pull Requests</span>
                  <strong>
                    {github.summary.pullRequestEvents}
                  </strong>
                </div>

                <div>
                  <span>Issues</span>
                  <strong>
                    {github.summary.issueEvents}
                  </strong>
                </div>
              </div>
            </section>
          </div>

          <section className="github-section-card">
            <div className="github-section-header">
              <div>
                <h2>Top Repositories</h2>
                <p>
                  Your public repositories ranked using stars and forks.
                </p>
              </div>
            </div>

            {github.repositories.length === 0 ? (
              <div className="github-empty">
                <p>No public repositories found.</p>
              </div>
            ) : (
              <div className="github-repository-grid">
                {github.repositories.map((repository) => (
                  <article
                    className="github-repository-card"
                    key={repository.id}
                  >
                    <div className="github-repository-title">
                      <h3>{repository.name}</h3>

                      {repository.language && (
                        <span>{repository.language}</span>
                      )}
                    </div>

                    <p>
                      {repository.description ||
                        "No repository description provided."}
                    </p>

                    <div className="github-repository-meta">
                      <span>★ {repository.stars}</span>
                      <span>⑂ {repository.forks}</span>
                      <span>Issues {repository.openIssues}</span>
                    </div>

                    <a
                      href={repository.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open Repository
                    </a>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="github-section-card">
            <div className="github-section-header">
              <div>
                <h2>Recent Public Activity</h2>
                <p>
                  GitHub public events available from the recent activity feed.
                </p>
              </div>
            </div>

            {github.recentActivity.length === 0 ? (
              <div className="github-empty">
                <p>No recent public GitHub activity was returned.</p>
              </div>
            ) : (
              <div className="github-events">
                {github.recentActivity.map((activity) => (
                  <div
                    className="github-event"
                    key={activity.id}
                  >
                    <div className="github-event-dot" />

                    <div className="github-event-content">
                      <strong>{activity.label}</strong>

                      <a
                        href={activity.repositoryUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {activity.repository}
                      </a>

                      <span>
                        {new Date(
                          activity.createdAt
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default GithubActivity;