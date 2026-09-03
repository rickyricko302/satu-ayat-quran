import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  BookOpen,
  Play,
  Pause,
  Copy,
  Check,
  Languages,
  ChevronDown,
  ChevronUp,
  Compass,
  AlertCircle,
} from "lucide-react";
import V4Background from "../components/V4Background";

const API_BASE = "https://quran-endpoint.vercel.app/quran";

const CinemaV4FullSurah = () => {
  const { surah } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePlayingAyah, setActivePlayingAyah] = useState(null);
  const [isSurahTafsirExpanded, setIsSurahTafsirExpanded] = useState(false);
  const [showAllLatin, setShowAllLatin] = useState(true);
  const [copiedAyahIndex, setCopiedAyahIndex] = useState(null);
  const [adabToast, setAdabToast] = useState(false);

  const audioRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setActivePlayingAyah(null);
  }, []);

  const fetchSurah = useCallback(async () => {
    stopAudio();
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${API_BASE}/${surah}`);
      setData(res.data.data);
    } catch (err) {
      console.error("Gagal memuat surah:", err);
      setError("Gagal memuat rincian surah. Pastikan koneksi stabil.");
    } finally {
      setIsLoading(false);
    }
  }, [surah, stopAudio]);

  useEffect(() => {
    fetchSurah();
    return () => {
      stopAudio();
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [fetchSurah, stopAudio]);

  useEffect(() => {
    if (data?.asma?.id?.short) {
      document.title = `QS. ${data.asma.id.short} — Surah Lengkap Cinema v4`;
    }
  }, [data]);

  const triggerAdabToast = () => {
    setAdabToast(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setAdabToast(false);
    }, 4500);
  };

  const handlePlayAyah = (ayahIndex, audioUrl) => {
    if (!audioUrl) return;

    if (activePlayingAyah === ayahIndex) {
      triggerAdabToast();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setActivePlayingAyah(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setActivePlayingAyah(ayahIndex);

    audio.onended = () => {
      setActivePlayingAyah(null);
    };

    audio.onerror = () => {
      setActivePlayingAyah(null);
      console.warn("Gagal memutar audio ayat ini.");
    };

    audio.play().catch((err) => {
      console.warn("Browser mencegah pemutaran audio otomatis:", err);
      setActivePlayingAyah(null);
    });
  };

  const handleCopyAyah = (item, index) => {
    const shareText = `"${item.text?.ar}"\n\n` +
      `${item.text?.read ? `(${item.text?.read})\n\n` : ""}` +
      `Artinya: "${item.translation?.id}"\n\n` +
      `— QS. ${data?.asma?.id?.short} [${data?.number}:${index + 1}]\n` +
      `Disimak melalui Satu Ayat Quran Cinema v4`;

    navigator.clipboard.writeText(shareText).then(() => {
      setCopiedAyahIndex(index);
      setTimeout(() => setCopiedAyahIndex(null), 2000);
    });
  };

  return (
    <div className="v4-universe">
      <V4Background />

      <div className="v4-content-layer">
        {/* Navigation Bar */}
        <header className="v4-navbar">
          <Link to="/v4" className="v4-btn-ghost" title="Kembali ke Ayat Acak">
            <ArrowLeft size={16} />
            <span>Kembali ke Satu Ayat</span>
          </Link>

          <div className="v4-nav-actions">
            <button
              type="button"
              className={`v4-btn-ghost ${showAllLatin ? "active" : ""}`}
              onClick={() => setShowAllLatin((prev) => !prev)}
              title="Toggle Transliterasi Latin Semua Ayat"
            >
              <Languages size={15} />
              <span>{showAllLatin ? "Sembunyikan Latin" : "Tampilkan Latin"}</span>
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="v4-main-container" style={{ maxWidth: "860px" }}>
          {error ? (
            <div className="v4-sanctuary-card text-center p-5">
              <AlertCircle size={44} color="#f59e0b" className="mb-3" />
              <h3 className="text-light mb-2">{error}</h3>
              <button onClick={fetchSurah} className="v4-btn-cinema-primary mt-3">
                Coba Muat Ulang
              </button>
            </div>
          ) : isLoading || !data ? (
            <div className="d-flex flex-column gap-4">
              <div className="v4-skeleton-pulse" style={{ height: "220px", borderRadius: "24px" }} />
              <div className="v4-skeleton-pulse" style={{ height: "120px", borderRadius: "16px" }} />
              <div className="v4-skeleton-pulse" style={{ height: "160px", borderRadius: "16px" }} />
            </div>
          ) : (
            <>
              {/* Surah Hero Card */}
              <section className="v4-surah-hero">
                <div className="v4-surah-hero-arabic-title">
                  {data.asma?.ar?.short}
                </div>
                <h1 className="v4-surah-hero-latin-title">
                  Surah {data.asma?.id?.short}
                </h1>
                <p className="v4-surah-meaning mb-0">
                  &ldquo;{data.asma?.translation?.id}&rdquo;
                </p>

                {/* Metadata Pills */}
                <div className="v4-surah-meta-pills">
                  <span className="v4-meta-pill">
                    Surah ke-{data.number}
                  </span>
                  <span className="v4-meta-pill">
                    {data.ayahCount} Ayat
                  </span>
                  <span className="v4-meta-pill">
                    Golongan {data.type?.id || "Makkiyah"}
                  </span>
                  <span className="v4-meta-pill">
                    Urutan Turun ke-{data.sequence}
                  </span>
                </div>

                {/* Bismillah (if not Surah 9 At-Taubah & Surah 1 Al-Fatihah includes it as ayah 1) */}
                {data.number !== 9 && data.number !== 1 && (
                  <div className="v4-bismillah-banner">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </div>
                )}
              </section>

              {/* Surah Tafsir Card */}
              {data.tafsir?.id && (
                <section className="v4-surah-tafsir-card">
                  <div
                    className="d-flex align-items-center justify-content-between cursor-pointer"
                    onClick={() => setIsSurahTafsirExpanded((prev) => !prev)}
                    style={{ cursor: "pointer" }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="v4-surah-tafsir-title mb-0">
                      <BookOpen size={16} />
                      <span>Tafsir Pengantar Surah {data.asma?.id?.short}</span>
                    </div>
                    <button
                      type="button"
                      className="v4-tool-btn"
                      aria-label="Toggle Tafsir Surah"
                    >
                      {isSurahTafsirExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {isSurahTafsirExpanded && (
                    <div className="v4-surah-tafsir-body mt-3 pt-3 border-top border-secondary border-opacity-25">
                      {data.tafsir.id}
                    </div>
                  )}
                </section>
              )}

              {/* List of Ayahs */}
              <section className="v4-ayahs-collection" aria-label="Daftar Seluruh Ayat">
                {data.ayahs?.map((item, index) => {
                  const ayahNumber = index + 1;
                  const isCurrentPlaying = activePlayingAyah === index;

                  return (
                    <article
                      key={index}
                      id={`ayah-${ayahNumber}`}
                      className={`v4-ayah-row ${isCurrentPlaying ? "active-playing" : ""}`}
                    >
                      <div className="v4-ayah-row-top">
                        <span className="v4-ayah-num-badge">
                          <span className="v4-surah-badge-num">{ayahNumber}</span>
                          <span className="text-muted">/ {data.ayahCount}</span>
                        </span>

                        <div className="v4-ayah-row-actions">
                          <button
                            type="button"
                            onClick={() => handleCopyAyah(item, index)}
                            className="v4-tool-btn"
                            title="Salin Ayat Ini"
                          >
                            {copiedAyahIndex === index ? (
                              <Check size={14} color="#10b981" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePlayAyah(index, item.audio?.url)}
                            className={`v4-ayah-play-btn ${isCurrentPlaying ? "playing" : ""}`}
                            aria-label={isCurrentPlaying ? `Jeda Ayat ${ayahNumber}` : `Dengarkan Ayat ${ayahNumber}`}
                            title={isCurrentPlaying ? "Jeda Audio" : "Putar Audio"}
                          >
                            {isCurrentPlaying ? <Pause size={17} /> : <Play size={17} style={{ marginLeft: "2px" }} />}
                          </button>
                        </div>
                      </div>

                      {/* Arabic Text */}
                      <div className="v4-ayah-scripture-box py-2">
                        <p className="v4-arabic-text" style={{ fontSize: "clamp(1.75rem, 4vw, 2.4rem)" }}>
                          {item.text?.ar}
                          <span className="v4-ayah-seal">{ayahNumber}</span>
                        </p>
                      </div>

                      {/* Latin Transliteration */}
                      {showAllLatin && item.text?.read && (
                        <div className="v4-transliteration mt-2">
                          &ldquo;{item.text.read}&rdquo;
                        </div>
                      )}

                      {/* Translation */}
                      <div className="v4-translation-box mt-3 pt-2">
                        <p className="v4-translation-text mb-0">
                          {item.translation?.id}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </section>

              {/* Bottom Navigation */}
              <div className="text-center my-4">
                <Link to="/v4" className="v4-btn-cinema-secondary">
                  <ArrowLeft size={16} />
                  <span>Kembali ke Halaman Satu Ayat</span>
                </Link>
              </div>
            </>
          )}
        </main>

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

        {/* Footer */}
        <footer className="v4-footer">
          <p className="v4-footer-text mb-1">
            © 2024 — Satu Ayat Quran • Disajikan dengan cinta dan ketakziman untuk Al-Qur&apos;an
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CinemaV4FullSurah;
