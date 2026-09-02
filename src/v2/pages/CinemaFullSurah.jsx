import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  Share2,
  Copy,
  Check,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Search,
  FileText,
  Volume2,
  VolumeX,
  Repeat,
  Radio,
  Eye,
  EyeOff,
} from "lucide-react";

import AtmosphereBackground from "../components/AtmosphereBackground";
import CinemaHeader from "../components/CinemaHeader";
import CinemaFooter from "../components/CinemaFooter";
import CinemaSkeleton from "../components/CinemaSkeleton";
import TafsirModal from "../components/TafsirModal";
import BookmarksDrawer from "../components/BookmarksDrawer";
import ShortcutsModal from "../components/ShortcutsModal";
import SurahSearchModal from "../components/SurahSearchModal";
import ToastNotification from "../components/ToastNotification";

import { useCinemaTheme } from "../context/ThemeContext";
import { useFavorites } from "../context/FavoritesContext";

const CinemaFullSurah = () => {
  const { surah } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Audio Continuous State
  const [currentPlayingAyahIdx, setCurrentPlayingAyahIdx] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioInstanceRef = useRef(null);

  // Modals
  const [activeTafsir, setActiveTafsir] = useState(null);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isSurahSearchOpen, setIsSurahSearchOpen] = useState(false);

  const { fontSize, showLatin, toggleLatin } = useCinemaTheme();
  const { toggleBookmark, isBookmarked, showToast } = useFavorites();

  const surahNum = parseInt(surah, 10) || 1;

  // Fetch Surah Details
  const getSurahData = useCallback(async () => {
    setIsLoading(true);
    // Stop any existing audio
    if (audioInstanceRef.current) {
      audioInstanceRef.current.pause();
      audioInstanceRef.current.src = "";
    }
    setCurrentPlayingAyahIdx(null);
    setIsAudioPlaying(false);

    try {
      const res = await axios.get(`https://quran-endpoint.vercel.app/quran/${surahNum}`);
      setData(res.data.data);
    } catch (err) {
      console.error("Failed to load surah:", err);
      showToast("Gagal memuat data surah", "error");
    } finally {
      setIsLoading(false);
    }
  }, [surahNum, showToast]);

  useEffect(() => {
    getSurahData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [getSurahData]);

  // Scroll Progress Listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Audio Playback Manager
  const playAyahAudio = (idx) => {
    if (!data?.ayahs || !data.ayahs[idx]) return;

    if (currentPlayingAyahIdx === idx && isAudioPlaying) {
      // Pause
      if (audioInstanceRef.current) {
        audioInstanceRef.current.pause();
      }
      setIsAudioPlaying(false);
      return;
    }

    if (audioInstanceRef.current) {
      audioInstanceRef.current.pause();
      audioInstanceRef.current.src = "";
    }

    const audioUrl = data.ayahs[idx].audio?.url;
    if (!audioUrl) {
      showToast("Audio belum tersedia untuk ayat ini", "info");
      return;
    }

    const audio = new Audio(audioUrl);
    audioInstanceRef.current = audio;
    setCurrentPlayingAyahIdx(idx);
    setIsAudioPlaying(true);

    audio.onloadedmetadata = () => {
      setAudioDuration(audio.duration || 0);
    };

    audio.ontimeupdate = () => {
      setAudioProgress(audio.currentTime || 0);
    };

    audio.onplay = () => setIsAudioPlaying(true);
    audio.onpause = () => setIsAudioPlaying(false);

    audio.onended = () => {
      setIsAudioPlaying(false);
      setAudioProgress(0);

      // Auto advance to next ayah if enabled
      if (autoPlayNext && idx + 1 < data.ayahs.length) {
        playAyahAudio(idx + 1);
      } else {
        setCurrentPlayingAyahIdx(null);
      }
    };

    audio.play().catch((e) => console.log("Audio play error:", e));

    // Scroll active ayah into view smoothly
    const ayahElement = document.getElementById(`ayah-${idx + 1}`);
    if (ayahElement) {
      ayahElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleNextAyah = () => {
    if (currentPlayingAyahIdx !== null && currentPlayingAyahIdx + 1 < data.ayahs.length) {
      playAyahAudio(currentPlayingAyahIdx + 1);
    }
  };

  const handlePrevAyah = () => {
    if (currentPlayingAyahIdx !== null && currentPlayingAyahIdx > 0) {
      playAyahAudio(currentPlayingAyahIdx - 1);
    }
  };

  const handleCopyAyah = (ayah, ayahNum) => {
    const textToCopy = `${ayah.text?.ar}\n\n"${ayah.translation?.id}"\n\n(QS. ${data.asma?.id?.short} [${surahNum}]: ${ayahNum})`;
    navigator.clipboard.writeText(textToCopy);
    showToast(`Ayat ${ayahNum} berhasil disalin!`, "success");
  };

  const getArabicScalerClass = () => {
    if (fontSize === "sm") return "arabic-scaler-sm";
    if (fontSize === "md") return "arabic-scaler-md";
    if (fontSize === "xl") return "arabic-scaler-xl";
    return "arabic-scaler-lg";
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${minutes}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  return (
    <div className="cinema-app-root">
      {/* Top Reading Progress Line */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: `${scrollProgress}%`,
          height: "3px",
          background: "linear-gradient(90deg, var(--cq-accent-emerald) 0%, var(--cq-accent-gold) 100%)",
          zIndex: 100,
          transition: "width 0.1s ease-out",
        }}
      />

      <AtmosphereBackground />
      <ToastNotification />

      <CinemaHeader
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenSurahSearch={() => setIsSurahSearchOpen(true)}
      />

      <main className="flex-fill py-4 py-md-5">
        <div className="cinema-container">
          {/* Navigation Bar: Back & Surah Navigator */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <Link
              to="/v2"
              className="cinema-btn cinema-btn-glass px-3 py-2 small"
            >
              <ArrowLeft size={16} />
              <span>Satu Ayat Acak</span>
            </Link>

            <div className="d-flex align-items-center gap-2">
              <button
                className="cinema-btn cinema-btn-glass cinema-btn-icon"
                disabled={surahNum <= 1}
                onClick={() => navigate(`/v2/full-surah/${surahNum - 1}`)}
                title="Surah Sebelumnya"
                style={{ width: "2.3rem", height: "2.3rem" }}
              >
                <ChevronLeft size={16} />
              </button>

              <button
                className="cinema-btn cinema-btn-glass px-3 py-1 small"
                onClick={() => setIsSurahSearchOpen(true)}
                title="Pilih Surah (1-114)"
                style={{ fontSize: "0.85rem" }}
              >
                <Search size={14} />
                <span>Pilih Surah</span>
              </button>

              <button
                className="cinema-btn cinema-btn-glass cinema-btn-icon"
                disabled={surahNum >= 114}
                onClick={() => navigate(`/v2/full-surah/${surahNum + 1}`)}
                title="Surah Berikutnya"
                style={{ width: "2.3rem", height: "2.3rem" }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {isLoading || !data ? (
            <div className="d-flex justify-content-center">
              <CinemaSkeleton fullSurah />
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center">
              {/* Grand Hero Surah Card */}
              <div
                className="cinema-card p-4 p-md-5 w-100 mb-4"
                style={{ maxWidth: "900px" }}
              >
                <div className="d-flex flex-column align-items-center text-center">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="cinema-badge-gold">
                      Surah ke-{data.number}
                    </span>
                    <span className="cinema-badge-emerald">
                      {data.type?.id || "Makkiyyah"} • {data.ayahCount} Ayat
                    </span>
                    {data.sequence && (
                      <span className="cinema-badge-gold d-none d-sm-inline-flex">
                        Urutan Wahyu ke-{data.sequence}
                      </span>
                    )}
                  </div>

                  <h1
                    className="fw-bold font-serif-cinematic mb-1"
                    style={{ color: "var(--cq-text-main)", fontSize: "2.25rem" }}
                  >
                    {data.asma?.id?.short}
                  </h1>

                  <h2
                    className="font-arabic mb-2"
                    style={{
                      color: "var(--cq-text-arabic)",
                      fontSize: "2.75rem",
                      textShadow: "0 0 20px rgba(254, 240, 138, 0.2)",
                    }}
                  >
                    {data.asma?.ar?.short}
                  </h2>

                  <p className="text-muted fs-6 mb-3">
                    "{data.asma?.translation?.id}" ({data.asma?.translation?.en})
                  </p>

                  <div className="cinema-ornament-divider w-50">
                    <span>۞</span>
                  </div>

                  {/* Surah Tafsir Synopsis */}
                  {data.tafsir?.id && (
                    <div
                      className="p-3 p-md-4 rounded-3 text-start w-100 mt-2"
                      style={{
                        background: "var(--cq-surface-elevated)",
                        border: "1px solid var(--cq-border-light)",
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="fw-bold small text-warning d-flex align-items-center gap-1">
                          <Sparkles size={13} /> Tafsir Ringkas Surah
                        </span>
                        <button
                          className="cinema-btn cinema-btn-glass px-2 py-1 small"
                          style={{ fontSize: "0.75rem" }}
                          onClick={() =>
                            setActiveTafsir({
                              title: `Tafsir Surah ${data.asma?.id?.short}`,
                              info: `Surah ke-${data.number} • ${data.ayahCount} Ayat`,
                              text: data.tafsir?.id,
                            })
                          }
                        >
                          <FileText size={12} /> Buka Layar Penuh
                        </button>
                      </div>
                      <p
                        className="mb-0 text-muted small text-justify lh-base"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {data.tafsir.id}
                      </p>
                    </div>
                  )}

                  {/* Continuous Murottal Master Toggle Bar */}
                  <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 mt-4 pt-3 border-top w-100" style={{ borderColor: "var(--cq-border-light)" }}>
                    <button
                      className="cinema-btn cinema-btn-primary px-4 py-2"
                      onClick={() => playAyahAudio(0)}
                    >
                      <Play size={16} />
                      <span>Putar dari Ayat Pertama</span>
                    </button>

                    <button
                      className={`cinema-btn cinema-btn-glass px-3 py-2 small ${autoPlayNext ? "border-success text-success" : "text-muted"}`}
                      onClick={() => setAutoPlayNext(!autoPlayNext)}
                    >
                      <Radio size={15} />
                      <span>{autoPlayNext ? "Lanjut Otomatis: Aktif" : "Lanjut Otomatis: Mati"}</span>
                    </button>

                    <button
                      className="cinema-btn cinema-btn-glass px-3 py-2 small"
                      onClick={toggleLatin}
                    >
                      {showLatin ? <EyeOff size={14} /> : <Eye size={14} />}
                      <span>{showLatin ? "Latin Aktif" : "Tampilkan Latin"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bismillah Calligraphy (Shown for all except Surah 9 At-Taubah and Surah 1 Al-Fatihah which has basmalah as verse 1) */}
              {data.number !== 9 && data.number !== 1 && (
                <div
                  className="cinema-card p-4 text-center my-3 w-100"
                  style={{ maxWidth: "900px" }}
                >
                  <h2
                    className="font-arabic mb-0"
                    style={{
                      color: "var(--cq-text-arabic)",
                      fontSize: "2.25rem",
                    }}
                  >
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </h2>
                  <div className="text-muted small mt-2">
                    "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang."
                  </div>
                </div>
              )}

              {/* Ayah Rows List */}
              <div className="w-100 my-3" style={{ maxWidth: "900px" }}>
                {data.ayahs?.map((item, index) => {
                  const ayahNumber = index + 1;
                  const isCurrent = currentPlayingAyahIdx === index;
                  const bookmarked = isBookmarked(data.number, ayahNumber);

                  return (
                    <div
                      key={ayahNumber}
                      id={`ayah-${ayahNumber}`}
                      className={`cinema-ayah-row ${isCurrent ? "active-playing" : ""}`}
                    >
                      {/* Top Ayah Row Header */}
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center gap-2">
                          <div className="cinema-ayah-num-badge">
                            {ayahNumber}
                          </div>
                          <span className="text-muted small">
                            Ayat ke-{ayahNumber}
                          </span>
                        </div>

                        <div className="d-flex align-items-center gap-1">
                          {/* Audio Play Button */}
                          <button
                            className={`cinema-btn cinema-btn-icon ${isCurrent && isAudioPlaying ? "cinema-btn-gold" : "cinema-btn-glass"}`}
                            onClick={() => playAyahAudio(index)}
                            title={isCurrent && isAudioPlaying ? "Jeda Audio" : "Putar Audio Ayat"}
                            style={{ width: "2.3rem", height: "2.3rem" }}
                          >
                            {isCurrent && isAudioPlaying ? (
                              <Pause size={14} />
                            ) : (
                              <Play size={14} style={{ marginLeft: "1px" }} />
                            )}
                          </button>

                          {/* Bookmark */}
                          <button
                            className={`cinema-btn cinema-btn-glass cinema-btn-icon ${bookmarked ? "text-warning" : "text-muted"}`}
                            onClick={() =>
                              toggleBookmark({
                                surahNumber: data.number,
                                ayahNumber: ayahNumber,
                                surahName: data.asma?.id?.short,
                                arabic: item.text?.ar,
                                translation: item.translation?.id,
                                tafsir: item.tafsir?.id,
                                audioUrl: item.audio?.url,
                              })
                            }
                            title={bookmarked ? "Hapus dari Favorit" : "Simpan ke Favorit"}
                            style={{ width: "2.3rem", height: "2.3rem" }}
                          >
                            <Bookmark size={14} fill={bookmarked ? "currentColor" : "none"} />
                          </button>

                          {/* Tafsir */}
                          <button
                            className="cinema-btn cinema-btn-glass cinema-btn-icon text-muted"
                            onClick={() =>
                              setActiveTafsir({
                                title: `Tafsir QS. ${data.asma?.id?.short} Ayat ${ayahNumber}`,
                                info: `Surah ke-${data.number} • Ayat ke-${ayahNumber}`,
                                text: item.tafsir?.id,
                              })
                            }
                            title="Baca Tafsir Ayat"
                            style={{ width: "2.3rem", height: "2.3rem" }}
                          >
                            <FileText size={14} />
                          </button>

                          {/* Copy */}
                          <button
                            className="cinema-btn cinema-btn-glass cinema-btn-icon text-muted"
                            onClick={() => handleCopyAyah(item, ayahNumber)}
                            title="Salin Ayat"
                            style={{ width: "2.3rem", height: "2.3rem" }}
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Arabic Script */}
                      <div className="text-end my-3">
                        <h2
                          className={`font-arabic ${getArabicScalerClass()} text-end mb-0`}
                          style={{
                            color: "var(--cq-text-arabic)",
                            textShadow: isCurrent ? "0 0 20px rgba(254, 240, 138, 0.3)" : "none",
                          }}
                        >
                          {item.text?.ar}
                        </h2>

                        {/* Transliteration */}
                        {showLatin && item.text?.read && (
                          <div
                            className="fst-italic mt-2 text-start small"
                            style={{ color: "var(--cq-accent-gold)", opacity: 0.85 }}
                          >
                            "{item.text.read}"
                          </div>
                        )}
                      </div>

                      {/* Indonesian Translation */}
                      <p
                        className="mb-0 text-muted fs-6 lh-lg text-justify fst-italic mt-3"
                        style={{ borderLeft: "2px solid var(--cq-border-light)", paddingLeft: "0.75rem" }}
                      >
                        {item.translation?.id}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Sticky Bottom Floating Audio Dock when playing */}
      {currentPlayingAyahIdx !== null && data?.ayahs && (
        <div
          style={{
            position: "fixed",
            bottom: "1.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxWidth: "680px",
            zIndex: 60,
          }}
        >
          <div className="cinema-audio-dock">
            <button
              className="cinema-btn cinema-btn-glass cinema-btn-icon"
              onClick={handlePrevAyah}
              disabled={currentPlayingAyahIdx <= 0}
              style={{ width: "2.3rem", height: "2.3rem" }}
              title="Ayat Sebelumnya"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              className={`cinema-btn cinema-btn-icon ${isAudioPlaying ? "cinema-btn-gold" : "cinema-btn-primary"}`}
              onClick={() => playAyahAudio(currentPlayingAyahIdx)}
              style={{ width: "2.85rem", height: "2.85rem" }}
            >
              {isAudioPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: "2px" }} />}
            </button>

            <button
              className="cinema-btn cinema-btn-glass cinema-btn-icon"
              onClick={handleNextAyah}
              disabled={currentPlayingAyahIdx >= data.ayahs.length - 1}
              style={{ width: "2.3rem", height: "2.3rem" }}
              title="Ayat Berikutnya"
            >
              <ChevronRight size={16} />
            </button>

            <div className="flex-fill d-none d-sm-block">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="fw-bold small" style={{ color: "var(--cq-text-main)" }}>
                  {data.asma?.id?.short} : Ayat {currentPlayingAyahIdx + 1}
                </span>
                <span className="text-muted small" style={{ fontSize: "0.72rem" }}>
                  {formatTime(audioProgress)} / {formatTime(audioDuration)}
                </span>
              </div>

              <input
                type="range"
                className="cinema-scrubber"
                min="0"
                max={audioDuration || 100}
                value={audioProgress}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setAudioProgress(val);
                  if (audioInstanceRef.current) {
                    audioInstanceRef.current.currentTime = val;
                  }
                }}
              />
            </div>

            {isAudioPlaying && (
              <div className="cinema-wave-container d-none d-md-flex">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="cinema-wave-bar playing" />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <CinemaFooter />

      {/* Modals */}
      {activeTafsir && (
        <TafsirModal
          isOpen={!!activeTafsir}
          onClose={() => setActiveTafsir(null)}
          title={activeTafsir.title}
          surahInfo={activeTafsir.info}
          tafsirText={activeTafsir.text}
        />
      )}

      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        onSelectAyah={(saved) => {
          if (saved.surahNumber === data?.number) {
            playAyahAudio(saved.ayahNumber - 1);
            setIsBookmarksOpen(false);
          } else {
            navigate(`/v2/full-surah/${saved.surahNumber}`);
          }
        }}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <SurahSearchModal
        isOpen={isSurahSearchOpen}
        onClose={() => setIsSurahSearchOpen(false)}
      />
    </div>
  );
};

export default CinemaFullSurah;
