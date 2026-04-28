import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Download,
  TrendingUp,
  Users,
  BookOpen,
  Star,
} from "lucide-react";
import { fetchAdminReportsData } from "../../../../lib/api";

const RANGE_OPTIONS = ["This Month", "Last 6 Months", "This Year"];

const EMPTY_DATA = {
  categoryData: [],
  completionData: [],
  geoData: [],
  kpis: {
    newUsers: 0,
    enrollments: 0,
    revenue: 0,
    rating: "0.0",
  },
};

export function AdminReports() {
  const [reports, setReports] = useState(EMPTY_DATA);
  const [activeRange, setActiveRange] = useState("Last 6 Months");
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  // ── Fetch Dynamic Data ─────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const loadReports = async () => {
      try {
        setLoading(true);
        setError("");

        // Si ton backend accepte un filtre:
        // fetchAdminReportsData(activeRange)
        const { ok, data } = await fetchAdminReportsData(activeRange);

        if (cancelled) return;

        if (!ok || !data) {
          setError("Failed to load reports.");
          return;
        }

        setReports({
          categoryData: Array.isArray(data.categoryData)
            ? data.categoryData
            : [],
          completionData: Array.isArray(data.completionData)
            ? data.completionData
            : [],
          geoData: Array.isArray(data.geoData) ? data.geoData : [],
          kpis: data.kpis || EMPTY_DATA.kpis,
        });
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError("An error occurred while loading reports.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadReports();

    return () => {
      cancelled = true;
    };
  }, [activeRange]);

  // ── Memoized Max Value ─────────────────────────────────────────────
  const maxGeoUsers = useMemo(() => {
    if (!reports.geoData.length) return 1;
    return Math.max(...reports.geoData.map((item) => item.users || 0), 1);
  }, [reports.geoData]);

  // ── Export CSV ─────────────────────────────────────────────────────
  const handleExport = () => {
    if (!reports.categoryData.length) {
      setInfo("No report data available for export.");
      return;
    }

    const headers = ["category", "students", "revenue"];
    const rows = reports.categoryData.map((item) => [
      item.name,
      item.students,
      item.revenue,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `admin-reports-${activeRange
      .toLowerCase()
      .replace(/\s+/g, "-")}.csv`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    setInfo(`Report exported for ${activeRange}.`);
  };

  return (
    <div className="container my-4">
      {/* ── Header Controls ───────────────────────────────────── */}
      <div className="d-flex justify-content-end mb-3 flex-wrap gap-2">
        {RANGE_OPTIONS.map((range) => (
          <button
            key={range}
            className="btn btn-sm"
            type="button"
            style={{
              backgroundColor:
                range === activeRange ? "#4A90E2" : "white",
              color: range === activeRange ? "white" : "#555",
              border: "1px solid #ced4da",
            }}
            onClick={() => {
              setActiveRange(range);
              setInfo(`Range selected: ${range}`);
            }}
          >
            {range}
          </button>
        ))}

        <button
          className="btn btn-success btn-sm d-flex align-items-center gap-1"
          type="button"
          onClick={handleExport}
        >
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* ── Alerts ────────────────────────────────────────────── */}
      {info && (
        <div className="alert alert-info py-2">
          {info}
        </div>
      )}

      {error && (
        <div className="alert alert-danger py-2">
          {error}
        </div>
      )}

      {/* ── Loading ───────────────────────────────────────────── */}
      {loading ? (
        <div className="text-center py-5">
          <div
            className="spinner-border text-primary"
            role="status"
          />
          <p className="mt-2 text-muted">Loading reports...</p>
        </div>
      ) : (
        <>
          {/* ── KPI Cards ───────────────────────────────────── */}
          <div className="row g-3 mb-4">
            {[
              {
                icon: Users,
                label: "New Users",
                value: `+${reports.kpis.newUsers || 0}`,
                period: activeRange,
                color: "#4A90E2",
              },
              {
                icon: BookOpen,
                label: "Enrollments",
                value: String(reports.kpis.enrollments || 0),
                period: activeRange,
                color: "#7F3FBF",
              },
              {
                icon: TrendingUp,
                label: "Revenue",
                value: `$${Number(
                  reports.kpis.revenue || 0
                ).toFixed(2)}`,
                period: activeRange,
                color: "#28A745",
              },
              {
                icon: Star,
                label: "Avg Rating",
                value: `${reports.kpis.rating || "0.0"}/5`,
                period: "Across all courses",
                color: "#FF7A00",
              },
            ].map((kpi) => (
              <div key={kpi.label} className="col-6 col-lg-3">
                <div className="card shadow-sm border h-100">
                  <div className="card-body">
                    <kpi.icon
                      size={24}
                      className="mb-2"
                      style={{ color: kpi.color }}
                    />
                    <h5
                      className="fw-bold"
                      style={{ color: kpi.color }}
                    >
                      {kpi.value}
                    </h5>
                    <p className="mb-0 text-muted small">
                      {kpi.label}
                    </p>
                    <p
                      className="mb-0 text-muted"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {kpi.period}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Charts ───────────────────────────────────────── */}
          <div className="row g-4">
            {/* Revenue by Category */}
            <div className="col-lg-6">
              <div className="card shadow-sm border h-100">
                <div className="card-body">
                  <h5 className="card-title mb-3">
                    Revenue by Category
                  </h5>

                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={reports.categoryData}
                      layout="vertical"
                      barSize={14}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f0f0f0"
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "#666" }}
                        tickFormatter={(v) => `$${v / 1000}K`}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        width={100}
                      />
                      <Tooltip
                        formatter={(v) => [
                          `$${Number(v).toLocaleString()}`,
                          "Revenue",
                        ]}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="#4A90E2"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="col-lg-6">
              <div className="card shadow-sm border h-100">
                <div className="card-body">
                  <h5 className="card-title mb-3">
                    Course Completion Rate
                  </h5>

                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={reports.completionData}>
                      <defs>
                        <linearGradient
                          id="compGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#28A745"
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="95%"
                            stopColor="#28A745"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f0f0f0"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 11,
                          fill: "#666",
                        }}
                      />

                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 11,
                          fill: "#666",
                        }}
                        tickFormatter={(v) => `${v}%`}
                        domain={[0, 100]}
                      />

                      <Tooltip
                        formatter={(v) => [
                          `${v}%`,
                          "Completion Rate",
                        ]}
                      />

                      <Area
                        type="monotone"
                        dataKey="rate"
                        stroke="#28A745"
                        strokeWidth={2.5}
                        fill="url(#compGrad)"
                        dot={{
                          fill: "#28A745",
                          r: 4,
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* ── Users by Region / Role ───────────────────────── */}
          <div className="card shadow-sm border mt-4">
            <div className="card-body">
              <h5 className="card-title mb-3">
                Users Distribution
              </h5>

              <div className="d-flex flex-column gap-3">
                {reports.geoData.length === 0 ? (
                  <p className="text-muted mb-0">
                    No distribution data available.
                  </p>
                ) : (
                  reports.geoData.map((item) => (
                    <div
                      key={item.country}
                      className="d-flex align-items-center gap-3"
                    >
                      <div
                        className="text-muted"
                        style={{
                          width: "120px",
                          fontSize: "0.85rem",
                        }}
                      >
                        {item.country}
                      </div>

                      <div
                        className="progress flex-grow-1"
                        style={{ height: "24px" }}
                      >
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${
                              ((item.users || 0) / maxGeoUsers) *
                              100
                            }%`,
                            backgroundColor:
                              item.color || "#4A90E2",
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