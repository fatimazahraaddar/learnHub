import { RouterProvider } from "react-router-dom";
import { Router } from "./components/routes";

export default function App() {
  return <RouterProvider router={Router} />;
}