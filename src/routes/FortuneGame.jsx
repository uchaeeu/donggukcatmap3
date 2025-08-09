import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const cats = [
  {
    name: "치즈냥이",
    src: process.env.PUBLIC_URL + "/images/cat-yellow.png",
    fortunes: [
      "🍀 오늘은 기분 좋은 일이 가능할 거예요! 🍀",
      "✨ 행운이 가득한 하루가 될 거예요! ✨",
      "🌟 작은 기적이 당신을 찾아올 거예요! 🌟",
      "🎉 오늘 하루는 특별한 선물이 기다리고 있어요! 🎉",
      "💫 긍정적인 에너지가 가득한 하루가 될 거예요! 💫",
      "🎊 예상치 못한 좋은 소식이 들릴 거예요! 🎊",
      "🌈 무지개 같은 아름다운 하루가 될 거예요! 🌈",
      "⭐ 오늘은 모든 것이 순조롭게 진행될 거예요! ⭐"
    ]
  },
  {
    name: "까망냥이",
    src: process.env.PUBLIC_URL + "/images/cat-black.png",
    fortunes: [
      "작은 실수도 웃고 넘기면 복이 와요! 🐾",
      "😄 웃음이 가득한 하루가 될 거예요! 😄",
      "🎭 재미있는 일들이 연속으로 일어날 거예요! 🎭",
      "🎪 오늘은 마치 서커스 같은 신나는 하루! 🎪",
      "🎨 창의적인 아이디어가 떠오를 거예요! 🎨",
      "🎯 예상치 못한 재미있는 만남이 있을 거예요! 🎯",
      "🎪 오늘은 마치 축제 같은 분위기! 🎪",
      "🎭 웃음이 가득한 하루가 될 거예요! 🎭"
    ]
  },
  {
    name: "녹차냥이",
    src: process.env.PUBLIC_URL + "/images/cat-green.png",
    fortunes: [
      "🌙 오늘 날 좋은 꿈과 영감이 함께할 거예요!",
      "🌸 아름다운 꽃처럼 피어날 거예요! 🌸",
      "🌿 자연의 힘으로 마음이 치유될 거예요! 🌿",
      "🌺 새로운 시작의 기운이 가득해요! 🌺",
      "🌼 평화로운 마음으로 하루를 보낼 수 있을 거예요! 🌼",
      "🌻 따뜻한 햇살 같은 기운이 가득할 거예요! 🌻",
      "🌷 아름다운 영감이 떠오를 거예요! 🌷",
      "🌱 새로운 성장의 계절이 시작될 거예요! 🌱"
    ]
  }
];

/* ✅ 추가: 스마트폰 프레임 고정 값 */
const BASE_W = 375;
const BASE_H = 812;

function Fortune() {
  const navigate = useNavigate();

  /* ✅ 추가: 데스크톱에서 폰 프레임 확대/축소 */
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => {
      const s = Math.min(window.innerWidth / BASE_W, window.innerHeight / BASE_H);
      setScale(s);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const [showModal, setShowModal] = useState(true);
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedFortune, setSelectedFortune] = useState("");
  const [showFortune, setShowFortune] = useState(false);

  const handleReveal = () => setShowModal(false);

  const handleClick = (cat) => {
    if (!selectedCat) {
      const randomIndex = Math.floor(Math.random() * cat.fortunes.length);
      const randomFortune = cat.fortunes[randomIndex];
      setSelectedCat(cat);
      setSelectedFortune(randomFortune);
      setTimeout(() => setShowFortune(true), 1000);
    }
  };

  return (
    /* ✅ stage: 브라우저 전체 (폰 프레임 중앙 배치) */
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F8EEE4",
        overflow: "hidden",
      }}
    >
      {/* ✅ phone: 375×812 고정, scale로 확대/축소 */}
      <div
        style={{
          width: BASE_W,
          height: BASE_H,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          position: "relative",
          backgroundImage: `url(${process.env.PUBLIC_URL}/images/screen.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px 16px",
            boxSizing: "border-box",
          }}
        >
          {/* 뒤로 가기 버튼 */}
          <div style={{ position: "absolute", top: 24, left: 24, zIndex: 10000 }}>
            <motion.img
              src={process.env.PUBLIC_URL + "/images/back-button.png"}
              alt="뒤로 가기"
              style={{
                width: 44,
                height: 44,
                cursor: "pointer",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: 10,
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (window.history.length > 1) navigate(-1);
                else navigate("/");
              }}
            />
          </div>

          {/* 모달 (그대로) */}
          {showModal && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10001,
              }}
            >
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "24px",
                  borderRadius: "26px",
                  textAlign: "center",
                  width: 280,
                  maxWidth: "100%",
                }}
              >
                <h2 style={{ fontSize: 20, margin: 10 }}>오늘 나의 운세는 어떨까?</h2>
                <button
                  onClick={handleReveal}
                  style={{
                    marginTop: 10,
                    padding: "14px 24px",
                    backgroundColor: "#FFB366",
                    border: "none",
                    borderRadius: 15,
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: 18,
                    cursor: "pointer",
                    width: "80%",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  확인하러 가기
                </button>
              </div>
            </div>
          )}

          {/* 고양이 선택 (그대로) */}
          {!showModal && !selectedCat && (
            <>
              <h2 style={{ margin: "0 0 12px", fontSize: 22, fontWeight: "normal" }}>
                🐱 오늘의 고양이를 선택하세요! 🐱
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {cats.map((cat, i) => (
                  <motion.div
                    key={i}
                    style={{
                      width: 200,
                      height: 200,
                      borderRadius: 15,
                      overflow: "hidden",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      backgroundColor: "#fff",
                      padding: 5,
                    }}
                    onClick={() => handleClick(cat)}
                    whileTap={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    layoutId={
                      selectedCat && selectedCat.name === cat.name ? "selectedCat" : undefined
                    }
                  >
                    <img
                      src={cat.src}
                      alt={cat.name}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* 선택된 고양이 + 운세 (개선) */}
          {selectedCat && (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* 카드에서 확대 상태로 자연스럽게 변형되도록 layoutId는 컨테이너에 */}
              <motion.div
                layoutId="selectedCat"
                transition={{ type: "spring", stiffness: 260, damping: 24, mass: 0.8 }}
                style={{
                  width: 260,
                  height: 260,
                  borderRadius: 20,
                  background: "#fff",
                  overflow: "hidden",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 32, // ✅ 이미지-텍스트 간격
                  willChange: "transform",
                }}
              >
                <motion.img
                  src={selectedCat.src}
                  alt={selectedCat.name}
                  style={{ width: "88%", height: "88%", objectFit: "contain" }}
                  initial={{ opacity: 0.85, scale: 0.98, y: 6 }}  // ✅ 튀지 않게 살짝만
                  animate={{ opacity: 1, scale: 1.06, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24, mass: 0.8 }}
                />
              </motion.div>

              <AnimatePresence>
                {showFortune && (
                  <motion.div
                    style={{ textAlign: "center" }}
                    initial={{ opacity: 0, y: 24, scale: 1.02 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.35, ease: "easeOut", delay: 0.35 }}
                  >
                    {/* 🔎 ~ 의 운세: */}
                    <motion.p
                      style={{ fontSize: 20, fontWeight: 400, marginBottom: 12 }}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: 0.45 }}
                    >
                      🔎 <strong>{selectedCat.name}</strong> 의 운세:
                    </motion.p>

                    {/* 운세 본문 */}
                    <motion.p
                      style={{ fontSize: 20, lineHeight: 1.5, padding: "0 8px" }}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.38, delay: 0.55 }}
                      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                    >
                      {selectedFortune}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Fortune;

