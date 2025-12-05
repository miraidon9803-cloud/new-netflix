import { useEffect } from "react";
import NetflixOriginal from "../components/NetflixOriginal";
import { useNetflixStorte } from "../store/NetflixStore";

const Main = () => {
  const { onFetchOriginal, original } = useNetflixStorte();
  useEffect(() => {
    onFetchOriginal();
  });
  return (
    <div>
      <NetflixOriginal title="넷플릭스 오리지날" original={original} />
    </div>
  );
};

export default Main;
