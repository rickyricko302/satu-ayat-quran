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
        <div className="mt-2">
          <Link
            to="/v2"
            className="badge rounded-pill text-decoration-none px-3 py-2 shadow-sm"
            style={{
              background: "linear-gradient(135deg, #065f46 0%, #047857 50%, #b45309 100%)",
              color: "#fef08a",
              border: "1px solid rgba(254, 240, 138, 0.4)",
              fontSize: "0.82rem",
              letterSpacing: "0.03em",
            }}
          >
            ✨ Coba Versi Baru: <strong>/v2 Absolute Cinema</strong> ↗
          </Link>
        </div>
      </div>
    </>
  );
};
export default Header;
