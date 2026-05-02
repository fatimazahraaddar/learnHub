import { useEffect, useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";
import { Download, TrendingUp, Users, BookOpen, Star } from "lucide-react";
import { fetchAdminReportsData } from "../../../../api";

const RANGE_OPTIONS = ["This Month", "Last 6 Months", "This Year"];

const EMPTY_DATA = {
  categoryData: [],
  completionData: [],
  geoData: [],
  kpis: { newUsers: 0, enrollments: 0, rating: "0.0" },
};

export function AdminStatistics() {
  const [reports, setReports]         = useState(EMPTY_DATA);
  const [activeRange, setActiveRange] = useState("Last 6 Months");
  const [loading, setLoading]         = useState(true);
  const [info, setInfo]               = useState("");
  const [error, setError]             = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const { ok, data } = await fetchAdminReportsData();
        if (cancelled) return;
        if (!ok || !data) { setError("Failed to load reports."); return; }
        setReports({
          categoryData:  Array.isArray(data.categoryData)  ? data.categoryData  : [],
          completionData: Array.isArray(data.completionData) ? data.completionData : [],
          geoData:       Array.isArray(data.geoData)       ? data.geoData       : [],
          kpis:          data.kpis || EMPTY_DATA.kpis,
        });
      } catch {
        if (!cancelled) setError("An error occurred.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [activeRange]);

  const maxGeoUsers = useMemo(() => {
    if (!reports.geoData.length) return 1;
    return Math.max(...reports.geoData.map((i) => i.users || 0), 1);
  }, [reports.geoData]);

  const handleExport = () => {
    if (!reports.categoryData.length) { setInfo("No data to export."); return; }
    const csv = [
      ["category", "students"].join(","),
      ...reports.categoryData.map((r) => [r.name, r.students].join(",")),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `report-${activeRange.toLowerCase().replace(/\s+/g, "-")}.csv`;
    a.click();
    setInfo(`Exported for ${activeRange}.`);
  };

  return (
    <div className="container my-4">

      {/* CONTROLS */}
      <div className="d-flex justify-content-end mb-3 flex-wrap gap-2">
        {RANGE_OPTIONS.map((range) => (
          <button
            key={range}
            type="button"
            className="btn btn-sm"
            style={{
              backgroundColor: range === activeRange ? "#4A90E2" : "white",
              color: range === activeRange ? "white" : "#555",
              border: "1px solid #ced4da",
            }}
            onClick={() => { setActiveRange(range); setInfo(`Range: ${range}`); }}
          >
            {range}
          </button>
        ))}
        <button className="btn btn-success btn-sm d-flex align-items-center gap-1" type="button" onClick={handleExport}>
          <Download size={16} /> Export
        </button>
      </div>

      {info  && <div className="alert alert-info py-2">{info}</div>}
      {error && <div className="alert alert-danger py-2">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2 text-muted">Loading reports...</p>
        </div>
      ) : (
        <>
          {/* KPIs — sans Revenue */}
          <div className="row g-3 mb-4">
            {[
              { icon: Users,    label: "New Users",   value: `+${reports.kpis.newUsers}`,    color: "#4A90E2" },
              { icon: BookOpen, label: "Enrollments", value: reports.kpis.enrollments,        color: "#7F3FBF" },
              { icon: Star,     label: "Avg Rating",  value: `${reports.kpis.rating}/5`,      color: "#FF7A00" },
              { icon: TrendingUp, label: "Completion", value: reports.completionData.length
                  ? `${reports.completionData.at(-1)?.rate ?? 0}%` : "0%",                    color: "#28A745" },
            ].map((kpi) => (
              <div key={kpi.label} className="col-6 col-lg-3">
                <div className="card shadow-sm border h-100">
                  <div className="card-body">
                    <kpi.icon size={24} className="mb-2" style={{ color: kpi.color }} />
                    <h5 className="fw-bold" style={{ color: kpi.color }}>{kpi.value}</h5>
                    <p className="mb-0 text-muted small">{kpi.label}</p>
                    <p className="mb-0 text-muted" style={{ fontSize: "0.7rem" }}>{activeRange}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CHARTS */}
          <div className="row g-4">

            {/* Enrollments par catégorie */}
            <div className="col-lg-6">
              <div className="card shadow-sm border h-100">
                <div className="card-body">
                  <h5 className="card-title mb-3">Enrollments by Category</h5>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={reports.categoryData} layout="vertical" barSize={14}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#666" }} />
                      <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={100} />
                      <Tooltip formatter={(v) => [v, "Students"]} />
                      <Bar dataKey="students" fill="#4A90E2" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Taux de complétion */}
            <div className="col-lg-6">
              <div className="card shadow-sm border h-100">
                <div className="card-body">
                  <h5 className="card-title mb-3">Course Completion Rate</h5>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={reports.completionData}>
                      <defs>
                        <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#28A745" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#28A745" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#666" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#666" }} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                      <Tooltip formatter={(v) => [`${v}%`, "Completion"]} />
                      <Area type="monotone" dataKey="rate" stroke="#28A745" strokeWidth={2.5} fill="url(#compGrad)" dot={{ fill: "#28A745", r: 4 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* DISTRIBUTION */}
          <div className="card shadow-sm border mt-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Users Distribution</h5>
              <div className="d-flex flex-column gap-3">
                {reports.geoData.length === 0 ? (
                  <p className="text-muted mb-0">No data available.</p>
                ) : (
                  reports.geoData.map((item) => (
                    <div key={item.country} className="d-flex align-items-center gap-3">
                      <div className="text-muted" style={{ width: "120px", fontSize: "0.85rem" }}>
                        {item.country}
                      </div>
                      <div className="progress flex-grow-1" style={{ height: "24px" }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${((item.users || 0) / maxGeoUsers) * 100}%`,
                            backgroundColor: item.color || "#4A90E2",
                          }}
                        >
                          {(item.users || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}