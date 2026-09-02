import { Heart, Sparkles, Code, Database, Compass } from "lucide-react";
import { Link } from "react-router-dom";

const CinemaFooter = () => {
  return (
    <footer
      className="mt-auto py-5 border-top"
      style={{
        borderColor: "var(--cq-border-light)",
        background: "rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="cinema-container text-center">
        <div className="cinema-ornament-divider" style={{ maxWidth: "320px", margin: "0 auto 1.5rem" }}>
          <span>۞</span>
          <span className="small font-serif-cinematic">Satu Ayat Quran</span>
          <span>۞</span>
        </div>

        <p className="text-muted small mb-3" style={{ maxWidth: "540px", margin: "0 auto" }}>
          Dirancang untuk menghadirkan ketenangan dan perenungan mendalam di sela rutinitas Anda. Luangkan satu menit untuk satu pesan ilahi.
        </p>

        <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 text-muted small my-3">
          <div className="d-flex align-items-center gap-1">
            <Code size={14} className="text-success" />
            <span>Karya</span>
            <a
              href="https://github.com/rickyricko302"
              target="_blank"
              rel="noreferrer"
              className="fw-bold text-decoration-none"
              style={{ color: "var(--cq-accent-gold)" }}
            >
              @ricky v
            </a>
          </div>

          <span>•</span>

          <div className="d-flex align-items-center gap-1">
            <Database size={14} className="text-info" />
            <span>Sumber Data oleh</span>
            <a
              href="https://github.com/rzkytmgr"
              target="_blank"
              rel="noreferrer"
              className="fw-bold text-decoration-none"
              style={{ color: "var(--cq-accent-gold)" }}
            >
              @rzkytmgr
            </a>
          </div>

          <span>•</span>

          <div className="d-flex align-items-center gap-1">
            <Compass size={14} className="text-warning" />
            <Link
              to="/"
              className="text-decoration-none"
              style={{ color: "var(--cq-text-muted)" }}
            >
              Versi Klasik (v1)
            </Link>
          </div>
        </div>

        <div className="text-muted" style={{ fontSize: "0.75rem", opacity: 0.7 }}>
          © {new Date().getFullYear()} Satu Ayat Quran • v2 Absolute Cinema
        </div>
      </div>
    </footer>
  );
};

export default CinemaFooter;
