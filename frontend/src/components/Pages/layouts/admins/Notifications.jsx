import { useEffect, useState } from "react";
import { Bell, AlertCircle, CheckCircle, Info, Trash2, Check } from "lucide-react";
import { fetchAdminNotificationsData } from "../../../../lib/api";

const TYPE_CONFIG = {
  warning: { icon: AlertCircle, color: "#FF7A00", bg: "#FFF3E8" },
  success: { icon: CheckCircle, color: "#28A745", bg: "#F0FFF4" },
  info: { icon: Info, color: "#4A90E2", bg: "#EBF4FF" },
};

export function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [info, setInfo] = useState("");

  useEffect(() => {
    const load = async () => {
      const { ok, data } = await fetchAdminNotificationsData();
      if (!ok || !data?.status) return;
      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
    };
    load();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const toggleRead = (id) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  };

  return (
    <div className="container my-4" style={{ maxWidth: "800px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <Bell size={20} style={{ color: "#FF7A00" }} />
          <span className="small text-muted">{unreadCount} unread notifications</span>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" onClick={markAllRead} type="button">
            <Check size={16} /> Mark All Read
          </button>
          <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1" onClick={clearAll} type="button">
            <Trash2 size={16} /> Clear All
          </button>
        </div>
      </div>

      <div className="d-flex flex-column gap-2">
        {info ? <div className="alert alert-info py-2">{info}</div> : null}
        {notifications.map((notif) => {
          const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info;
          return (
            <div
              key={notif.id}
              className="card shadow-sm"
              style={{
                borderColor: !notif.read ? `${config.color}40` : "#ced4da",
                opacity: notif.read ? 0.75 : 1,
              }}
            >
              <div className="card-body d-flex">
                <div className="flex-shrink-0 d-flex align-items-center justify-content-center rounded me-3" style={{ width: 50, height: 50, backgroundColor: config.bg }}>
                  <config.icon size={20} style={{ color: config.color }} />
                </div>
                <div className="flex-grow-1 d-flex flex-column">
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <strong>{notif.title}</strong>
                        {!notif.read && <span className="rounded-circle" style={{ width: 8, height: 8, backgroundColor: config.color }} />}
                      </div>
                      <div className="small text-muted">{notif.message}</div>
                    </div>
                    <div className="text-end small text-muted">{notif.time}</div>
                  </div>
                  <div className="mt-2 d-flex gap-2 small">
                    <button className="btn btn-link p-0" style={{ color: config.color }} type="button" onClick={() => setInfo(notif.message)}>
                      View Details
                    </button>
                    <span className="text-muted">-</span>
                    <button className="btn btn-link p-0 text-muted" onClick={() => toggleRead(notif.id)} type="button">
                      {notif.read ? "Mark Unread" : "Mark Read"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
