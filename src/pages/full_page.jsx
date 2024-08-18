import { Link, useParams } from "react-router-dom";
import SkeletonLoader from "../components/common/SkeletonLoader";
import LayoutApp from "../components/templates/LayoutApp";
import { useEffect, useState } from "react";
import axios from "axios";
import FullCard from "../components/partials/FullCard";
import ButtonCircle from "../components/common/ButtonCircle";
import BackIcon from "../components/common/BackIcon";

const FullPage = () => {
  const { surah } = useParams();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  async function getSurah() {
    setIsLoading(true);
    await axios
      .get(`https://quran-endpoint.vercel.app/quran/${surah}`)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  }

  useEffect(() => {
    getSurah();
  }, []);
  return (
    <LayoutApp>
      <div className="d-flex align-items-center flex-column px-4 px-lg-8">
        {isLoading ? <SkeletonLoader /> : <FullCard data={data} />}
      </div>
    </LayoutApp>
  );
};

export default FullPage;
