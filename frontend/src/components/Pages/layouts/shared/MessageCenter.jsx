import { useEffect, useMemo, useState } from "react";
import { Send, Search, MessageSquare } from "lucide-react";
import {
  fetchConversation,
  fetchMessageContacts,
  getStoredUser,
  sendConversationMessage,
} from "../../../../lib/api";

const ROLE_LABELS = {
  learner: "Learner",
  trainer: "Trainer",
  admin: "Admin",
};

function formatTime(value) {
  if (!value) return "";
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function MessageCenter() {
  const user = getStoredUser();
  const senderId = Number(user?.id || 0);
  const senderRole = String(user?.role || "learner");

  const [contacts, setContacts] = useState([]);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [info, setInfo] = useState("");

  const filteredContacts = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return contacts;
    return contacts.filter((c) =>
      `${c.name || ""} ${c.email || ""} ${c.role || ""}`.toLowerCase().includes(q)
    );
  }, [contacts, query]);

  useEffect(() => {
    const loadContacts = async () => {
      if (!senderId || !senderRole) return;

      const { data } = await fetchMessageContacts(senderId);

      const list = Array.isArray(data?.contacts) ? data.contacts : [];
      setContacts(list);
      if (list.length > 0) {
        setActive(list[0]);
      }
    };

    loadContacts();
  }, [senderId, senderRole]);

  useEffect(() => {
    const loadChat = async () => {
      if (!senderId || !active?.id) {
        setMessages([]);
        return;
      }

      const { data } = await fetchConversation(senderId, active.id);

      if (Array.isArray(data)) {
        setMessages(data);
      }
    };

    loadChat();
  }, [active?.id, active?.role, senderId, senderRole]);

  const sendMessage = async () => {
    const value = text.trim();
    if (!senderId || !active?.id || !value) return;

    const { data } = await sendConversationMessage(senderId, active.id, value);

    if (!data.status) {
      setInfo(data.message || "Failed to send message");
      return;
    }

    setText("");
    setInfo("");

    const { data: refreshed } = await fetchConversation(senderId, active.id);

    if (Array.isArray(refreshed)) {
      setMessages(refreshed);
    }
  };

  if (!senderId) {
    return (
      <div className="container my-4">
        <div className="alert alert-warning">Please login first.</div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      {info ? <div className="alert alert-warning py-2">{info}</div> : null}
      <div className="card shadow-sm">
        <div className="row g-0">
          <div className="col-md-4 border-end">
            <div className="p-3 border-bottom">
              <h5 className="fw-bold mb-2">Messages</h5>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <Search size={16} />
                </span>
                <input
                  className="form-control"
                  placeholder="Search contacts..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="list-group" style={{ maxHeight: "520px", overflowY: "auto" }}>
              {filteredContacts.map((contact) => (
                <button
                  key={`${contact.role}-${contact.id}`}
                  type="button"
                  onClick={() => setActive(contact)}
                  className={`list-group-item list-group-item-action d-flex align-items-start gap-2 ${
                    active?.id === contact.id && active?.role === contact.role ? "active" : ""
                  }`}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center bg-light"
                    style={{ width: 36, height: 36 }}
                  >
                    <MessageSquare size={16} />
                  </div>
                  <div className="text-start">
                    <div className="fw-semibold">{contact.name || "Unnamed"}</div>
                    <small className="d-block">{contact.email}</small>
                    <small className="opacity-75">{ROLE_LABELS[contact.role] || contact.role}</small>
                  </div>
                </button>
              ))}

              {filteredContacts.length === 0 ? (
                <div className="p-3 text-muted small">No contacts found</div>
              ) : null}
            </div>
          </div>

          <div className="col-md-8 d-flex flex-column">
            <div className="p-3 border-bottom">
              <strong>{active?.name || "Select a contact"}</strong>
              {active ? (
                <div className="text-muted small">
                  {active.email} - {ROLE_LABELS[active.role] || active.role}
                </div>
              ) : null}
            </div>

            <div className="p-3 flex-grow-1" style={{ minHeight: 380, maxHeight: 380, overflowY: "auto" }}>
              {messages.map((msg) => {
                const isMe =
                  Number(msg.sender_id) === senderId &&
                  String(msg.sender_role || "learner") === senderRole;

                return (
                  <div key={msg.id} className={`d-flex mb-3 ${isMe ? "justify-content-end" : ""}`}>
                    <div
                      className={`px-3 py-2 rounded ${isMe ? "bg-primary text-white" : "bg-light text-dark"}`}
                      style={{ maxWidth: "75%" }}
                    >
                      <div>{msg.message}</div>
                      <small className={isMe ? "text-white-50" : "text-muted"}>
                        {formatTime(msg.created_at)}
                      </small>
                    </div>
                  </div>
                );
              })}

              {messages.length === 0 ? (
                <div className="text-muted small">No messages yet. Start the conversation.</div>
              ) : null}
            </div>

            <div className="border-top p-3">
              <div className="input-group">
                <input
                  className="form-control"
                  placeholder="Type a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                  disabled={!active}
                />
                <button className="btn btn-primary" onClick={sendMessage} disabled={!active}>
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
