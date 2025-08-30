import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ThemeProvider } from "./contexts/ThemeContext";

import Home from "./routes/home";

import "./css/index.css";
import "./css/footer.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
