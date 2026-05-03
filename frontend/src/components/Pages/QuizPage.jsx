import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle } from "lucide-react";
 
// ─── Mock data (remplace par les vraies routes API quand prêtes) ───────────────
const MOCK_QUIZ = {
  id: 1,
  title: "Quiz — Introduction au HTML",
  lesson_title: "Introduction au HTML",
  questions: [
    {
      id: 1,
      question: "Que signifie HTML ?",
      options: [
        "HyperText Markup Language",
        "High Tech Modern Language",
        "HyperText Modern Links",
        "HyperText Module Language",
      ],
      correct: 0,
    },
    {
      id: 2,
      question: "Quelle balise définit le titre principal ?",
      options: ["<title>", "<head>", "<h1>", "<p>"],
      correct: 2,
    },
    {
      id: 3,
      question: "Quelle balise est utilisée pour un paragraphe ?",
      options: ["<div>", "<span>", "<section>", "<p>"],
      correct: 3,
    },
  ],
};
// ─────────────────────────────────────────────────────────────────────────────
 
export function QuizPage() {
  const { courseId, lessonId: _lessonId } = useParams(); // lessonId utilisé quand l'API sera branchée
  const navigate = useNavigate();
 
  // Remplace MOCK_QUIZ par : const { data } = await fetchQuiz(courseId, lessonId);
  const quiz = MOCK_QUIZ;
 
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
 
  const total = quiz.questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round((answeredCount / total) * 100);
 
  const score = submitted
    ? quiz.questions.filter((q, i) => answers[i] === q.correct).length
    : null;
 
  const scorePct = submitted ? Math.round((score / total) * 100) : null;
  const passed = submitted && scorePct >= 50;
 
  const handlePick = (questionIndex, optionIndex) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };
 
  const handleSubmit = async () => {
    if (answeredCount < total) return;
    // await submitQuiz(courseId, lessonId, answers); // branche l'API ici
    setSubmitted(true);
    setCurrentQ(0);
  };
 
  const handleNext = () => {
    if (currentQ < total - 1) setCurrentQ((p) => p + 1);
  };
 
  const handlePrev = () => {
    if (currentQ > 0) setCurrentQ((p) => p - 1);
  };
 
  // ─── Vue résultat ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ backgroundColor: "#F4F7FB", minHeight: "100vh" }}>
        {/* Header */}
        <div
          className="d-flex align-items-center px-4 py-3"
          style={{ background: "#1E3A5F", color: "white" }}
        >
          <button
            onClick={() => navigate(`/courses/${courseId}/learn`)}
            className="btn btn-sm text-white d-flex align-items-center gap-2"
            style={{ background: "transparent", border: "none" }}
          >
            <ArrowLeft size={16} /> Retour au cours
          </button>
        </div>
 
        <div style={{ maxWidth: "640px", margin: "3rem auto", padding: "0 1.5rem" }}>
          {/* Score card */}
          <div
            className="text-center p-5 mb-4"
            style={{
              background: "white",
              borderRadius: "16px",
              border: "0.5px solid #e5e5e5",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: passed ? "#EAF3DE" : "#FCEBEB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
              }}
            >
              {passed ? (
                <CheckCircle size={36} color="#10B981" />
              ) : (
                <XCircle size={36} color="#E24B4A" />
              )}
            </div>
 
            <h2 style={{ fontSize: "22px", fontWeight: 600, marginBottom: "0.5rem" }}>
              {passed ? "Bravo !" : "Pas encore..."}
            </h2>
 
            <p style={{ color: "#666", fontSize: "15px", marginBottom: "1.5rem" }}>
              {passed
                ? "Tu as réussi ce quiz et débloqué la leçon suivante."
                : "Tu n'as pas encore le score minimum. Réessaie !"}
            </p>
 
            <div
              style={{
                fontSize: "48px",
                fontWeight: 700,
                color: passed ? "#10B981" : "#E24B4A",
                marginBottom: "0.25rem",
              }}
            >
              {scorePct}%
            </div>
            <div style={{ color: "#888", fontSize: "14px", marginBottom: "1.5rem" }}>
              {score}/{total} bonnes réponses
            </div>
 
            {/* Progress bar score */}
            <div
              style={{
                height: "8px",
                background: "#f0f0f0",
                borderRadius: "99px",
                overflow: "hidden",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  width: `${scorePct}%`,
                  height: "100%",
                  background: passed ? "#10B981" : "#E24B4A",
                  borderRadius: "99px",
                  transition: "width 0.6s ease",
                }}
              />
            </div>
 
            <div className="d-flex gap-3 justify-content-center">
              {!passed && (
                <button
                  className="btn fw-semibold"
                  style={{
                    background: "#1E3A5F",
                    color: "white",
                    borderRadius: "8px",
                  }}
                  onClick={() => {
                    setAnswers({});
                    setSubmitted(false);
                    setCurrentQ(0);
                  }}
                >
                  Réessayer
                </button>
              )}
              {passed && (
                <button
                  className="btn fw-semibold"
                  style={{
                    background: "#10B981",
                    color: "white",
                    borderRadius: "8px",
                  }}
                  onClick={() => navigate(`/courses/${courseId}/learn`)}
                >
                  Continuer le cours <ArrowRight size={15} />
                </button>
              )}
            </div>
          </div>
 
          {/* Récap des réponses */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              border: "0.5px solid #e5e5e5",
              padding: "1.5rem",
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "1.25rem" }}>
              Récapitulatif
            </h3>
            {quiz.questions.map((q, qi) => {
              const isCorrect = answers[qi] === q.correct;
              return (
                <div
                  key={q.id}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    background: isCorrect ? "#EAF3DE" : "#FCEBEB",
                    border: `0.5px solid ${isCorrect ? "#10B981" : "#E24B4A"}`,
                    marginBottom: "10px",
                  }}
                >
                  <div
                    className="d-flex align-items-start gap-2"
                    style={{ marginBottom: "6px" }}
                  >
                    {isCorrect ? (
                      <CheckCircle size={16} color="#10B981" style={{ flexShrink: 0, marginTop: "2px" }} />
                    ) : (
                      <XCircle size={16} color="#E24B4A" style={{ flexShrink: 0, marginTop: "2px" }} />
                    )}
                    <span style={{ fontSize: "14px", fontWeight: 500, color: isCorrect ? "#27500A" : "#791F1F" }}>
                      {q.question}
                    </span>
                  </div>
                  {!isCorrect && (
                    <div style={{ fontSize: "13px", color: "#27500A", paddingLeft: "22px" }}>
                      Bonne réponse : <strong>{q.options[q.correct]}</strong>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
 
  // ─── Vue quiz (question par question) ────────────────────────────────────
  const q = quiz.questions[currentQ];
 
  return (
    <div style={{ backgroundColor: "#F4F7FB", minHeight: "100vh" }}>
      {/* Header */}
      <div
        className="d-flex align-items-center justify-content-between px-4 py-3"
        style={{ background: "#1E3A5F", color: "white" }}
      >
        <button
          onClick={() => navigate(`/courses/${courseId}/learn`)}
          className="btn btn-sm text-white d-flex align-items-center gap-2"
          style={{ background: "transparent", border: "none" }}
        >
          <ArrowLeft size={16} /> Retour
        </button>
        <span style={{ fontSize: "13px", opacity: 0.8 }}>{quiz.title}</span>
        <span style={{ fontSize: "13px", opacity: 0.8 }}>
          {answeredCount}/{total} répondues
        </span>
      </div>
 
      {/* Progress bar */}
      <div style={{ height: "4px", background: "#e5e5e5" }}>
        <div
          style={{
            width: `${progressPct}%`,
            height: "100%",
            background: "#10B981",
            transition: "width 0.3s",
          }}
        />
      </div>
 
      <div style={{ maxWidth: "640px", margin: "2.5rem auto", padding: "0 1.5rem 4rem" }}>
        {/* Indicateur question */}
        <div
          className="d-flex align-items-center justify-content-between mb-3"
          style={{ fontSize: "13px", color: "#888" }}
        >
          <span>Question {currentQ + 1} sur {total}</span>
          <div className="d-flex gap-1">
            {quiz.questions.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentQ(i)}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 500,
                  cursor: "pointer",
                  background:
                    answers[i] !== undefined
                      ? "#1E3A5F"
                      : i === currentQ
                      ? "#E6F1FB"
                      : "#f0f0f0",
                  color:
                    answers[i] !== undefined
                      ? "white"
                      : i === currentQ
                      ? "#1E3A5F"
                      : "#888",
                  border: i === currentQ ? "1.5px solid #1E3A5F" : "1.5px solid transparent",
                  transition: "all 0.2s",
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
 
        {/* Question card */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            border: "0.5px solid #e5e5e5",
            padding: "2rem",
            marginBottom: "1rem",
          }}
        >
          <span
            className="badge mb-3"
            style={{ background: "#FEF3C7", color: "#92400E", fontWeight: 500 }}
          >
            Quiz
          </span>
          <p style={{ fontSize: "17px", fontWeight: 600, marginBottom: "1.5rem" }}>
            {q.question}
          </p>
 
          <div className="d-flex flex-column gap-2">
            {q.options.map((opt, oi) => {
              const isSelected = answers[currentQ] === oi;
              return (
                <div
                  key={oi}
                  onClick={() => handlePick(currentQ, oi)}
                  style={{
                    padding: "13px 1rem",
                    borderRadius: "8px",
                    border: isSelected
                      ? "1.5px solid #1E3A5F"
                      : "0.5px solid #ddd",
                    background: isSelected ? "#E6F1FB" : "white",
                    color: isSelected ? "#0C447C" : "#1a1a1a",
                    fontSize: "14px",
                    fontWeight: isSelected ? 500 : 400,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: isSelected ? "#1E3A5F" : "#f0f0f0",
                      color: isSelected ? "white" : "#888",
                      fontSize: "11px",
                      fontWeight: 600,
                      textAlign: "center",
                      lineHeight: "22px",
                      marginRight: "10px",
                    }}
                  >
                    {String.fromCharCode(65 + oi)}
                  </span>
                  {opt}
                </div>
              );
            })}
          </div>
        </div>
 
        {/* Navigation */}
        <div className="d-flex justify-content-between align-items-center">
          <button
            className="btn btn-outline-secondary"
            disabled={currentQ === 0}
            onClick={handlePrev}
          >
            ← Précédent
          </button>
 
          {currentQ < total - 1 ? (
            <button
              className="btn fw-semibold"
              style={{ background: "#1E3A5F", color: "white", borderRadius: "8px" }}
              disabled={answers[currentQ] === undefined}
              onClick={handleNext}
            >
              Suivant <ArrowRight size={15} />
            </button>
          ) : (
            <button
              className="btn fw-semibold"
              style={{
                background: answeredCount === total ? "#10B981" : "#ccc",
                color: "white",
                borderRadius: "8px",
              }}
              disabled={answeredCount < total}
              onClick={handleSubmit}
            >
              Valider le quiz ✓
            </button>
          )}
        </div>
 
        {answeredCount < total && currentQ === total - 1 && (
          <p
            className="text-center mt-3"
            style={{ fontSize: "13px", color: "#E24B4A" }}
          >
            Réponds à toutes les questions avant de valider.
          </p>
        )}
      </div>
    </div>
  );
}