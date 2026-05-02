import { useEffect, useMemo, useState } from "react";
import { Search, Filter, UserPlus, Mail, Shield, MoreVertical, Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchAdminTrainersData, updateUser, deleteUser } from "../../../../api";

export function AdminTrainers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({ total: 0, trainers: 0 });
  const [search, setSearch] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [info, setInfo] = useState("");

  // Modal état
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

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

  // ── Actions ──────────────────────────────────────────

  const handleViewProfile = (user) => {
    navigate(`/admin/users/${user.id}`);
  };

  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    const { ok } = await updateUser(selectedUser.id, {
      name: selectedUser.name,
      email: selectedUser.email,
      role: newRole,
    });
    if (ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, role: newRole } : u))
      );
      setInfo(`Rôle de ${selectedUser.name} mis à jour en "${newRole}".`);
    } else {
      setInfo("Erreur lors de la mise à jour du rôle.");
    }
    setShowRoleModal(false);
  };

  const handleOpenDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    const { ok } = await deleteUser(selectedUser.id);
    if (ok) {
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setInfo(`${selectedUser.name} a été supprimé.`);
    } else {
      setInfo("Erreur lors de la suppression.");
    }
    setShowDeleteModal(false);
  };

  // ────────────────────────────────────────────────────

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
                <span className="input-group-text"><Search size={16} /></span>
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

          {info && <div className="alert alert-info py-2">{info}</div>}

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
                        <img src={user.avatar} width="40" height="40" className="rounded-circle" alt="user" />
                        <div>
                          <div className="fw-semibold">{user.name}</div>
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge bg-info">{user.role}</span></td>
                    <td>{user.courses}</td>
                    <td>{user.joined}</td>
                    <td><span className="badge bg-success">{user.status}</span></td>
                    <td>
                      <div className="d-flex gap-2">
                        {/* Mail */}
                        <button className="btn btn-sm btn-light" title="Envoyer un email" type="button"
                          onClick={() => (window.location.href = `mailto:${user.email}`)}>
                          <Mail size={16} />
                        </button>

                        {/* Voir profil */}
                        <button className="btn btn-sm btn-light" title="Voir le profil" type="button"
                          onClick={() => handleViewProfile(user)}>
                          <Shield size={16} />
                        </button>

                        {/* Modifier le rôle */}
                        <button className="btn btn-sm btn-light" title="Modifier le rôle" type="button"
                          onClick={() => handleOpenRoleModal(user)}>
                          <Edit size={16} />
                        </button>

                        {/* Supprimer */}
                        <button className="btn btn-sm btn-danger" title="Supprimer" type="button"
                          onClick={() => handleOpenDeleteModal(user)}>
                          <Trash2 size={16} />
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

      {/* ── Modal : Modifier le rôle ── */}
      {showRoleModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modifier le rôle — {selectedUser?.name}</h5>
                <button className="btn-close" onClick={() => setShowRoleModal(false)} />
              </div>
              <div className="modal-body">
                <label className="form-label">Nouveau rôle</label>
                <select className="form-select" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                  <option value="admin">Admin</option>
                  <option value="trainer">Trainer</option>
                  <option value="learner">Learner</option>
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowRoleModal(false)}>Annuler</button>
                <button className="btn btn-primary" onClick={handleUpdateRole}>Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal : Confirmer suppression ── */}
      {showDeleteModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Supprimer {selectedUser?.name} ?</h5>
                <button className="btn-close" onClick={() => setShowDeleteModal(false)} />
              </div>
              <div className="modal-body">
                <p>Cette action est irréversible. Confirmer la suppression ?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Annuler</button>
                <button className="btn btn-danger" onClick={handleDeleteUser}>Supprimer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}