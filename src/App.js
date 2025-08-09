// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav";

// 너/팀원1
import FortuneGame from "./routes/FortuneGame";
import MainScreen from "./routes/MainScreen";
import UploadScreen from "./routes/UploadScreen";
import SearchScreen from "./routes/SearchScreen";
import TrendScreen from "./routes/TrendScreen";
import LocationScreen from "./routes/LocationScreen";

// 팀원2
import PostDetailPage from "./routes/PostDetailPage";
import PostGridPage from "./routes/PostGridPage";
import MapPage from "./routes/MapPage";
import TagSearchPage from "./routes/TagSearchPage";
import TagResultPage from "./routes/TagResultPage";
import TagPickPage from "./routes/TagPickPage";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ paddingBottom: 90 }}>
        <Routes>
          {/* 홈 */}
          <Route path="/" element={<MainScreen />} />

          {/* 지도 */}
          <Route path="/map" element={<MapPage />} />
          <Route path="/location" element={<LocationScreen />} />

          {/* 인기/그리드 */}
          <Route path="/popular" element={<PostGridPage mode="popular" />} />

          {/* 태그 검색/결과/선택 */}
          <Route path="/tags" element={<TagSearchPage />} />
          <Route path="/tags/search" element={<TagSearchPage />} />
          <Route path="/tags/:name" element={<TagResultPage />} />
          <Route path="/tags/pick" element={<TagPickPage />} />   {/* 태그 선택 페이지 */}
          <Route path="/upload/tags" element={<TagPickPage />} /> {/* 호환용 경로(선택) */}

          {/* 상세 */}
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/posts/:postId" element={<PostDetailPage />} />

          {/* 업로드 */}
          <Route path="/posts" element={<UploadScreen />} />

          {/* 게임 */}
          <Route path="/game" element={<FortuneGame />} />

          {/* 404 */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>

        <Nav />
      </div>
    </BrowserRouter>
  );
}
