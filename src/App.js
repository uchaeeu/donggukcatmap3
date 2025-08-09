import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

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
/*import BottomNav from "./components/BottomNav";*/

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ paddingBottom: 90 }}>
        <Routes>
          {/* ✅ 홈을 업로드 화면으로 */}
          <Route path="/" element={<MainScreen />} />

          {/* 지도 */}
          <Route path="/map" element={<MapPage />} />
          <Route path="/location" element={<LocationScreen />} />

          {/* 인기/그리드 */}
          <Route path="/popular" element={<PostGridPage mode="popular" />} />

          {/* 태그 */}
          <Route path="/tags" element={<TagSearchPage />} />
          <Route path="/tags/search" element={<TagSearchPage />} />
          <Route path="/tags/:name" element={<TagResultPage />} />

          {/* 상세 */}
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/posts/:postId" element={<PostDetailPage />} />

          {/* 업로드 별칭(원래 경로도 살려두고 싶으면 유지) */}
          <Route path="/posts" element={<UploadScreen />} />
          <Route path="/upload/tags" element={<TagPickPage />} />

          {/* 게임 */}
          <Route path="/game" element={<FortuneGame />} />

          {/* 404 */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>

        
      </div>
    </BrowserRouter>
  );
}
