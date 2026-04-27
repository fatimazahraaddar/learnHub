import { useEffect, useMemo, useState } from "react";
import { Play, Lock, CheckCircle, ChevronRight, BookOpen } from "lucide-react";
import { fetchLearnerLessonsData, getStoredUser } from "../../../../lib/api";

export function LearnerLessons() {
  const [lessons, setLessons] = useState([]);
  const [activeDiff, setActiveDiff] = useState("All");
  const [activeLesson, setActiveLesson] = useState(null);
  const [playerInfo, setPlayerInfo] = useState("");

  useEffect(() => {
    const load = async () => {
      const user = getStoredUser();
      if (!user?.id) return;

      const { ok, data } = await fetchLearnerLessonsData(user.id);
      if (!ok || !data?.status) return;

      const list = Array.isArray(data.lessons) ? data.lessons : [];
      setLessons(list);
      setActiveLesson(list[0] || null);
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    return activeDiff === "All"
      ? lessons
      : lessons.filter((l) => l.difficulty === activeDiff);
  }, [activeDiff, lessons]);

  const completedCount = lessons.filter((l) => l.completed).length;
  const progress = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;
  const activeIndex = activeLesson ? lessons.findIndex((l) => l.id === activeLesson.id) : -1;

  return (
    <div className="container my-4">
      <div className="d-flex flex-wrap gap-2 align-items-center mb-4">
        {["All", "Easy", "Medium", "Difficult"].map((d) => (
          <button
            key={d}
            onClick={() => setActiveDiff(d)}
            className={`btn btn-sm ${activeDiff === d ? "btn-primary" : "btn-outline-secondary"}`}
            type="button"
          >
            {d}
          </button>
        ))}

        <div className="ms-auto d-flex align-items-center gap-2">
          <small>{completedCount}/{lessons.length} completed</small>

          <div className="progress" style={{ width: "120px", height: "6px" }}>
            <div className="progress-bar bg-success" style={{ width: `${progress}%` }} />
          </div>

          <small className="text-success fw-bold">{progress}%</small>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header fw-bold">Course Lessons</div>

            <div className="list-group list-group-flush" style={{ maxHeight: "600px", overflowY: "auto" }}>
              {filtered.map((lesson) => {
                const isActive = activeLesson?.id === lesson.id;

                return (
                  <button
                    key={lesson.id}
                    disabled={lesson.locked}
                    onClick={() => setActiveLesson(lesson)}
                    className={`list-group-item list-group-item-action ${isActive ? "active" : ""}`}
                    type="button"
                  >
                    <div className="d-flex align-items-start gap-2">
                      {lesson.locked ? (
                        <Lock size={16} />
                      ) : lesson.completed ? (
                        <CheckCircle size={16} className="text-success" />
                      ) : (
                        <Play size={16} />
                      )}

                      <div>
                        <div className="fw-semibold">{lesson.title}</div>
                        <small className="text-muted">{lesson.difficulty} - {lesson.duration}</small>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          {activeLesson ? (
            <>
              <div className="card mb-3">
                <div
                  className="bg-dark text-white d-flex align-items-center justify-content-center"
                  style={{ height: "350px" }}
                >
                  <button className="btn btn-light rounded-circle" type="button" onClick={() => setPlayerInfo(`Playing: ${activeLesson.title}`)}>
                    <Play />
                  </button>
                </div>
              </div>

              <div className="card shadow-sm">
                <div className="card-body">
                  <h4 className="fw-bold">{activeLesson.title}</h4>
                  <p className="text-muted">{activeLesson.description}</p>

                  <div className="d-flex gap-2 mt-3">
                    <button
                      className={`btn ${activeLesson.completed ? "btn-success" : "btn-primary"}`}
                      type="button"
                      onClick={() => {
                        setLessons((prev) =>
                          prev.map((item) =>
                            item.id === activeLesson.id ? { ...item, completed: true } : item
                          )
                        );
                        setActiveLesson((prev) => (prev ? { ...prev, completed: true } : prev));
                      }}
                    >
                      {activeLesson.completed ? "Completed" : "Mark Complete"}
                    </button>
                  </div>
                  {playerInfo ? <small className="text-muted d-block mt-2">{playerInfo}</small> : null}

                  <div className="d-flex mt-4">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      disabled={activeIndex <= 0}
                      onClick={() => {
                        if (activeIndex > 0) setActiveLesson(lessons[activeIndex - 1]);
                      }}
                    >
                      Previous
                    </button>
                    <button
                      className="btn btn-primary ms-auto"
                      type="button"
                      disabled={activeIndex < 0 || activeIndex >= lessons.length - 1}
                      onClick={() => {
                        if (activeIndex >= 0 && activeIndex < lessons.length - 1) {
                          setActiveLesson(lessons[activeIndex + 1]);
                        }
                      }}
                    >
                      Next Lesson <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="card text-center p-5">
              <BookOpen size={40} className="text-muted mx-auto mb-3" />
              <p className="text-muted">Select a lesson to start learning</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
