import { Link, useNavigate } from "react-router-dom";
import { useCinemaTheme } from "../context/ThemeContext";
import { useFavorites } from "../context/FavoritesContext";
import {
  Sparkles,
  Palette,
  Type,
  Bookmark,
  Search,
  Keyboard,
  ArrowLeftRight,
  BookOpen,
} from "lucide-react";

const CinemaHeader = ({
  onOpenBookmarks,
  onOpenShortcuts,
  onOpenSurahSearch,
}) => {
  const { theme, cycleTheme, fontSize, cycleFontSize } = useCinemaTheme();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const getThemeLabel = () => {
    if (theme === "emerald") return "Emerald";
    if (theme === "celestial") return "Celestial";
    return "Alabaster";
  };

  return (
    <header className="cinema-header px-4 py-3">
      <div className="cinema-container d-flex align-items-center justify-content-between">
        {/* Brand & Logo */}
        <Link
          to="/v2"
          className="d-flex align-items-center gap-3 text-decoration-none"
        >
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "2.75rem",
              height: "2.75rem",
              background: "linear-gradient(135deg, var(--cq-accent-emerald) 0%, var(--cq-accent-gold) 100%)",
              boxShadow: "0 0 20px var(--cq-accent-gold-glow)",
            }}
          >
            <BookOpen size={20} className="text-white" />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <span
                className="font-serif-cinematic fw-bold fs-5"
                style={{ color: "var(--cq-text-main)", letterSpacing: "0.04em" }}
              >
                Satu Ayat
              </span>
              <span className="cinema-badge-gold">
                <Sparkles size={11} /> v2 CINEMA
              </span>
            </div>
            <div
              className="text-muted small d-none d-sm-block"
              style={{ fontSize: "0.78rem", marginTop: "-2px" }}
            >
              Jeda sejenak, resapi satu pesan dari Al-Qur'an
            </div>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="d-flex align-items-center gap-2">
          {/* Surah Search Quick Jump */}
          {onOpenSurahSearch && (
            <button
              className="cinema-btn cinema-btn-glass cinema-btn-icon"
              onClick={onOpenSurahSearch}
              title="Cari Surah (1-114)"
              aria-label="Cari Surah"
            >
              <Search size={18} />
            </button>
          )}

          {/* Bookmarks Counter & Drawer Trigger */}
          {onOpenBookmarks && (
            <button
              className="cinema-btn cinema-btn-glass position-relative px-3"
              onClick={onOpenBookmarks}
              title="Ayat Tersimpan"
              aria-label="Ayat Tersimpan"
              style={{ height: "2.75rem" }}
            >
              <Bookmark
                size={18}
                className={favorites.length > 0 ? "text-warning" : ""}
              />
              <span className="d-none d-md-inline small">Favorit</span>
              {favorites.length > 0 && (
                <span
                  className="badge rounded-pill bg-warning text-dark ms-1"
                  style={{ fontSize: "0.7rem", padding: "0.25em 0.5em" }}
                >
                  {favorites.length}
                </span>
              )}
            </button>
          )}

          {/* Font Size Adjuster */}
          <button
            className="cinema-btn cinema-btn-glass cinema-btn-icon"
            onClick={cycleFontSize}
            title={`Ukuran Font Arab: ${fontSize.toUpperCase()}`}
            aria-label="Ubah Ukuran Font"
          >
            <span className="fw-bold small" style={{ fontSize: "0.8rem" }}>
              A<sup style={{ fontSize: "0.6rem" }}>{fontSize.toUpperCase()}</sup>
            </span>
          </button>

          {/* Theme Cycler */}
          <button
            className="cinema-btn cinema-btn-glass px-3"
            onClick={cycleTheme}
            title={`Tema Saat Ini: ${getThemeLabel()} (Klik untuk ganti)`}
            aria-label="Ganti Tema"
            style={{ height: "2.75rem" }}
          >
            <Palette size={18} className="text-warning" />
            <span className="d-none d-lg-inline small">{getThemeLabel()}</span>
          </button>

          {/* Keyboard Shortcuts Dialog */}
          {onOpenShortcuts && (
            <button
              className="cinema-btn cinema-btn-glass cinema-btn-icon d-none d-sm-flex"
              onClick={onOpenShortcuts}
              title="Pintasan Keyboard (Shortcuts)"
              aria-label="Pintasan Keyboard"
            >
              <Keyboard size={18} />
            </button>
          )}

          {/* Switch to Classic v1 */}
          <Link
            to="/"
            className="cinema-btn cinema-btn-glass px-3 d-none d-md-flex text-muted"
            title="Kembali ke Mode Klasik v1"
            style={{ height: "2.75rem", fontSize: "0.8rem" }}
          >
            <ArrowLeftRight size={14} />
            <span>Mode Klasik</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default CinemaHeader;
