import { useState } from "react";
import { Menu, X } from "lucide-react";
import SidebarContent from "./SidebarContent";

export function DashboardSidebar({ items, title, accentColor = "#4A90E2" }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="d-lg-none position-fixed top-0 start-0 m-3 text-white border-0"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          backgroundColor: accentColor,
          zIndex: 1030,
        }}
      >
        <Menu size={20} />
      </button>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="d-lg-none position-fixed top-0 start-0 w-100 h-100">
          <div
            className="position-absolute w-100 h-100"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setMobileOpen(false)}
          />

          <div
            className="position-relative h-100"
            style={{ width: "256px", backgroundColor: "#1a1a2e" }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="position-absolute top-0 end-0 m-3 text-white border-0 bg-transparent"
            >
              <X size={20} />
            </button>

            <SidebarContent
              items={items}
              title={title}
              accentColor={accentColor} // ✅ IMPORTANT
              setMobileOpen={setMobileOpen}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className="d-none d-lg-flex flex-column flex-shrink-0"
        style={{
          width: "256px",
          minHeight: "100vh",
          backgroundColor: "#1a1a2e",
        }}
      >
        <SidebarContent
          items={items}
          title={title}
          accentColor={accentColor} // ✅ IMPORTANT
          setMobileOpen={setMobileOpen}
        />
      </aside>
    </>
  );
}
