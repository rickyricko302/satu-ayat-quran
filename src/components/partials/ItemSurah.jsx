import { useContext, useState } from "react";
import PlayIcon from "../common/PlayIcon";
import PauseIcon from "../common/PauseIcon";
import AudioContext from "../../hooks/audio_context";
const ItemSurah = ({ number, arabic, translation, audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { isPlayed, setStatus } = useContext(AudioContext);
  const audio = new Audio(audioUrl);

  audio.onplaying = () => {
    setIsPlaying(true);
    setStatus({ value: true });
  };

  audio.onended = () => {
    setIsPlaying(false);
    setStatus({ value: false });
  };

  function logicPausePlay() {
    if (isPlayed) {
      alert("sebaiknya didengarkan sampai selesai");
    } else {
      setIsPlaying(true);
      audio.play();
    }
  }
  return (
    <>
      <hr className="border-dashed" />
      <div className="d-flex align-items-center">
        <span className="text-small me-2 text-muted">{number}.</span>
        <h1 className="flex-fill text-end text-quran me-2">{arabic}</h1>
        <a type="button" onClick={logicPausePlay}>
          {isPlaying ? (
            <PauseIcon color="#198754" />
          ) : (
            <PlayIcon color="#198754" />
          )}
        </a>
      </div>
      <p className="text-success text-justify fst-italic mt-3">{translation}</p>
    </>
  );
};

export default ItemSurah;
