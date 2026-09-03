import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowRight,
  Copy,
  Check,
  Languages,
  Aperture,
  Compass,
  AlertCircle,
} from "lucide-react";
import V4Background from "../components/V4Background";
import V4AudioWave from "../components/V4AudioWave";
import V4TafsirModal from "../components/V4TafsirModal";
import V4Skeleton from "../components/V4Skeleton";

const API_BASE = "https://quran-endpoint.vercel.app/quran";

const CinemaV4Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isTafsirOpen, setIsTafsirOpen] = useState(false);
  const [showLatin, setShowLatin] = useState(true);
  const [fontSizeLevel, setFontSizeLevel] = useState(1); // 0: standard, 1: medium, 2: large
  const [copied, setCopied] = useState(false);
  const [adabToast, setAdabToast] = useState(false);
  const [error, setError] = useState(null);

  const audioRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const getSurah = useCallback(async () => {
    stopAudio();
    setIsLoading(true);
    setError(null);

    try {
      const randomSurah = Math.floor(Math.random() * 114) + 1;
      const surahRes = await axios.get(`${API_BASE}/${randomSurah}`);
      const ayahCount = surahRes.data.data.ayahCount;
      const randomAyah = Math.floor(Math.random() * ayahCount) + 1;

      const ayahRes = await axios.get(`${API_BASE}/${randomSurah}/${randomAyah}`);
      const payload = {
        ...ayahRes.data.data,
        randomSurah,
        randomAyah,
        totalAyahInSurah: ayahCount,
      };
      setData(payload);
    } catch (err) {
      console.error("Gagal memuat ayat acak:", err);
      setError("Gagal memuat ayat ilahi. Silakan periksa koneksi lalu ulangi.");
    } finally {
      setIsLoading(false);
    }
  }, [stopAudio]);

  useEffect(() => {
    document.title = "Satu Ayat Quran — Absolute Cinema v4";
    getSurah();
    return () => {
      stopAudio();
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [getSurah, stopAudio]);

  // Audio setup when data loads
  const setupAudio = useCallback(() => {
    if (!data?.ayah?.audio?.url) return null;

    if (!audioRef.current) {
      const audio = new Audio(data.ayah.audio.url);
      audioRef.current = audio;

      audio.onloadedmetadata = () => {
        setDuration(audio.duration || 0);
      };

      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime || 0);
      };

      audio.onplay = () => {
        setIsPlaying(true);
      };

      audio.onpause = () => {
        setIsPlaying(false);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
    }
    return audioRef.current;
  }, [data]);

  const triggerAdabToast = useCallback(() => {
    setAdabToast(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setAdabToast(false);
    }, 4500);
  }, []);

  const handleTogglePlay = useCallback(() => {
    const audio = setupAudio();
    if (!audio) return;

    if (isPlaying) {
      // Adab santun seperti v1: "sebaiknya didengarkan sampai selesai"
      triggerAdabToast();
      audio.pause();
    } else {
      audio.play().catch((err) => {
        console.warn("Autoplay dicegah browser:", err);
      });
    }
  }, [setupAudio, isPlaying, triggerAdabToast]);

  const handleSeek = (targetSeconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = targetSeconds;
      setCurrentTime(targetSeconds);
    }
  };

  const handleCopyAyah = () => {
    if (!data) return;
    const shareText = `"${data.ayah?.text?.ar}"\n\n` +
      `${data.ayah?.text?.read ? `(${data.ayah?.text?.read})\n\n` : ""}` +
      `Artinya: "${data.ayah?.translation?.id}"\n\n` +
      `— QS. ${data.surah?.id?.short} [${data.randomSurah}:${data.randomAyah}]\n` +
      `Disimak melalui Satu Ayat Quran Cinema v4`;

    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    });
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if inside input/textarea
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;

      if (e.code === "Space") {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        getSurah();
      } else if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        setIsTafsirOpen((prev) => !prev);
      } else if (e.key === "l" || e.key === "L") {
        e.preventDefault();
        setShowLatin((prev) => !prev);
      } else if (e.key === "f" || e.key === "F") {
        if (data?.randomSurah) {
          e.preventDefault();
          navigate(`/v4/full-surah/${data.randomSurah}`);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleTogglePlay, getSurah, data, navigate]);

  const arabicFontSizes = ["clamp(1.6rem, 3.8vw, 2.2rem)", "clamp(1.85rem, 4.5vw, 2.75rem)", "clamp(2.2rem, 5.5vw, 3.4rem)"];

  return (
    <div className="v4-universe">
      <V4Background />

      <div className="v4-content-layer">
        {/* Navigation Bar */}
        <header className="v4-navbar">
          <Link to="/v4" className="v4-brand">
            <div className="v4-brand-icon-seal">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="v4-brand-title">Satu Ayat</span>
              <span className="v4-brand-badge ms-2">v4 Cinema</span>
            </div>
          </Link>

          <div className="v4-nav-actions">
            <Link to="/" className="v4-btn-ghost" title="Ke Versi Orisinal v1">
              <span>v1 Original</span>
            </Link>
            <button
              type="button"
              className="v4-btn-ghost"
              onClick={getSurah}
              disabled={isLoading}
              title="Acak Ayat Lain (Tekan R)"
            >
              <RotateCcw size={14} className={isLoading ? "spin" : ""} />
              <span>Acak</span>
            </button>
          </div>
        </header>

        {/* Main Stage */}
        <main className="v4-main-container">
          <div className="v4-hero-meta">
            <div className="v4-tagline-chip">
              <Aperture size={13} />
              <span>Ruang Hening Al-Qur&apos;an</span>
            </div>
            <div className="v4-tagline-text">
              Jeda sejenak dari hiruk-pikuk dunia, resapi satu pesan ilahi untuk harimu.
            </div>
          </div>

          {error ? (
            <div className="v4-sanctuary-card text-center p-5">
              <AlertCircle size={44} color="#f59e0b" className="mb-3" />
              <h3 className="text-light mb-2">{error}</h3>
              <button onClick={getSurah} className="v4-btn-cinema-primary mt-3">
                Coba Muat Ulang
              </button>
            </div>
          ) : isLoading || !data ? (
            <V4Skeleton />
          ) : (
            <article className="v4-sanctuary-card">
              <div className="v4-card-glow-edge" />

              {/* Surah Header Information */}
              <div className="v4-surah-identity">
                <div className="v4-surah-badge-meta">
                  <span className="v4-surah-badge-num">
                    QS. {data.randomSurah}:{data.randomAyah}
                  </span>
                  <span>(Ayat ke-{data.randomAyah} dari {data.totalAyahInSurah})</span>
                </div>

                <div className="v4-surah-titles">
                  <h1 className="v4-surah-name-heading">
                    <span>{data.surah?.id?.short}</span>
                    <span className="v4-arabic-name">{data.surah?.ar?.short}</span>
                  </h1>
                  <div className="v4-surah-meaning">
                    &ldquo;{data.surah?.translation?.id}&rdquo;
                  </div>
                </div>

                {/* Toolbar actions */}
                <div className="v4-card-toolbar">
                  <button
                    type="button"
                    className={`v4-tool-btn ${showLatin ? "active" : ""}`}
                    onClick={() => setShowLatin((prev) => !prev)}
                    title="Tampilkan / Sembunyikan Pelafalan Latin [L]"
                  >
                    <Languages size={15} />
                  </button>

                  <button
                    type="button"
                    className="v4-tool-btn"
                    onClick={() => setFontSizeLevel((prev) => (prev + 1) % 3)}
                    title="Ubah Ukuran Teks Arab"
                  >
                    <span style={{ fontSize: "11px", fontWeight: "700" }}>Aa</span>
                  </button>

                  <button
                    type="button"
                    className="v4-tool-btn"
                    onClick={handleCopyAyah}
                    title="Salin Ayat ke Clipboard [C]"
                  >
                    {copied ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
                  </button>
                </div>
              </div>

              {/* The Holy Scripture Box */}
              <div className="v4-ayah-scripture-box">
                <p
                  className="v4-arabic-text"
                  style={{ fontSize: arabicFontSizes[fontSizeLevel] }}
                >
                  {data.ayah?.text?.ar}
                  <span className="v4-ayah-seal" title={`Ayat ${data.randomAyah}`}>
                    {data.randomAyah}
                  </span>
                </p>
              </div>

              {/* Transliteration */}
              {showLatin && data.ayah?.text?.read && (
                <div className="v4-transliteration">
                  &ldquo;{data.ayah?.text?.read}&rdquo;
                </div>
              )}

              {/* Translation */}
              <div className="v4-translation-box">
                <div className="v4-translation-label">
                  <Sparkles size={12} />
                  <span>Terjemahan Makna</span>
                </div>
                <p className="v4-translation-text">
                  {data.ayah?.translation?.id}
                </p>
              </div>

              {/* Tafsir Preview */}
              {data.ayah?.tafsir?.id && (
                <div className="v4-tafsir-preview-box">
                  <div className="v4-tafsir-header-bar">
                    <div className="v4-tafsir-tag">
                      <BookOpen size={13} />
                      <span>Renungan & Tafsir</span>
                    </div>
                    <button
                      type="button"
                      className="v4-tafsir-expand-btn"
                      onClick={() => setIsTafsirOpen(true)}
                    >
                      Buka Tafsir Lengkap →
                    </button>
                  </div>
                  <p className="v4-tafsir-snippet">
                    {data.ayah?.tafsir?.id}
                  </p>
                </div>
              )}

              {/* Centerpiece Audio Console */}
              {data.ayah?.audio?.url && (
                <V4AudioWave
                  isPlaying={isPlaying}
                  currentTime={currentTime}
                  duration={duration}
                  onTogglePlay={handleTogglePlay}
                  onSeek={handleSeek}
                  reciterName="Syaikh Ahmed ibn Ali al-Ajamy"
                  subtitle={`Murottal QS. ${data.surah?.id?.short} [Ayat ${data.randomAyah}]`}
                />
              )}
            </article>
          )}

          {/* Action Navigation Below Card */}
          {data && !isLoading && (
            <div className="v4-actions-center">
              <Link
                to={`/v4/full-surah/${data.randomSurah}`}
                className="v4-btn-cinema-primary"
              >
                <span>Tampilkan Lengkap Surah Ini</span>
                <ArrowRight size={17} />
              </Link>

              {data.ayah?.tafsir?.id && (
                <button
                  type="button"
                  className="v4-btn-cinema-secondary"
                  onClick={() => setIsTafsirOpen(true)}
                >
                  <BookOpen size={16} />
                  <span>Baca Tafsir Mendalam</span>
                </button>
              )}
            </div>
          )}

          {/* Desktop Keyboard Shortcuts Pill */}
          <div className="v4-shortcuts-bar" aria-label="Pintasan Keyboard">
            <span><span className="v4-kbd">Space</span> Audio</span>
            <span><span className="v4-kbd">R</span> Acak Ayat</span>
            <span><span className="v4-kbd">T</span> Tafsir</span>
            <span><span className="v4-kbd">L</span> Latin</span>
            <span><span className="v4-kbd">F</span> Surah Penuh</span>
          </div>
        </main>

        {/* Floating Refresh Button */}
        <button
          type="button"
          onClick={getSurah}
          className={`v4-floating-refresh ${isLoading ? "spinning" : ""}`}
          aria-label="Acak Ayat Al-Qur'an Lain"
          title="Acak Ayat Lain (R)"
        >
          <RotateCcw size={22} />
        </button>

        {/* Adab Toast Reminder */}
        {adabToast && (
          <div className="v4-adab-toast" role="status">
            <div className="v4-adab-icon">
              <Compass size={16} />
            </div>
            <span>
              <strong>Adab Mendengarkan:</strong> Sebaiknya didengarkan sampai selesai agar hati menyerap keagungannya.
            </span>
          </div>
        )}

        {/* Contemplation Tafsir Modal */}
        <V4TafsirModal
          isOpen={isTafsirOpen}
          onClose={() => setIsTafsirOpen(false)}
          title="Tafsir Ringkas"
          surahName={data?.surah?.id?.short}
          ayahNumber={data?.randomAyah}
          tafsirText={data?.ayah?.tafsir?.id}
        />

        {/* Footer */}
        <footer className="v4-footer">
          <p className="v4-footer-text mb-1">
            © 2024 — Satu Ayat Quran • Disajikan dengan cinta dan ketakziman untuk Al-Qur&apos;an
          </p>
          <small className="text-muted">
            Data bersumber dari{" "}
            <a href="https://quran-endpoint.vercel.app/" target="_blank" rel="noreferrer">
              quran-endpoint
            </a>{" "}
            oleh{" "}
            <a href="https://github.com/rzkytmgr" target="_blank" rel="noreferrer">
              @rzkytmgr
            </a>
          </small>
        </footer>
      </div>
    </div>
  );
};

export default CinemaV4Home;
