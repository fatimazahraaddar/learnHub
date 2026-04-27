import { useEffect, useMemo, useState } from "react";
import { Search, Filter, UserPlus, MoreVertical, Shield, Mail } from "lucide-react";
import { fetchAdminUsersData } from "../../../../lib/api";

const ROLE_COLORS = {
  Learner: { bg: "#EBF4FF", color: "#4A90E2" },
  Trainer: { bg: "#F3EBFF", color: "#7F3FBF" },
  Admin: { bg: "#FFF3E8", color: "#FF7A00" },
};

const STATUS_COLORS = {
  Active: { bg: "#F0FFF4", color: "#28A745" },
  Inactive: { bg: "#F7F7F7", color: "#888" },
  Suspended: { bg: "#FFF5F5", color: "#dc2626" },
};

export function AdminUsers() {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({ total: 0, learners: 0, trainers: 0, admins: 0 });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [info, setInfo] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await fetchAdminUsersData();
      if (!data?.status) return;

      setUsers(Array.isArray(data.users) ? data.users : []);
      if (data.summary) {
        setSummary({
          total: Number(data.summary.total || 0),
          learners: Number(data.summary.learners || 0),
          trainers: Number(data.summary.trainers || 0),
          admins: Number(data.summary.admins || 0),
        });
      }
    };

    load();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    const byRole = roleFilter === "All" ? users : users.filter((u) => u.role === roleFilter);
    if (!q) return byRole;

    return byRole.filter((user) => {
      return `${user.name || ""} ${user.email || ""} ${user.role || ""}`
        .toLowerCase()
        .includes(q);
    });
  }, [users, search, roleFilter]);

  return (
    <div className="container my-4">
      <div className="row g-3 mb-4">
        {[
          { label: "Total Users", value: String(summary.total), color: "#4A90E2" },
          { label: "Learners", value: String(summary.learners), color: "#7F3FBF" },
          { label: "Trainers", value: String(summary.trainers), color: "#FF7A00" },
          { label: "Admins", value: String(summary.admins), color: "#28A745" },
        ].map((s) => (
          <div key={s.label} className="col-6 col-sm-3">
            <div className="card text-center border shadow-sm rounded-3 p-3">
              <h5 className="fw-bold mb-1" style={{ color: s.color }}>
                {s.value}
              </h5>
              <small className="text-muted">{s.label}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between mb-3 p-3 bg-light rounded-3 border">
        <h4 className="mb-2 mb-sm-0">User Management</h4>
        <div className="d-flex flex-wrap gap-2">
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-white">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
            type="button"
            onClick={() => {
              const order = ["All", "Learner", "Trainer", "Admin"];
              const next = order[(order.indexOf(roleFilter) + 1) % order.length];
              setRoleFilter(next);
            }}
          >
            <Filter size={16} /> {roleFilter}
          </button>
          <button className="btn btn-primary btn-sm d-flex align-items-center gap-1" type="button" onClick={() => setInfo("Create user form will be available in next update.")}>
            <UserPlus size={16} /> Add User
          </button>
        </div>
      </div>
      {info ? <div className="alert alert-info py-2">{info}</div> : null}

      <div className="table-responsive">
        <table className="table align-middle table-hover table-bordered">
          <thead className="table-light">
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Courses</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              const rc = ROLE_COLORS[user.role] || ROLE_COLORS.Learner;
              const sc = STATUS_COLORS[user.status] || STATUS_COLORS.Active;
              return (
                <tr key={`${user.role}-${user.id}`}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={user.avatar}
                        className="rounded-circle"
                        width={40}
                        height={40}
                        alt={user.name}
                      />
                      <div>
                        <div className="fw-semibold">{user.name}</div>
                        <small className="text-muted">{user.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{ backgroundColor: rc.bg, color: rc.color }}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.courses}</td>
                  <td>{user.joined}</td>
                  <td>
                    <span className="badge" style={{ backgroundColor: sc.bg, color: sc.color }}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-1 position-relative">
                      <button className="btn btn-light btn-sm p-1" type="button" onClick={() => (window.location.href = `mailto:${user.email}`)}>
                        <Mail size={16} />
                      </button>
                      <button className="btn btn-light btn-sm p-1" type="button" onClick={() => setInfo(`Role check done for ${user.name}.`)}>
                        <Shield size={16} />
                      </button>
                      <button
                        className="btn btn-light btn-sm p-1"
                        type="button"
                        onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                      >
                        <MoreVertical size={16} />
                      </button>

                      {openMenuId === user.id && (
                        <div
                          className="position-absolute end-0 top-100 mt-1 bg-white border rounded shadow-sm"
                          style={{ minWidth: 150, zIndex: 100 }}
                        >
                          <button className="dropdown-item btn btn-sm w-100 text-start" type="button" onClick={() => setInfo(`Editing ${user.name} is coming soon.`)}>
                            Edit User
                          </button>
                          <button
                            className="dropdown-item btn btn-sm w-100 text-start"
                            type="button"
                            onClick={() =>
                              setUsers((prev) =>
                                prev.map((u) =>
                                  u.id === user.id
                                    ? { ...u, role: u.role === "Learner" ? "Trainer" : u.role === "Trainer" ? "Admin" : "Learner" }
                                    : u
                                )
                              )
                            }
                          >
                            Change Role
                          </button>
                          <button
                            className="dropdown-item btn btn-sm w-100 text-start text-warning"
                            type="button"
                            onClick={() =>
                              setUsers((prev) =>
                                prev.map((u) => (u.id === user.id ? { ...u, status: u.status === "Suspended" ? "Active" : "Suspended" } : u))
                              )
                            }
                          >
                            Suspend
                          </button>
                          <button
                            className="dropdown-item btn btn-sm w-100 text-start text-danger"
                            type="button"
                            onClick={() => setUsers((prev) => prev.filter((u) => u.id !== user.id))}
                          >
                            Delete User
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <small className="text-muted">
          Showing {filteredUsers.length} of {summary.total} users
        </small>
      </div>
    </div>
  );
}
