import { useState, useEffect } from 'react';
import './scss/SearchModal.scss';

// 타입 정의
interface Content {
  title: string;
  url: string;
  type: 'poster' | 'backdrop';
  logo: string | null;
}

interface SearchModalProps {
  onClose: () => void;
}

// 데이터 import (경로는 팀 프로젝트 구조에 맞게 조정)
import netflixDataRaw from '../data/netflix_data.json';
const netflixData = netflixDataRaw as Content[];

const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

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

  // 검색어 지우기
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  // 검색 실행
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const queryNoSpace = query.toLowerCase().replace(/\s/g, '');

    const results = netflixData.filter((item: Content) => {
      const title = item.title.toLowerCase();
      const titleNoSpace = title.replace(/\s/g, '');

      if (titleNoSpace.includes(queryNoSpace)) {
        return true;
      }

      const keywords = query.toLowerCase().trim().split(' ');
      return keywords.every(keyword => title.includes(keyword));
    });

    const uniqueResults = results.filter((item: Content) => item.type === 'poster');
    setSearchResults(uniqueResults);
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

  // 검색어 입력 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  // 검색 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
    addRecentSearch(searchQuery);
  };

  // 검색 버튼 클릭
  const handleSearchButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
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

  // 인기 콘텐츠 상위 6개
  const popularContent = netflixData
    .filter((item: Content) => item.type === 'backdrop')
    .slice(0, 6);

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
              placeholder="검색어를 입력해주세요"
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

          {/* 검색 결과 */}
          {isSearching && searchResults.length > 0 && (
            <div className="search-results-section">
              <div className="section-header">
                <h2 className="section-title">콘텐츠</h2>
                <a href="/contents" className="go-link">바로가기</a>
              </div>
              <div className="results-grid">
                {searchResults.map((content, index) => (
                  <div key={index} className="results-card">
                    <div className="results-image-wrapper">
                      <img
                        src={content.url}
                        alt={content.title}
                        className="results-image"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 검색 결과 없음 */}
          {isSearching && searchResults.length === 0 && (
            <div className="no-results">
              <p>검색 결과가 없습니다.</p>
            </div>
          )}

          {/* 가장 많이 찾아본 콘텐츠 */}
          {!isSearching && (
            <div className="popular-content-section">
              <div className="section-header">
                <h2 className="section-title">가장 많이 찾아본 콘텐츠</h2>
              </div>
              <div className="content-grid">
                {popularContent.map((content, index) => (
                  <div key={index} className="content-card">
                    <div className={`card-rank ${index === 0 ? 'rank-first' : ''}`}>
                      {index + 1}
                    </div>
                    <div className="card-image-wrapper">
                      <img
                        src={content.url}
                        alt={content.title}
                        className="card-image"
                      />
                      {content.logo ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w300${content.logo}`}
                          alt={content.title}
                          className="card-logo"
                        />
                      ) : (
                        <div className="card-title">{content.title}</div>
                      )}
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