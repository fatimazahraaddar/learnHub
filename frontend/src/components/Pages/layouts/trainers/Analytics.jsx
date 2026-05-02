import { useEffect, useState } from "react";
import { Star, Eye, Users, BookOpen, Loader2 } from "lucide-react";
import { fetchTrainerAnalytics } from "../../../../api";

export function TrainerAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { ok, data } = await fetchTrainerAnalytics();
      if (!ok) setError("Failed to load analytics.");
      else setStats(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return (
    <div className="text-center py-5">
      <Loader2 size={36} className="text-primary" />
      <p className="text-muted mt-2">Loading analytics...</p>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger m-4">{error}</div>
  );

const cards = [
  { label: "Enrollments",   value: stats.totalEnrollments.toLocaleString(), color: "#7F3FBF", icon: <Users size={20} /> },
  { label: "Total Courses", value: stats.totalCourses,                      color: "#28a745", icon: <BookOpen size={20} /> },
  { label: "Avg Rating",    value: `${stats.avgRating} ★`,                  color: "#FF7A00", icon: <Star size={20} /> },
];

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h3 className="fw-bold">Analytics</h3>
        <p className="text-muted">Track your performance.</p>
      </div>

      <div className="row g-4">
        {cards.map((card) => (
          <div key={card.label} className="col-md-6 col-lg-3">
            <div className="card text-center shadow-sm p-3 h-100">
              <div style={{ color: card.color }} className="mb-1">{card.icon}</div>
              <h4 className="fw-bold" style={{ color: card.color }}>{card.value}</h4>
              <small className="text-muted">{card.label}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}