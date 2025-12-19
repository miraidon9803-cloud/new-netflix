import React, { useState } from 'react';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p/w342';

type MovieDetail = {
  id: number;
  title: string;
  overview?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  runtime?: number;
  vote_average?: number;
  vote_count?: number;
  genres?: { id: number; name: string }[];
};

const MovieById: React.FC = () => {
  const [movieId, setMovieId] = useState('');
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMovie = async () => {
    try {
      const id = Number(movieId.trim());
      if (!id) return setError('movie id를 입력하세요');

      setLoading(true);
      setError('');
      setMovie(null);

      const url = `${BASE}/movie/${id}?api_key=${API_KEY}&language=ko-KR`;
      console.log('[TMDB][MovieById] request URL:', url);

      const res = await fetch(url);
      if (!res.ok) throw new Error(`TMDB error: ${res.status}`);

      const data = (await res.json()) as MovieDetail;

      // ✅ 전체 데이터
      console.log('[TMDB][MovieById] raw response:', data);

      // ✅ 장르만 따로 보기 좋게
      console.log(
        '[TMDB][MovieById] genres:',
        data.genres?.map((g) => ({
          id: g.id,
          name: g.name,
        }))
      );

      setMovie(data);
    } catch (e: any) {
      setError(e?.message ?? '에러 발생');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Movie ID 검색</h2>

      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem' }}>
        <input
          value={movieId}
          onChange={(e) => setMovieId(e.target.value)}
          placeholder="예: 496243"
          style={{ padding: '0.6rem', width: '14rem' }}
        />
        <button onClick={fetchMovie} style={{ padding: '0.6rem 1.2rem' }}>
          검색
        </button>
      </div>

      {loading && <p>로딩중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {movie && (
        <div style={{ display: 'flex', gap: '1rem' }}>
          {movie.poster_path && <img src={`${IMG}${movie.poster_path}`} alt={movie.title} />}

          <div>
            <h3>{movie.title}</h3>

            {/* 장르 UI */}
            {movie.genres && movie.genres.length > 0 && (
              <p>장르: {movie.genres.map((g) => g.name).join(', ')}</p>
            )}

            <p>{movie.overview}</p>
            <p>개봉일: {movie.release_date}</p>
            <p>러닝타임: {movie.runtime}분</p>
            <p>평점: {movie.vote_average}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieById;
