// src/pages/TagSearchPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

/**
 * GET /api/tags → ["뚱냥이","치즈냥이", ...]
 * 다른 형태라면 mapTags() 수정
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
  if (Array.isArray(json)) {
    if (json.length === 0) return [];
    if (typeof json[0] === "string") return json;
    return json.map((t) => t.name ?? t.tag ?? String(t));
  }
  return [];
};

export default function TagSearchPage() {
  const [keyword, setKeyword] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const ac = new AbortController();
    async function fetchTags() {
      setLoading(true);
      setErr("");
      try {
        const url = buildUrl("/api/tags");
        const res = await fetch(url, {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
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

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    if (!k) return allTags;
    return allTags.filter((t) => t.toLowerCase().includes(k));
  }, [keyword, allTags]);

  return (
    <div
      style={{
        padding: 16,
        maxWidth: 480,
        margin: "0 auto",
        paddingBottom: 90,
      }}
    >
      {/* 사이트 타이틀 */}
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#2563eb",
          marginBottom: 6,
        }}
      >
        동국대에서 만난 고양이
      </div>

      {/* 제목 + 아이콘 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
          어떤 고양이가 궁금하신가요
        </h2>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="#111" aria-hidden>
          <path d="M3 12c0-4.5 3.5-8 8-8 2.3 0 4.4 1 5.9 2.6l1.5-1.1c.4-.3.9.2.7.6l-.7 1.8c.7.9 1.1 2 1.1 3.1 0 4.5-3.5 8-8 8S3 16.5 3 12z" />
          <circle cx="10" cy="11" r="1.2" fill="#fff" />
          <circle cx="14" cy="11" r="1.2" fill="#fff" />
        </svg>
      </div>

      {/* 검색 입력 */}
      <div
        style={{
          marginTop: 12,
          background: "#f1f5f9",
          borderRadius: 24,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="해시태그를 입력하세요."
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            width: "100%",
            fontSize: 14,
          }}
        />
      </div>

      {/* 결과 */}
      <div
        style={{
          marginTop: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {loading && <div>태그 불러오는 중…</div>}
        {err && <div style={{ color: "#c00" }}>에러: {err}</div>}
        {!loading && !err && filtered.length === 0 ? (
          <div style={{ opacity: 0.6, textAlign: "center", padding: 16 }}>
            해당 키워드를 포함한 태그가 없어요
          </div>
        ) : (
          !loading &&
          !err &&
          filtered.map((tag, idx) => {
            const isOrange = idx % 2 === 0;
            return (
              <Link
                key={tag}
                to={`/tags/${encodeURIComponent(tag)}`}
                style={{
                  display: "block",
                  textDecoration: "none",
                  fontWeight: 700,
                  textAlign: "center",
                  padding: "12px 16px",
                  borderRadius: 16,
                  color: isOrange ? "#fff" : "#111",
                  background: isOrange
                    ? "linear-gradient(180deg, #ffa94d, #ff7d3a)"
                    : "#ffffff",
                  boxShadow: isOrange
                    ? "0 6px 14px rgba(255,125,58,0.25)"
                    : "0 4px 10px rgba(0,0,0,0.06)",
                  border: isOrange ? "none" : "1px solid #eee",
                }}
              >
                #{tag}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
