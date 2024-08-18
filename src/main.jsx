import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/global.css";
import Home from "./pages/home_page.jsx";
import FullPage from "./pages/full_page.jsx";
import { AudioProvider } from "./hooks/audio_context.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/full-surah/:surah",
    element: <FullPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AudioProvider>
      <RouterProvider router={router} />
    </AudioProvider>
  </StrictMode>
);
