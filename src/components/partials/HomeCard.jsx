import { useState } from "react";
import Card from "../common/Card";
import PlaySvg from "../../assets/svg/play.svg";
import PauseSvg from "../../assets/svg/pause.svg";
import ButtonCircle from "../common/ButtonCircle";

const HomeCard = ({ data }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audio = new Audio(data.ayah.audio.url);

  audio.onplaying = () => {
    setIsPlaying(true);
  };

  audio.onended = () => {
    setIsPlaying(false);
  };

  function logicPausePlay() {
    if (isPlaying) {
      alert("sebaiknya didengarkan sampai selesai");
    } else {
      setIsPlaying(true);
      audio.play();
    }
  }
  return (
    <div className="position-relative d-flex justify-content-center">
      <Card>
        <div className="row d-flex align-items-center mt-4">
          <div className="col-lg-4 text-center">
            <span className="text-muted">
              Surah {data.randomSurah}, Ayat {data.randomAyah}
            </span>
          </div>
          <div className="col-lg-4 text-center mt-2 mb-1 mt-lg-0 mb-lg-0">
            <h3 className="fw-bold">
              {data.surah.id.short} | {data.surah.ar.short}
            </h3>
          </div>
          <div className="col-lg-4 text-center ">
            <span className="text-muted">{data.surah.translation.id}</span>
          </div>
        </div>
        <hr className="border-dashed" />
        <h1 className="text-quran text-end mt-3">{data.ayah.text.ar}</h1>
        <p className="text-success text-justify fst-italic mt-3">
          {data.ayah.translation.id}
        </p>
        <hr className="border-dashed" />
        <small className="text-muted">tafsir :</small>
        <p className="text-justify">{data.ayah.tafsir.id}</p>
      </Card>

      <ButtonCircle
        onClick={logicPausePlay}
        extraClass="audio-button"
        tooltipText={isPlaying ? "hentikan audio" : "putar audio"}
      >
        <img src={isPlaying ? PauseSvg : PlaySvg} alt="" />
      </ButtonCircle>
    </div>
  );
};

export default HomeCard;
