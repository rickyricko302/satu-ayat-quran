/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { X, BookOpen } from "lucide-react";

const V4TafsirModal = ({
  isOpen,
  onClose,
  title = "Tafsir Ayat",
  surahName = "",
  ayahNumber = null,
  tafsirText = "",
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="v4-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="v4-tafsir-title"
    >
      <div
        className="v4-modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="v4-modal-header">
          <div className="d-flex align-items-center gap-2">
            <BookOpen size={18} color="#f59e0b" />
            <h2 id="v4-tafsir-title" className="v4-modal-title">
              {title} {surahName ? `— ${surahName}` : ""}{" "}
              {ayahNumber ? `[Ayat ${ayahNumber}]` : ""}
            </h2>
          </div>
          <button
            type="button"
            className="v4-modal-close-btn"
            onClick={onClose}
            aria-label="Tutup Tafsir"
          >
            <X size={18} />
          </button>
        </div>

        <div className="v4-modal-body">
          <p className="mb-0">
            {tafsirText || "Keterangan tafsir belum tersedia untuk ayat ini."}
          </p>
        </div>

        <div className="v4-modal-footer">
          <button
            type="button"
            className="v4-btn-ghost"
            onClick={onClose}
          >
            Tutup Lembar Tafsir
          </button>
        </div>
      </div>
    </div>
  );
};

export default V4TafsirModal;
