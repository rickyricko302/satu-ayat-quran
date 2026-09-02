import { X, Keyboard, Sparkles } from "lucide-react";

const ShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "Space", desc: "Putar / Jeda Murottal Ayat" },
    { key: "R", desc: "Acak & Muat Ayat Baru" },
    { key: "T", desc: "Buka Penjelasan Tafsir" },
    { key: "B", desc: "Simpan / Hapus dari Favorit" },
    { key: "C", desc: "Salin Teks Ayat & Terjemahan" },
    { key: "F", desc: "Buka Bacaan Surah Lengkap" },
    { key: "S", desc: "Buka Menu Cari Surah" },
    { key: "Esc", desc: "Tutup Dialog / Modal" },
  ];

  return (
    <div className="cinema-modal-backdrop" onClick={onClose}>
      <div
        className="cinema-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "520px" }}
      >
        <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom" style={{ borderColor: "var(--cq-border-light)" }}>
          <div className="d-flex align-items-center gap-2">
            <Keyboard size={20} className="text-warning" />
            <h5 className="mb-0 fw-bold font-serif-cinematic" style={{ color: "var(--cq-text-main)" }}>
              Pintasan Keyboard (Shortcuts)
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

        <p className="text-muted small mb-3">
          Gunakan tombol keyboard berikut untuk navigasi cepat tanpa perlu mengklik:
        </p>

        <div className="d-flex flex-column gap-2 mb-4">
          {shortcuts.map((item, idx) => (
            <div
              key={idx}
              className="d-flex align-items-center justify-content-between p-2 px-3 rounded-3"
              style={{ background: "var(--cq-surface-elevated)" }}
            >
              <span className="small text-muted">{item.desc}</span>
              <kbd
                className="px-2 py-1 rounded small fw-bold"
                style={{
                  background: "var(--cq-card-bg-solid)",
                  border: "1px solid var(--cq-card-border)",
                  color: "var(--cq-accent-gold)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="cinema-btn cinema-btn-primary w-100 py-2" onClick={onClose}>
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortcutsModal;
