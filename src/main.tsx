import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ThemeProvider } from "./contexts/ThemeContext";

import Home from "./routes/home";
import Article from "./routes/article";

import "./css/general/index.css";
import "./css/general/footer.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/:tag/:article",
    element: <Article />,
  },
  {
    path: "*",
    element: (
      <div>
        <p>Page not found</p>
        <a href="/">Go back to home</a>
      </div>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
