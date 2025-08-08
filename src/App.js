import FortuneGame from "./components/FortuneGame";
import './App.css';
import { BrowserRouter } from "react-router-dom";

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
        <h1>동만고 🐾</h1>
        <FortuneGame />
      </div>
    </BrowserRouter>
  );
}

export default App;
