import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/global.css";
import "./assets/css/cinema_v2.css";
import "./assets/css/cinema_v3.css";

// v1 Pages
import Home from "./pages/home_page.jsx";
import FullPage from "./pages/full_page.jsx";
import { AudioProvider } from "./hooks/audio_context.jsx";

// v2 "Absolute Cinema" Pages & Contexts
import CinemaHome from "./v2/pages/CinemaHome.jsx";
import CinemaFullSurah from "./v2/pages/CinemaFullSurah.jsx";
import { ThemeProvider } from "./v2/context/ThemeContext.jsx";
import { FavoritesProvider } from "./v2/context/FavoritesContext.jsx";
import V3Home from "./v3/pages/V3Home.jsx";
import V3FullSurah from "./v3/pages/V3FullSurah.jsx";

const router = createBrowserRouter([
  // v1 Original Routes
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/full-surah/:surah",
    element: <FullPage />,
  },
  // v2 "Absolute Cinema" Routes
  {
    path: "/v2",
    element: <CinemaHome />,
  },
  {
    path: "/v2/full-surah/:surah",
    element: <CinemaFullSurah />,
  },
  {
    path: "/v3",
    element: <V3Home />,
  },
  {
    path: "/v3/full-surah/:surah",
    element: <V3FullSurah />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <FavoritesProvider>
        <AudioProvider>
          <RouterProvider router={router} />
        </AudioProvider>
      </FavoritesProvider>
    </ThemeProvider>
  </StrictMode>
);
