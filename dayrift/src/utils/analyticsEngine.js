// utils/analyticsEngine.js

export function calculateCompletionRate(tasks) {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter(task => task.completed).length;
  return Math.round((completed / tasks.length) * 100);
}

export function calculateFocusTime(focusSessions) {
  if (!focusSessions || focusSessions.length === 0) return 0;
  const totalSeconds = focusSessions.reduce(
    (sum, session) => sum + session.duration,
    0
  );
  return Math.floor(totalSeconds / 60); // minutes
}

export function calculateSessionsToday(focusSessions) {
  const today = new Date().toDateString();
  return focusSessions.filter(session =>
    new Date(session.completedAt).toDateString() === today
  ).length;
}

// NEW: Process desktop activity data logged by the Python tracker
export function calculateDesktopProductivity(desktopActivities) {
  if (!desktopActivities || desktopActivities.length === 0) {
    return { productiveMinutes: 0, distractingMinutes: 0, totalMinutes: 0 };
  }

  let productiveSeconds = 0;
  let distractingSeconds = 0;

  desktopActivities.forEach(activity => {
    // Expecting activity object: { duration: seconds, category: 'productive' | 'distracting' }
    if (activity.category === 'productive') {
      productiveSeconds += activity.duration;
    } else if (activity.category === 'distracting') {
      distractingSeconds += activity.duration;
    }
  });

  return {
    productiveMinutes: Math.floor(productiveSeconds / 60),
    distractingMinutes: Math.floor(distractingSeconds / 60),
    totalMinutes: Math.floor((productiveSeconds + distractingSeconds) / 60)
  };
}

// UPDATED: The core Rule-Based Focus Score Algorithm
export function calculateFocusScore(tasks, focusSessions, desktopActivities = []) {
  const completionRate = calculateCompletionRate(tasks);
  const focusMinutes = calculateFocusTime(focusSessions);
  const desktopStats = calculateDesktopProductivity(desktopActivities);

  // 1. Task Intention Score (30% weight)
  const taskScore = completionRate * 0.3;

  // 2. Structured Focus Score (30% weight) - Assuming 120 mins (2h) daily goal for deep mobile focus
  const dailyFocusGoal = 120; 
  const focusProgress = Math.min((focusMinutes / dailyFocusGoal) * 100, 100);
  const focusScorePart = focusProgress * 0.3;

  // 3. Behavioral Desktop Score (40% weight)
  let desktopScorePart = 0;
  if (desktopStats.totalMinutes > 0) {
    // Ratio of productive time vs total tracked active time
    const desktopRatio = desktopStats.productiveMinutes / desktopStats.totalMinutes;
    desktopScorePart = (desktopRatio * 100) * 0.4;
  } else {
    // Fallback: If the user didn't use the desktop today, redistribute weights to 50/50
    return Math.round((completionRate * 0.5) + (focusProgress * 0.5));
  }

  // Base integration calculation
  let finalScore = taskScore + focusScorePart + desktopScorePart;

  // Bonus: Micro-habit reinforcement (Small bump for multiple focus sessions)
  const sessionBonus = Math.min(calculateSessionsToday(focusSessions) * 2, 10);
  
  // Penalty: Behavioral Awareness (Subtract points for excessive distraction > 60 mins)
  let distractionPenalty = 0;
  if (desktopStats.distractingMinutes > 60) {
     distractionPenalty = Math.min((desktopStats.distractingMinutes - 60) * 0.5, 25); // Max 25 points lost
  }

  finalScore = finalScore + sessionBonus - distractionPenalty;

  // Clamp the final score strictly between 0 and 100
  return Math.max(0, Math.min(Math.round(finalScore), 100));
}

// NEW: Streak Mechanism logic
export function calculateStreak(currentStreak, todayScore) {
  const PRODUCTIVE_THRESHOLD = 60; // User needs a score of at least 60 to maintain a streak
  
  if (todayScore >= PRODUCTIVE_THRESHOLD) {
    return currentStreak + 1;
  } else {
    return 0; // Streak broken due to low productivity
  }
}

export function calculateFocusDistribution(tasks, focusSessions) {
  const distribution = {};

  focusSessions.forEach(session => {
    const task = tasks.find(t => t.id === session.taskId);
    if (!task) return;

    const category = task.category || 'Uncategorized';

    if (!distribution[category]) {
      distribution[category] = 0;
    }
    distribution[category] += session.duration;
  });

  return distribution;
}
