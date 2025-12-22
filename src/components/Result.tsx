import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetch2025Movies, fetch2025Tv } from "../api/tmdb";
import { getMood, getFlow, getTone } from "../utils/tmdbRules";

import "./scss/Result.scss";
import SideNav from "./SideNav";

/* 결과 카드 타입 */
interface ResultCard {
  id: number;
  title: string;
  poster: string;
  mediaType: "movie" | "tv";
  mood: string;
  flow: string;
  tone: string;
}

/* Result props */
interface ResultProps {
  mood: string | null; // Step1
  flow: string | null; // Step2
  tone: string | null; // Step3
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const Result = ({ mood, flow, tone }: ResultProps) => {
  const navigate = useNavigate();

  const [results, setResults] = useState<ResultCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 선택값이 하나라도 없으면 결과 화면 진입 불가
    if (!mood || !flow || !tone) {
      setLoading(false);
      return;
    }

    const loadResults = async () => {
      setLoading(true);

      try {
        const movies = await fetch2025Movies();
        const tv = await fetch2025Tv();

        /* 1️⃣ TMDB 데이터 가공 */
        const processed: ResultCard[] = [...movies, ...tv].map((item: any) => {
          const isMovie = "title" in item;

          return {
            id: item.id,
            title: item.title || item.name,
            poster: item.poster_path,
            mediaType: isMovie ? "movie" : "tv",

            mood: getMood(item),
            flow: getFlow(item),
            tone: getTone(item),
          };
        });

        /* 2️⃣ OR 필터 (하나라도 맞으면 추천) ⭐ */
        const filtered = processed.filter(
          (item) =>
            item.mood === mood || item.flow === flow || item.tone === tone
        );

        setResults(filtered);
      } catch (error) {
        console.error("Result load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [mood, flow, tone]);

  /* 로딩 */
  if (loading) {
    return (
      <section className="result_loading">
        <p>추천 콘텐츠를 불러오는 중입니다…</p>
      </section>
    );
  }

  /* 결과 없음 */
  if (!results.length) {
    return (
      <section className="result_empty">
        <p>조건에 맞는 콘텐츠를 찾지 못했어요</p>
        <button onClick={() => navigate("/exploration")}>다시 선택하기</button>
      </section>
    );
  }

  return (
    <section className="result_section">
      <SideNav />
      <div className="result_header">
        <h2 className="result_title">
          지금의 당신에게 어울리는 이야기들이에요
        </h2>
        <p className="result_sub">오늘의 감정을 기준으로 골라봤어요</p>
      </div>

      <div className="result_grid">
        {results.map((item) => (
          <button
            key={`${item.mediaType}-${item.id}`}
            className="result_card"
            onClick={() =>
              // navigate(`/${item.mediaType}/${item.id}`)
              navigate(`/movie/${item.id}`)
            }
          >
            {item.poster ? (
              <img src={`${IMAGE_BASE_URL}${item.poster}`} alt={item.title} />
            ) : (
              <div className="result_no_image">이미지 없음</div>
            )}
          </button>
        ))}
      </div>

      <div className="result_footer">
        <button
          className="result_retry"
          onClick={() => navigate("/exploration")}
        >
          다시 골라보기
        </button>
      </div>
    </section>
  );
};

export default Result;
