import { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { Users, BookOpen, Activity, Bell, X } from "lucide-react";
import { fetchAdminDashboardData } from "../../../../api";
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
 
  .ad-wrap { font-family: 'DM Sans', sans-serif; padding: 24px; }
 
  .ad-stat-card {
    background: #fff;
    border: 1px solid #E8ECF0;
    border-radius: 14px;
    padding: 20px;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .ad-stat-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }
 
  .ad-stat-icon {
    width: 42px; height: 42px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 14px;
  }
  .ad-stat-value {
    font-size: 1.8rem; font-weight: 700; line-height: 1.1;
    margin-bottom: 4px; color: #1A202C;
  }
  .ad-stat-label {
    font-size: 0.78rem; color: #8492A6; font-weight: 500;
    text-transform: uppercase; letter-spacing: 0.05em;
  }
  .ad-stat-trend {
    display: flex; align-items: center; gap: 5px;
    font-size: 0.78rem; font-weight: 600; color: #16A34A;
    margin-top: 10px;
  }
 
  .ad-section-title {
    font-size: 1rem; font-weight: 700; color: #1A202C; margin: 0;
  }
 
  .ad-card {
    background: #fff;
    border: 1px solid #E8ECF0;
    border-radius: 14px;
    overflow: hidden;
  }
  .ad-card-header {
    padding: 16px 20px;
    border-bottom: 1px solid #F0F3F7;
    display: flex; align-items: center; justify-content: space-between;
  }
 
  .ad-table { width: 100%; border-collapse: collapse; }
  .ad-table thead tr { background: #F6F8FA; border-bottom: 1px solid #E8ECF0; }
  .ad-table th {
    padding: 13px 18px;
    font-size: 0.75rem; font-weight: 600; color: #8492A6;
    text-transform: uppercase; letter-spacing: 0.06em;
    text-align: left; white-space: nowrap;
  }
  .ad-table tbody tr { border-bottom: 1px solid #F0F3F7; transition: background 0.15s; }
  .ad-table tbody tr:last-child { border-bottom: none; }
  .ad-table tbody tr:hover { background: #FAFBFC; }
  .ad-table td { padding: 14px 18px; font-size: 0.875rem; color: #2D3748; }
 
  .ad-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px;
    font-size: 0.75rem; font-weight: 600;
  }
  .ad-badge-dot {
    width: 6px; height: 6px; border-radius: 50%; display: inline-block;
  }
 
  .ad-alert-item {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 13px 16px;
    border-bottom: 1px solid #F0F3F7;
    transition: background 0.15s;
  }
  .ad-alert-item:last-child { border-bottom: none; }
  .ad-alert-item:hover { background: #FAFBFC; }
  .ad-alert-icon {
    width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .ad-alert-msg { font-size: 0.85rem; color: #2D3748; font-weight: 500; }
  .ad-alert-time { font-size: 0.75rem; color: #A0AEC0; margin-top: 2px; }
 
  .ad-footer {
    padding: 12px 20px;
    font-size: 0.8rem; color: #A0AEC0;
    border-top: 1px solid #F0F3F7;
  }
`;
 
const ALERT_COLORS = {
  warning: { bg: "#FFF8F0", color: "#C47A1A", iconBg: "#FFF0D6" },
  danger:  { bg: "#FFF5F5", color: "#dc2626", iconBg: "#FFE5E5" },
  success: { bg: "#F0FFF4", color: "#16A34A", iconBg: "#DCFCE7" },
  info:    { bg: "#EBF4FF", color: "#4A90E2", iconBg: "#DBEAFE" },
};
 
const BADGE_COLORS = {
  Completed: { bg: "#ECFDF5", color: "#16A34A" },
  Enrolled:  { bg: "#EBF4FF", color: "#4A90E2" },
  Pending:   { bg: "#FFF8F0", color: "#C47A1A" },
};
 
const STAT_COLORS = [
  { iconBg: "#EBF4FF", iconColor: "#4A90E2", Icon: Users },
  { iconBg: "#F3EBFF", iconColor: "#7F3FBF", Icon: BookOpen },
  { iconBg: "#ECFDF5", iconColor: "#16A34A", Icon: Activity },
];
 
export function AdminDashboards() {
  const [stats, setStats]           = useState([]);
  const [chartData, setChartData]   = useState([]);
  const [recentActivity, setRecent] = useState([]);
  const [alerts, setAlerts]         = useState([]);
  const [loading, setLoading]       = useState(true);
 
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data } = await fetchAdminDashboardData();
      if (cancelled || !data?.status) return;
      setStats(data.stats           ?? []);
      setChartData(data.chartData   ?? []);
      setRecent(data.recentActivity ?? []);
      setAlerts(data.alerts         ?? []);
      setLoading(false);
    };
    load();
    const interval = setInterval(load, 10000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);
 
  if (loading) return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", textAlign: "center", padding: "60px", color: "#8492A6" }}>
      Loading dashboard...
    </div>
  );
 
  return (
    <div className="ad-wrap">
      <style>{styles}</style>
 
      {/* STAT CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
        {stats.map((stat, i) => {
          const cfg = STAT_COLORS[i % STAT_COLORS.length];
          const Icon = cfg.Icon;
          return (
            <div key={i} className="ad-stat-card">
              <div className="ad-stat-icon" style={{ background: cfg.iconBg }}>
                <Icon size={18} color={cfg.iconColor} />
              </div>
              <div className="ad-stat-value" style={{ color: cfg.iconColor }}>{stat.value}</div>
              <div className="ad-stat-label">{stat.label}</div>
 
            </div>
          );
        })}
      </div>
 
      {/* CHART */}
      <div className="ad-card" style={{ marginBottom: 24 }}>
        <div className="ad-card-header">
          <span className="ad-section-title">Enrollments &amp; New Users</span>
          <span style={{ fontSize: "0.78rem", color: "#A0AEC0", fontWeight: 500 }}>Last 6 months</span>
        </div>
        <div style={{ padding: "20px 20px 10px" }}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <CartesianGrid stroke="#F0F3F7" strokeDasharray="4 4" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8492A6", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#8492A6", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#fff", border: "1px solid #E8ECF0",
                  borderRadius: 10, fontSize: 13, fontFamily: "DM Sans",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
                }}
              />
              <Area type="monotone" dataKey="enrollments" stroke="#4A90E2" strokeWidth={2} fill="rgba(74,144,226,0.08)" dot={false} />
              <Area type="monotone" dataKey="users"       stroke="#7F3FBF" strokeWidth={2} fill="rgba(127,63,191,0.08)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
 
      {/* BOTTOM ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16, alignItems: "start" }}>
 
        {/* RECENT ENROLLMENTS TABLE */}
        <div className="ad-card">
          <div className="ad-card-header">
            <span className="ad-section-title">Recent Enrollments</span>
            <span style={{
              fontSize: "0.75rem", fontWeight: 600,
              background: "#EBF4FF", color: "#4A90E2",
              padding: "4px 10px", borderRadius: 20
            }}>
              {recentActivity.length} entries
            </span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="ad-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "40px", color: "#A0AEC0" }}>
                      No recent activity.
                    </td>
                  </tr>
                )}
                {recentActivity.map((r, i) => {
                  const bc = BADGE_COLORS[r.status] || BADGE_COLORS.Enrolled;
                  return (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, color: "#1A202C" }}>{r.user}</td>
                      <td style={{ color: "#4A5568" }}>{r.course}</td>
                      <td style={{ color: "#8492A6" }}>{r.date}</td>
                      <td>
                        <span className="ad-badge" style={{ background: bc.bg, color: bc.color }}>
                          <span className="ad-badge-dot" style={{ background: bc.color }} />
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="ad-footer">
            Showing <strong>{recentActivity.length}</strong> recent enrollments
          </div>
        </div>
 
        {/* ALERTS */}
        <div className="ad-card">
          <div className="ad-card-header">
            <span className="ad-section-title">System Alerts</span>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: alerts.length ? "#FFF0D6" : "#F6F8FA",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Bell size={14} color={alerts.length ? "#C47A1A" : "#A0AEC0"} />
            </div>
          </div>
          <div>
            {alerts.length === 0 && (
              <div style={{ padding: "32px", textAlign: "center", color: "#A0AEC0", fontSize: "0.85rem" }}>
                No alerts at this time.
              </div>
            )}
            {alerts.map((alert, i) => {
              const ac = ALERT_COLORS[alert.type] || ALERT_COLORS.info;
              return (
                <div key={i} className="ad-alert-item">
                  <div className="ad-alert-icon" style={{ background: ac.iconBg }}>
                    <X size={13} color={ac.color} />
                  </div>
                  <div>
                    <div className="ad-alert-msg">{alert.message}</div>
                    <div className="ad-alert-time">{alert.time || "Just now"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
 
      </div>
    </div>
  );
}