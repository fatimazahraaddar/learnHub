import { useEffect, useState } from "react";
import { Bell, AlertCircle, CheckCircle, Info, Trash2, Check, Loader2, RefreshCw } from "lucide-react";
import { fetchAdminNotificationsData } from "../../../../api";
 
const PRIMARY = "#1E3A5F";
const ACCENT  = "#10B981";
 
const TYPE_CONFIG = {
  warning: { icon: AlertCircle, color: "#FF7A00", bg: "rgba(255,122,0,0.08)"   },
  success: { icon: CheckCircle, color: ACCENT,    bg: "rgba(16,185,129,0.08)"  },
  info:    { icon: Info,        color: "#4A90E2", bg: "rgba(74,144,226,0.08)"  },
};
 
const FILTERS = ["All", "Unread", "Read"];
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
 
  .an-wrap { font-family: 'DM Sans', sans-serif; max-width: 780px; margin: 0 auto; padding: 32px 24px; }
 
  /* ── Header ── */
  .an-header {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 12px; margin-bottom: 24px;
  }
  .an-header-left { display: flex; align-items: center; gap: 10px; }
  .an-bell-icon {
    width: 40px; height: 40px; border-radius: 11px;
    background: rgba(255,122,0,0.1);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .an-title   { font-size: 1rem; font-weight: 800; color: ${PRIMARY}; margin: 0; }
  .an-subtitle { font-size: 0.75rem; color: #A0AEC0; font-weight: 500; margin: 0; }
 
  .an-actions { display: flex; gap: 8px; flex-wrap: wrap; }
  .an-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 9px;
    font-size: 0.78rem; font-weight: 700; cursor: pointer;
    font-family: 'DM Sans', sans-serif; border: 1px solid #E8ECF0;
    background: #fff; color: ${PRIMARY}; transition: all 0.15s;
  }
  .an-btn:hover:not(:disabled) { background: #F6F8FA; }
  .an-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .an-btn-danger { border-color: rgba(229,62,62,0.25); color: #E53E3E; }
  .an-btn-danger:hover:not(:disabled) { background: #FFF5F5; }
 
  /* ── Filters ── */
  .an-filters { display: flex; gap: 8px; margin-bottom: 24px; }
  .an-filter-btn {
    padding: 7px 16px; border-radius: 10px; border: none;
    font-size: 0.78rem; font-weight: 700; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.15s;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .an-filter-btn.active   { background: ${PRIMARY}; color: #fff; box-shadow: 0 2px 8px rgba(30,58,95,0.25); }
  .an-filter-btn.inactive { background: #fff; color: ${PRIMARY}; border: 1px solid #E8ECF0; }
  .an-filter-btn.inactive:hover { background: #F6F8FA; }
  .an-badge {
    display: inline-flex; align-items: center; justify-content: center;
    width: 18px; height: 18px; border-radius: 50%;
    background: #E53E3E; color: #fff; font-size: 0.65rem; font-weight: 800;
  }
 
  /* ── Alert / Error ── */
  .an-alert {
    padding: 10px 14px; border-radius: 10px; margin-bottom: 16px;
    font-size: 0.8rem; font-weight: 500;
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
  }
  .an-alert-info   { background: rgba(74,144,226,0.08); border: 1px solid rgba(74,144,226,0.2); color: #2B6CB0; }
  .an-alert-danger { background: rgba(229,62,62,0.07);  border: 1px solid rgba(229,62,62,0.2);  color: #E53E3E; }
  .an-alert-close {
    background: none; border: none; cursor: pointer; font-size: 1rem;
    color: inherit; opacity: 0.6; padding: 0; line-height: 1;
  }
  .an-alert-close:hover { opacity: 1; }
 
  /* ── Loading / Empty ── */
  .an-center { text-align: center; padding: 60px 20px; }
  .an-empty-icon { margin: 0 auto 14px; opacity: 0.18; display: block; }
  .an-empty-text { font-size: 0.875rem; color: #A0AEC0; margin: 0; }
 
  /* ── Notification list ── */
  .an-list { display: flex; flex-direction: column; gap: 10px; }
 
  .an-card {
    background: #fff; border: 1px solid #E8ECF0;
    border-radius: 14px; overflow: hidden;
    display: flex; align-items: stretch;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .an-card:hover { box-shadow: 0 6px 22px rgba(0,0,0,0.07); transform: translateY(-1px); }
  .an-card.read { opacity: 0.65; }
 
  .an-card-accent { width: 4px; flex-shrink: 0; }
 
  .an-card-body {
    padding: 16px 18px; display: flex; gap: 14px; flex: 1; align-items: flex-start;
  }
 
  .an-icon-wrap {
    width: 42px; height: 42px; border-radius: 11px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
 
  .an-content { flex: 1; min-width: 0; }
  .an-content-top {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 8px; margin-bottom: 4px;
  }
  .an-title-row { display: flex; align-items: center; gap: 7px; }
  .an-notif-title { font-size: 0.875rem; font-weight: 800; color: ${PRIMARY}; margin: 0; }
  .an-unread-dot  { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .an-time { font-size: 0.72rem; color: #A0AEC0; white-space: nowrap; font-weight: 500; }
  .an-message { font-size: 0.8rem; color: #8492A6; margin: 0 0 10px; line-height: 1.55; }
 
  .an-card-actions { display: flex; align-items: center; gap: 4px; }
  .an-link {
    background: none; border: none; padding: 4px 8px; border-radius: 6px;
    font-size: 0.75rem; font-weight: 700; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: background 0.15s;
  }
  .an-link:hover { background: #F6F8FA; }
  .an-sep { color: #E2E8F0; font-size: 0.7rem; user-select: none; }
  .an-link-danger { color: #E53E3E; }
  .an-link-danger:hover { background: #FFF5F5; }
  .an-link-muted  { color: #8492A6; }
`;
 
export function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [filter, setFilter]               = useState("All");
  const [detail, setDetail]               = useState("");
 
  if (typeof document !== "undefined" && !document.getElementById("an-styles")) {
    const tag = document.createElement("style");
    tag.id = "an-styles";
    tag.textContent = styles;
    document.head.appendChild(tag);
  }
 
  const loadNotifications = async (signal) => {
    const { ok, data } = await fetchAdminNotificationsData();
    if (signal.aborted) return;
    if (!ok || !data?.status) {
      setError("Failed to load notifications.");
    } else {
      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
    }
    setLoading(false);
  };
 
  const load = () => {
    setLoading(true);
    setError("");
    const controller = new AbortController();
    loadNotifications(controller.signal);
    return controller;
  };
 
  useEffect(() => {
    const controller = load();
    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  const filtered     = notifications.filter((n) =>
    filter === "Unread" ? !n.read : filter === "Read" ? n.read : true
  );
  const unreadCount  = notifications.filter((n) => !n.read).length;
  const markAllRead  = () => setNotifications((p) => p.map((n) => ({ ...n, read: true })));
  const clearAll     = () => setNotifications([]);
  const toggleRead   = (id) => setNotifications((p) => p.map((n) => n.id === id ? { ...n, read: !n.read } : n));
  const dismiss      = (id) => setNotifications((p) => p.filter((n) => n.id !== id));
 
  return (
    <div className="an-wrap">
 
      {/* ── Header ── */}
      <div className="an-header">
        <div className="an-header-left">
          <div className="an-bell-icon">
            <Bell size={18} style={{ color: "#FF7A00" }} />
          </div>
          <div>
            <p className="an-title">Notifications</p>
            <p className="an-subtitle">{unreadCount} unread · {notifications.length} total</p>
          </div>
        </div>
 
        <div className="an-actions">
          <button className="an-btn" type="button" onClick={load}>
            <RefreshCw size={13} /> Refresh
          </button>
          <button className="an-btn" type="button" onClick={markAllRead} disabled={unreadCount === 0}>
            <Check size={13} /> Mark All Read
          </button>
          <button className="an-btn an-btn-danger" type="button" onClick={clearAll} disabled={notifications.length === 0}>
            <Trash2 size={13} /> Clear All
          </button>
        </div>
      </div>
 
      {/* ── Filters ── */}
      <div className="an-filters">
        {FILTERS.map((f) => (
          <button key={f} type="button"
            className={`an-filter-btn ${filter === f ? "active" : "inactive"}`}
            onClick={() => setFilter(f)}>
            {f}
            {f === "Unread" && unreadCount > 0 && (
              <span className="an-badge">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>
 
      {/* ── Detail alert ── */}
      {detail && (
        <div className="an-alert an-alert-info">
          <span>{detail}</span>
          <button className="an-alert-close" onClick={() => setDetail("")}>×</button>
        </div>
      )}
 
      {/* ── Error ── */}
      {error && <div className="an-alert an-alert-danger">{error}</div>}
 
      {/* ── Loading ── */}
      {loading ? (
        <div className="an-center">
          <Loader2 size={28} style={{ color: PRIMARY, animation: "spin 1s linear infinite" }} />
          <p className="an-empty-text" style={{ marginTop: 12 }}>Loading notifications…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
 
      ) : filtered.length === 0 ? (
        <div className="an-center">
          <Bell size={44} className="an-empty-icon" />
          <p className="an-empty-text">No {filter.toLowerCase()} notifications.</p>
        </div>
 
      ) : (
        <div className="an-list">
          {filtered.map((notif) => {
            const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info;
            return (
              <div key={notif.id} className={`an-card ${notif.read ? "read" : ""}`}>
                <div className="an-card-accent" style={{ background: cfg.color }} />
                <div className="an-card-body">
                  <div className="an-icon-wrap" style={{ background: cfg.bg }}>
                    <cfg.icon size={18} style={{ color: cfg.color }} />
                  </div>
                  <div className="an-content">
                    <div className="an-content-top">
                      <div className="an-title-row">
                        <p className="an-notif-title">{notif.title}</p>
                        {!notif.read && (
                          <span className="an-unread-dot" style={{ background: cfg.color }} />
                        )}
                      </div>
                      <span className="an-time">{notif.time}</span>
                    </div>
                    <p className="an-message">{notif.message}</p>
                    <div className="an-card-actions">
                      <button className="an-link" style={{ color: cfg.color }} type="button"
                        onClick={() => setDetail(notif.message)}>
                        View Details
                      </button>
                      <span className="an-sep">·</span>
                      <button className="an-link an-link-muted" type="button"
                        onClick={() => toggleRead(notif.id)}>
                        {notif.read ? "Mark Unread" : "Mark Read"}
                      </button>
                      <span className="an-sep">·</span>
                      <button className="an-link an-link-danger" type="button"
                        onClick={() => dismiss(notif.id)}>
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