import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Repeat,
  Sparkles,
} from "lucide-react";

const AudioWavePlayer = ({
  audioUrl,
  title = "Murottal Ayat",
  subtitle = "Lantunan Murottal",
  autoPlay = false,
  onEnded,
  compact = false,
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  useEffect(() => {
    if (!audioUrl) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.playbackRate = playbackRate;
    audio.loop = isLooping;
    audio.muted = isMuted;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoadingAudio(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onEnded) onEnded();
    };

    const handleWaiting = () => setIsLoadingAudio(true);
    const handleCanPlay = () => setIsLoadingAudio(false);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnd);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);

    if (autoPlay) {
      audio.play().catch((e) => console.log("Autoplay blocked:", e));
    }

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnd);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.pause();
      audio.src = "";
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((e) => console.log("Audio play failed:", e));
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const toggleRate = () => {
    const nextRates = { 1: 1.25, 1.25: 0.75, 0.75: 1 };
    const nextRate = nextRates[playbackRate] || 1;
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const toggleLoop = () => {
    const next = !isLooping;
    setIsLooping(next);
    if (audioRef.current) {
      audioRef.current.loop = next;
    }
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (audioRef.current) {
      audioRef.current.muted = next;
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${minutes}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  if (compact) {
    return (
      <div className="d-flex align-items-center gap-2">
        <button
          className={`cinema-btn cinema-btn-icon ${isPlaying ? "cinema-btn-gold" : "cinema-btn-primary"}`}
          onClick={togglePlay}
          title={isPlaying ? "Jeda Audio" : "Putar Audio"}
          style={{ width: "2.3rem", height: "2.3rem" }}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: "2px" }} />}
        </button>

        {isPlaying && (
          <div className="cinema-wave-container" style={{ height: "20px" }}>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="cinema-wave-bar playing"
                style={{ width: "3px" }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="p-3 p-md-4 rounded-4"
      style={{
        background: "var(--cq-surface-elevated)",
        border: "1px solid var(--cq-border-light)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
        {/* Track Info & Visualizer */}
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "3rem",
              height: "3rem",
              background: isPlaying
                ? "linear-gradient(135deg, var(--cq-accent-gold) 0%, #b45309 100%)"
                : "linear-gradient(135deg, var(--cq-accent-emerald) 0%, #065f46 100%)",
              boxShadow: isPlaying ? "0 0 20px var(--cq-accent-gold-glow)" : "none",
              transition: "all 0.3s ease",
            }}
          >
            {isPlaying ? (
              <div className="cinema-wave-container">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="cinema-wave-bar playing" />
                ))}
              </div>
            ) : (
              <Volume2 size={20} className="text-white" />
            )}
          </div>

          <div>
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold" style={{ color: "var(--cq-text-main)" }}>
                {title}
              </span>
              {isPlaying && (
                <span className="cinema-badge-emerald">
                  <Sparkles size={10} /> Melantun
                </span>
              )}
            </div>
            <div className="text-muted small">{subtitle}</div>
          </div>
        </div>

        {/* Player Controls & Modifiers */}
        <div className="d-flex align-items-center gap-2 align-self-end align-self-md-center">
          {/* Rate button */}
          <button
            className="cinema-btn cinema-btn-glass px-2 py-1 small"
            onClick={toggleRate}
            title="Kecepatan Pemutaran"
            style={{ fontSize: "0.78rem" }}
          >
            {playbackRate}x
          </button>

          {/* Repeat button */}
          <button
            className={`cinema-btn cinema-btn-glass cinema-btn-icon ${isLooping ? "text-warning border-warning" : "text-muted"}`}
            onClick={toggleLoop}
            title={isLooping ? "Ulangi Aktif" : "Ulangi Nonaktif"}
            style={{ width: "2.3rem", height: "2.3rem" }}
          >
            <Repeat size={14} />
          </button>

          {/* Mute button */}
          <button
            className="cinema-btn cinema-btn-glass cinema-btn-icon text-muted"
            onClick={toggleMute}
            title={isMuted ? "Bunyikan" : "Senyapkan"}
            style={{ width: "2.3rem", height: "2.3rem" }}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Main Play/Pause Button */}
          <button
            className={`cinema-btn cinema-btn-icon ${isPlaying ? "cinema-btn-gold" : "cinema-btn-primary"}`}
            onClick={togglePlay}
            title={isPlaying ? "Jeda Murottal (Space)" : "Putar Murottal (Space)"}
            style={{ width: "2.85rem", height: "2.85rem" }}
          >
            {isPlaying ? (
              <Pause size={18} />
            ) : (
              <Play size={18} style={{ marginLeft: "2px" }} />
            )}
          </button>
        </div>
      </div>

      {/* Scrubber & Time */}
      <div className="d-flex align-items-center gap-3">
        <span className="text-muted small" style={{ minWidth: "35px", fontSize: "0.75rem" }}>
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          className="cinema-scrubber"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          aria-label="Progress Audio"
        />
        <span className="text-muted small" style={{ minWidth: "35px", fontSize: "0.75rem", textAlign: "right" }}>
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

export default AudioWavePlayer;
