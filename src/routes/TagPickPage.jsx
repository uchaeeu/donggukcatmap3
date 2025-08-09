// src/pages/TagPickPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * 예상 엔드포인트
 * GET /api/tags  -> ["뚱냥이","치즈냥이", ...]
 * 응답 형태가 다르면 아래 mapTags()에서 맞춰줘.
 */
const API_BASE = import.meta.env?.VITE_API_BASE || "";

function buildUrl(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  });
  return url.toString().replace(window.location.origin, "");
}
const mapTags = (json) => {
  // 문자열 배열 또는 객체 배열 모두 대응
  if (Array.isArray(json)) {
    if (json.length === 0) return [];
    if (typeof json[0] === "string") return json;
    // 예: [{name:"치즈냥이"}] 형태
    return json.map((t) => t.name ?? t.tag ?? String(t));
  }
  return [];
};

export default function TagPickPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 업로드 화면 등에서 돌아온 경우, 전달받은 초기 선택값(state.tags)을 반영
  const initialSelected = Array.isArray(location.state?.tags)
    ? location.state.tags
    : [];

  const [allTags, setAllTags] = useState([]);
  const [selected, setSelected] = useState(initialSelected);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // 태그 목록 가져오기
  useEffect(() => {
    const ac = new AbortController();
    async function fetchTags() {
      setLoading(true);
      setErr("");
      try {
        const url = buildUrl("/api/tags");
        const res = await fetch(url, {
          headers: { "Content-Type": "application/json" },
          credentials: "include", // 필요 없으면 제거
          signal: ac.signal,
        });
        if (!res.ok) {
          const msg = await res.text().catch(() => "");
          throw new Error(`[${res.status}] ${msg || res.statusText}`);
        }
        const text = await res.text();
        const json = text ? JSON.parse(text) : [];
        setAllTags(mapTags(json));
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || String(e));
      } finally {
        setLoading(false);
      }
    }
    fetchTags();
    return () => ac.abort();
  }, []);

  // 보기 좋은 순서(선택된 태그를 위로)
  const orderedTags = useMemo(() => {
    const sel = allTags.filter((t) => selected.includes(t));
    const rest = allTags.filter((t) => !selected.includes(t));
    return [...sel, ...rest];
  }, [allTags, selected]);

  const toggle = (tag) => {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/upload"); // 히스토리 없으면 업로드 페이지로
  };

  const confirm = () => {
    navigate("/upload", { state: { tags: selected } });
  };

  return (
    <div
      style={{
        padding: 12,
        maxWidth: 480,
        margin: "0 auto",
        paddingBottom: 140,
      }}
    >
      {/* 상단 뒤로가기 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <button
          onClick={goBack}
          aria-label="뒤로가기"
          style={{
            width: 36,
            height: 36,
            border: "none",
            background: "#fff",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
            cursor: "pointer",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#333"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      {/* 상태 표시 */}
      {loading && <div>태그 불러오는 중…</div>}
      {err && <div style={{ color: "#c00" }}>에러: {err}</div>}

      {/* 리스트 (주황/흰색 번갈이, 선택되면 주황 + 체크 표시) */}
      {!loading && !err && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {orderedTags.length === 0 ? (
            <div style={{ opacity: 0.6 }}>사용 가능한 태그가 없어요</div>
          ) : (
            orderedTags.map((tag, idx) => {
              const isSelected = selected.includes(tag);
              const isOrangeRow = idx % 2 === 0;

              const bg = isSelected
                ? "linear-gradient(180deg, #ffa94d, #ff7d3a)"
                : isOrangeRow
                ? "linear-gradient(180deg, #ffa94d, #ff7d3a)"
                : "#ffffff";

              const color = isSelected ? "#fff" : isOrangeRow ? "#fff" : "#111";
              const border = isSelected ? "none" : isOrangeRow ? "none" : "1px solid #eee";
              const shadow = isSelected
                ? "0 6px 14px rgba(255,125,58,0.25)"
                : isOrangeRow
                ? "0 6px 14px rgba(255,125,58,0.25)"
                : "0 4px 10px rgba(0,0,0,0.06)";

              return (
                <button
                  key={tag}
                  onClick={() => toggle(tag)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    borderRadius: 16,
                    fontWeight: 800,
                    background: bg,
                    color,
                    border,
                    boxShadow: shadow,
                    cursor: "pointer",
                  }}
                >
                  <span>#{tag}</span>
                  {isSelected && (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}

      {/* 하단 고정 '선택하기 →' 버튼 */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 90, // BottomNav 위에 겹치지 않게
          display: "flex",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <button
          onClick={confirm}
          disabled={selected.length === 0}
          style={{
            minWidth: 200,
            padding: "12px 18px",
            borderRadius: 16,
            background:
              selected.length === 0
                ? "#f2f2f2"
                : "linear-gradient(180deg, #ffa94d, #ff7d3a)",
            color: selected.length === 0 ? "#999" : "#fff",
            fontWeight: 800,
            border: "none",
            boxShadow:
              selected.length === 0 ? "none" : "0 12px 24px rgba(255,125,58,0.35)",
            cursor: selected.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          선택하기 →
        </button>
      </div>
    </div>
  );
}
