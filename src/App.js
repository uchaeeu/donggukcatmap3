import { BrowserRouter, Routes, Route } from "react-router-dom";
import FortuneGame from "./routes/FortuneGame";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div
        className="App"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/images/screen.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <Routes>
          <Route path="/" element={<FortuneGame />} />
          {/* 여기에 다른 팀원들의 페이지들을 추가할 수 있습니다 */}
          {/* 예: <Route path="/other-page" element={<OtherPage />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
