import { useState, useEffect } from "react";
import { Target, Brain } from "lucide-react";

interface WeakTopic {
  count: number;
  lastAsked: string;
}

type WeakTopics = Record<string, WeakTopic>;

const WEAK_TOPICS_KEY = "zequi_weak_topics";

export function trackTopic(message: string): void {
  try {
    const topics: WeakTopics = JSON.parse(localStorage.getItem(WEAK_TOPICS_KEY) || "{}");
    const keywords = extractKeywords(message);

    keywords.forEach((keyword) => {
      if (topics[keyword]) {
        topics[keyword].count += 1;
        topics[keyword].lastAsked = new Date().toISOString();
      } else {
        topics[keyword] = {
          count: 1,
          lastAsked: new Date().toISOString(),
        };
      }
    });

    localStorage.setItem(WEAK_TOPICS_KEY, JSON.stringify(topics));
  } catch {}
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "must", "can", "to", "of", "in", "for",
    "on", "with", "at", "by", "from", "about", "into", "through",
    "during", "before", "after", "above", "below", "between", "under",
    "and", "but", "or", "nor", "so", "yet", "both", "either", "neither",
    "not", "only", "own", "same", "than", "too", "very", "just", "also",
    "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you",
    "your", "yours", "yourself", "yourselves", "he", "him", "his",
    "she", "her", "hers", "it", "its", "they", "them", "their", "what",
    "which", "who", "whom", "this", "that", "these", "those", "am",
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word));

  // Get common academic subjects
  const subjectPatterns = [
    "calculus", "algebra", "geometry", "physics", "chemistry", "biology",
    "history", "english", "literature", "python", "javascript", "react",
    "math", "science", "economics", "psychology", "sociology", "art",
    "music", "philosophy", "geography", "geology", "astronomy", "coding",
    "programming", "statistics", "probability", "trigonometry", "grammar",
  ];

  const found: string[] = [];
  words.forEach((word) => {
    if (subjectPatterns.includes(word) || word.length > 5) {
      found.push(word);
    }
  });

  return [...new Set(found)].slice(0, 3);
}

export function getTopWeakTopics(limit: number = 3): Array<{ topic: string; count: number }> {
  try {
    const topics: WeakTopics = JSON.parse(localStorage.getItem(WEAK_TOPICS_KEY) || "{}");
    const sorted = Object.entries(topics)
      .filter(([, data]) => data.count >= 2)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, limit)
      .map(([topic, data]) => ({ topic, count: data.count }));

    return sorted;
  } catch {
    return [];
  }
}

interface Props {
  onSuggestQuiz?: (topic: string) => void;
}

export default function TopicTracker({ onSuggestQuiz }: Props) {
  const [topics, setTopics] = useState<Array<{ topic: string; count: number }>>([]);

  useEffect(() => {
    setTopics(getTopWeakTopics(3));
  }, []);

  // Refresh topics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setTopics(getTopWeakTopics(3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (topics.length === 0) return null;

  return (
    <div className="glass-panel p-3 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Target size={16} className="text-amber-400" />
        <span className="text-xs font-medium text-slate-400">Focus Areas</span>
      </div>
      <div className="space-y-2">
        {topics.map(({ topic, count }) => (
          <div
            key={topic}
            className="flex items-center justify-between p-2 rounded bg-slate-800/50 hover:bg-slate-800/70 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm capitalize">{topic}</span>
              <span className="text-xs text-amber-400">×{count}</span>
            </div>
            {count >= 2 && onSuggestQuiz && (
              <button
                onClick={() => onSuggestQuiz(topic)}
                className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition-colors"
              >
                <Brain size={12} />
                Quiz
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
