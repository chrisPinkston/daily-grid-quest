import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom'
import App from "./App.tsx";
import "./index.css";

/ Vite exposes the base path here:
const basename = import.meta.env.BASE_URL; // -> '/daily-grid-quest/'


createRoot(document.getElementById("root")!).render(<BrowserRouter basename={basename}>
    <App />
  </BrowserRouter>);
