import Card from "../common/Card";
import PlayIcon from "../common/PlayIcon";
import ItemSurah from "./ItemSurah";
const FullCard = ({ data }) => {
  return (
    <div className="position-relative d-flex justify-content-center">
      <Card>
        <div className="row d-flex align-items-center mt-4">
          <div className="col-lg-4 text-center">
            <span className="text-muted">
              Surah {data.number}, Total Ayat {data.ayahCount}
            </span>
          </div>
          <div className="col-lg-4 text-center mt-2 mb-1 mt-lg-0 mb-lg-0">
            <h3 className="fw-bold">
              {data.asma.id.short} | {data.asma.ar.short}
            </h3>
          </div>
          <div className="col-lg-4 text-center ">
            <span className="text-muted">{data.asma.translation.id}</span>
          </div>
        </div>
        <hr className="border-dashed" />
        <small className="text-muted">tafsir surah:</small>
        <p className="text-justify">{data.tafsir.id}</p>
        {data.ayahs.map((item, index) => (
          <ItemSurah
            key={index}
            number={index + 1}
            arabic={item.text.ar}
            translation={item.translation.id}
            audioUrl={item.audio.url}
          />
        ))}
      </Card>
    </div>
  );
};

export default FullCard;
