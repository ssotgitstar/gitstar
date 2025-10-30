import { useState, useEffect } from 'react';
// .js 확장자는 생략 가능합니다.
import { MOCK_PROJECT_DATA, MOCK_PROJECT_DETAILS } from './mock-data';
import { useDebounce } from './useDebounce';

// 1. App 컴포넌트 시작
function App() {
  // --- script.js의 "상태 변수"를 React useState로 변환 ---
  const [projects, setProjects] = useState([]); // currentProjects
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all"); // currentFilter
  const [currentSort, setCurrentSort] = useState("trending"); // currentSort
  const [selectedProjectId, setSelectedProjectId] = useState(null); // isModalOpen
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- 디바운스 적용 ---
  // 300ms 딜레이 후 검색어(debouncedQuery)가 확정됨
  const debouncedQuery = useDebounce(searchQuery, 300);

  // --- script.js의 "loadAndRenderProjects" 로직 변환 ---
  // debouncedQuery, currentFilter, currentSort가 바뀔 때마다 실행됨
  useEffect(() => {
    const loadProjects = () => {
      setIsLoading(true);
      
      // [API 연동] 이 함수를 실제 fetch로 바꾸면 됩니다.
      // 지금은 Mock 데이터로 시뮬레이션
      setTimeout(() => {
        let projectsToRender = [...MOCK_PROJECT_DATA];
        const query = debouncedQuery.toLowerCase();

        // 1. 검색 필터 (Mock)
        if (query) {
          projectsToRender = projectsToRender.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.id.toLowerCase().includes(query) ||
            MOCK_PROJECT_DETAILS[p.id]?.ai_summary.toLowerCase().includes(query)
          );
        }

        // 2. 카테고리 필터 (Mock)
        if (currentFilter !== 'all') {
          projectsToRender = projectsToRender.filter(p => {
            const details = MOCK_PROJECT_DETAILS[p.id];
            return details?.tags.toLowerCase().split(',').map(t => t.trim()).includes(currentFilter);
          });
        }

        // 3. 정렬 (Mock)
        if (currentSort === 'stars') {
          projectsToRender.sort((a, b) => Number(b.stars) - Number(a.stars));
        } else if (currentSort === 'newest') {
          projectsToRender.reverse(); // (단순 reverse Mock)
        }

        setProjects(projectsToRender); // 상태 업데이트 -> React가 화면 자동 렌더링
        setIsLoading(false);
      }, 300); // Mock 딜레이
    };

    loadProjects();
  }, [debouncedQuery, currentFilter, currentSort]); // 의존성 배열

  // --- script.js의 "이벤트 리스너"들을 JSX에 바인딩 ---

  // 로고 클릭 핸들러
  const handleLogoClick = (e) => {
    e.preventDefault();
    setSearchQuery("");
    setCurrentFilter("all");
    setCurrentSort("trending");
  };

  // 검색 폼 제출 핸들러 (즉시 검색)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // 이미 debouncedQuery가 처리하므로, 여기서는 별도 로직 불필요
    console.log("Form submitted");
  };

  // 모달 열기/닫기
  const openModal = (projectId) => setSelectedProjectId(projectId);
  const closeModal = () => setSelectedProjectId(null);


  // --- script.js의 HTML 생성을 JSX로 변환 ---
  // index.html의 <body> 내부를 그대로 가져와서 React용으로 수정
  return (
    <>
      {/* 1. Header (index.html 복사) */}
      <header className="site-header">
        <nav className="main-nav">
          <a href="#" className="logo-container" onClick={handleLogoClick}>
            {/* SVG 로고 (index.html에서 복사) */}
            {/* JSX에서는 style 속성을 객체로 전달해야 합니다. */}
            <svg className="logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="logoGradientHeader" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{stopColor:"#22d3ee"}} /><stop offset="100%" style={{stopColor:"#a78bfa"}} /></linearGradient></defs><path d="M50 10 L90 35 V 65 L50 90 L10 65 V 35 Z M10 35 L50 60 L90 35 M50 60 V 90" stroke="url(#logoGradientHeader)" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d="M30 42 L50 54 L70 42" stroke="url(#logoGradientHeader)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" /></svg>
            <span className="logo-text">GitStar</span>
          </a>
          <div className="search-container">
            <form id="mainSearchForm" onSubmit={handleSearchSubmit}>
              <input
                type="search"
                id="mainSearchInput"
                placeholder="Describe the project you're looking for..."
                aria-label="Search projects with natural language"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" aria-label="Submit search">Search</button>
            </form>
          </div>
          <div className="user-actions">
            <button className="action-button">Sign In</button>
          </div>
          <button
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            id="mobileMenuToggle"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
        </nav>
        <div className={`mobile-nav-menu ${isMobileMenuOpen ? 'active' : ''}`} id="mobileNavMenu">
          {/* (index.html에서 모바일 메뉴 내용 복사) */}
          <a href="#explore">Explore</a>
          <a href="#recommended">Recommended</a>
          <a href="#about">About</a>
          <hr />
          <button className="action-button">Sign In</button>
        </div>
      </header>

      {/* 2. Main Content (index.html 복사) */}
      <main className="content-area">
        <div className="filter-sort-bar">
          <div className="filters">
            <span className="filter-label">Category:</span>
            {/* 필터 버튼들 (상태와 연동) */}
            {['all', 'ai/ml', 'web dev', 'mobile', 'data science'].map((filter) => (
              <button
                key={filter}
                className={`filter-btn ${currentFilter === filter ? 'active' : ''}`}
                data-filter={filter}
                onClick={() => setCurrentFilter(filter)}
              >
                {/* 간단한 첫글자 대문자화 로직 */}
                {filter === 'all' ? 'All' : filter === 'ai/ml' ? 'AI/ML' : filter === 'web dev' ? 'Web Dev' : filter === 'data science' ? 'Data Science' : 'Mobile'}
              </button>
            ))}
          </div>
          <div className="sort-options">
            <label htmlFor="sortSelect">Sort by:</label>
            <select
              id="sortSelect"
              value={currentSort}
              onChange={(e) => setCurrentSort(e.target.value)}
            >
              <option value="trending">Trending</option>
              <option value="newest">Newest</option>
              <option value="stars">Stars</option>
            </select>
          </div>
        </div>

        {/* 3. Project Grid (React 렌더링) */}
        <div className="project-grid" id="projectGrid">
          {isLoading ? (
            <div className="spinner-container" id="spinnerContainer">
              <div id="loadingSpinner" className="spinner"></div>
            </div>
          ) : (
            projects.length > 0 ? (
              // projects 배열을 .map()으로 순회하며 ProjectCard 컴포넌트 렌더링
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => openModal(project.id)}
                />
              ))
            ) : (
              // script.js의 innerHTML 대신 JSX로 바로 표시
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                No projects found matching your criteria.
              </p>
            )
          )}
        </div>
      </main>

      {/* 4. Footer (index.html 복사) */}
      <footer className="site-footer">
        <div className="footer-content">
            <p>&copy; 2025 GitStar AI Project Discovery. All rights reserved.</p>
            <div className="footer-links">
                <a href="#">About</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
            </div>
        </div>
      </footer>

      {/* 5. Modal (React 렌더링) */}
      {/* selectedProjectId가 있을 때만 ProjectModal 컴포넌트 렌더링 */}
      {selectedProjectId && (
        <ProjectModal
          projectId={selectedProjectId}
          onClose={closeModal}
        />
      )}
    </>
  );
}

// =====================================================================
// --- 컴포넌트 분리 (App.jsx 파일 하단 또는 별도 파일) ---
// =====================================================================

// --- script.js의 "createProjectCardHTML"을 React 컴포넌트로 변환 ---
// props에서 { project, onClick }을 바로 구조분해 할당
function ProjectCard({ project, onClick }) {
  // Mock 데이터에서 상세 정보 가져오기
  const details = MOCK_PROJECT_DETAILS[project.id] || MOCK_PROJECT_DETAILS['default'];
  const tags = details.tags?.split(',').slice(0, 3).map(tag => tag.trim()) || [];

  return (
    <a href="#" className="project-card" data-project-id={project.id} tabIndex={0} onClick={(e) => { e.preventDefault(); onClick(); }}>
      <div className="card-header">
        <h3 className="project-title">{project.name || 'Untitled Project'}</h3>
        <span className="project-author">{details.author || '@unknown'}</span>
      </div>
      <div className="ai-summary-section">
        <span className="summary-label">
          {/* AI 아이콘 SVG */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a1 1 0 0 0 -1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0 -1 -1z M19.071 4.929a1 1 0 0 0 -1.414 0l-1.414 1.414a1 1 0 0 0 1.414 1.414l1.414 -1.414a1 1 0 0 0 0 -1.414z M4.929 4.929a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 -1.414l-1.414 -1.414a1 1 0 0 0 -1.414 0z M3 12a1 1 0 0 0 1 1h2a1 1 0 0 0 0 -2h-2a1 1 0 0 0 -1 1z M21 12a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 1 -1z M17.657 16.243a1 1 0 0 0 -1.414 -1.414l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414 -1.414z M6.343 16.243a1 1 0 0 0 1.414 -1.414l-1.414 -1.414a1 1 0 0 0 -1.414 1.414l1.414 1.414z M12 19a1 1 0 0 0 -1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0 -1 -1z"></path></svg>
          AI Summary
        </span>
        <p className="project-summary">{details.ai_summary || 'Click to learn more...'}</p>
      </div>
      <div className="project-tags">
        {tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
      </div>
      <div className="project-stats">
        <span>⭐ {details.stars || 'N/A'}</span>
        {details.forks && details.forks !== 'N/A' && (
          <span>🍴 {details.forks}</span>
        )}
      </div>
    </a>
  );
}

// --- script.js의 "openModal" 로직을 React 컴포넌트로 변환 ---
function ProjectModal({ projectId, onClose }) {
  // 모달 내부에 자체적인 로딩/데이터 상태를 둠
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- script.js의 모달 데이터 fetch 로직 ---
  useEffect(() => {
    setIsLoading(true);
    
    // [API 연동] 이 함수를 실제 fetch(`/project/${projectId}`)로 바꾸면 됨
    // Mock 데이터 시뮬레이션
    setTimeout(() => {
      const data = MOCK_PROJECT_DETAILS[projectId] || MOCK_PROJECT_DETAILS['default'];
      setDetails(data);
      setIsLoading(false);
    }, 300); // 0.3초 딜레이
  }, [projectId]); // projectId가 바뀔 때마다 다시 fetch

  // --- script.js의 ESC 키 이벤트 리스너 ---
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    // 컴포넌트가 사라질 때 이벤트 리스너 정리
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // .? (옵셔널 체이닝) : details가 null일 경우 에러 방지
  const tags = details?.tags?.split(',').map(t => t.trim()).filter(Boolean) || [];

  // index.html의 모달 HTML을 가져옴
  return (
    <div
      id="projectModal"
      className="modal-overlay visible" // 항상 visible
      onClick={(e) => {
        // 모달 바깥 클릭 시 닫기
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal-content">
        <button className="modal-close-btn" aria-label="Close modal" onClick={onClose}>
          &times;
        </button>

        {isLoading || !details ? (
          // 모달 로딩 스피너
          <div>
            <div className="modal-header">
              <h2 id="modalTitle">Loading Project...</h2>
            </div>
            <div className="spinner-container" style={{padding: '50px 0'}}>
                <div className="spinner"></div>
            </div>
          </div>
        ) : (
          // 데이터 로드 완료 시
          <>
            <div className="modal-header">
              <h2 id="modalTitle">{details.title}</h2>
              <span id="modalAuthor">by {details.author}</span>
            </div>
            <a id="modalRepoLink" href={details.repo_url} target="_blank" rel="noopener noreferrer" className="repo-link" style={{ display: details.repo_url !== '#' ? 'inline-flex' : 'none' }}>
              {/* GitHub 아이콘 SVG */}
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.87-.31-1.59-.8-2.15C10.64 10.5 9.09 9.94 7.64 9.94c-1.45 0-2.5.47-3.37 1.29-.31-.05-.62-.12-.94-.23-.28-.1-.58-.23-.9-.38-.2-.1-.4-.2-.59-.3-.3-.18-.59-.38-.89-.63-.3-.25-.59-.53-.88-.88-.3-.34-.56-.7-.8-1.08l-.24-.46c-.05-.1-.08-.2-.1-.3-.04-.1-.08-.2-.1-.3C.05 7.02 0 6.69 0 6.36c0-.38.05-.75.14-1.11l.1-.38c.03-.1.06-.2.1-.3.04-.1.08-.2.13-.3.04-.1.08-.2.13-.28.18-.3.39-.59.62-.85.24-.27.5-.52.78-.75.29-.24.59-.45.9-.63l.6-.3c.2-.1.4-.18.6-.25.29-.1.59-.17.9-.23.31-.06.62-.1.94-.12.33-.03.66-.04 1-.04Zm.45 14.39c.07-.02.13-.04.2-.05.18-.04.36-.08.53-.13.13-.04.26-.08.39-.13l.1-.03c.1-.04.2-.08.3-.13.3-.13.59-.28.88-.45l.3-.17c.29-.18.57-.37.84-.58.27-.2.53-.42.78-.65.25-.23.49-.47.72-.73.23-.26.44-.54.65-.84l.2-.3c.18-.3.35-.63.48-.98.13-.35.24-.72.3-1.1V6.36c0-.33-.04-.66-.12-1l-.08-.3c-.02-.08-.05-.16-.08-.24l-.08-.22c-.1-.28-.22-.55-.37-.8l-.16-.28-.15-.25c-.29-.48-.63-.92-1-1.3-.39-.39-.82-.73-1.3-1L9.1 1.05c-.3-.1-.6-.18-.9-.23-.3-.06-.6-.09-.9-.1-.3-.01-.6 0-1 0-.3 0-.6 0-.9.02l-.4.02c-.3.02-.6.06-.88.1-.28.04-.56.1-.83.18l-.53.15c-.26.08-.52.17-.78.28l-.5.2c-.25.1-.5.24-.73.38l-.45.28c-.22.14-.44.3-.65.46-.2.16-.4.34-.58.53l-.35.34c-.17.18-.34.37-.5.57l-.3.38c-.15.2-.3.4-.44.62l-.26.43-.2.37c-.14.28-.26.57-.36.88l-.16.5-.1.35c-.06.2-.1.4-.14.6L.14 5.25c-.1.35-.14.72-.14 1.11 0 .33.04.66.12 1l.08.3c.02.08.05.16.08.24l.08.22c.1.28.22.55.37.8l.16.28.15.25c.29.48.63.92 1 1.3.39.39.82.73 1.3 1l.48.35c.3.2.6.38.9.53.3.14.6.26.9.36.29.1.59.18.9.24.31.06.62.1.94.12l.4.02c.3.02.6.03.9.03.34 0 .67-.01 1-.02.3-.01.6-.04.9-.07.29-.03.58-.08.86-.14.28-.06.56-.13.83-.21l.4-.1c.15-.05.28-.1.42-.15.14-.06.28-.12.42-.19.14-.07.27-.14.4-.22.13-.08.26-.16.39-.25.13-.09.25-.19.37-.29.12-.1.24-.2.35-.31.11-.11.22-.23.33-.35.11-.12.21-.25.31-.38.1-.13.19-.27.28-.41l.1-.15Z" fill="currentColor"></path></svg>
              View on GitHub ↗
            </a>
            <hr className="modal-divider" />
            <h4>🤖 AI 요약 (Full)</h4>
            <p id="modalSummary">{details.ai_summary}</p>
            <hr className="modal-divider" />
            <h4>🏷️ 태그</h4>
            <div className="project-tags modal-tags" id="modalTags">
              {tags.length > 0 ? (
                tags.map(tag => <span key={tag} className="tag">{tag}</span>)
              ) : (
                <span className="tag loading">No tags provided</span>
              )}
            </div>
            <hr className="modal-divider" />
            <h4>📊 상세 통계</h4>
            <div className="project-stats modal-stats" id="modalStats">
              <div><span>⭐ Stars</span><strong id="modalStars">{details.stars}</strong></div>
              <div><span>🍴 Forks</span><strong id="modalForks">{details.forks}</strong></div>
              <div><span>📜 License</span><strong id="modalLicense">{details.license}</strong></div>
            </div>
            <hr className="modal-divider" />
            <div className="readme-container">
              <h3>README Preview</h3>
              {/* <pre> 태그로 감싸서 README의 공백과 줄바꿈 유지 */}
              <pre className="readme-body" id="readmeBody">
                {details.readme_content}
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;