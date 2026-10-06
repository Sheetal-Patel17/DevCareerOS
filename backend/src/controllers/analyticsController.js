const DsaProblem = require("../models/DsaProblem");
const Goal = require("../models/Goal");
const Interview = require("../models/Interview");
const Resume = require("../models/Resume");

const getUserId = (req) => {
  return req.auth?.userId || req.auth?.id || req.auth?._id;
};

// GET /api/analytics
const getCareerAnalytics = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const [problems, goals, interviews, resumes] = await Promise.all([
      DsaProblem.find({ user: userId }).sort({ createdAt: -1 }),
      Goal.find({ user: userId }).sort({ createdAt: -1 }),
      Interview.find({ user: userId }).sort({ interviewDate: -1 }),
      Resume.find({ user: userId }).sort({ updatedAt: -1 }),
    ]);

    // -------------------------
    // DSA Analytics
    // -------------------------

    const dsaTotal = problems.length;

    const dsaSolved = problems.filter(
      (problem) => problem.status === "Solved"
    ).length;

    const dsaInProgress = problems.filter(
      (problem) => problem.status === "In Progress"
    ).length;

    const dsaNotStarted = problems.filter(
      (problem) => problem.status === "Not Started"
    ).length;

    const dsaEasy = problems.filter(
      (problem) => problem.difficulty === "Easy"
    ).length;

    const dsaMedium = problems.filter(
      (problem) => problem.difficulty === "Medium"
    ).length;

    const dsaHard = problems.filter(
      (problem) => problem.difficulty === "Hard"
    ).length;

    const dsaSolvedEasy = problems.filter(
      (problem) =>
        problem.difficulty === "Easy" && problem.status === "Solved"
    ).length;

    const dsaSolvedMedium = problems.filter(
      (problem) =>
        problem.difficulty === "Medium" && problem.status === "Solved"
    ).length;

    const dsaSolvedHard = problems.filter(
      (problem) =>
        problem.difficulty === "Hard" && problem.status === "Solved"
    ).length;

    const dsaCompletion =
      dsaTotal === 0 ? 0 : Math.round((dsaSolved / dsaTotal) * 100);

    // -------------------------
    // Goal Analytics
    // -------------------------

    const goalTotal = goals.length;

    const goalCompleted = goals.filter(
      (goal) => goal.status === "Completed"
    ).length;

    const goalInProgress = goals.filter(
      (goal) => goal.status === "In Progress"
    ).length;

    const goalNotStarted = goals.filter(
      (goal) => goal.status === "Not Started"
    ).length;

    const goalPaused = goals.filter(
      (goal) => goal.status === "Paused"
    ).length;

    const goalProgressTotal = goals.reduce(
      (total, goal) => total + Number(goal.progress || 0),
      0
    );

    const averageGoalProgress =
      goalTotal === 0
        ? 0
        : Math.round(goalProgressTotal / goalTotal);

    const goalCompletion =
      goalTotal === 0 ? 0 : Math.round((goalCompleted / goalTotal) * 100);

    const goalCategories = goals.reduce((categories, goal) => {
      const category = goal.category || "Other";

      if (!categories[category]) {
        categories[category] = 0;
      }

      categories[category] += 1;

      return categories;
    }, {});

    // -------------------------
    // Interview Analytics
    // -------------------------

    const interviewTotal = interviews.length;

    const interviewScheduled = interviews.filter(
      (interview) => interview.status === "Scheduled"
    ).length;

    const interviewCompleted = interviews.filter(
      (interview) => interview.status === "Completed"
    ).length;

    const interviewSelected = interviews.filter(
      (interview) => interview.status === "Selected"
    ).length;

    const interviewRejected = interviews.filter(
      (interview) => interview.status === "Rejected"
    ).length;

    const interviewCancelled = interviews.filter(
      (interview) => interview.status === "Cancelled"
    ).length;

    const interviewDecided =
      interviewSelected + interviewRejected;

    const interviewSuccessRate =
      interviewDecided === 0
        ? 0
        : Math.round((interviewSelected / interviewDecided) * 100);

    const now = new Date();

    const upcomingInterviews = interviews.filter(
      (interview) =>
        interview.interviewDate &&
        new Date(interview.interviewDate) >= now &&
        interview.status === "Scheduled"
    ).length;

    const interviewTypes = interviews.reduce((types, interview) => {
      const type = interview.type || "Other";

      if (!types[type]) {
        types[type] = 0;
      }

      types[type] += 1;

      return types;
    }, {});

    // -------------------------
    // Resume Analytics
    // -------------------------

    const resumeTotal = resumes.length;

    const resumeDraft = resumes.filter(
      (resume) => resume.status === "Draft"
    ).length;

    const resumeReady = resumes.filter(
      (resume) => resume.status === "Ready"
    ).length;

    const resumeArchived = resumes.filter(
      (resume) => resume.status === "Archived"
    ).length;

    const resumeReadyPercentage =
      resumeTotal === 0
        ? 0
        : Math.round((resumeReady / resumeTotal) * 100);

    // -------------------------
    // Overall Summary
    // -------------------------

    const activeGoals = goalInProgress + goalNotStarted;

    const totalCareerRecords =
      dsaTotal + goalTotal + interviewTotal + resumeTotal;

    return res.status(200).json({
      success: true,
      analytics: {
        summary: {
          totalDsaProblems: dsaTotal,
          solvedDsaProblems: dsaSolved,
          dsaCompletion,
          totalGoals: goalTotal,
          completedGoals: goalCompleted,
          averageGoalProgress,
          totalInterviews: interviewTotal,
          selectedInterviews: interviewSelected,
          interviewSuccessRate,
          upcomingInterviews,
          totalResumes: resumeTotal,
          readyResumes: resumeReady,
          resumeReadyPercentage,
          activeGoals,
          totalCareerRecords,
        },

        dsa: {
          total: dsaTotal,
          solved: dsaSolved,
          inProgress: dsaInProgress,
          notStarted: dsaNotStarted,
          completionPercentage: dsaCompletion,
          difficulty: {
            easy: dsaEasy,
            medium: dsaMedium,
            hard: dsaHard,
            solvedEasy: dsaSolvedEasy,
            solvedMedium: dsaSolvedMedium,
            solvedHard: dsaSolvedHard,
          },
        },

        goals: {
          total: goalTotal,
          completed: goalCompleted,
          inProgress: goalInProgress,
          notStarted: goalNotStarted,
          paused: goalPaused,
          averageProgress: averageGoalProgress,
          completionPercentage: goalCompletion,
          categories: goalCategories,
        },

        interviews: {
          total: interviewTotal,
          scheduled: interviewScheduled,
          completed: interviewCompleted,
          selected: interviewSelected,
          rejected: interviewRejected,
          cancelled: interviewCancelled,
          successRate: interviewSuccessRate,
          upcoming: upcomingInterviews,
          types: interviewTypes,
        },

        resumes: {
          total: resumeTotal,
          draft: resumeDraft,
          ready: resumeReady,
          archived: resumeArchived,
          readyPercentage: resumeReadyPercentage,
        },
      },
    });
  } catch (error) {
    console.error("Get career analytics error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to calculate career analytics",
    });
  }
};

module.exports = {
  getCareerAnalytics,
};