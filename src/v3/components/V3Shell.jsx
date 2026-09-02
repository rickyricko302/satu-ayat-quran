/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const V3Shell = ({ children, footerLabel = "Satu pesan. Satu jeda." }) => {
  return (
    <div className="v3-app">
      <div className="v3-atmosphere" aria-hidden="true">
        <div className="v3-projector-light" />
        <div className="v3-film-grain" />
        <span className="v3-frame-mark v3-frame-mark--left">١</span>
        <span className="v3-frame-mark v3-frame-mark--right">١١٤</span>
      </div>

      <header className="v3-header">
        <Link to="/v3" className="v3-brand" aria-label="Satu Ayat Quran — beranda">
          <span className="v3-brand-mark" aria-hidden="true">
            <img src="/quran.svg" alt="" />
          </span>
          <span>
            <span className="v3-brand-kicker">A quiet encounter</span>
            <strong>Satu Ayat Quran</strong>
          </span>
        </Link>

        <div className="v3-header-note">
          <span />
          <p>Jeda sejenak. Dengarkan yang abadi.</p>
        </div>
      </header>

      {children}

      <footer className="v3-footer">
        <p>{footerLabel}</p>
        <div className="v3-footer-rule" />
        <p>
          Data Al-Qur’an oleh{" "}
          <a href="https://quran-endpoint.vercel.app/" target="_blank" rel="noreferrer">
            Quran Endpoint
          </a>
        </p>
      </footer>
    </div>
  );
};

export default V3Shell;
