import { useState } from "react";
import { X, BookOpen, Copy, Check, Sparkles } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";

const TafsirModal = ({ isOpen, onClose, title, surahInfo, tafsirText }) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useFavorites();

  if (!isOpen) return null;

  const handleCopyTafsir = () => {
    navigator.clipboard.writeText(
      `Tafsir ${title} (${surahInfo}):\n\n${tafsirText}\n\nSumber: Satu Ayat Quran`
    );
    setCopied(true);
    showToast("Teks tafsir berhasil disalin!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="cinema-modal-backdrop" onClick={onClose}>
      <div
        className="cinema-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "680px" }}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom" style={{ borderColor: "var(--cq-border-light)" }}>
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: "2.5rem",
                height: "2.5rem",
                background: "linear-gradient(135deg, var(--cq-accent-gold) 0%, #d97706 100%)",
              }}
            >
              <BookOpen size={18} className="text-white" />
            </div>
            <div>
              <h5 className="mb-0 fw-bold font-serif-cinematic" style={{ color: "var(--cq-text-main)" }}>
                {title || "Tafsir Ayat"}
              </h5>
              <span className="text-muted small">{surahInfo}</span>
            </div>
          </div>

          <button
            className="cinema-btn cinema-btn-glass cinema-btn-icon"
            onClick={onClose}
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tafsir Body */}
        <div className="py-3">
          <div className="cinema-badge-gold mb-3">
            <Sparkles size={11} /> Penjelasan & Tadabbur
          </div>
          <div
            className="lh-lg text-justify"
            style={{
              color: "var(--cq-text-main)",
              fontSize: "1.025rem",
              lineHeight: "1.9",
              whiteSpace: "pre-line",
            }}
          >
            {tafsirText || "Tafsir belum tersedia untuk ayat ini."}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top" style={{ borderColor: "var(--cq-border-light)" }}>
          <small className="text-muted">Kementerian Agama RI / Sumber Terpercaya</small>
          <button
            className="cinema-btn cinema-btn-glass px-3 py-2 small"
            onClick={handleCopyTafsir}
          >
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
            <span>{copied ? "Tersalin" : "Salin Tafsir"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TafsirModal;
