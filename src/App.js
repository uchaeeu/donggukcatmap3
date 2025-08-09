// src/App.jsx  (TS 프로젝트면 App.tsx로 저장해도 OK)
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css"; // App 전용 스타일


// 너/팀원1 쪽
import FortuneGame from "./routes/FortuneGame";
import MainScreen from "./routes/MainScreen";
import UploadScreen from "./routes/UploadScreen";
import SearchScreen from "./routes/SearchScreen";
import TrendScreen from "./routes/TrendScreen";
import LocationScreen from "./routes/LocationScreen";

// 팀원2 쪽
import PostDetailPage from "./routes/PostDetailPage";
import PostGridPage from "./routes/PostGridPage";
import MapPage from "./routes/MapPage";
import TagSearchPage from "./routes/TagSearchPage";
import TagResultPage from "./routes/TagResultPage";
import TagPickPage from "./routes/TagPickPage";
import BottomNav from "./components/BottomNav";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      {/* BottomNav 공간 확보 */}
      <div style={{ paddingBottom: 90 }}>
        <Routes>
          {/* 홈 경로 — 팀원2 설계 존중: / → /map 리다이렉트 
              (네 메인 화면을 기본으로 쓰고 싶으면 아래 두 줄을 바꾸면 돼)
          */}
          <Route path="/" element={<Navigate to="/map" replace />} />
          {/* <Route path="/" element={<MainScreen />} /> */}

          {/* 지도 */}
          <Route path="/map" element={<MapPage />} />
          <Route path="/location" element={<LocationScreen />} /> {/* 기존 팀원1 경로 유지 */}

          {/* 인기/그리드 조회 */}
          <Route path="/popular" element={<PostGridPage mode="popular" />} />

          {/* 태그 검색/결과 */}
          <Route path="/tags" element={<SearchScreen />} />        {/* 기존 팀원1 */}
          <Route path="/tags/search" element={<TagSearchPage />} />{/* 팀원2 */}
          <Route path="/tags/:name" element={<TagResultPage />} /> {/* 팀원2 */}

          {/* 게시글 상세 (경로 두 가지 모두 허용) */}
          <Route path="/post/:id" element={<PostDetailPage />} />      {/* 팀원2 */}
          <Route path="/posts/:postId" element={<PostDetailPage />} /> {/* 팀원1의 테스트 경로 호환 */}

          {/* 업로드 + 태그 선택 */}
          <Route path="/posts" element={<UploadScreen />} />  {/* 업로드 화면 */}
          <Route path="/upload/tags" element={<TagPickPage />} />

          {/* 게임 */}
          <Route path="/game" element={<FortuneGame />} />

          {/* 기타 */}
          <Route path="/trend" element={<TrendScreen />} />

          {/* 404 */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>

        {/* 하단 네비는 모든 페이지에서 표시 */}
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}


