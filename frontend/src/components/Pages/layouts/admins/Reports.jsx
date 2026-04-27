import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Download, TrendingUp, Users, BookOpen, Star } from "lucide-react";
import { fetchAdminReportsData } from "../../../../lib/api";

export function AdminReports() {
  const [data, setData] = useState({
    categoryData: [],
    completionData: [],
    geoData: [],
    kpis: { newUsers: 0, enrollments: 0, revenue: 0, rating: "0.0" },
  });
  const [activeRange, setActiveRange] = useState("Last 6 Months");
  const [info, setInfo] = useState("");

  useEffect(() => {
    const load = async () => {
      const { ok, data } = await fetchAdminReportsData();
      if (!ok || !data?.status) return;
      setData(data);
    };
    load();
  }, []);

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-end mb-3 flex-wrap gap-2">
        {[
          "This Month",
          "Last 6 Months",
          "This Year",
        ].map((f) => (
          <button
            key={f}
            className="btn btn-sm"
            style={{
              backgroundColor: f === activeRange ? "#4A90E2" : "white",
              color: f === activeRange ? "white" : "#555",
              borderColor: f === activeRange ? "#4A90E2" : "#ced4da"
            }}
            type="button"
            onClick={() => {
              setActiveRange(f);
              setInfo(`Range selected: ${f}`);
            }}
          >
            {f}
          </button>
        ))}
        <button
          className="btn btn-success btn-sm d-flex align-items-center gap-1"
          type="button"
          onClick={() => {
            const rows = data.categoryData.map((item) => `${item.name},${item.students},${item.revenue}`);
            const csv = ["category,students,revenue", ...rows].join("\n");
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "admin-reports.csv";
            a.click();
            URL.revokeObjectURL(url);
            setInfo("Report exported.");
          }}
        >
          <Download size={16} /> Export Report
        </button>
      </div>
      {info ? <div className="alert alert-info py-2">{info}</div> : null}

      <div className="row g-3 mb-4">
        {[
          { icon: Users, label: "New Users", value: `+${data.kpis.newUsers}`, period: "Current dataset", color: "#4A90E2" },
          { icon: BookOpen, label: "Enrollments", value: String(data.kpis.enrollments), period: "Current dataset", color: "#7F3FBF" },
          { icon: TrendingUp, label: "Revenue", value: `$${Number(data.kpis.revenue || 0).toFixed(2)}`, period: "Current dataset", color: "#28A745" },
          { icon: Star, label: "Avg Rating", value: `${data.kpis.rating}/5`, period: "Across all courses", color: "#FF7A00" },
        ].map((k) => (
          <div key={k.label} className="col-6 col-lg-3">
            <div className="card shadow-sm border h-100">
              <div className="card-body">
                <k.icon size={24} className="mb-2" style={{ color: k.color }} />
                <h5 className="fw-bold" style={{ color: k.color }}>{k.value}</h5>
                <p className="mb-0 text-muted small">{k.label}</p>
                <p className="mb-0 text-muted" style={{ fontSize: "0.7rem" }}>{k.period}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm border h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Revenue by Category</h5>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.categoryData} layout="vertical" barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#666" }} tickFormatter={(v) => `$${v/1000}K`} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={100} />
                  <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#4A90E2" radius={[0,4,4,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm border h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Course Completion Rate</h5>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={data.completionData}>
                  <defs>
                    <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#28A745" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#28A745" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#666" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#666" }} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                  <Tooltip formatter={(v) => [`${v}%`, "Completion Rate"]} />
                  <Area type="monotone" dataKey="rate" stroke="#28A745" strokeWidth={2.5} fill="url(#compGrad)" dot={{ fill: "#28A745", r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border mt-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Users by Role</h5>
          <div className="d-flex flex-column gap-3">
            {data.geoData.map((item) => (
              <div key={item.country} className="d-flex align-items-center gap-3">
                <div className="text-muted" style={{ width: "120px", fontSize: "0.85rem" }}>{item.country}</div>
                <div className="progress flex-grow-1" style={{ height: "24px" }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${(item.users / Math.max(data.geoData[0]?.users || 1, 1)) * 100}%`, backgroundColor: item.color }}
                  >
                    {item.users.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
