import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import "../src/Components/Stlying/UserAccountBar.css";
import "../src/Components/Stlying/Staff_acount.css";
import "../src/Components/Stlying/view_attendees_section.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
