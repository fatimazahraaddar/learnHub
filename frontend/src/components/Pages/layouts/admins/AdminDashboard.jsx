import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, BookOpen, DollarSign, TrendingUp, Activity } from "lucide-react";
import { fetchAdminDashboardData } from "../../../../lib/api";

export function AdminDashboards() {
  const [stats, setStats] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const iconMap = {
    Users,
    Courses: BookOpen,
    Revenue: DollarSign,
    Active: Activity,
  };

  const fetchDashboardData = async () => {
    try {
      const { data } = await fetchAdminDashboardData();
      if (!data?.status) {
        throw new Error(data?.message || "Failed to load dashboard data");
      }

      setStats(Array.isArray(data.stats) ? data.stats : []);
      setRevenueData(Array.isArray(data.revenue) ? data.revenue : []);
      setTransactions(Array.isArray(data.transactions) ? data.transactions : []);
      setAlerts(Array.isArray(data.alerts) ? data.alerts : []);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading dashboard...</div>;
  }

  return (
    <div className="container-fluid">
      <div className="row g-4 mb-4">
        {stats.map((stat, index) => {
          const Icon = iconMap[stat.label] || Users;

          return (
            <div key={index} className="col-md-3">
              <div className="card p-3 shadow-sm stat-card">
                <div className="d-flex justify-content-between mb-2">
                  <div className="icon-box" style={{ background: stat.bg || "#eee" }}>
                    <Icon size={18} style={{ color: stat.color || "#000" }} />
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

      <div className="card p-4 shadow-sm mb-4">
        <h5 className="mb-3">Revenue & Users</h5>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#4A90E2"
              fill="rgba(74,144,226,0.2)"
            />

            <Area
              type="monotone"
              dataKey="users"
              stroke="#7F3FBF"
              fill="rgba(127,63,191,0.2)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="p-3 border-bottom">
              <h6 className="mb-0">Recent Transactions</h6>
            </div>

            <div className="table-responsive">
              <table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <th>User</th>
                    <th>Course</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((t, i) => (
                    <tr key={i}>
                      <td>{t.user}</td>
                      <td>{t.course}</td>
                      <td className="text-success">${t.amount}</td>
                      <td>{t.date}</td>
                      <td>
                        <span
                          className={`badge ${
                            t.status === "Completed" ? "bg-success" : "bg-warning text-dark"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

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
