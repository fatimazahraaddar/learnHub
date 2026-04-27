import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function PublicLayout() {
return ( <div className="d-flex flex-column min-vh-100">


  {/* Navbar */}
  <Navbar />

  {/* Content */}
  <main className="flex-grow-1">
    <Outlet />
  </main>

  {/* Footer */}
  <Footer />

</div>

);
}
