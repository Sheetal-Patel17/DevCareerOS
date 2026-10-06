const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_API_VERSION = "2026-03-10";

const getGithubHeaders = () => ({
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": GITHUB_API_VERSION,
  "User-Agent": "DevCareerOS",
});

const validateUsername = (username) => {
  return /^[a-zA-Z0-9-]{1,39}$/.test(username);
};

const getEventLabel = (event) => {
  const action = event.payload?.action;

  switch (event.type) {
    case "PushEvent":
      return "Pushed code";

    case "CreateEvent":
      return "Created " + (event.payload?.ref_type || "resource");

    case "DeleteEvent":
      return "Deleted " + (event.payload?.ref_type || "resource");

    case "PullRequestEvent":
      return "Pull request " + (action || "updated");

    case "PullRequestReviewEvent":
      return "Reviewed a pull request";

    case "IssuesEvent":
      return "Issue " + (action || "updated");

    case "IssueCommentEvent":
      return "Commented on an issue or pull request";

    case "ForkEvent":
      return "Forked a repository";

    case "WatchEvent":
      return "Starred a repository";

    case "ReleaseEvent":
      return "Published a release";

    case "PublicEvent":
      return "Made a repository public";

    default:
      return event.type
        ? event.type.replace("Event", " activity")
        : "GitHub activity";
  }
};

const getCareerGithubActivity = async (req, res) => {
  try {
    const username = String(req.query.username || "").trim();

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "GitHub username is required",
      });
    }

    if (!validateUsername(username)) {
      return res.status(400).json({
        success: false,
        message: "Invalid GitHub username",
      });
    }

    const headers = getGithubHeaders();

    const [profileResponse, repositoriesResponse, eventsResponse] =
      await Promise.all([
        fetch(`${GITHUB_API_BASE}/users/${username}`, {
          headers,
        }),

        fetch(
          `${GITHUB_API_BASE}/users/${username}/repos?per_page=100&sort=updated`,
          {
            headers,
          }
        ),

        fetch(
          `${GITHUB_API_BASE}/users/${username}/events/public?per_page=30`,
          {
            headers,
          }
        ),
      ]);

    if (
      profileResponse.status === 404 ||
      repositoriesResponse.status === 404
    ) {
      return res.status(404).json({
        success: false,
        message: "GitHub user not found",
      });
    }

    if (
      profileResponse.status === 403 ||
      repositoriesResponse.status === 403 ||
      eventsResponse.status === 403
    ) {
      return res.status(429).json({
        success: false,
        message:
          "GitHub API rate limit reached. Please try again later.",
      });
    }

    if (
      !profileResponse.ok ||
      !repositoriesResponse.ok ||
      !eventsResponse.ok
    ) {
      return res.status(502).json({
        success: false,
        message: "GitHub API request failed",
      });
    }

    const profile = await profileResponse.json();
    const repositories = await repositoriesResponse.json();
    const events = await eventsResponse.json();

    const repositoryList = Array.isArray(repositories)
      ? repositories
      : [];

    const eventList = Array.isArray(events) ? events : [];

    const totalStars = repositoryList.reduce(
      (total, repository) =>
        total + Number(repository.stargazers_count || 0),
      0
    );

    const totalForks = repositoryList.reduce(
      (total, repository) =>
        total + Number(repository.forks_count || 0),
      0
    );

    const languageCounts = repositoryList.reduce(
      (languages, repository) => {
        const language = repository.language;

        if (!language) {
          return languages;
        }

        languages[language] = (languages[language] || 0) + 1;

        return languages;
      },
      {}
    );

    const eventCounts = eventList.reduce(
      (counts, event) => {
        counts.total += 1;

        switch (event.type) {
          case "PushEvent":
            counts.pushes += 1;
            break;

          case "PullRequestEvent":
          case "PullRequestReviewEvent":
            counts.pullRequests += 1;
            break;

          case "IssuesEvent":
          case "IssueCommentEvent":
            counts.issues += 1;
            break;

          case "CreateEvent":
          case "DeleteEvent":
          case "ForkEvent":
          case "ReleaseEvent":
          case "PublicEvent":
            counts.repositoryActivity += 1;
            break;

          default:
            counts.other += 1;
        }

        return counts;
      },
      {
        total: 0,
        pushes: 0,
        pullRequests: 0,
        issues: 0,
        repositoryActivity: 0,
        other: 0,
      }
    );

    const topRepositories = [...repositoryList]
      .sort((first, second) => {
        const firstScore =
          Number(first.stargazers_count || 0) * 10 +
          Number(first.forks_count || 0);

        const secondScore =
          Number(second.stargazers_count || 0) * 10 +
          Number(second.forks_count || 0);

        return secondScore - firstScore;
      })
      .slice(0, 12)
      .map((repository) => ({
        id: repository.id,
        name: repository.name,
        fullName: repository.full_name,
        description: repository.description || "",
        htmlUrl: repository.html_url,
        language: repository.language || "Other",
        stars: repository.stargazers_count || 0,
        forks: repository.forks_count || 0,
        openIssues: repository.open_issues_count || 0,
        updatedAt: repository.updated_at,
        pushedAt: repository.pushed_at,
      }));

    const recentActivity = eventList.slice(0, 20).map((event) => ({
      id: event.id,
      type: event.type,
      label: getEventLabel(event),
      repository: event.repo?.name || "GitHub",
      repositoryUrl:
        event.repo?.name
          ? `https://github.com/${event.repo.name}`
          : "https://github.com/" + username,
      createdAt: event.created_at,
    }));

    return res.status(200).json({
      success: true,
      github: {
        profile: {
          login: profile.login,
          name: profile.name || profile.login,
          avatarUrl: profile.avatar_url,
          htmlUrl: profile.html_url,
          bio: profile.bio || "",
          publicRepos: profile.public_repos || 0,
          followers: profile.followers || 0,
          following: profile.following || 0,
          company: profile.company || "",
          location: profile.location || "",
        },

        summary: {
          publicRepos: profile.public_repos || 0,
          followers: profile.followers || 0,
          following: profile.following || 0,
          stars: totalStars,
          forks: totalForks,
          recentEvents: eventCounts.total,
          pushEvents: eventCounts.pushes,
          pullRequestEvents: eventCounts.pullRequests,
          issueEvents: eventCounts.issues,
          repositoryActivity: eventCounts.repositoryActivity,
        },

        languages: languageCounts,

        repositories: topRepositories,

        recentActivity,
      },
    });
  } catch (error) {
    console.error("GitHub activity error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load GitHub activity",
    });
  }
};

module.exports = {
  getCareerGithubActivity,
};