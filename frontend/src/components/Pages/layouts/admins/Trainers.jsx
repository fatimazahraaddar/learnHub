import { useEffect, useMemo, useState } from "react";
import { Search, Filter, UserPlus, Mail, Shield, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchAdminTrainersData } from "../../../../lib/api";

export function AdminTrainers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({ total: 0, trainers: 0 });
  const [search, setSearch] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [info, setInfo] = useState("");

  useEffect(() => {
    const load = async () => {
      const { ok, data } = await fetchAdminTrainersData();
      if (!ok || !data?.status) return;
      setUsers(Array.isArray(data.users) ? data.users : []);
      setSummary(data.summary || { total: 0, trainers: 0 });
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = verifiedOnly ? users.filter((u) => u.status === "Active") : users;
    if (!q) return list;
    return list.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(q));
  }, [users, search, verifiedOnly]);

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h3 className="fw-bold">Trainer Management</h3>
        <p className="text-muted">Review and manage instructor profiles.</p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="card text-center p-3 shadow-sm">
            <h4 className="text-primary fw-bold">{summary.total}</h4>
            <small>Total Trainers</small>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3 flex-wrap gap-2">
            <h5>Trainer List</h5>

            <div className="d-flex gap-2">
              <div className="input-group">
                <span className="input-group-text">
                  <Search size={16} />
                </span>
                <input
                  className="form-control"
                  placeholder="Search trainers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button
                className={`btn d-flex align-items-center gap-1 ${verifiedOnly ? "btn-secondary text-white" : "btn-outline-secondary"}`}
                type="button"
                onClick={() => setVerifiedOnly((prev) => !prev)}
              >
                <Filter size={16} /> {verifiedOnly ? "All" : "Active"}
              </button>

              <button className="btn btn-primary d-flex align-items-center gap-1" type="button" onClick={() => navigate("/admin/users")}>
                <UserPlus size={16} /> Add Trainer
              </button>
            </div>
          </div>
          {info ? <div className="alert alert-info py-2">{info}</div> : null}

          <div className="table-responsive">
            <table className="table align-middle">
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
                {filtered.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={user.avatar}
                          width="40"
                          height="40"
                          className="rounded-circle"
                          alt="user"
                        />

                        <div>
                          <div className="fw-semibold">{user.name}</div>
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="badge bg-info">{user.role}</span>
                    </td>

                    <td>{user.courses}</td>
                    <td>{user.joined}</td>

                    <td>
                      <span className="badge bg-success">{user.status}</span>
                    </td>

                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-light" type="button" onClick={() => (window.location.href = `mailto:${user.email}`)}>
                          <Mail size={16} />
                        </button>
                        <button className="btn btn-sm btn-light" type="button" onClick={() => setInfo(`${user.name} verified.`)}>
                          <Shield size={16} />
                        </button>
                        <button className="btn btn-sm btn-light" type="button" onClick={() => setInfo(`More actions for ${user.name} coming soon.`)}>
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
