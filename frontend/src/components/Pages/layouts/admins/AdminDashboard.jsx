import { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { Users, BookOpen, Activity, TrendingUp } from "lucide-react";
import { fetchAdminDashboardData } from "../../../../lib/api";

export function AdminDashboards() {
  const [stats, setStats]               = useState([]);
  const [chartData, setChartData]       = useState([]);
  const [recentActivity, setRecent]     = useState([]);
  const [alerts, setAlerts]             = useState([]);
  const [loading, setLoading]           = useState(true);

  const iconMap = { Users, Courses: BookOpen, Active: Activity };

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
  return () => {
    cancelled = true;
    clearInterval(interval);
  };
}, []);

  if (loading) return <div className="text-center mt-5">Loading dashboard...</div>;

  return (
    <div className="container-fluid">

      {/* STATS */}
      <div className="row g-4 mb-4">
        {stats.map((stat, i) => {
          const Icon = iconMap[stat.label] || Users;
          return (
            <div key={i} className="col-md-4">
              <div className="card p-3 shadow-sm">
                <div className="d-flex justify-content-between mb-2">
                  <div className="icon-box" style={{ background: stat.bg }}>
                    <Icon size={18} style={{ color: stat.color }} />
                  </div>
                  <TrendingUp size={16} color="#28A745" />
                </div>
                <h4 style={{ color: stat.color }}>{stat.value}</h4>
                <small className="text-muted">{stat.label}</small>
              </div>
            </div>
          );
        })}
      </div>

      {/* GRAPHIQUE Enrollments + Users */}
      <div className="card p-4 shadow-sm mb-4">
        <h5 className="mb-3">Enrollments & New Users</h5>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="enrollments" stroke="#4A90E2" fill="rgba(74,144,226,0.2)" />
            <Area type="monotone" dataKey="users"       stroke="#7F3FBF" fill="rgba(127,63,191,0.2)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="row g-4">

        {/* ACTIVITÉ RÉCENTE */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="p-3 border-bottom">
              <h6 className="mb-0">Recent Enrollments</h6>
            </div>
            <div className="table-responsive">
              <table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <th>User</th>
                    <th>Course</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((r, i) => (
                    <tr key={i}>
                      <td>{r.user}</td>
                      <td>{r.course}</td>
                      <td>{r.date}</td>
                      <td>
                        <span className={`badge ${r.status === "Completed" ? "bg-success" : "bg-primary"}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ALERTS */}
        <div className="col-lg-4">
          <div className="card p-4 shadow-sm">
            <h6>System Alerts</h6>
            {alerts.map((alert, i) => (
              <div key={i} className={`alert alert-${alert.type} mt-2`}>
                {alert.message}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}