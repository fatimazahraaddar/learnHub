import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
// import { fetchCourseLessons, submitQuizAnswer, markLessonComplete } from "../../api"; // décommenter quand le backend est prêt
 
// ─── Mock data (remplace par les vraies routes API quand prêtes) ───────────────
const MOCK_LESSONS = [
  {
    id: 1,
    type: "lesson",
    title: "Introduction",
    content: "Contenu de la leçon...",
    code: null,
    done: false,
  },
  {
    id: 2,
    type: "quiz",
    title: "Quiz 1",
    done: false,
    locked: true,
    questions: [
      {
        id: 1,
        question: "Question exemple ?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 0,
      },
    ],
  },
];
// ─────────────────────────────────────────────────────────────────────────────
 
export function CourseLearningPage() {
  const { id: courseId } = useParams();
 
  const [lessons, setLessons] = useState([]);
  const [current, setCurrent] = useState(null);
  const [quizState, setQuizState] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  // ── Charger les leçons du cours ──────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Remplace ici par : const { ok, data } = await fetchCourseLessons(courseId);
        // if (!ok) { setError(data?.message || "Erreur"); return; }
        // setLessons(data.lessons);
        // setCurrent(data.lessons[0]);
 
        // Mock temporaire
        setLessons(MOCK_LESSONS);
        setCurrent(MOCK_LESSONS[0]);
      } catch {
        setError("Impossible de charger les leçons.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);
 
  // ── Progression ──────────────────────────────────────────────────────────
  const completedCount = lessons.filter((l) => l.done).length;
  const progressPct =
    lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;
 
  const currentIndex = lessons.findIndex((l) => l.id === current?.id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
 
  // ── Marquer leçon comme terminée ─────────────────────────────────────────
  const handleCompleteLesson = async () => {
    // await markLessonComplete(courseId, current.id); // branche l'API ici
    setLessons((prev) =>
      prev.map((l, i) => {
        if (l.id === current.id) return { ...l, done: true };
        if (i === currentIndex + 1) return { ...l, locked: false };
        return l;
      })
    );
    if (nextLesson) setCurrent({ ...nextLesson, locked: false });
  };
 
  // ── Quiz : sélectionner une réponse ──────────────────────────────────────
  const handlePickAnswer = (qid, questionIndex, optionIndex) => {
    if (quizState[qid]?.submitted) return;
    setQuizState((prev) => ({
      ...prev,
      [qid]: {
        ...prev[qid],
        answers: { ...(prev[qid]?.answers || {}), [questionIndex]: optionIndex },
        submitted: false,
      },
    }));
  };
 
  // ── Quiz : valider ────────────────────────────────────────────────────────
  const handleSubmitQuiz = async (lesson) => {
    const state = quizState[lesson.id];
    if (!state) return;
 
    // await submitQuizAnswer(courseId, lesson.id, state.answers); // branche l'API ici
 
    const score = lesson.questions.filter(
      (q, i) => state.answers[i] === q.correct
    ).length;
 
    setQuizState((prev) => ({
      ...prev,
      [lesson.id]: { ...prev[lesson.id], submitted: true, score },
    }));
 
    if (score >= 1) {
      setLessons((prev) =>
        prev.map((l, i) => {
          if (l.id === lesson.id) return { ...l, done: true };
          if (i === currentIndex + 1) return { ...l, locked: false };
          return l;
        })
      );
    }
  };
 
  // ── Naviguer ──────────────────────────────────────────────────────────────
  const goTo = (lesson) => {
    if (!lesson || lesson.locked) return;
    setCurrent(lesson);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
 
  // ─────────────────────────────────────────────────────────────────────────
 
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" />
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/courses" className="btn btn-outline-secondary">
          ← Retour aux cours
        </Link>
      </div>
    );
  }
 
  return (
    <div style={{ backgroundColor: "#F4F7FB", minHeight: "100vh" }}>
      {/* ── Top bar ── */}
      <div
        className="d-flex align-items-center justify-content-between px-4 py-3"
        style={{ background: "#1E3A5F", color: "white" }}
      >
        <Link
          to={`/courses/${courseId}`}
          className="text-white text-decoration-none d-flex align-items-center gap-2"
          style={{ fontSize: "14px" }}
        >
          <ArrowLeft size={16} /> Retour
        </Link>
 
        <div className="d-flex align-items-center gap-3">
          <div
            style={{
              width: "160px",
              height: "5px",
              background: "rgba(255,255,255,0.25)",
              borderRadius: "99px",
            }}
          >
            <div
              style={{
                width: `${progressPct}%`,
                height: "100%",
                background: "#10B981",
                borderRadius: "99px",
                transition: "width 0.4s",
              }}
            />
          </div>
          <span style={{ fontSize: "12px", opacity: 0.8 }}>
            {completedCount}/{lessons.length}
          </span>
        </div>
      </div>
 
      {/* ── Steps bar ── */}
      <div
        className="d-flex align-items-center px-4 py-3 gap-1 overflow-auto"
        style={{
          background: "white",
          borderBottom: "0.5px solid #e5e5e5",
        }}
      >
        {lessons.map((l, i) => (
          <div key={l.id} className="d-flex align-items-center">
            {i > 0 && (
              <div
                style={{
                  width: "24px",
                  height: "2px",
                  background: lessons[i - 1].done ? "#10B981" : "#e5e5e5",
                  margin: "0 4px",
                  flexShrink: 0,
                }}
              />
            )}
            <div
              onClick={() => goTo(l)}
              title={l.title}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 500,
                flexShrink: 0,
                cursor: l.locked ? "not-allowed" : "pointer",
                opacity: l.locked ? 0.4 : 1,
                border: `1.5px solid ${
                  l.done
                    ? "#10B981"
                    : l.id === current?.id
                    ? l.type === "quiz"
                      ? "#F59E0B"
                      : "#1E3A5F"
                    : "#ddd"
                }`,
                background: l.done
                  ? "#10B981"
                  : l.id === current?.id
                  ? l.type === "quiz"
                    ? "#F59E0B"
                    : "#1E3A5F"
                  : "#f5f5f5",
                color: l.done || l.id === current?.id ? "white" : "#888",
                transition: "all 0.2s",
              }}
            >
              {l.done ? "✓" : l.type === "quiz" ? "Q" : i / 2 + 1}
            </div>
          </div>
        ))}
      </div>
 
      {/* ── Contenu principal ── */}
      <div style={{ maxWidth: "720px", margin: "2rem auto", padding: "0 1.5rem 4rem" }}>
        {current?.type === "lesson" ? (
          <LessonView lesson={current} />
        ) : (
          <QuizView
            lesson={current}
            state={quizState[current?.id]}
            onPick={handlePickAnswer}
            onSubmit={handleSubmitQuiz}
          />
        )}
 
        {/* ── Actions ── */}
        <div className="d-flex justify-content-between align-items-center mt-4">
          <button
            className="btn btn-outline-secondary"
            disabled={!prevLesson}
            onClick={() => goTo(prevLesson)}
          >
            ← Précédent
          </button>
 
          {current?.type === "lesson" && !current?.done && (
            <button
              className="btn text-white fw-semibold"
              style={{ background: "#1E3A5F" }}
              onClick={handleCompleteLesson}
            >
              Marquer comme terminé <ArrowRight size={15} />
            </button>
          )}
 
          {current?.type === "lesson" && current?.done && nextLesson && (
            <button
              className="btn text-white fw-semibold"
              style={{ background: "#10B981" }}
              onClick={() => goTo(nextLesson)}
            >
              Suivant <ArrowRight size={15} />
            </button>
          )}
 
          {current?.type === "quiz" &&
            quizState[current?.id]?.submitted &&
            nextLesson && (
              <button
                className="btn text-white fw-semibold"
                style={{ background: "#1E3A5F" }}
                onClick={() => goTo(nextLesson)}
              >
                Suivant <ArrowRight size={15} />
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
 
// ─── Composant Leçon ─────────────────────────────────────────────────────────
function LessonView({ lesson }) {
  return (
    <div
      className="p-4"
      style={{
        background: "white",
        borderRadius: "12px",
        border: "0.5px solid #e5e5e5",
      }}
    >
      <span
        className="badge mb-3"
        style={{ background: "#EAF3DE", color: "#3B6D11", fontWeight: 500 }}
      >
        Leçon
      </span>
      <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "1rem" }}>
        {lesson.title}
      </h2>
      <div
        style={{ fontSize: "15px", lineHeight: 1.7, color: "#555" }}
        dangerouslySetInnerHTML={{ __html: lesson.content }}
      />
      {lesson.code && (
        <pre
          style={{
            background: "#0f172a",
            color: "#7dd3b0",
            borderRadius: "8px",
            padding: "1rem",
            fontSize: "13px",
            marginTop: "1rem",
            overflowX: "auto",
          }}
        >
          {lesson.code}
        </pre>
      )}
      {lesson.done && (
        <div
          className="d-flex align-items-center gap-2 mt-3"
          style={{ color: "#10B981", fontSize: "14px" }}
        >
          <CheckCircle size={16} /> Leçon terminée
        </div>
      )}
    </div>
  );
}
 
// ─── Composant Quiz ──────────────────────────────────────────────────────────
function QuizView({ lesson, state, onPick, onSubmit }) {
  if (!lesson) return null;
 
  const allAnswered = lesson.questions?.every(
    (_, i) => state?.answers?.[i] !== undefined
  );
 
  const score = state?.submitted
    ? lesson.questions.filter((q, i) => state.answers[i] === q.correct).length
    : null;
 
  return (
    <div
      className="p-4"
      style={{
        background: "white",
        borderRadius: "12px",
        border: "0.5px solid #e5e5e5",
      }}
    >
      <span
        className="badge mb-3"
        style={{ background: "#FEF3C7", color: "#92400E", fontWeight: 500 }}
      >
        Quiz
      </span>
      <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "1.5rem" }}>
        {lesson.title}
      </h2>
 
      {lesson.questions?.map((q, qi) => (
        <div key={q.id} style={{ marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "15px", fontWeight: 500, marginBottom: "0.75rem" }}>
            {qi + 1}. {q.question}
          </p>
          <div className="d-flex flex-column gap-2">
            {q.options.map((opt, oi) => {
              let bg = "white";
              let border = "0.5px solid #ddd";
              let color = "#1a1a1a";
 
              if (state?.submitted) {
                if (oi === q.correct) {
                  bg = "#EAF3DE"; border = "0.5px solid #10B981"; color = "#27500A";
                } else if (state?.answers?.[qi] === oi) {
                  bg = "#FCEBEB"; border = "0.5px solid #E24B4A"; color = "#791F1F";
                }
              } else if (state?.answers?.[qi] === oi) {
                bg = "#E6F1FB"; border = "0.5px solid #1E3A5F"; color = "#0C447C";
              }
 
              return (
                <div
                  key={oi}
                  onClick={() => onPick(lesson.id, qi, oi)}
                  style={{
                    padding: "11px 1rem",
                    borderRadius: "8px",
                    border,
                    background: bg,
                    color,
                    fontSize: "14px",
                    cursor: state?.submitted ? "default" : "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {opt}
                </div>
              );
            })}
          </div>
        </div>
      ))}
 
      {!state?.submitted && (
        <button
          className="btn w-100 text-white fw-semibold"
          style={{ background: "#10B981" }}
          disabled={!allAnswered}
          onClick={() => onSubmit(lesson)}
        >
          Valider le quiz
        </button>
      )}
 
      {state?.submitted && (
        <div
          className="text-center p-4 mt-2"
          style={{
            background: "#f8f8f8",
            borderRadius: "10px",
            border: "0.5px solid #e5e5e5",
          }}
        >
          <div style={{ fontSize: "32px", fontWeight: 600, color: "#10B981" }}>
            {score}/{lesson.questions.length}
          </div>
          <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
            {score === lesson.questions.length
              ? "Parfait !"
              : "Bonne tentative !"}{" "}
            — {Math.round((score / lesson.questions.length) * 100)}%
          </div>
        </div>
      )}
    </div>
  );
}