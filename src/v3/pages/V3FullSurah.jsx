import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { ArrowLeft, Pause, Play, RotateCcw } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import V3Shell from "../components/V3Shell";

const API_BASE = "https://quran-endpoint.vercel.app/quran";

const V3FullSurah = () => {
  const { surah } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeAyah, setActiveAyah] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setActiveAyah(null);
    setIsPlaying(false);
  }, []);

  const getSurah = useCallback(async () => {
    stopAudio();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.get(`${API_BASE}/${surah}`);
      setData(response.data.data);
    } catch (requestError) {
      console.error("Gagal memuat surah:", requestError);
      setError("Surah belum berhasil dimuat. Periksa koneksi lalu coba kembali.");
    } finally {
      setIsLoading(false);
    }
  }, [stopAudio, surah]);

  useEffect(() => {
    getSurah();
    window.scrollTo({ top: 0, behavior: "instant" });
    return stopAudio;
  }, [getSurah, stopAudio]);

  useEffect(() => {
    document.title = data?.asma?.id?.short
      ? `${data.asma.id.short} — Satu Ayat Quran`
      : "Surah Lengkap — Satu Ayat Quran";
  }, [data]);

  const toggleAyahAudio = (ayah, index) => {
    if (!ayah?.audio?.url) return;

    if (audioRef.current && activeAyah === index) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch((audioError) => console.error("Gagal memutar audio:", audioError));
      } else {
        audioRef.current.pause();
      }
      return;
    }

    stopAudio();
    const audio = new Audio(ayah.audio.url);
    audioRef.current = audio;
    setActiveAyah(index);
    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => {
      setIsPlaying(false);
      setActiveAyah(null);
      audioRef.current = null;
    };
    audio.play().catch((audioError) => console.error("Gagal memutar audio:", audioError));
  };

  return (
    <V3Shell footerLabel={data?.asma?.id?.short || "Surah lengkap"}>
      <main className="v3-main v3-reader-main">
        <div className="v3-reader-nav">
          <Link to="/v3">
            <ArrowLeft size={16} />
            Kembali ke satu ayat
          </Link>
          <span>PEMBACAAN LENGKAP / {String(surah).padStart(3, "0")}</span>
        </div>

        {isLoading ? (
          <section className="v3-reader-status">
            <div className="v3-loading" role="status">
              <div className="v3-loading-orbit"><span /></div>
              <p>Menyiapkan seluruh rangkaian ayat…</p>
            </div>
          </section>
        ) : error || !data ? (
          <section className="v3-reader-status">
            <div className="v3-error" role="alert">
              <span className="v3-eyebrow">Siaran terhenti</span>
              <h1>Surah ini belum dapat ditampilkan.</h1>
              <p>{error}</p>
              <button type="button" className="v3-text-button" onClick={getSurah}>
                <RotateCcw size={16} /> Coba lagi
              </button>
            </div>
          </section>
        ) : (
          <>
            <section className="v3-surah-hero">
              <div className="v3-surah-number" aria-hidden="true">
                {String(data.number).padStart(3, "0")}
              </div>

              <div className="v3-surah-identity">
                <span className="v3-eyebrow">SURAH KE-{data.number} · {data.ayahCount} AYAT</span>
                <h1>{data.asma?.id?.short}</h1>
                <p className="v3-surah-arabic" lang="ar" dir="rtl">{data.asma?.ar?.short}</p>
                <p className="v3-surah-meaning">“{data.asma?.translation?.id}”</p>
              </div>

              <div className="v3-surah-note">
                <span>TAFSIR SURAH</span>
                <p>{data.tafsir?.id}</p>
              </div>
            </section>

            {data.number !== 1 && data.number !== 9 && (
              <div className="v3-bismillah" aria-label="Bismillahirrahmanirrahim">
                <span />
                <p lang="ar" dir="rtl">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
                <span />
              </div>
            )}

            <section className="v3-ayah-sequence" aria-label={`Ayat-ayat Surah ${data.asma?.id?.short}`}>
              {data.ayahs?.map((ayah, index) => {
                const ayahNumber = index + 1;
                const isActive = activeAyah === index;

                return (
                  <article className={`v3-ayah-frame ${isActive ? "is-active" : ""}`} key={ayahNumber}>
                    <div className="v3-ayah-index">
                      <span>{String(ayahNumber).padStart(3, "0")}</span>
                      <small>FRAME</small>
                    </div>

                    <div className="v3-ayah-copy">
                      <p className="v3-ayah-arabic" lang="ar" dir="rtl">{ayah.text?.ar}</p>
                      <div className="v3-ayah-translation">
                        <span>{ayahNumber}</span>
                        <p>{ayah.translation?.id}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="v3-ayah-play"
                      onClick={() => toggleAyahAudio(ayah, index)}
                      aria-label={`${isActive && isPlaying ? "Jeda" : "Putar"} audio ayat ${ayahNumber}`}
                    >
                      <span className="v3-sound-bars" aria-hidden="true">
                        <i /><i /><i /><i />
                      </span>
                      {isActive && isPlaying
                        ? <Pause size={19} fill="currentColor" />
                        : <Play size={19} fill="currentColor" />}
                    </button>
                  </article>
                );
              })}
            </section>

            <div className="v3-reader-end">
              <span>۞</span>
              <p>Telah selesai Surah {data.asma?.id?.short}</p>
              <Link to="/v3">Temukan satu ayat lain</Link>
            </div>
          </>
        )}
      </main>
    </V3Shell>
  );
};

export default V3FullSurah;
