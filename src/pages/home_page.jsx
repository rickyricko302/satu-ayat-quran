import { useEffect, useState } from "react";
import SkeletonLoader from "../components/common/SkeletonLoader";
import LayoutApp from "../components/templates/LayoutApp";
import axios from "axios";
import HomeCard from "../components/partials/HomeCard";
import ButtonCircle from "../components/common/ButtonCircle";
import RefreshSvg from "../assets/svg/refresh.svg";
import { Link } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    getSurah();
  }, []);

  async function getSurah() {
    setIsLoading(true);
    let randomSurah = Math.floor(Math.random() * 114) + 1;
    let randomAyah;
    await axios
      .get(`https://quran-endpoint.vercel.app/quran/${randomSurah}`)
      .then(
        (res) =>
          (randomAyah = Math.floor(Math.random() * res.data.data.ayahCount) + 1)
      )
      .catch((err) => console.log(err));
    await axios
      .get(
        `https://quran-endpoint.vercel.app/quran/${randomSurah}/${randomAyah}`
      )
      .then((res) => {
        res.data.data.randomSurah = randomSurah;
        res.data.data.randomAyah = randomAyah;
        setData(res.data.data);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  }

  return (
    <LayoutApp>
      <div className="d-flex align-items-center flex-column px-4 px-lg-8">
        {isLoading ? <SkeletonLoader /> : <HomeCard data={data} />}
        <Link
          to={`/full-surah/${data.randomSurah}`}
          className={`btn btn-success mt-4 ${isLoading ? "d-none" : ""}`}
        >
          tampilkan lengkap surah ini
        </Link>
      </div>

      <ButtonCircle
        onClick={getSurah}
        tooltipText={"refresh surah"}
        extraClass={`refresh-button ${isLoading ? "disabled" : ""}`}
      >
        <img src={RefreshSvg} alt="" />
      </ButtonCircle>
    </LayoutApp>
  );
};

export default Home;
