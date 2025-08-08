import React, { useState } from "react";
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
  },
];

function Fortune() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedFortune, setSelectedFortune] = useState("");
  const [showFortune, setShowFortune] = useState(false);

  const handleReveal = () => {
    setShowModal(false);
  };

  const handleClick = (cat) => {
    if (!selectedCat) {
      // 랜덤으로 운세 선택
      const randomIndex = Math.floor(Math.random() * cat.fortunes.length);
      const randomFortune = cat.fortunes[randomIndex];
      
      setSelectedCat(cat);
      setSelectedFortune(randomFortune);
      
      // 1초 후에 운세 텍스트 표시
      setTimeout(() => {
        setShowFortune(true);
      }, 1000);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* 뒤로 가기 버튼 - 이미지 내부 왼쪽 상단에 배치 */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          left: "10px",
          zIndex: 10000,
        }}
      >
        <motion.img
          src={process.env.PUBLIC_URL + "/images/back-button.png"}
          alt="뒤로 가기"
          style={{
            width: "40px",
            height: "40px",
            cursor: "pointer",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
            transition: "transform 0.2s ease",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "8px",
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate('/');
            }
          }}
        />
      </div>

      {/* 모달 */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: "16px",
              textAlign: "center",
              width: "350px",
              maxWidth: "90vw",
            }}
          >
            <h2 style={{ fontSize: "1.8rem" }}>오늘 나의 운세는 어떨까?</h2>
            <button
              onClick={handleReveal}
              style={{
                marginTop: "1rem",
                padding: "1rem 1.5rem",
                backgroundColor: "#FFB366",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1.5rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              확인하러 가기
            </button>
          </div>
        </div>
      )}

      {/* 고양이 선택 */}
      {!showModal && !selectedCat && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            paddingTop: "2rem",
            position: "relative",
          }}
        >
          <h2 style={{ marginBottom: "2.5rem", fontSize: "1.8rem", fontWeight: "normal" }}>
            🐱 오늘의 고양이를 선택하세요! 🐱
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {cats.map((cat, i) => (
              <motion.div
                key={i}
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  backgroundColor: "#fff",
                  padding: "0.5rem",
                }}
                onClick={() => handleClick(cat)}
                whileTap={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
                layoutId={selectedCat && selectedCat.name === cat.name ? "selectedCat" : undefined}
              >
                <img
                  src={cat.src}
                  alt={cat.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 선택된 고양이 크기조정 + 운세 */}
      {selectedCat && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            paddingTop: "6rem",
            position: "relative",
          }}
        >
          {/* 고양이 이미지 */}
          <motion.img
            src={selectedCat.src}
            alt={selectedCat.name}
            style={{ 
              width: "250px", 
              height: "250px", 
              objectFit: "contain",
              marginBottom: "4rem",
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1.3,
              opacity: 1,
            }}
            transition={{ 
              duration: 1.2,
              ease: "easeOut",
            }}
            layoutId="selectedCat"
          />

          {/* 운세 텍스트 */}
          <AnimatePresence>
            {showFortune && (
              <motion.div 
                style={{ textAlign: "center" }}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.8,
                  ease: "easeOut",
                  delay: 0.5
                }}
              >
                <motion.p 
                  style={{ fontSize: "1.5rem", fontWeight: "normal", marginBottom: "1rem" }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  🔎 <strong>{selectedCat.name}</strong>의 운세:
                </motion.p>
                <motion.p 
                  style={{ fontSize: "1.5rem" }}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                >
                  {selectedFortune}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default Fortune;
