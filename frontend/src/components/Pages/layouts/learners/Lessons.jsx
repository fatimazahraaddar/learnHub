import { useEffect, useState } from "react";
import { CheckCircle, ChevronRight, ChevronLeft, BookOpen, HelpCircle, Code } from "lucide-react";
import { fetchLearnerLessonsData, updateEnrollmentProgress, getStoredUser } from "../../../../api";
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
 
  .ll-wrap { font-family: 'DM Sans', sans-serif; padding: 24px; }
 
  /* ── Tabs ── */
  .ll-tabs {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 20px;
    border-bottom: 1px solid #E8ECF0;
    padding-bottom: 0;
  }
  .ll-tab {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 16px; border-radius: 10px 10px 0 0;
    border: 1px solid transparent; border-bottom: none;
    font-size: 0.875rem; font-weight: 600; color: #8492A6;
    cursor: pointer; background: transparent;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.15s, background 0.15s;
    margin-bottom: -1px;
  }
  .ll-tab:hover { color: #4A5568; background: #F6F8FA; }
  .ll-tab.active-lessons {
    color: #4A90E2; background: #fff;
    border-color: #E8ECF0; border-bottom-color: #fff;
  }
  .ll-tab.active-quiz {
    color: #D97706; background: #fff;
    border-color: #E8ECF0; border-bottom-color: #fff;
  }
  .ll-tab-badge {
    display: inline-flex; align-items: center;
    padding: 1px 7px; border-radius: 20px;
    font-size: 0.7rem; font-weight: 700;
  }
  .ll-tab-badge.blue   { background: #EBF4FF; color: #4A90E2; }
  .ll-tab-badge.amber  { background: #FFFBEB; color: #D97706; }
 
  .ll-progress-info {
    display: flex; align-items: center; gap: 10px;
    margin-left: auto; padding-bottom: 12px;
  }
  .ll-progress-track {
    width: 110px; height: 5px; border-radius: 99px;
    background: #E8ECF0; overflow: hidden;
  }
  .ll-progress-fill {
    height: 100%; border-radius: 99px; background: #16A34A;
    transition: width 0.4s ease;
  }
  .ll-progress-label { font-size: 0.78rem; font-weight: 700; color: #16A34A; }
  .ll-progress-count { font-size: 0.78rem; color: #8492A6; }
 
  /* ── Sidebar ── */
  .ll-sidebar {
    background: #fff; border: 1px solid #E8ECF0;
    border-radius: 14px; overflow: hidden;
  }
  .ll-sidebar-header {
    padding: 14px 18px; border-bottom: 1px solid #F0F3F7;
    font-size: 0.875rem; font-weight: 700; color: #1A202C;
  }
  .ll-sidebar-list { max-height: 500px; overflow-y: auto; }
  .ll-sidebar-list::-webkit-scrollbar { width: 4px; }
  .ll-sidebar-list::-webkit-scrollbar-track { background: transparent; }
  .ll-sidebar-list::-webkit-scrollbar-thumb { background: #E8ECF0; border-radius: 99px; }
 
  .ll-lesson-btn {
    display: flex; align-items: flex-start; gap: 10px;
    width: 100%; padding: 12px 16px;
    border: none; border-bottom: 1px solid #F0F3F7;
    background: transparent; text-align: left;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
  }
  .ll-lesson-btn:last-child { border-bottom: none; }
  .ll-lesson-btn:hover:not(.is-active) { background: #FAFBFC; }
  .ll-lesson-btn.is-active { background: linear-gradient(135deg, #4A90E2, #7F3FBF); }
 
  .ll-lesson-num {
    width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; font-weight: 700; margin-top: 1px;
  }
  .ll-lesson-num.done      { background: #ECFDF5; color: #16A34A; }
  .ll-lesson-num.pending   { background: #F0F3F7; color: #8492A6; }
  .ll-lesson-num.active    { background: rgba(255,255,255,0.25); color: #fff; }
 
  .ll-lesson-title { font-size: 0.875rem; font-weight: 600; color: #1A202C; margin: 0 0 2px; line-height: 1.3; }
  .ll-lesson-title.active { color: #fff; }
  .ll-lesson-sub { font-size: 0.72rem; color: #8492A6; }
  .ll-lesson-sub.active   { color: rgba(255,255,255,0.7); }
 
  .ll-quiz-btn {
    display: flex; align-items: center; gap: 10px;
    width: 100%; padding: 12px 16px;
    border: none; border-bottom: 1px solid #F0F3F7;
    background: transparent; text-align: left;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
  }
  .ll-quiz-btn:last-child { border-bottom: none; }
  .ll-quiz-btn:hover:not(.is-active) { background: #FAFBFC; }
  .ll-quiz-btn.is-active { background: linear-gradient(135deg, #D97706, #F59E0B); }
  .ll-quiz-title { font-size: 0.875rem; font-weight: 600; color: #1A202C; margin: 0 0 2px; }
  .ll-quiz-title.active { color: #fff; }
  .ll-quiz-sub { font-size: 0.72rem; color: #8492A6; }
  .ll-quiz-sub.active { color: rgba(255,255,255,0.7); }
 
  /* ── Content card ── */
  .ll-content-card {
    background: #fff; border: 1px solid #E8ECF0;
    border-radius: 14px; overflow: hidden;
  }
  .ll-content-header {
    padding: 16px 24px; border-bottom: 1px solid #F0F3F7;
    display: flex; align-items: center; gap: 10px;
  }
  .ll-content-title { font-size: 1.05rem; font-weight: 700; color: #1A202C; margin: 0; }
  .ll-content-body  { padding: 24px; }
 
  .ll-desc { font-size: 0.9rem; line-height: 1.8; color: #2D3748; white-space: pre-wrap; margin-bottom: 20px; }
 
  .ll-code-label {
    display: flex; align-items: center; gap: 6px;
    font-size: 0.72rem; font-weight: 700; color: #8492A6;
    text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;
  }
  .ll-code-block {
    background: #1A202C; color: #E2E8F0;
    padding: 20px; border-radius: 10px;
    overflow-x: auto; font-size: 0.85rem; line-height: 1.7;
    margin: 0 0 24px; font-family: 'Fira Code', 'Courier New', monospace;
  }
 
  .ll-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 18px; border-radius: 10px; border: none;
    font-size: 0.875rem; font-weight: 600; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: opacity 0.15s, transform 0.15s;
  }
  .ll-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  .ll-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
 
  .ll-btn-primary {
    background: linear-gradient(135deg, #4A90E2, #7F3FBF);
    color: #fff; box-shadow: 0 2px 8px rgba(74,144,226,0.3);
  }
  .ll-btn-success {
    background: #ECFDF5; color: #16A34A;
    border: 1px solid #A7F3D0 !important;
  }
  .ll-btn-outline {
    background: #fff; color: #4A5568;
    border: 1px solid #E2E8F0 !important;
  }
 
  .ll-nav { display: flex; align-items: center; gap: 10px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #F0F3F7; }
 
  /* ── Quiz ── */
  .ll-question-card {
    border: 1px solid #E8ECF0; border-radius: 12px;
    padding: 18px; margin-bottom: 16px;
  }
  .ll-question-text { font-size: 0.9rem; font-weight: 700; color: #1A202C; margin: 0 0 14px; }
  .ll-option {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 9px; margin-bottom: 8px;
    cursor: pointer; border: 1px solid #E2E8F0; background: #F8FAFC;
    transition: border-color 0.15s, background 0.15s;
    font-size: 0.875rem; color: #2D3748;
  }
  .ll-option:last-child { margin-bottom: 0; }
  .ll-option.selected  { border-color: #4A90E2; background: #EBF4FF; color: #1A202C; }
  .ll-option.correct   { border-color: #16A34A; background: #ECFDF5; color: #14532D; }
  .ll-option.wrong     { border-color: #dc2626; background: #FFF5F5; color: #7F1D1D; }
  .ll-option.disabled  { cursor: default; }
 
  .ll-score-banner {
    display: flex; align-items: center; gap: 14px;
    padding: 16px 20px; border-radius: 12px;
    background: #ECFDF5; border: 1px solid #A7F3D0; margin-top: 8px;
  }
  .ll-score-title { font-size: 0.95rem; font-weight: 700; color: #14532D; margin: 0 0 2px; }
  .ll-score-sub   { font-size: 0.82rem; color: #16A34A; margin: 0; }
 
  .ll-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 60px 20px; gap: 12px;
    color: #A0AEC0; font-size: 0.875rem;
  }
 
  .ll-layout { display: grid; grid-template-columns: 300px 1fr; gap: 20px; align-items: start; }
  @media (max-width: 768px) { .ll-layout { grid-template-columns: 1fr; } }
`;
 
export function LearnerLessons() {
  const [lessons, setLessons]           = useState([]);
  const [quizzes, setQuizzes]           = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeQuiz, setActiveQuiz]     = useState(null);
  const [tab, setTab]                   = useState("lessons");
  const [answers, setAnswers]           = useState({});
  const [submitted, setSubmitted]       = useState(false);
 
  useEffect(() => {
    const load = async () => {
      const user = getStoredUser();
      if (!user?.id) return;
      const { ok, data } = await fetchLearnerLessonsData(user.id);
      if (!ok || !data?.status) return;
      const list  = Array.isArray(data.lessons) ? data.lessons : [];
      const qlist = Array.isArray(data.quizzes) ? data.quizzes : [];
      setLessons(list);
      setQuizzes(qlist);
      setActiveLesson(list[0] || null);
    };
    load();
  }, []);
 
  const completedCount = lessons.filter((l) => l.completed).length;
  const progress       = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;
  const activeIndex    = activeLesson ? lessons.findIndex((l) => l.id === activeLesson.id) : -1;
 
  const score = activeQuiz
    ? activeQuiz.questions.filter((q, i) => answers[i] === q.correct).length
    : 0;
 
  const handleMarkComplete = async () => {
    const updatedLessons = lessons.map((l) =>
      l.id === activeLesson.id ? { ...l, completed: true } : l
    );
    setLessons(updatedLessons);
    setActiveLesson((prev) => prev ? { ...prev, completed: true } : prev);
    const completed  = updatedLessons.filter((l) => l.completed).length;
    const newProgress = Math.round((completed / updatedLessons.length) * 100);
    await updateEnrollmentProgress(activeLesson.course_id, newProgress);
  };
 
  const scoreLabel = submitted && activeQuiz
    ? score === activeQuiz.questions.length
      ? "Parfait ! 🎉"
      : score >= activeQuiz.questions.length / 2
        ? "Bien joué !"
        : "Continue à t'entraîner !"
    : "";
 
  return (
    <div className="ll-wrap">
      <style>{styles}</style>
 
      {/* Tabs */}
      <div className="ll-tabs">
        <button
          className={`ll-tab${tab === "lessons" ? " active-lessons" : ""}`}
          onClick={() => setTab("lessons")} type="button"
        >
          <BookOpen size={14} />
          Leçons
          <span className="ll-tab-badge blue">{lessons.length}</span>
        </button>
 
        <button
          className={`ll-tab${tab === "quiz" ? " active-quiz" : ""}`}
          onClick={() => setTab("quiz")} type="button"
        >
          <HelpCircle size={14} />
          Quiz
          <span className="ll-tab-badge amber">{quizzes.length}</span>
        </button>
 
        {tab === "lessons" && lessons.length > 0 && (
          <div className="ll-progress-info">
            <span className="ll-progress-count">{completedCount}/{lessons.length}</span>
            <div className="ll-progress-track">
              <div className="ll-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="ll-progress-label">{progress}%</span>
          </div>
        )}
      </div>
 
      {/* ── Lessons tab ── */}
      {tab === "lessons" && (
        <div className="ll-layout">
 
          {/* Sidebar */}
          <div className="ll-sidebar">
            <div className="ll-sidebar-header">Leçons du cours</div>
            <div className="ll-sidebar-list">
              {lessons.length === 0 && (
                <div className="ll-empty" style={{ padding: "30px 16px" }}>
                  Aucune leçon disponible.
                </div>
              )}
              {lessons.map((lesson, idx) => {
                const isActive = activeLesson?.id === lesson.id;
                return (
                  <button
                    key={lesson.id}
                    className={`ll-lesson-btn${isActive ? " is-active" : ""}`}
                    onClick={() => setActiveLesson(lesson)}
                    type="button"
                  >
                    <div className={`ll-lesson-num${lesson.completed ? " done" : isActive ? " active" : " pending"}`}>
                      {lesson.completed
                        ? <CheckCircle size={13} />
                        : idx + 1
                      }
                    </div>
                    <div>
                      <p className={`ll-lesson-title${isActive ? " active" : ""}`}>{lesson.title}</p>
                      <span className={`ll-lesson-sub${isActive ? " active" : ""}`}>
                        {lesson.duration || "Self paced"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
 
          {/* Content */}
          {activeLesson ? (
            <div className="ll-content-card">
              <div className="ll-content-header">
                <BookOpen size={16} color="#4A90E2" />
                <p className="ll-content-title">{activeLesson.title}</p>
                {activeLesson.completed && (
                  <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.78rem", fontWeight: 600, color: "#16A34A" }}>
                    <CheckCircle size={13} /> Complétée
                  </span>
                )}
              </div>
              <div className="ll-content-body">
                {activeLesson.description && (
                  <div className="ll-desc">{activeLesson.description}</div>
                )}
 
                {activeLesson.code && (
                  <div>
                    <div className="ll-code-label">
                      <Code size={13} color="#4A90E2" /> Code exemple
                    </div>
                    <pre className="ll-code-block"><code>{activeLesson.code}</code></pre>
                  </div>
                )}
 
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    className={`ll-btn ${activeLesson.completed ? "ll-btn-success" : "ll-btn-primary"}`}
                    type="button"
                    disabled={activeLesson.completed}
                    onClick={handleMarkComplete}
                  >
                    {activeLesson.completed
                      ? <><CheckCircle size={14} /> Complétée</>
                      : "Marquer comme complétée"
                    }
                  </button>
                </div>
 
                <div className="ll-nav">
                  <button
                    className="ll-btn ll-btn-outline"
                    type="button"
                    disabled={activeIndex <= 0}
                    onClick={() => activeIndex > 0 && setActiveLesson(lessons[activeIndex - 1])}
                  >
                    <ChevronLeft size={15} /> Précédente
                  </button>
                  <button
                    className="ll-btn ll-btn-primary"
                    style={{ marginLeft: "auto" }}
                    type="button"
                    disabled={activeIndex >= lessons.length - 1}
                    onClick={() => activeIndex < lessons.length - 1 && setActiveLesson(lessons[activeIndex + 1])}
                  >
                    Suivante <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="ll-content-card">
              <div className="ll-empty">
                <BookOpen size={36} color="#CBD5E0" />
                <span>Sélectionne une leçon pour commencer</span>
              </div>
            </div>
          )}
        </div>
      )}
 
      {/* ── Quiz tab ── */}
      {tab === "quiz" && (
        <div className="ll-layout">
 
          {/* Sidebar */}
          <div className="ll-sidebar">
            <div className="ll-sidebar-header">Quiz disponibles</div>
            <div className="ll-sidebar-list">
              {quizzes.length === 0 && (
                <div className="ll-empty" style={{ padding: "30px 16px" }}>
                  Aucun quiz disponible.
                </div>
              )}
              {quizzes.map((q) => {
                const isActive = activeQuiz?.id === q.id;
                return (
                  <button
                    key={q.id}
                    className={`ll-quiz-btn${isActive ? " is-active" : ""}`}
                    onClick={() => { setActiveQuiz(q); setAnswers({}); setSubmitted(false); }}
                    type="button"
                  >
                    <HelpCircle size={15} color={isActive ? "#fff" : "#D97706"} style={{ flexShrink: 0 }} />
                    <div>
                      <p className={`ll-quiz-title${isActive ? " active" : ""}`}>{q.title || "Quiz"}</p>
                      <span className={`ll-quiz-sub${isActive ? " active" : ""}`}>
                        {q.questions?.length || 0} questions
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
 
          {/* Quiz content */}
          {activeQuiz ? (
            <div className="ll-content-card">
              <div className="ll-content-header">
                <HelpCircle size={16} color="#D97706" />
                <p className="ll-content-title">{activeQuiz.title}</p>
              </div>
              <div className="ll-content-body">
                {activeQuiz.questions.map((q, qi) => (
                  <div key={qi} className="ll-question-card">
                    <p className="ll-question-text">{qi + 1}. {q.question}</p>
                    {q.options.map((opt, oi) => {
                      const selected = answers[qi] === oi;
                      const correct  = submitted && oi === q.correct;
                      const wrong    = submitted && selected && oi !== q.correct;
                      let cls = "ll-option";
                      if (correct)        cls += " correct disabled";
                      else if (wrong)     cls += " wrong disabled";
                      else if (selected)  cls += " selected";
                      if (submitted)      cls += " disabled";
                      return (
                        <label key={oi} className={cls}>
                          <input
                            type="radio"
                            disabled={submitted}
                            checked={selected}
                            onChange={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                            style={{ accentColor: "#4A90E2" }}
                          />
                          <span style={{ flex: 1 }}>{opt}</span>
                          {correct && <CheckCircle size={14} color="#16A34A" />}
                        </label>
                      );
                    })}
                  </div>
                ))}
 
                {!submitted ? (
                  <button
                    className="ll-btn ll-btn-primary"
                    style={{ background: "linear-gradient(135deg, #D97706, #F59E0B)", boxShadow: "0 2px 8px rgba(217,119,6,0.3)" }}
                    disabled={Object.keys(answers).length < activeQuiz.questions.length}
                    onClick={() => setSubmitted(true)}
                    type="button"
                  >
                    Soumettre le quiz
                  </button>
                ) : (
                  <div className="ll-score-banner">
                    <CheckCircle size={28} color="#16A34A" />
                    <div>
                      <p className="ll-score-title">Score : {score} / {activeQuiz.questions.length}</p>
                      <p className="ll-score-sub">{scoreLabel}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="ll-content-card">
              <div className="ll-empty">
                <HelpCircle size={36} color="#CBD5E0" />
                <span>Sélectionne un quiz pour commencer</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}