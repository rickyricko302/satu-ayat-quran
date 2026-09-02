import { X, Trash2, BookmarkCheck, Play, ArrowRight, BookOpen } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { Link } from "react-router-dom";

const BookmarksDrawer = ({ isOpen, onClose, onSelectAyah }) => {
  const { favorites, removeBookmark, clearAllFavorites } = useFavorites();

  if (!isOpen) return null;

  return (
    <div className="cinema-modal-backdrop" onClick={onClose}>
      <div
        className="cinema-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-bottom d-flex align-items-center justify-content-between" style={{ borderColor: "var(--cq-border-light)" }}>
          <div className="d-flex align-items-center gap-2">
            <BookmarkCheck size={22} className="text-warning" />
            <h5 className="mb-0 fw-bold font-serif-cinematic" style={{ color: "var(--cq-text-main)" }}>
              Ayat Tersimpan ({favorites.length})
            </h5>
          </div>

          <button
            className="cinema-btn cinema-btn-glass cinema-btn-icon"
            onClick={onClose}
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body List */}
        <div className="flex-fill overflow-auto p-3">
          {favorites.length === 0 ? (
            <div className="text-center py-5 px-3">
              <div
                className="d-inline-flex p-3 rounded-circle mb-3"
                style={{ background: "var(--cq-surface-elevated)" }}
              >
                <BookOpen size={32} className="text-muted" />
              </div>
              <h6 className="fw-bold mb-1">Belum Ada Ayat Tersimpan</h6>
              <p className="text-muted small">
                Klik ikon hati/bookmark pada kartu ayat untuk menyimpannya di sini.
              </p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {favorites.map((item, idx) => (
                <div
                  key={`${item.surahNumber}-${item.ayahNumber}-${idx}`}
                  className="p-3 rounded-3 position-relative"
                  style={{
                    background: "var(--cq-surface-elevated)",
                    border: "1px solid var(--cq-border-light)",
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="cinema-badge-gold">
                      Surah {item.surahName} ({item.surahNumber}:{item.ayahNumber})
                    </span>

                    <button
                      className="btn btn-sm text-danger p-1"
                      onClick={() => removeBookmark(item.surahNumber, item.ayahNumber)}
                      title="Hapus dari favorit"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div
                    className="font-arabic my-2"
                    style={{
                      fontSize: "1.25rem",
                      lineHeight: "1.8",
                      color: "var(--cq-text-arabic)",
                    }}
                  >
                    {item.arabic}
                  </div>

                  <p className="text-muted small mb-3 text-truncate" style={{ maxHeight: "40px" }}>
                    "{item.translation}"
                  </p>

                  <div className="d-flex align-items-center justify-content-between gap-2 pt-2 border-top" style={{ borderColor: "var(--cq-border-light)" }}>
                    <Link
                      to={`/v2/full-surah/${item.surahNumber}`}
                      onClick={onClose}
                      className="text-decoration-none small d-flex align-items-center gap-1"
                      style={{ color: "var(--cq-accent-emerald-light)" }}
                    >
                      <span>Baca Surah</span>
                      <ArrowRight size={13} />
                    </Link>

                    {item.audioUrl && (
                      <button
                        className="cinema-btn cinema-btn-glass px-2 py-1 small"
                        style={{ fontSize: "0.75rem" }}
                        onClick={() => {
                          if (onSelectAyah) onSelectAyah(item);
                        }}
                      >
                        <Play size={11} /> Putar Audio
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {favorites.length > 0 && (
          <div className="p-3 border-top d-flex justify-content-end" style={{ borderColor: "var(--cq-border-light)" }}>
            <button
              className="cinema-btn cinema-btn-glass text-danger small py-2 px-3"
              onClick={clearAllFavorites}
            >
              <Trash2 size={14} />
              <span>Bersihkan Semua</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksDrawer;
