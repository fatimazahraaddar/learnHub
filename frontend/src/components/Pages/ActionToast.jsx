export function ActionToast({ show, text, variant = "info", onClose }) {
  if (!show || !text) return null;

  const color =
    variant === "success"
      ? "success"
      : variant === "danger"
        ? "danger"
        : "info";

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 2000 }}>
      <div className={`alert alert-${color} shadow mb-0 d-flex align-items-center justify-content-between`} role="alert">
        <span>{text}</span>
        <button type="button" className="btn-close ms-3" onClick={onClose} />
      </div>
    </div>
  );
}
