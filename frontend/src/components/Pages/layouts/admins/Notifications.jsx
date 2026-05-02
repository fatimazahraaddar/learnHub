import { useEffect, useState } from "react";
import { Bell, AlertCircle, CheckCircle, Info, Trash2, Check, Loader2, RefreshCw } from "lucide-react";
import { fetchAdminNotificationsData } from "../../../../api";

const TYPE_CONFIG = {
  warning: { icon: AlertCircle, color: "#FF7A00", bg: "#FFF3E8" },
  success: { icon: CheckCircle, color: "#28A745", bg: "#F0FFF4" },
  info:    { icon: Info,        color: "#4A90E2", bg: "#EBF4FF" },
};

const FILTERS = ["All", "Unread", "Read"];

export function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [filter, setFilter]               = useState("All");
  const [detail, setDetail]               = useState("");

  const handleRefresh = async () => {
  setLoading(true);
  setError("");
  const { ok, data } = await fetchAdminNotificationsData();
  if (!ok || !data?.status) {
    setError("Failed to load notifications.");
  } else {
    setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
  }
  setLoading(false);
};

 useEffect(() => {
  let cancelled = false;

  const load = async () => {
    setLoading(true);
    setError("");
    const { ok, data } = await fetchAdminNotificationsData();
    if (cancelled) return;
    if (!ok || !data?.status) {
      setError("Failed to load notifications.");
    } else {
      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
    }
    setLoading(false);
  };

  load();
  return () => { cancelled = true; };
}, []);

  // ✅ Filtrage
  const filtered = notifications.filter((n) => {
    if (filter === "Unread") return !n.read;
    if (filter === "Read")   return n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const clearAll = () => setNotifications([]);

  const toggleRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );

  const dismiss = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <div className="container my-4" style={{ maxWidth: "800px" }}>

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <Bell size={20} style={{ color: "#FF7A00" }} />
          <span className="small text-muted">
            {unreadCount} unread · {notifications.length} total
          </span>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <button
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
            onClick={handleRefresh} type="button"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
            onClick={markAllRead} type="button"
            disabled={unreadCount === 0}
          >
            <Check size={16} /> Mark All Read
          </button>
          <button
            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
            onClick={clearAll} type="button"
            disabled={notifications.length === 0}
          >
            <Trash2 size={16} /> Clear All
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="d-flex gap-2 mb-3">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className="btn btn-sm"
            style={{
              backgroundColor: filter === f ? "#4A90E2" : "white",
              color:           filter === f ? "white"   : "#555",
              border: "1px solid #ced4da",
            }}
            onClick={() => setFilter(f)}
          >
            {f}
            {f === "Unread" && unreadCount > 0 && (
              <span className="badge bg-danger ms-1" style={{ fontSize: "0.65rem" }}>
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* DETAIL ALERT */}
      {detail && (
        <div className="alert alert-info py-2 d-flex justify-content-between align-items-center">
          <span>{detail}</span>
          <button type="button" className="btn-close btn-sm" onClick={() => setDetail("")} />
        </div>
      )}

      {/* ERROR */}
      {error && <div className="alert alert-danger py-2">{error}</div>}

      {/* LOADING */}
      {loading ? (
        <div className="text-center py-5">
          <Loader2 size={32} className="text-primary" />
          <p className="text-muted mt-2">Loading notifications...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <Bell size={40} style={{ opacity: 0.2 }} />
          <p className="mt-3">No {filter.toLowerCase()} notifications.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {filtered.map((notif) => {
            const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info;
            return (
              <div
                key={notif.id}
                className="card shadow-sm"
                style={{
                  borderLeft: `4px solid ${config.color}`,
                  opacity: notif.read ? 0.75 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                <div className="card-body d-flex gap-3 py-3">

                  {/* ICON */}
                  <div
                    className="flex-shrink-0 d-flex align-items-center justify-content-center rounded"
                    style={{ width: 46, height: 46, backgroundColor: config.bg }}
                  >
                    <config.icon size={20} style={{ color: config.color }} />
                  </div>

                  {/* CONTENT */}
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <strong style={{ fontSize: "0.9rem" }}>{notif.title}</strong>
                        {!notif.read && (
                          <span
                            className="rounded-circle"
                            style={{ width: 8, height: 8, backgroundColor: config.color, display: "inline-block" }}
                          />
                        )}
                      </div>
                      <span className="small text-muted">{notif.time}</span>
                    </div>

                    <p className="small text-muted mb-2">{notif.message}</p>

                    {/* ACTIONS */}
                    <div className="d-flex gap-2 small">
                      <button
                        className="btn btn-link p-0 small"
                        style={{ color: config.color }}
                        type="button"
                        onClick={() => setDetail(notif.message)}
                      >
                        View Details
                      </button>
                      <span className="text-muted">·</span>
                      <button
                        className="btn btn-link p-0 small text-muted"
                        type="button"
                        onClick={() => toggleRead(notif.id)}
                      >
                        {notif.read ? "Mark Unread" : "Mark Read"}
                      </button>
                      <span className="text-muted">·</span>
                      <button
                        className="btn btn-link p-0 small text-danger"
                        type="button"
                        onClick={() => dismiss(notif.id)}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}