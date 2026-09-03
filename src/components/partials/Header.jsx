import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <div className="d-flex flex-column align-items-center justify-content-center my-4">
        <div className="d-flex gap-2 align-items-center justify-content-center">
          <h1 className="text-success fw-bold">Satu Ayat Quran</h1>
          <span className="h1">💖</span>
        </div>
        <div className="text-center text-muted">Jeda sejenak, baca satu pesan dari Al-Qur'an.</div>
        <div className="mt-2 d-flex gap-2 flex-wrap justify-content-center">
          <Link
            to="/v4"
            className="badge rounded-pill text-decoration-none px-3 py-2 shadow-sm"
            style={{
              background: "linear-gradient(135deg, #065f46 0%, #047857 50%, #d4af37 100%)",
              color: "#ffffff",
              border: "1px solid rgba(212, 175, 55, 0.5)",
              fontSize: "0.84rem",
              letterSpacing: "0.04em",
              boxShadow: "0 0 16px rgba(16, 185, 129, 0.3)",
            }}
          >
            🌟 Coba Versi Baru: <strong>/v4 Absolute Cinema</strong> ↗
          </Link>
          <Link
            to="/v2"
            className="badge rounded-pill text-decoration-none px-3 py-2 text-muted"
            style={{
              background: "rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.1)",
              fontSize: "0.82rem",
            }}
          >
            /v2
          </Link>
        </div>
      </div>
    </>
  );
};
export default Header;
