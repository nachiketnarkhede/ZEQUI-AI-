import { useState, useEffect } from "react";
import { Brain, RotateCcw, Download, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { type GroqMessage, useGroq } from "../hooks/useGroq";

interface Question {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizData {
  questions: Question[];
}

interface QuizHistory {
  topic: string;
  score: number;
  total: number;
  date: string;
}

const QUIZ_HISTORY_KEY = "zequi_quiz_history";

function saveQuizToHistory(topic: string, score: number, total: number) {
  try {
    const history: QuizHistory[] = JSON.parse(localStorage.getItem(QUIZ_HISTORY_KEY) || "[]");
    history.unshift({
      topic,
      score,
      total,
      date: new Date().toISOString(),
    });
    localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
  } catch {}
}

interface Props {
  content: string;
  addToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function QuizMode({ content, addToast }: Props) {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    setQuiz(null);
    setAnswers({});
    setSubmitted(false);
    setShowReview(false);
  }, [content]);

  async function generateQuiz() {
    setLoading(true);
    try {
      const prompt = `Based on this content, create a quiz with 5 multiple choice questions. Return ONLY valid JSON in this exact format, no markdown:
{"questions":[{"q":"question text","options":["A","B","C","D"],"correct":0,"explanation":"why this is correct"}]}

Content: ${content.substring(0, 2000)}`;

      const messages: GroqMessage[] = [
        { role: "user", content: prompt }
      ];

      const response = await call(messages);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid response format");

      const data: QuizData = JSON.parse(jsonMatch[0]);
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid quiz format");
      }

      setQuiz(data);
      addToast("Quiz generated successfully!", "success");
    } catch (error) {
      addToast("Failed to generate quiz. Please try again.", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(qIndex: number, aIndex: number) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: aIndex }));
  }

  function submitQuiz() {
    if (!quiz) return;
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < quiz.questions.length) {
      addToast("Please answer all questions", "error");
      return;
    }

    setSubmitted(true);
    const correct = quiz.questions.filter((q, i) => answers[i] === q.correct).length;
    saveQuizToHistory("Generated Quiz", correct, quiz.questions.length);
    addToast(`Quiz complete! Score: ${correct}/${quiz.questions.length}`, "success");
  }

  function retakeQuiz() {
    setAnswers({});
    setSubmitted(false);
    setShowReview(false);
  }

  function exportQuiz() {
    if (!quiz) return;
    let text = "ZEQUI Quiz Export\n" + "=".repeat(40) + "\n\n";
    quiz.questions.forEach((q, i) => {
      text += `Q${i + 1}: ${q.q}\n`;
      q.options.forEach((opt, j) => {
        text += `  ${String.fromCharCode(65 + j)}) ${opt}\n`;
      });
      text += `Correct: ${String.fromCharCode(65 + q.correct)}\n`;
      text += `Explanation: ${q.explanation}\n\n`;
    });

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zequi-quiz-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast("Quiz exported!", "success");
  }

  function getScore() {
    if (!quiz) return 0;
    return quiz.questions.filter((q, i) => answers[i] === q.correct).length;
  }

  if (!quiz) {
    return (
      <button
        onClick={generateQuiz}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 rounded-lg glass-panel text-sm theme-text hover:scale-105 transition-all disabled:opacity-50"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
        {loading ? "Generating..." : "Generate Quiz"}
      </button>
    );
  }

  const score = getScore();
  const percentage = Math.round((score / quiz.questions.length) * 100);

  return (
    <div className="space-y-4">
      {/* Score Display */}
      {submitted && (
        <div className="glass-panel p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {percentage >= 80 ? (
                <CheckCircle className="text-green-400" size={24} />
              ) : (
                <XCircle className="text-amber-400" size={24} />
              )}
              <span className="text-lg font-bold">Score: {score}/{quiz.questions.length} ({percentage}%)</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={retakeQuiz}
                className="flex items-center gap-1 px-3 py-1 rounded-lg glass-panel text-xs hover:scale-105 transition-all"
              >
                <RotateCcw size={14} /> Retake
              </button>
              <button
                onClick={exportQuiz}
                className="flex items-center gap-1 px-3 py-1 rounded-lg glass-panel text-xs hover:scale-105 transition-all"
              >
                <Download size={14} /> Save Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-3">
        {quiz.questions.map((q, qIdx) => {
          const userAnswer = answers[qIdx];
          const isCorrect = userAnswer === q.correct;
          const showCorrect = submitted && !isCorrect;

          return (
            <div key={qIdx} className="glass-panel p-4 rounded-lg">
              <p className="font-medium mb-2">
                {qIdx + 1}. {q.q}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oIdx) => {
                  const selected = userAnswer === oIdx;
                  const isCorrectOption = q.correct === oIdx;

                  let bgClass = "bg-slate-800/50";
                  if (submitted) {
                    if (isCorrectOption) bgClass = "bg-green-500/20 border border-green-500/50";
                    else if (selected && !isCorrectOption) bgClass = "bg-red-500/20 border border-red-500/50";
                  } else if (selected) {
                    bgClass = "bg-cyan-500/20 border border-cyan-500/50";
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => selectAnswer(qIdx, oIdx)}
                      disabled={submitted}
                      className={`w-full text-left px-3 py-2 rounded-lg ${bgClass} transition-all ${
                        !submitted && "hover:scale-[1.01]"
                      }`}
                    >
                      <span className="font-medium">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                    </button>
                  );
                })}
              </div>
              {showCorrect && showReview && (
                <div className="mt-3 p-2 rounded bg-blue-500/10 border border-blue-500/30 text-sm">
                  <strong>Correct:</strong> {q.options[q.correct]}
                  <br />
                  <strong className="text-cyan-400">Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      {!submitted && (
        <button
          onClick={submitQuiz}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium hover:scale-[1.02] transition-all"
        >
          Submit Quiz
        </button>
      )}

      {submitted && !showReview && (
        <button
          onClick={() => setShowReview(true)}
          className="w-full py-2 rounded-lg glass-panel text-sm hover:scale-[1.01] transition-all"
        >
          Review Mistakes
        </button>
      )}
    </div>
  );
}
