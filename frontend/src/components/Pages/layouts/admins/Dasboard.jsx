import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Users, BookOpen, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const REVENUE_DATA = [
  { month: "Sep", revenue: 45000, users: 4200 },
  { month: "Oct", revenue: 52000, users: 5100 },
  { month: "Nov", revenue: 48000, users: 4800 },
  { month: "Dec", revenue: 61000, users: 6200 },
  { month: "Jan", revenue: 58000, users: 5900 },
  { month: "Feb", revenue: 72000, users: 7400 },
  { month: "Mar", revenue: 89000, users: 8900 },
];

const ALERTS = [
  { type: "warning", icon: AlertCircle, message: "3 courses pending review", time: "2 hours ago", color: "#FF7A00" },
  { type: "success", icon: CheckCircle, message: "Monthly revenue target exceeded by 18%", time: "Today", color: "#28A745" },
  { type: "info", icon: Clock, message: "12 new trainer applications pending", time: "Yesterday", color: "#4A90E2" },
  { type: "warning", icon: AlertCircle, message: "5 support tickets unresolved > 48h", time: "2 days ago", color: "#7F3FBF" },
];

const RECENT_TRANSACTIONS = [
  { user: "James Anderson", course: "Web Dev Bootcamp", amount: 89.99, date: "Mar 4, 2026", status: "Completed" },
  { user: "Priya Sharma", course: "Data Science & ML", amount: 119.99, date: "Mar 3, 2026", status: "Completed" },
  { user: "Marcus Levi", course: "Digital Marketing", amount: 69.99, date: "Mar 3, 2026", status: "Pending" },
  { user: "Sofia Chen", course: "Business Leadership", amount: 149.99, date: "Mar 2, 2026", status: "Completed" },
  { user: "Liu Wei", course: "Graphic Design", amount: 79.99, date: "Mar 1, 2026", status: "Refunded" },
];

const TX_STATUS_COLORS = {
  Completed: { bg: "#F0FFF4", color: "#28A745" },
  Pending: { bg: "#FFF3E8", color: "#FF7A00" },
  Refunded: { bg: "#FFF5F5", color: "#dc2626" },
};

export function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="container my-4">
      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        {[
          { icon: Users, label: "Total Users", value: "48,520", change: "+1,850 this month", color: "#4A90E2", bg: "#EBF4FF" },
          { icon: BookOpen, label: "Total Courses", value: "1,240", change: "+24 this month", color: "#7F3FBF", bg: "#F3EBFF" },
          { icon: DollarSign, label: "Total Revenue", value: "$892,450", change: "+$89K this month", color: "#28A745", bg: "#F0FFF4" },
          { icon: Activity, label: "Active Learners", value: "12,890", change: "+12% vs last month", color: "#FF7A00", bg: "#FFF3E8" },
        ].map((stat) => (
          <div key={stat.label} className="col-6 col-lg-3">
            <div className="card h-100 shadow-sm border">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: 40, height: 40, backgroundColor: stat.bg }}>
                    <stat.icon size={20} color={stat.color} />
                  </div>
                  <TrendingUp size={16} color="#28A745" />
                </div>
                <h5 className="fw-bold mb-1" style={{ color: stat.color }}>{stat.value}</h5>
                <p className="text-muted small mb-1">{stat.label}</p>
                <p className="small mb-0 text-success">{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue & Users Chart */}
      <div className="card shadow-sm border mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="mb-1">Platform Revenue & User Growth</h5>
              <p className="text-muted small mb-0">Last 7 months · All figures in USD</p>
            </div>
            <div className="d-flex gap-3 small">
              <span className="d-flex align-items-center gap-1"><span className="rounded-circle" style={{ width: 8, height: 8, backgroundColor: "#4A90E2" }} /> Revenue</span>
              <span className="d-flex align-items-center gap-1"><span className="rounded-circle" style={{ width: 8, height: 8, backgroundColor: "#7F3FBF" }} /> Users</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#4A90E2" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7F3FBF" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#7F3FBF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}/>
              <Area type="monotone" dataKey="revenue" stroke="#4A90E2" fill="url(#revGrad)" strokeWidth={2}/>
              <Area type="monotone" dataKey="users" stroke="#7F3FBF" fill="url(#userGrad)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="row g-3">
        {/* Recent Transactions */}
        <div className="col-lg-8">
          <div className="card shadow-sm border overflow-hidden">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Transactions</h5>
              <button
                className="btn btn-link btn-sm text-primary p-0"
                type="button"
                onClick={() => navigate("/admin/reports")}
              >
                View All
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small text-muted">
                  <tr>
                    {["User", "Course", "Amount", "Date", "Status"].map((h) => <th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_TRANSACTIONS.map((tx, i) => {
                    const sc = TX_STATUS_COLORS[tx.status];
                    return (
                      <tr key={i}>
                        <td>{tx.user}</td>
                        <td className="text-truncate" style={{ maxWidth: "200px" }}>{tx.course}</td>
                        <td className="fw-semibold text-success">${tx.amount}</td>
                        <td className="text-muted small">{tx.date}</td>
                        <td>
                          <span className="badge" style={{ backgroundColor: sc.bg, color: sc.color }}>{tx.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="col-lg-4">
          <div className="card shadow-sm border p-3">
            <h5 className="mb-3">System Alerts</h5>
            <div className="d-flex flex-column gap-2 mb-3">
              {ALERTS.map((alert, i) => (
                <div key={i} className="d-flex align-items-start gap-2 p-2 rounded-2" style={{ backgroundColor: `${alert.color}10` }}>
                  <alert.icon size={16} color={alert.color} />
                  <div>
                    <p className="mb-0 small fw-medium text-dark">{alert.message}</p>
                    <p className="mb-0 text-muted small">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="row g-2 text-center">
              {[
                { label: "Completion", value: "73%", color: "#4A90E2" },
                { label: "Satisfaction", value: "94%", color: "#28A745" },
                { label: "Churn", value: "3.2%", color: "#FF7A00" },
              ].map((m) => (
                <div key={m.label} className="col">
                  <div className="p-2 bg-light rounded-2">
                    <p className="mb-0 fw-bold" style={{ color: m.color }}>{m.value}</p>
                    <p className="mb-0 small text-muted">{m.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
