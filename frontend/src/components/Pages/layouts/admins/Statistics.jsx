import { useEffect, useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";
import { Download, TrendingUp, Users, BookOpen, ChevronDown } from "lucide-react";
import { fetchAdminReportsData } from "../../../../api";
 
const RANGE_OPTIONS = ["This Month", "Last 6 Months", "This Year"];
 
const EMPTY_DATA = {
  categoryData:   [],
  completionData: [],
  geoData:        [],
  kpis:           { newUsers: 0, enrollments: 0, rating: "0.0" },
};
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
 
  .ast-wrap { font-family: 'DM Sans', sans-serif; padding: 24px; }
 
  .ast-stat-card {
    background: #fff; border: 1px solid #E8ECF0; border-radius: 14px;
    padding: 20px; transition: box-shadow 0.2s, transform 0.2s;
  }
  .ast-stat-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }
  .ast-stat-icon {
    width: 42px; height: 42px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; margin-bottom: 14px;
  }
  .ast-stat-value { font-size: 1.8rem; font-weight: 700; line-height: 1.1; margin-bottom: 4px; }
  .ast-stat-label { font-size: 0.78rem; color: #8492A6; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
  .ast-stat-range { font-size: 0.72rem; color: #B0BAC9; margin-top: 4px; }
 
  .ast-toolbar {
    background: #fff; border: 1px solid #E8ECF0; border-radius: 14px;
    padding: 16px 20px; display: flex; align-items: center;
    justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;
  }
  .ast-toolbar-title { font-size: 1.15rem; font-weight: 700; color: #1A202C; margin: 0; }
 
  .ast-range-btn {
    padding: 7px 14px; border-radius: 10px; font-size: 0.875rem; font-weight: 500;
    border: 1px solid #E8ECF0; background: #F6F8FA; color: #4A5568;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s;
  }
  .ast-range-btn:hover { background: #EEF1F5; border-color: #CBD5E0; }
  .ast-range-btn.active { background: #EBF4FF; border-color: #4A90E2; color: #4A90E2; font-weight: 600; }
 
  .ast-btn-export {
    display: flex; align-items: center; gap: 6px;
    background: linear-gradient(135deg, #4A90E2, #7F3FBF);
    border: none; border-radius: 10px; padding: 8px 16px;
    font-size: 0.875rem; font-weight: 600; color: #fff;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: opacity 0.15s, transform 0.15s;
    box-shadow: 0 2px 8px rgba(74,144,226,0.3);
  }
  .ast-btn-export:hover { opacity: 0.9; transform: translateY(-1px); }
 
  .ast-card {
    background: #fff; border: 1px solid #E8ECF0; border-radius: 14px; overflow: hidden;
  }
  .ast-card-header {
    padding: 16px 20px; border-bottom: 1px solid #F0F3F7;
    display: flex; align-items: center; justify-content: space-between;
  }
  .ast-card-title { font-size: 1rem; font-weight: 700; color: #1A202C; margin: 0; }
 
  .ast-toast {
    background: #1A202C; color: #fff; border-radius: 10px;
    padding: 12px 18px; font-size: 0.875rem; font-weight: 500;
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; margin-bottom: 16px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    animation: ast-fade 0.2s ease;
  }
  .ast-toast.error { background: #7f1d1d; }
  @keyframes ast-fade {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ast-toast-close { background: none; border: none; color: #A0AEC0; cursor: pointer; font-size: 1rem; }
  .ast-toast-close:hover { color: #fff; }
 
  .ast-geo-row { display: flex; align-items: center; gap: 14px; padding: 10px 0; border-bottom: 1px solid #F0F3F7; }
  .ast-geo-row:last-child { border-bottom: none; }
  .ast-geo-label { font-size: 0.85rem; color: #4A5568; font-weight: 500; width: 120px; flex-shrink: 0; }
  .ast-geo-bar-bg { flex: 1; background: #F0F3F7; border-radius: 6px; height: 10px; overflow: hidden; }
  .ast-geo-bar-fill { height: 100%; border-radius: 6px; transition: width 0.4s ease; }
  .ast-geo-count { font-size: 0.8rem; font-weight: 600; color: #4A5568; width: 40px; text-align: right; flex-shrink: 0; }
`;
 
export function AdminStatistics() {
  const [reports,     setReports]     = useState(EMPTY_DATA);
  const [activeRange, setActiveRange] = useState("Last 6 Months");
  const [loading,     setLoading]     = useState(true);
  const [info,        setInfo]        = useState("");
  const [error,       setError]       = useState("");
 
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true); setError("");
        const { ok, data } = await fetchAdminReportsData();
        if (cancelled) return;
        if (!ok || !data) { setError("Failed to load reports."); return; }
        setReports({
          categoryData:   Array.isArray(data.categoryData)   ? data.categoryData   : [],
          completionData: Array.isArray(data.completionData) ? data.completionData : [],
          geoData:        Array.isArray(data.geoData)        ? data.geoData        : [],
          kpis:           data.kpis || EMPTY_DATA.kpis,
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
 
  const completionRate = reports.completionData.length
    ? `${reports.completionData.at(-1)?.rate ?? 0}%`
    : "0%";
 
  const KPIS = [
    { Icon: Users,     label: "New Users",   value: `+${reports.kpis.newUsers}`, iconBg: "#EBF4FF", iconColor: "#4A90E2" },
    { Icon: BookOpen,  label: "Enrollments", value: reports.kpis.enrollments,    iconBg: "#F3EBFF", iconColor: "#7F3FBF" },
    { Icon: TrendingUp,label: "Completion",  value: completionRate,              iconBg: "#ECFDF5", iconColor: "#16A34A" },
  ];
 
  return (
    <div className="ast-wrap">
      <style>{styles}</style>
 
      {/* TOOLBAR */}
      <div className="ast-toolbar">
        <span className="ast-toolbar-title">Statistics &amp; Reports</span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {RANGE_OPTIONS.map((range) => (
            <button
              key={range}
              type="button"
              className={`ast-range-btn ${range === activeRange ? "active" : ""}`}
              onClick={() => { setActiveRange(range); setInfo(`Range: ${range}`); }}
            >
              {range}
            </button>
          ))}
          <button className="ast-btn-export" type="button" onClick={handleExport}>
            <Download size={15} /> Export
          </button>
        </div>
      </div>
 
      {/* TOASTS */}
      {info  && <div className="ast-toast"><span>{info}</span><button className="ast-toast-close" onClick={() => setInfo("")}>✕</button></div>}
      {error && <div className="ast-toast error"><span>{error}</span><button className="ast-toast-close" onClick={() => setError("")}>✕</button></div>}
 
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#8492A6", fontFamily: "DM Sans, sans-serif" }}>
          Loading reports...
        </div>
      ) : (
        <>
          {/* KPI CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 22 }}>
            {KPIS.map((kpi) => (
              <div key={kpi.label} className="ast-stat-card">
                <div className="ast-stat-icon" style={{ background: kpi.iconBg }}>
                  <kpi.Icon size={18} color={kpi.iconColor} />
                </div>
                <div className="ast-stat-value" style={{ color: kpi.iconColor }}>{kpi.value}</div>
                <div className="ast-stat-label">{kpi.label}</div>
                <div className="ast-stat-range">{activeRange}</div>
              </div>
            ))}
          </div>
 
          {/* CHARTS ROW */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
 
            {/* Enrollments by Category */}
            <div className="ast-card">
              <div className="ast-card-header">
                <span className="ast-card-title">Enrollments by Category</span>
              </div>
              <div style={{ padding: "20px 16px 12px" }}>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={reports.categoryData} layout="vertical" barSize={12}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F3F7" horizontal={false} />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8492A6", fontFamily: "DM Sans" }} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={100} tick={{ fontSize: 11, fill: "#4A5568", fontFamily: "DM Sans" }} />
                    <Tooltip
                      formatter={(v) => [v, "Students"]}
                      contentStyle={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: 10, fontSize: 13, fontFamily: "DM Sans", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                    />
                    <Bar dataKey="students" fill="#4A90E2" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
 
            {/* Completion Rate */}
            <div className="ast-card">
              <div className="ast-card-header">
                <span className="ast-card-title">Course Completion Rate</span>
              </div>
              <div style={{ padding: "20px 16px 12px" }}>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={reports.completionData}>
                    <defs>
                      <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#16A34A" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F3F7" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8492A6", fontFamily: "DM Sans" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8492A6", fontFamily: "DM Sans" }} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                    <Tooltip
                      formatter={(v) => [`${v}%`, "Completion"]}
                      contentStyle={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: 10, fontSize: 13, fontFamily: "DM Sans", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                    />
                    <Area type="monotone" dataKey="rate" stroke="#16A34A" strokeWidth={2} fill="url(#compGrad)" dot={{ fill: "#16A34A", r: 3, strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
 
          {/* USERS DISTRIBUTION */}
          <div className="ast-card">
            <div className="ast-card-header">
              <span className="ast-card-title">Users Distribution</span>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, background: "#EBF4FF", color: "#4A90E2", padding: "4px 10px", borderRadius: 20 }}>
                {reports.geoData.length} regions
              </span>
            </div>
            <div style={{ padding: "8px 20px 12px" }}>
              {reports.geoData.length === 0 ? (
                <p style={{ color: "#A0AEC0", fontSize: "0.85rem", padding: "16px 0" }}>No data available.</p>
              ) : (
                reports.geoData.map((item) => (
                  <div key={item.country} className="ast-geo-row">
                    <div className="ast-geo-label">{item.country}</div>
                    <div className="ast-geo-bar-bg">
                      <div
                        className="ast-geo-bar-fill"
                        style={{
                          width: `${((item.users || 0) / maxGeoUsers) * 100}%`,
                          background: item.color || "#4A90E2",
                        }}
                      />
                    </div>
                    <div className="ast-geo-count">{(item.users || 0).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}