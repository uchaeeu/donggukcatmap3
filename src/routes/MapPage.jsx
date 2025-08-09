// routes/MapPage.jsx
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";


const API_BASE = import.meta.env?.VITE_API_BASE || ""; // Vite면 .env에서 주입 가능

function buildUrl(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  });
  return url.toString().replace(window.location.origin, ""); // 상대경로 유지
}

// 백엔드 필드명이 다르면 여기서 변환
function mapField(item) {
  return {
    id: item.id ?? item.postId,
    title: item.title ?? item.name ?? "제목 없음",
    lat: item.lat ?? item.latitude,
    lng: item.lng ?? item.longitude,
    thumbnail: item.thumbnail ?? item.imageUrl,
  };
}

export default function MapPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // (선택) 토큰 쓰면 여기서 꺼내 공통 헤더로 보냄
  const authHeader = useMemo(() => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  useEffect(() => {
    const ac = new AbortController();

    async function fetchPosts() {
      setLoading(true);
      setErr("");
      try {
        const url = buildUrl("/api/posts", { limit: 50 }); // <- 엔드포인트 맞게 수정
        const res = await fetch(url, {
          headers: { "Content-Type": "application/json", ...authHeader },
          credentials: "include", // 쿠키 기반이면 유지, 아니면 지워도 됨
          signal: ac.signal,
        });
        if (!res.ok) {
          const msg = await res.text().catch(() => "");
          throw new Error(`[${res.status}] ${msg || res.statusText}`);
        }
        const text = await res.text();
        const json = text ? JSON.parse(text) : [];
        setPosts(Array.isArray(json) ? json.map(mapField) : []);
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || String(e));
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
    return () => ac.abort();
  }, [authHeader]);

  return (
    <div
      style={{
        padding: 12,
        height: "calc(100vh - 110px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        background: "#f7f8fb",
        borderRadius: 16,
        margin: 12,
        overflow: "hidden",
        gap: 12,
      }}
    >
      {/* 지도 영역(팀원이 붙일 부분). 지금은 자리만 확보 */}
      <div
        style={{
          height: "55%",
          background: "white",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #e9ecf2",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 style={{ margin: 0 }}>지도 컴포넌트 자리</h2>
          <p style={{ opacity: 0.7, marginTop: 6 }}>
            (핀 데이터는 아래 API 결과를 사용)
          </p>
        </div>
      </div>

      {/* 목록 영역: API 결과를 확인/클릭 이동 */}
      <div
        style={{
          flex: 1,
          background: "white",
          borderRadius: 12,
          border: "1px solid #e9ecf2",
          overflow: "auto",
          padding: 12,
        }}
      >
        {loading && <p>불러오는 중…</p>}
        {err && <p style={{ color: "#d33" }}>에러: {err}</p>}
        {!loading && !err && posts.length === 0 && <p>주변 포스트가 없어요.</p>}

        {!loading && !err && posts.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {posts.map((p) => (
              <li
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 4px",
                  borderBottom: "1px solid #f0f2f6",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                    background: "#f4f6fb",
                    overflow: "hidden",
                    flex: "0 0 44px",
                  }}
                >
                  {p.thumbnail ? (
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        color: "#94a3b8",
                      }}
                    >
                      N/A
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link
                    to={`/post/${p.id}`}
                    style={{ fontWeight: 600, color: "#0f172a", textDecoration: "none" }}
                  >
                    {p.title}
                  </Link>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                    {p.lat && p.lng ? `(${p.lat.toFixed?.(4)}, ${p.lng.toFixed?.(4)})` : "좌표 없음"}
                  </div>
                </div>

                {/* 추후: 핀 강조/이동 등 액션 버튼 영역 */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
