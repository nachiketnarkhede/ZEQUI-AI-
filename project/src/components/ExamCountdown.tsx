import { useState, useEffect } from "react";
import { Calendar, Plus, X, Clock, Target } from "lucide-react";
import { getTopWeakTopics } from "./TopicTracker";

interface Exam {
  name: string;
  date: string;
}

const EXAM_DATES_KEY = "zequi_exam_dates";

function getExams(): Exam[] {
  try {
    return JSON.parse(localStorage.getItem(EXAM_DATES_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveExams(exams: Exam[]): void {
  localStorage.setItem(EXAM_DATES_KEY, JSON.stringify(exams));
}

interface Props {
  addToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function ExamCountdown({ addToast }: Props) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newExam, setNewExam] = useState({ name: "", date: "" });
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    setExams(getExams());
  }, []);

  // Update countdown every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  function addExam() {
    if (!newExam.name.trim() || !newExam.date) {
      addToast("Please fill all fields", "error");
      return;
    }

    const examDate = new Date(newExam.date);
    if (examDate < new Date()) {
      addToast("Exam date must be in the future", "error");
      return;
    }

    const updated = [...exams, { name: newExam.name.trim(), date: newExam.date }];
    saveExams(updated);
    setExams(updated);
    setNewExam({ name: "", date: "" });
    setShowModal(false);
    addToast("Exam added successfully!", "success");
  }

  function deleteExam(index: number) {
    const updated = exams.filter((_, i) => i !== index);
    saveExams(updated);
    setExams(updated);
    addToast("Exam removed", "info");
  }

  function getDaysRemaining(dateStr: string): number {
    const examDate = new Date(dateStr);
    const diff = examDate.getTime() - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  function getDailyPriority(): string {
    const weakTopics = getTopWeakTopics(1);
    if (weakTopics.length > 0) {
      return `Focus on ${weakTopics[0].topic} (high-yield)`;
    }

    const upcomingExams = exams
      .map((e) => ({ ...e, days: getDaysRemaining(e.date) }))
      .filter((e) => e.days > 0)
      .sort((a, b) => a.days - b.days);

    if (upcomingExams.length > 0) {
      return `Review for ${upcomingExams[0].name}`;
    }

    return "Practice with ZEQUI AI";
  }

  const upcomingExams = exams
    .map((e) => ({ ...e, days: getDaysRemaining(e.date) }))
    .filter((e) => e.days > 0)
    .sort((a, b) => a.days - b.days);

  return (
    <>
      <div className="glass-panel p-3 rounded-lg space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-violet-400" />
            <span className="text-xs font-medium text-slate-400">Exam Countdown</span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="p-1 rounded hover:bg-slate-800/50 transition-colors"
          >
            <Plus size={14} className="text-cyan-400" />
          </button>
        </div>

        {/* Daily Priority */}
        <div className="p-2 rounded bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Target size={12} className="text-cyan-400" />
            <span className="text-xs font-medium">Today's Priority</span>
          </div>
          <p className="text-xs text-slate-300">{getDailyPriority()}</p>
        </div>

        {/* Exam List */}
        {upcomingExams.length > 0 ? (
          <div className="space-y-1.5">
            {upcomingExams.slice(0, 3).map((exam, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded bg-slate-800/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs truncate">{exam.name}</p>
                  <p className="text-[10px] text-slate-500">
                    {new Date(exam.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-amber-500/20 text-amber-400 text-xs">
                    <Clock size={12} />
                    <span>{exam.days}d</span>
                  </div>
                  <button
                    onClick={() => deleteExam(exams.findIndex((e) => e.name === exam.name))}
                    className="p-1 rounded hover:bg-red-500/20 transition-colors"
                  >
                    <X size={12} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-2">
            No upcoming exams
          </p>
        )}
      </div>

      {/* Add Exam Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm fade-in">
          <div className="glass-panel p-6 rounded-xl max-w-sm w-full mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Add Exam</h3>
              <button onClick={() => setShowModal(false)}>
                <X size={18} className="text-slate-400 hover:text-slate-200" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Exam Name</label>
                <input
                  type="text"
                  value={newExam.name}
                  onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
                  placeholder="e.g., Biology Final"
                  className="w-full px-3 py-2 rounded-lg glass-panel text-sm theme-input"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Exam Date</label>
                <input
                  type="date"
                  value={newExam.date}
                  onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg glass-panel text-sm theme-input"
                />
              </div>
            </div>

            <button
              onClick={addExam}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium hover:scale-[1.02] transition-all"
            >
              Add Exam
            </button>
          </div>
        </div>
      )}
    </>
  );
}
