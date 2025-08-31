import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ThemeProvider } from "./contexts/ThemeContext";

import Home from "./routes/home";
import Article from "./routes/article";
import Tags from "./routes/tags";

import "./css/general/index.css";
import "./css/general/footer.css";
import "./css/general/header.css";
import "./css/home/article-list.css";
import "./css/home/home.css";
import "./css/articles/reader.css";
import "./css/tags/tags.css";
import "./css/articles/comments.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/articles",
    element: <Tags />,
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
