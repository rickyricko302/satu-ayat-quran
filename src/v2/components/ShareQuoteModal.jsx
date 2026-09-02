import { useState } from "react";
import { X, Share2, Copy, Check, Sparkles, MessageCircle } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";

const ShareQuoteModal = ({ isOpen, onClose, data }) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useFavorites();

  if (!isOpen || !data) return null;

  const surahName = data.surah?.id?.short || data.asma?.id?.short || "";
  const surahNumber = data.randomSurah || data.number || "";
  const ayahNumber = data.randomAyah || data.ayah?.number?.insurah || 1;
  const arabicText = data.ayah?.text?.ar || "";
  const translation = data.ayah?.translation?.id || "";

  const shareText = `✨ Satu Ayat Quran ✨\n\n${arabicText}\n\n"${translation}"\n\n(QS. ${surahName} [${surahNumber}]: ${ayahNumber})\n\nDibaca di: Satu Ayat Quran (v2 Absolute Cinema)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    showToast("Teks kutipan berhasil disalin!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="cinema-modal-backdrop" onClick={onClose}>
      <div
        className="cinema-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "580px" }}
      >
        <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom" style={{ borderColor: "var(--cq-border-light)" }}>
          <div className="d-flex align-items-center gap-2">
            <Share2 size={20} className="text-warning" />
            <h5 className="mb-0 fw-bold font-serif-cinematic" style={{ color: "var(--cq-text-main)" }}>
              Bagikan Pesan Ayat
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

        {/* Cinematic Card Preview */}
        <div
          className="p-4 rounded-4 my-3 text-center position-relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #07281e 0%, #03120c 100%)",
            border: "1px solid rgba(245, 158, 11, 0.4)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.5)",
          }}
        >
          <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
            <span className="cinema-badge-gold" style={{ fontSize: "0.75rem" }}>
              <Sparkles size={11} /> QS. {surahName} : {ayahNumber}
            </span>
          </div>

          <div
            className="font-arabic my-3 px-2"
            style={{
              fontSize: "1.75rem",
              lineHeight: "2.1",
              color: "#fef08a",
              textShadow: "0 0 15px rgba(254, 240, 138, 0.25)",
            }}
          >
            {arabicText}
          </div>

          <div className="cinema-ornament-divider my-2" style={{ opacity: 0.5 }}>
            <span>۞</span>
          </div>

          <p
            className="fst-italic small px-3 mb-3"
            style={{ color: "#d1fae5", lineHeight: "1.7" }}
          >
            "{translation}"
          </p>

          <div className="text-muted" style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}>
            SATU AYAT QURAN • JEDA SEJENAK RESAPI PESAN
          </div>
        </div>

        {/* Share Action Buttons */}
        <div className="d-flex flex-wrap gap-2 justify-content-end mt-4">
          <button
            className="cinema-btn cinema-btn-glass px-3"
            onClick={handleCopy}
          >
            {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
            <span>{copied ? "Tersalin!" : "Salin Teks"}</span>
          </button>

          <button
            className="cinema-btn cinema-btn-gold px-4"
            onClick={handleWhatsApp}
          >
            <MessageCircle size={16} />
            <span>Bagikan ke WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareQuoteModal;
