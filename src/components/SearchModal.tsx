import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNetflixStore } from '../store/NetflixStore';
import './scss/SearchModal.scss';

// TMDB API 설정
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

interface SearchModalProps {
  onClose: () => void;
}

// 검색 결과 타입
interface SearchResultItem {
  id: number;
  title: string;
  poster_path: string | null;
  media_type: 'movie' | 'tv';
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // NetflixStore에서 인기 콘텐츠용 데이터만 가져오기
  const { netflixTop10, onFetchNetflixTop10 } = useNetflixStore();

  // 한글 포함 여부 체크
  const hasKorean = (text: string): boolean => {
    return /[가-힣]/.test(text);
  };

  // 한글 이름인지 체크 (완전히 한글로만 구성)
  const isKoreanName = (name: string): boolean => {
    const koreanOnly = name.replace(/\s/g, '');
    return /^[가-힣]+$/.test(koreanOnly);
  };

  // TMDB에서 제목 검색 (넷플릭스 콘텐츠)
  const searchByTitle = async (query: string): Promise<SearchResultItem[]> => {
    try {
      const results: SearchResultItem[] = [];
      const seenIds = new Set<string>();

      // TV 시리즈 검색 (넷플릭스 제공)
      const tvRes = await fetch(
        `${BASE_URL}/search/tv?api_key=${API_KEY}&language=ko-KR&query=${encodeURIComponent(query)}`
      );
      const tvData = await tvRes.json();

      // 영화 검색 (넷플릭스 제공)
      const movieRes = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&language=ko-KR&query=${encodeURIComponent(query)}`
      );
      const movieData = await movieRes.json();

      // TV 결과 처리
      for (const item of (tvData.results || []).slice(0, 15)) {
        const isNetflix = await checkNetflixAvailability(item.id, 'tv');
        if (isNetflix) {
          const uniqueKey = `tv-${item.id}`;
          if (!seenIds.has(uniqueKey)) {
            seenIds.add(uniqueKey);
            results.push({
              id: item.id,
              title: item.name || '제목 없음',
              poster_path: item.poster_path,
              media_type: 'tv',
            });
          }
        }
      }

      // 영화 결과 처리
      for (const item of (movieData.results || []).slice(0, 15)) {
        const isNetflix = await checkNetflixAvailability(item.id, 'movie');
        if (isNetflix) {
          const uniqueKey = `movie-${item.id}`;
          if (!seenIds.has(uniqueKey)) {
            seenIds.add(uniqueKey);
            results.push({
              id: item.id,
              title: item.title || '제목 없음',
              poster_path: item.poster_path,
              media_type: 'movie',
            });
          }
        }
      }

      return results;
    } catch (error) {
      console.error('제목 검색 오류:', error);
      return [];
    }
  };

  // 배우 검색 및 출연작 가져오기
  const searchActorCredits = async (query: string): Promise<SearchResultItem[]> => {
    try {
      // 1. 인물 검색
      const searchRes = await fetch(
        `${BASE_URL}/search/person?api_key=${API_KEY}&language=ko-KR&query=${encodeURIComponent(query)}`
      );
      const searchData = await searchRes.json();
      
      if (!searchData.results || searchData.results.length === 0) {
        return [];
      }

      const actorResults: SearchResultItem[] = [];
      const seenIds = new Set<string>();

      // 상위 3명의 배우만 검색
      const actors = searchData.results.slice(0, 3);

      for (const actor of actors) {
        // 한글 이름이 없는 배우는 제외
        if (!hasKorean(actor.name)) {
          continue;
        }

        // 국내 배우: 풀네임 매칭 필요
        if (isKoreanName(actor.name)) {
          if (actor.name !== query && !actor.name.includes(query)) {
            continue;
          }
        }

        // 2. 배우의 출연작 가져오기
        const creditsRes = await fetch(
          `${BASE_URL}/person/${actor.id}/combined_credits?api_key=${API_KEY}&language=ko-KR`
        );
        const creditsData = await creditsRes.json();

        if (!creditsData.cast) continue;

        // 주연/조연만 필터링 (20개로 축소)
        const mainRoles = creditsData.cast
          .filter((credit: any) => {
            return credit.order === undefined || credit.order < 20;
          })
          .slice(0, 20);

        for (const credit of mainRoles) {
          const mediaType = credit.media_type as 'movie' | 'tv';
          const uniqueKey = `${mediaType}-${credit.id}`;
          
          if (seenIds.has(uniqueKey)) continue;
          seenIds.add(uniqueKey);

          // 넷플릭스 제공 여부 확인
          const isNetflix = await checkNetflixAvailability(credit.id, mediaType);
          
          if (isNetflix) {
            actorResults.push({
              id: credit.id,
              title: credit.title || credit.name || '제목 없음',
              poster_path: credit.poster_path,
              media_type: mediaType,
            });
          }
        }
      }

      return actorResults;
    } catch (error) {
      console.error('배우 검색 오류:', error);
      return [];
    }
  };

  // 넷플릭스 제공 여부 확인
  const checkNetflixAvailability = async (id: number, mediaType: 'movie' | 'tv'): Promise<boolean> => {
    try {
      const res = await fetch(
        `${BASE_URL}/${mediaType}/${id}/watch/providers?api_key=${API_KEY}`
      );
      const data = await res.json();
      
      // 한국 (KR) 에서 넷플릭스 (provider_id: 8) 제공 여부
      const krProviders = data.results?.KR;
      if (!krProviders) return false;

      const allProviders = [
        ...(krProviders.flatrate || []),
        ...(krProviders.rent || []),
        ...(krProviders.buy || []),
      ];

      return allProviders.some((provider: any) => provider.provider_id === 8);
    } catch {
      return false;
    }
  };

  // 컴포넌트 마운트 시 인기 콘텐츠 fetch
  useEffect(() => {
    if (netflixTop10.length === 0) onFetchNetflixTop10();
  }, []);

  // 초기 로드: localStorage에서 최근 검색어 가져오기
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  // 모달 열릴 때 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // 최근 검색어 localStorage 저장
  const saveRecentSearches = (searches: string[]) => {
    localStorage.setItem('recentSearches', JSON.stringify(searches));
    setRecentSearches(searches);
  };

  // 통합 검색 실행 (TMDB API 직접 검색)
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setIsLoading(true);

    const combinedResults: SearchResultItem[] = [];
    const seenIds = new Set<string>();

    // 1. TMDB API로 제목 검색 (넷플릭스 콘텐츠만)
    const titleResults = await searchByTitle(query.trim());
    
    for (const item of titleResults) {
      const uniqueKey = `${item.media_type}-${item.id}`;
      if (!seenIds.has(uniqueKey)) {
        seenIds.add(uniqueKey);
        combinedResults.push(item);
      }
    }

    // 2. 배우 검색 (2글자 이상일 때만)
    if (query.trim().length >= 2) {
      const actorResults = await searchActorCredits(query.trim());
      
      for (const item of actorResults) {
        const uniqueKey = `${item.media_type}-${item.id}`;
        if (!seenIds.has(uniqueKey)) {
          seenIds.add(uniqueKey);
          combinedResults.push(item);
        }
      }
    }

    setSearchResults(combinedResults);
    setIsLoading(false);
  };

  // 최근 검색어 추가 (2글자 이상만)
  const addRecentSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) return;

    let updatedSearches = [...recentSearches];
    updatedSearches = updatedSearches.filter(item => item !== trimmedQuery);
    updatedSearches.unshift(trimmedQuery);

    if (updatedSearches.length > 5) {
      updatedSearches = updatedSearches.slice(0, 5);
    }

    saveRecentSearches(updatedSearches);
  };

  // 검색어 입력 처리 (디바운스 적용)
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // 디바운스: 500ms 후에 검색 실행 (API 호출 줄이기)
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      handleSearch(value);
    }, 500);

    setDebounceTimer(timer);
  };

  // 검색 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    handleSearch(searchQuery);
    addRecentSearch(searchQuery);
  };

  // 검색 버튼 클릭
  const handleSearchButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    handleSearch(searchQuery);
    addRecentSearch(searchQuery);
  };

  // 최근 검색어 클릭
  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  // 최근 검색어 개별 삭제
  const removeRecentSearch = (query: string) => {
    const updated = recentSearches.filter(item => item !== query);
    saveRecentSearches(updated);
  };

  // 최근 검색어 전체 삭제
  const clearAllRecentSearches = () => {
    saveRecentSearches([]);
  };

  // 콘텐츠 클릭 시 상세페이지로 이동
  const handleContentClick = (mediaType: 'movie' | 'tv', id: number) => {
    onClose(); // 모달 닫기
    navigate(`/${mediaType}/${id}`);
  };

  // 인기 콘텐츠 상위 6개 (netflixTop10에서 가져오기)
  const popularContent = netflixTop10.slice(0, 6);

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="search-popup">
          {/* Search 타이틀 */}
          <div className="title-wrapper">
            <h1 className="title">Search</h1>
            <button
              className="close-btn"
              aria-label="닫기"
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M6.46267 6.29289C6.08536 6.68342 6.08536 7.31658 6.46267 7.70711L16.1244 17.7071C16.5018 18.0976 17.1135 18.0976 17.4908 17.7071C17.8681 17.3166 17.8681 16.6834 17.4908 16.2929L7.82905 6.29289C7.45174 5.90237 6.83999 5.90237 6.46267 6.29289Z" fill="#D2D2D2" />
                <path fillRule="evenodd" clipRule="evenodd" d="M17.4908 6.29289C17.8681 6.68342 17.8681 7.31658 17.4908 7.70711L7.82905 17.7071C7.45174 18.0976 6.83999 18.0976 6.46267 17.7071C6.08536 17.3166 6.08536 16.6834 6.46267 16.2929L16.1244 6.29289C16.5018 5.90237 17.1135 5.90237 17.4908 6.29289Z" fill="#D2D2D2" />
              </svg>
            </button>
          </div>

          {/* 검색창 */}
          <form onSubmit={handleSubmit} className="search-form">
            <button
              type="button"
              className="back-btn"
              aria-label="뒤로가기"
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
                <path d="M17 7L1 7M1 7L7 0.999999M1 7L7 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <input
              type="text"
              className="search-input"
              placeholder="제목, 배우명으로 검색"
              value={searchQuery}
              onChange={handleInputChange}
              autoFocus
            />
            <button
              type="button"
              className="search-submit-btn"
              aria-label="검색"
              onClick={handleSearchButtonClick}
            >
              <img src="/images/search-btn.png" alt="search" />
            </button>
          </form>

          {/* 최근 검색어 */}
          {recentSearches.length > 0 && !isSearching && (
            <div className="recent-searches-section">
              <div className="section-header">
                <h2 className="section-title">최근검색어</h2>
                <button
                  className="clear-all-btn"
                  onClick={clearAllRecentSearches}
                >
                  전체삭제
                </button>
              </div>
              <div className="tags-container">
                {recentSearches.map((search, index) => (
                  <div key={index} className="tag">
                    <span
                      className="tag-text"
                      onClick={() => handleRecentSearchClick(search)}
                    >
                      {search}
                    </span>
                    <button
                      className="tag-remove-btn"
                      onClick={() => removeRecentSearch(search)}
                      aria-label="삭제"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 로딩 표시 */}
          {isLoading && (
            <div className="loading-section">
              <p>검색 중...</p>
            </div>
          )}

          {/* 검색 결과 */}
          {isSearching && !isLoading && searchResults.length > 0 && (
            <div className="search-results-section">
              <div className="section-header">
                <h2 className="section-title">콘텐츠</h2>
                <span className="results-link">바로가기</span>
              </div>
              <div className="results-grid">
                {searchResults.map((content) => (
                  <div 
                    key={`${content.media_type}-${content.id}`} 
                    className="results-card"
                    onClick={() => handleContentClick(content.media_type, content.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="results-image-wrapper">
                      {content.poster_path ? (
                        <img
                          src={`${IMAGE_BASE_URL}/w300${content.poster_path}`}
                          alt={content.title}
                          className="results-image"
                        />
                      ) : (
                        <div className="results-no-image">
                          <span>{content.title}</span>
                        </div>
                      )}
                    </div>
                    <p className="results-title">{content.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 검색 결과 없음 */}
          {isSearching && !isLoading && searchResults.length === 0 && (
            <div className="no-results">
              <p>검색 결과가 없습니다.</p>
            </div>
          )}

          {/* 가장 많이 찾아본 콘텐츠 (netflixTop10 상위 6개) */}
          {!isSearching && (
            <div className="popular-content-section">
              <div className="section-header">
                <h2 className="section-title">가장 많이 찾아본 콘텐츠</h2>
              </div>
              <div className="content-grid">
                {popularContent.map((content, index) => (
                  <div 
                    key={content.id} 
                    className="content-card"
                    onClick={() => handleContentClick(content.media_type || 'tv', content.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={`card-rank ${index === 0 ? 'rank-first' : ''}`}>
                      {index + 1}
                    </div>
                    <div className="card-image-wrapper">
                      {content.backdrop_path ? (
                        <img
                          src={`${IMAGE_BASE_URL}/w500${content.backdrop_path}`}
                          alt={content.name || content.title || ''}
                          className="card-image"
                        />
                      ) : content.poster_path ? (
                        <img
                          src={`${IMAGE_BASE_URL}/w300${content.poster_path}`}
                          alt={content.name || content.title || ''}
                          className="card-image"
                        />
                      ) : (
                        <div className="card-no-image">
                          <span>{content.name || content.title}</span>
                        </div>
                      )}
                      <div className="card-title">{content.name || content.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;