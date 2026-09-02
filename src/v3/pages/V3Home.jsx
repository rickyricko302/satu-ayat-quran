import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { ArrowUpRight, BookOpen, Pause, Play, RefreshCw, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import V3Shell from "../components/V3Shell";

const API_BASE = "https://quran-endpoint.vercel.app/quran";

const V3Home = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const getRandomAyah = useCallback(async () => {
    stopAudio();
    setIsLoading(true);
    setError("");

    try {
      const randomSurah = Math.floor(Math.random() * 114) + 1;
      const surahResponse = await axios.get(`${API_BASE}/${randomSurah}`);
      const ayahCount = surahResponse.data.data.ayahCount;
      const randomAyah = Math.floor(Math.random() * ayahCount) + 1;
      const ayahResponse = await axios.get(`${API_BASE}/${randomSurah}/${randomAyah}`);

      setData({
        ...ayahResponse.data.data,
        randomSurah,
        randomAyah,
        ayahCount,
      });
    } catch (requestError) {
      console.error("Gagal memuat ayat:", requestError);
      setError("Ayat belum berhasil dimuat. Periksa koneksi lalu coba sekali lagi.");
    } finally {
      setIsLoading(false);
    }
  }, [stopAudio]);

  useEffect(() => {
    document.title = "Satu Ayat Quran — Ruang Jeda";
    getRandomAyah();
    return stopAudio;
  }, [getRandomAyah, stopAudio]);

  const toggleAudio = () => {
    const audioUrl = data?.ayah?.audio?.url;
    if (!audioUrl) return;

    if (!audioRef.current) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => {
        audio.currentTime = 0;
        setIsPlaying(false);
      };
      audio.play().catch(() => setError("Audio belum dapat diputar dari perangkat ini."));
      return;
    }

    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => setError("Audio belum dapat diputar dari perangkat ini."));
    } else {
      audioRef.current.pause();
    }
  };

  return (
    <V3Shell>
      <main className="v3-main v3-home-main">
        <div className="v3-curtain-copy" aria-hidden="true">
          <span>AL-QUR’AN</span>
          <span>AL-QUR’AN</span>
        </div>

        <section className={`v3-verse-stage ${isLoading ? "is-loading" : ""}`} aria-live="polite">
          <div className="v3-stage-rail">
            <span>AYAT PILIHAN</span>
            <span className="v3-stage-rail-line" />
            <span>001—114</span>
          </div>

          {isLoading ? (
            <div className="v3-loading" role="status">
              <div className="v3-loading-orbit"><span /></div>
              <p>Membuka lembar yang ditakdirkan untuk jeda ini…</p>
            </div>
          ) : error || !data ? (
            <div className="v3-error" role="alert">
              <p className="v3-eyebrow">Siaran terhenti</p>
              <h1>Keheningan belum menemukan ayatnya.</h1>
              <p>{error}</p>
              <button type="button" className="v3-text-button" onClick={getRandomAyah}>
                <RotateCcw size={16} /> Coba lagi
              </button>
            </div>
          ) : (
            <div className="v3-verse-content">
              <div className="v3-verse-meta">
                <div>
                  <span className="v3-eyebrow">PERTEMUAN HARI INI</span>
                  <p>Surah {String(data.randomSurah).padStart(3, "0")} · Ayat {String(data.randomAyah).padStart(3, "0")}</p>
                </div>
                <div className="v3-surah-title">
                  <p>{data.surah?.ar?.short}</p>
                  <div>
                    <strong>{data.surah?.id?.short}</strong>
                    <span>{data.surah?.translation?.id}</span>
                  </div>
                </div>
              </div>

              <div className="v3-verse-center">
                <p className="v3-arabic-text" lang="ar" dir="rtl">{data.ayah?.text?.ar}</p>
                <div className="v3-breath-mark" aria-hidden="true"><span>۞</span></div>
                <blockquote>“{data.ayah?.translation?.id}”</blockquote>
              </div>

              <div className="v3-reflection">
                <span className="v3-reflection-index">CATATAN / TAFSIR</span>
                <p>{data.ayah?.tafsir?.id}</p>
              </div>

              <div className="v3-stage-actions">
                <button type="button" className="v3-audio-button" onClick={toggleAudio}>
                  <span className={`v3-audio-icon ${isPlaying ? "is-playing" : ""}`}>
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                  </span>
                  <span>
                    <small>{isPlaying ? "SEDANG MENGALUN" : "DENGARKAN"}</small>
                    <strong>Murottal ayat ini</strong>
                  </span>
                </button>

                <Link to={`/v3/full-surah/${data.randomSurah}`} className="v3-full-link">
                  <span>
                    <small>LANJUTKAN PERJALANAN</small>
                    <strong>Baca surah lengkap</strong>
                  </span>
                  <ArrowUpRight size={21} />
                </Link>
              </div>
            </div>
          )}
        </section>

        <button
          type="button"
          className="v3-random-button"
          onClick={getRandomAyah}
          disabled={isLoading}
          aria-label="Tampilkan ayat acak yang baru"
        >
          <RefreshCw size={19} className={isLoading ? "v3-spin" : ""} />
          <span>Ayat berikutnya</span>
          <BookOpen size={17} />
        </button>
      </main>
    </V3Shell>
  );
};

export default V3Home;
