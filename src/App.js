import { BrowserRouter, Routes, Route } from "react-router-dom";
import FortuneGame from "./routes/FortuneGame";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FortuneGame />} />
        {/* 여기에 다른 팀원들의 페이지들을 추가할 수 있습니다 */}
        {/* 예: <Route path="/other-page" element={<OtherPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
