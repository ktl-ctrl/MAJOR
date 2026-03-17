export function calculateCompletionRate(tasks) {
  if (tasks.length === 0) return 0;

  const completed = tasks.filter(task => task.completed).length;

  return Math.round((completed / tasks.length) * 100);
}

export function calculateFocusTime(focusSessions) {
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

export function calculateFocusScore(tasks, focusSessions) {

  const completionRate = calculateCompletionRate(tasks);
  const focusMinutes = calculateFocusTime(focusSessions);

  const dailyGoal = 240; // 4h goal

  const focusProgress = Math.min((focusMinutes / dailyGoal) * 100, 100);

  const score =
    completionRate * 0.4 +
    focusProgress * 0.4 +
    Math.min(focusSessions.length * 5, 20);

  return Math.round(score);
}
export function calculateFocusDistribution(tasks, focusSessions) {
  const distribution = {};

  focusSessions.forEach(session => {
    const task = tasks.find(t => t.id === session.taskId);
    if (!task) return;

    const category = task.category;

    if (!distribution[category]) {
      distribution[category] = 0;
    }

    distribution[category] += session.duration;
  });

  return distribution;
}