import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useMovieStore } from "../store/useMoiveStore";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const tvId = id ?? null;

  const { tvDetail, onFetchTvDetail } = useMovieStore();

  useEffect(() => {
    if (!tvId) return;
    onFetchTvDetail(tvId);
  }, [tvId, onFetchTvDetail]);

  if (!tvId) return <p>잘못된 접근입니다.</p>;
  if (!tvDetail) return <p>작품 불러오는 중..</p>;

  const title = tvDetail.name ?? "제목 없음";

  return (
    <div className="sub-page">
      <div className="inner">
        <div>
          <div>
            <img
              src={`https://image.tmdb.org/t/p/w300${tvDetail.poster_path}`}
              alt={title}
            />
          </div>

          <div className="text-box">
            <div className="title-wrap">
              <h2>{title}</h2>
              <button>재생</button>
            </div>

            <div className="text-content">
              <p>연령</p>
              <p>날짜</p>
              <p>시즌</p>
              <p>HD</p>
            </div>

            <div className="text-fads">
              <p>{tvDetail.overview}</p>
            </div>

            <div className="btn-wrap">
              <p>위시리스트</p>
              <p>따봉</p>
              <p>다운로드</p>
              <p>공유</p>
            </div>

            <p>정보 더보기 +</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
