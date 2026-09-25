export interface TopicSignal {
  topic: string;
  count: number;
  lastAsked?: string;
}

export interface QuizSignal {
  topic: string;
  score: number;
  total: number;
  date: string;
}

export interface LearningRecommendation {
  topic: string;
  reason: string;
  priority: "high" | "medium" | "low";
  action: string;
}

const TOPIC_KEY = "zequi_weak_topics";
const QUIZ_KEY = "zequi_quiz_history";

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getLearningSignals(): { topics: TopicSignal[]; quizzes: QuizSignal[] } {
  const rawTopics = readJSON<Record<string, { count: number; lastAsked: string }>>(TOPIC_KEY, {});
  const topics = Object.entries(rawTopics).map(([topic, value]) => ({
    topic,
    count: Number(value?.count || 0),
    lastAsked: value?.lastAsked,
  }));
  const quizzes = readJSON<QuizSignal[]>(QUIZ_KEY, []).filter(
    (item) => item && typeof item.topic === "string" && typeof item.score === "number" && typeof item.total === "number"
  );
  return { topics, quizzes };
}

export function getRecommendations(limit = 3): LearningRecommendation[] {
  const { topics, quizzes } = getLearningSignals();
  const quizByTopic = new Map<string, QuizSignal[]>();
  quizzes.forEach((quiz) => {
    const key = quiz.topic.toLowerCase();
    quizByTopic.set(key, [...(quizByTopic.get(key) || []), quiz]);
  });

  const candidates = topics.map((topic) => {
    const history = quizByTopic.get(topic.topic.toLowerCase()) || [];
    const latest = history[0];
    const accuracy = latest && latest.total > 0 ? latest.score / latest.total : null;
    const recencyDays = topic.lastAsked
      ? Math.max(0, (Date.now() - new Date(topic.lastAsked).getTime()) / 86400000)
      : 30;
    let priority: LearningRecommendation["priority"] = "low";
    let reason = `${topic.count} recent learning signals`;
    let action = `Review ${topic.topic} and test yourself.`;

    if (accuracy !== null && accuracy < 0.6) {
      priority = "high";
      reason = `Recent quiz accuracy is ${Math.round(accuracy * 100)}%.`;
      action = `Practice ${topic.topic} with a short targeted quiz.`;
    } else if (topic.count >= 4 || recencyDays > 7) {
      priority = "medium";
      reason = topic.count >= 4 ? `You have ${topic.count} learning signals.` : "It has not been reviewed recently.";
      action = `Do a focused ${topic.topic} review.`;
    }

    return { ...topic, priority, reason, action };
  });

  return candidates
    .sort((a, b) => ({ high: 3, medium: 2, low: 1 }[b.priority] - ({ high: 3, medium: 2, low: 1 }[a.priority]) || b.count - a.count))
    .slice(0, limit)
    .map(({ topic, priority, reason, action }) => ({ topic, priority, reason, action }));
}

export function getLearningSummary() {
  const { topics, quizzes } = getLearningSignals();
  const mastered = quizzes.filter((q) => q.total > 0 && q.score / q.total >= 0.8).length;
  const weak = quizzes.filter((q) => q.total > 0 && q.score / q.total < 0.6).length;
  const average = quizzes.length
    ? Math.round((quizzes.reduce((sum, q) => sum + (q.total ? q.score / q.total : 0), 0) / quizzes.length) * 100)
    : 0;
  return {
    trackedTopics: topics.length,
    quizAttempts: quizzes.length,
    strongAttempts: mastered,
    weakAttempts: weak,
    averageAccuracy: average,
  };
}

export function getTopicGraph(topics: TopicSignal[]) {
  const aliases: Record<string, string[]> = {
    python: ["programming", "coding", "apis"],
    programming: ["python", "coding", "react"],
    react: ["javascript", "programming"],
    javascript: ["react", "programming"],
    physics: ["math", "calculus"],
    calculus: ["math", "physics", "algebra"],
    probability: ["statistics", "math"],
    statistics: ["probability", "math"],
  };
  const known = new Set(topics.map((t) => t.topic.toLowerCase()));
  return topics.slice(0, 8).map((topic) => ({
    topic: topic.topic,
    links: (aliases[topic.topic.toLowerCase()] || []).filter((link) => known.has(link)),
  }));
}
