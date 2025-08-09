import { BrowserRouter, Routes, Route } from "react-router-dom";

// 네 파일
import FortuneGame from "./routes/FortuneGame";

// 팀원 파일
import MainScreen from "./routes/MainScreen";
import UploadScreen from "./routes/UploadScreen";
import SearchScreen from "./routes/SearchScreen";
import TrendScreen from "./routes/TrendScreen";
import LocationScreen from "./routes/LocationScreen";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 홈은 팀원 메인으로 */}
        <Route path="/" element={<MainScreen />} />

        {/* 네 게임 페이지는 /game */}
        <Route path="/game" element={<FortuneGame />} />

        {/* 팀원 라우트들 */}
        <Route path="/posts" element={<UploadScreen />} />
        <Route path="/posts/:postId" element={<h1>Test Page</h1>} />
        <Route path="/tags" element={<SearchScreen />} />
        <Route path="/trend" element={<TrendScreen />} />
        <Route path="/location" element={<LocationScreen />} />

        {/* 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}


