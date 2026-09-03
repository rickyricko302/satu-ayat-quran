/* eslint-disable react/prop-types */
import { Play, Pause, Volume2 } from "lucide-react";

const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds) || timeInSeconds === Infinity) return "00:00";
  const mins = Math.floor(timeInSeconds / 60);
  const secs = Math.floor(timeInSeconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const V4AudioWave = ({
  isPlaying,
  currentTime = 0,
  duration = 0,
  onTogglePlay,
  onSeek,
  reciterName = "Syaikh Ahmed ibn Ali al-Ajamy",
  subtitle = "Murottal Berkualitas Tinggi",
}) => {
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleTrackClick = (e) => {
    if (!onSeek || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const seekFraction = Math.max(0, Math.min(1, clickX / width));
    onSeek(seekFraction * duration);
  };

  return (
    <div className="v4-audio-console">
      <div className="v4-audio-main-row">
        <button
          type="button"
          onClick={onTogglePlay}
          className={`v4-audio-play-button ${isPlaying ? "playing" : ""}`}
          aria-label={isPlaying ? "Jeda Lantunan" : "Dengarkan Lantunan"}
          title={isPlaying ? "Jeda Murottal" : "Putar Murottal"}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: "3px" }} />}
        </button>

        <div className="v4-audio-info">
          <div className="v4-audio-reciter-name">
            <Volume2 size={15} color="#10b981" />
            <span>{reciterName}</span>
          </div>
          <div className="v4-audio-reciter-sub">{subtitle}</div>
        </div>

        <div className={`v4-wave-bars ${isPlaying ? "active" : ""}`} aria-hidden="true">
          <div className="v4-wave-bar" />
          <div className="v4-wave-bar" />
          <div className="v4-wave-bar" />
          <div className="v4-wave-bar" />
          <div className="v4-wave-bar" />
          <div className="v4-wave-bar" />
        </div>
      </div>

      <div className="v4-audio-progress-container">
        <span>{formatTime(currentTime)}</span>
        <div
          className="v4-progress-bar-track"
          onClick={handleTrackClick}
          role="slider"
          aria-valuenow={progressPercent}
          aria-valuemin="0"
          aria-valuemax="100"
          tabIndex={0}
        >
          <div
            className="v4-progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default V4AudioWave;
