import { Star } from "lucide-react";

export function AnalyticsPage() {
return ( <div className="container-fluid py-4">


  {/* HEADER */}
  <div className="mb-4">
    <h3 className="fw-bold">Analytics</h3>
    <p className="text-muted">Track performance and earnings.</p>
  </div>

  {/* STATS CARDS */}
  <div className="row g-4 mb-4">

    <div className="col-md-6 col-lg-3">
      <div className="card text-center shadow-sm p-3">
        <h4 className="text-primary fw-bold">124,500</h4>
        <small className="text-muted">Total Views</small>
      </div>
    </div>

    <div className="col-md-6 col-lg-3">
      <div className="card text-center shadow-sm p-3">
        <h4 className="text-purple fw-bold" style={{ color: "#7F3FBF" }}>2,450</h4>
        <small className="text-muted">Enrollments</small>
      </div>
    </div>

    <div className="col-md-6 col-lg-3">
      <div className="card text-center shadow-sm p-3">
        <h4 className="text-success fw-bold">$28,420</h4>
        <small className="text-muted">Revenue</small>
      </div>
    </div>

    <div className="col-md-6 col-lg-3">
      <div className="card text-center shadow-sm p-3">
        <h4 className="fw-bold" style={{ color: "#FF7A00" }}>
          4.8 <Star size={18} />
        </h4>
        <small className="text-muted">Avg Rating</small>
      </div>
    </div>

  </div>

  {/* BIG ANALYTICS BOX */}
  <div className="card shadow-sm p-5 text-center">

    <div className="mb-3" style={{ fontSize: "40px", opacity: 0.2 }}>
      📊
    </div>

    <p className="text-muted">
      Detailed analytics charts are available in the full version.
    </p>

  </div>

</div>

);
}
