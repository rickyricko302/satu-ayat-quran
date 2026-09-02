import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import confetti from "canvas-confetti";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  RefreshCw,
  BookOpen,
  Bookmark,
  Share2,
  Copy,
  Check,
  Compass,
  FileText,
  Volume2,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

import AtmosphereBackground from "../components/AtmosphereBackground";
import CinemaHeader from "../components/CinemaHeader";
import CinemaFooter from "../components/CinemaFooter";
import CinemaSkeleton from "../components/CinemaSkeleton";
import AudioWavePlayer from "../components/AudioWavePlayer";
import TafsirModal from "../components/TafsirModal";
import BookmarksDrawer from "../components/BookmarksDrawer";
import ShortcutsModal from "../components/ShortcutsModal";
import ShareQuoteModal from "../components/ShareQuoteModal";
import SurahSearchModal from "../components/SurahSearchModal";
import ToastNotification from "../components/ToastNotification";

import { useCinemaTheme } from "../context/ThemeContext";
import { useFavorites } from "../context/FavoritesContext";

const CinemaHome = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Modals state
  const [isTafsirOpen, setIsTafsirOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSurahSearchOpen, setIsSurahSearchOpen] = useState(false);

  const { fontSize, showLatin, toggleLatin } = useCinemaTheme();
  const { toggleBookmark, isBookmarked, showToast } = useFavorites();
  const navigate = useNavigate();

  const getSurah = useCallback(async (triggerConfetti = false) => {
    setIsLoading(true);
    setIsSpinning(true);
    try {
      const randomSurah = Math.floor(Math.random() * 114) + 1;
      const surahRes = await axios.get(
        `https://quran-endpoint.vercel.app/quran/${randomSurah}`
      );
      const ayahCount = surahRes.data.data.ayahCount;
      const randomAyah = Math.floor(Math.random() * ayahCount) + 1;

      const ayahRes = await axios.get(
        `https://quran-endpoint.vercel.app/quran/${randomSurah}/${randomAyah}`
      );

      const verseData = ayahRes.data.data;
      verseData.randomSurah = randomSurah;
      verseData.randomAyah = randomAyah;
      verseData.surahAyahCount = ayahCount;
      setData(verseData);

      if (triggerConfetti) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#10b981", "#fbbf24", "#38bdf8", "#ffffff"],
        });
      }
    } catch (err) {
      console.error("Failed to load verse:", err);
      showToast("Gagal memuat ayat, coba lagi nanti.", "error");
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsSpinning(false), 600);
    }
  }, [showToast]);

  useEffect(() => {
    getSurah(false);
  }, [getSurah]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if typing in an input
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;

      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        getSurah(true);
      } else if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        setIsTafsirOpen((prev) => !prev);
      } else if (e.key === "b" || e.key === "B") {
        if (data) {
          e.preventDefault();
          handleBookmarkToggle();
        }
      } else if (e.key === "c" || e.key === "C") {
        if (data) {
          e.preventDefault();
          handleCopyVerse();
        }
      } else if (e.key === "f" || e.key === "F") {
        if (data?.randomSurah) {
          e.preventDefault();
          navigate(`/v2/full-surah/${data.randomSurah}`);
        }
      } else if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        setIsSurahSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsTafsirOpen(false);
        setIsBookmarksOpen(false);
        setIsShortcutsOpen(false);
        setIsShareOpen(false);
        setIsSurahSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [data, getSurah, navigate]);

  const handleBookmarkToggle = () => {
    if (!data) return;
    toggleBookmark({
      surahNumber: data.randomSurah,
      ayahNumber: data.randomAyah,
      surahName: data.surah?.id?.short || `Surah ${data.randomSurah}`,
      arabic: data.ayah?.text?.ar || "",
      translation: data.ayah?.translation?.id || "",
      tafsir: data.ayah?.tafsir?.id || "",
      audioUrl: data.ayah?.audio?.url || "",
    });
  };

  const handleCopyVerse = () => {
    if (!data) return;
    const textToCopy = `${data.ayah?.text?.ar}\n\n"${data.ayah?.translation?.id}"\n\n(QS. ${data.surah?.id?.short} [${data.randomSurah}]: ${data.randomAyah})`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    showToast("Teks ayat dan terjemahan disalin!", "success");
    setTimeout(() => setIsCopied(false), 2200);
  };

  const getArabicScalerClass = () => {
    if (fontSize === "sm") return "arabic-scaler-sm";
    if (fontSize === "md") return "arabic-scaler-md";
    if (fontSize === "xl") return "arabic-scaler-xl";
    return "arabic-scaler-lg";
  };

  const bookmarked = data ? isBookmarked(data.randomSurah, data.randomAyah) : false;

  return (
    <div className="cinema-app-root">
      <AtmosphereBackground />
      <ToastNotification />

      <CinemaHeader
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenSurahSearch={() => setIsSurahSearchOpen(true)}
      />

      <main className="flex-fill d-flex flex-column align-items-center justify-content-center py-4 py-md-5">
        <div className="cinema-container d-flex flex-column align-items-center">
          {isLoading || !data ? (
            <CinemaSkeleton />
          ) : (
            <div
              className="cinema-card p-4 p-md-5 my-3 w-100"
              style={{ maxWidth: "880px" }}
            >
              {/* Card Header: Meta Badges & Surah Title */}
              <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 mb-3">
                <div className="d-flex align-items-center gap-2">
                  <span className="cinema-badge-emerald">
                    Surah {data.randomSurah} • Ayat {data.randomAyah}
                  </span>
                  {data.ayah?.juz && (
                    <span className="cinema-badge-gold d-none d-sm-inline-flex">
                      Juz {data.ayah.juz}
                    </span>
                  )}
                </div>

                <div className="text-center">
                  <h3 className="mb-0 fw-bold font-serif-cinematic" style={{ color: "var(--cq-text-main)" }}>
                    {data.surah?.id?.short}
                    <span className="font-arabic fs-4 ms-2" style={{ color: "var(--cq-text-arabic)" }}>
                      {data.surah?.ar?.short}
                    </span>
                  </h3>
                  <div className="text-muted small">
                    "{data.surah?.translation?.id}" ({data.surahAyahCount} Ayat)
                  </div>
                </div>

                {/* Transliteration & Latin Toggle */}
                <button
                  className="cinema-btn cinema-btn-glass px-3 py-1 small"
                  onClick={toggleLatin}
                  title="Tampilkan / Sembunyikan Bacaan Latin"
                  style={{ fontSize: "0.78rem" }}
                >
                  {showLatin ? <EyeOff size={14} /> : <Eye size={14} />}
                  <span>{showLatin ? "Latin Aktif" : "Tampilkan Latin"}</span>
                </button>
              </div>

              {/* Sacred Ornament Divider */}
              <div className="cinema-ornament-divider">
                <span>۞</span>
                <span className="small font-serif-cinematic">بِسْمِ اللَّهِ</span>
                <span>۞</span>
              </div>

              {/* Arabic Verse Display */}
              <div className="my-4 my-md-5 text-end px-2">
                <h1
                  className={`font-arabic ${getArabicScalerClass()} text-end mb-0`}
                  style={{
                    color: "var(--cq-text-arabic)",
                    textShadow: "0 0 25px rgba(254, 240, 138, 0.15)",
                  }}
                >
                  {data.ayah?.text?.ar}
                </h1>

                {/* Transliteration (Latin reading) */}
                {showLatin && data.ayah?.text?.read && (
                  <div
                    className="fst-italic mt-3 text-start small"
                    style={{ color: "var(--cq-accent-gold)", opacity: 0.9 }}
                  >
                    "{data.ayah.text.read}"
                  </div>
                )}
              </div>

              {/* Indonesian Translation */}
              <div
                className="p-3 p-md-4 rounded-3 my-4"
                style={{
                  background: "var(--cq-surface-elevated)",
                  borderLeft: "3px solid var(--cq-accent-emerald)",
                }}
              >
                <div className="small text-muted mb-1 fw-bold">TERJEMAHAN:</div>
                <p
                  className="mb-0 fs-6 lh-lg text-justify"
                  style={{ color: "var(--cq-text-main)", fontStyle: "italic" }}
                >
                  "{data.ayah?.translation?.id}"
                </p>
              </div>

              {/* Audio Wave Player Pro */}
              {data.ayah?.audio?.url && (
                <div className="my-4">
                  <AudioWavePlayer
                    audioUrl={data.ayah.audio.url}
                    title={`Murottal ${data.surah?.id?.short} : ${data.randomAyah}`}
                    subtitle={`Surah ke-${data.randomSurah}, Ayat ke-${data.randomAyah}`}
                  />
                </div>
              )}

              {/* Quick Action Suite */}
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-3 border-top" style={{ borderColor: "var(--cq-border-light)" }}>
                {/* Left group actions */}
                <div className="d-flex flex-wrap align-items-center gap-2">
                  {/* Bookmark Button */}
                  <button
                    className={`cinema-btn ${bookmarked ? "cinema-btn-gold" : "cinema-btn-glass"}`}
                    onClick={handleBookmarkToggle}
                    title={bookmarked ? "Hapus dari Favorit (B)" : "Simpan ke Favorit (B)"}
                  >
                    <Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
                    <span className="small">{bookmarked ? "Tersimpan" : "Simpan"}</span>
                  </button>

                  {/* Copy Button */}
                  <button
                    className="cinema-btn cinema-btn-glass"
                    onClick={handleCopyVerse}
                    title="Salin Teks Ayat & Terjemahan (C)"
                  >
                    {isCopied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                    <span className="small">{isCopied ? "Tersalin!" : "Salin"}</span>
                  </button>

                  {/* Tafsir Button */}
                  <button
                    className="cinema-btn cinema-btn-glass"
                    onClick={() => setIsTafsirOpen(true)}
                    title="Buka Penjelasan Tafsir (T)"
                  >
                    <FileText size={16} />
                    <span className="small">Tafsir</span>
                  </button>

                  {/* Share Quote Card Button */}
                  <button
                    className="cinema-btn cinema-btn-glass"
                    onClick={() => setIsShareOpen(true)}
                    title="Bagikan Kutipan Ayat"
                  >
                    <Share2 size={16} />
                    <span className="small">Bagikan</span>
                  </button>
                </div>

                {/* Right group: Full Surah Link */}
                <Link
                  to={`/v2/full-surah/${data.randomSurah}`}
                  className="cinema-btn cinema-btn-primary"
                  title="Baca Seluruh Ayat dalam Surah ini (F)"
                >
                  <BookOpen size={16} />
                  <span>Baca Surah Lengkap</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          )}

          {/* Inline Randomize Button */}
          <div className="d-flex align-items-center justify-content-center gap-3 mt-3">
            <button
              className="cinema-btn cinema-btn-gold px-4 py-2 fw-bold"
              onClick={() => getSurah(true)}
              disabled={isLoading}
            >
              <RefreshCw size={17} className={isSpinning ? "spin-icon" : ""} />
              <span>Acak Ayat Baru (R)</span>
            </button>
          </div>
        </div>
      </main>

      {/* Floating Action Button (Refresh Verse) */}
      <div className="cinema-fab-container">
        <button
          className={`cinema-fab-main ${isSpinning ? "spinning" : ""}`}
          onClick={() => getSurah(true)}
          title="Acak & Muat Ayat Baru (R)"
          aria-label="Acak Ayat Baru"
        >
          <RefreshCw size={24} />
        </button>
      </div>

      <CinemaFooter />

      {/* Modals */}
      {data && (
        <>
          <TafsirModal
            isOpen={isTafsirOpen}
            onClose={() => setIsTafsirOpen(false)}
            title={`Tafsir QS. ${data.surah?.id?.short} Ayat ${data.randomAyah}`}
            surahInfo={`Surah ke-${data.randomSurah}, Ayat ke-${data.randomAyah}`}
            tafsirText={data.ayah?.tafsir?.id}
          />

          <ShareQuoteModal
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
            data={data}
          />
        </>
      )}

      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
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

export default CinemaHome;
