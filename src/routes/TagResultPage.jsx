// src/pages/TagResultPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostCard from "../components/PostCard";

/** 유틸 */
const API_BASE = import.meta.env?.VITE_API_BASE || "";

function buildUrl(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  });
  return url.toString().replace(window.location.origin, "");
}

function mapItem(d) {
  return {
    id: d.id ?? d.postId,
    title: d.title ?? d.name ?? "제목 없음",
    image_url: d.image_url ?? d.imageUrl ?? d.thumbnail ?? "",
    tags: d.tags ?? d.tagList ?? [],
    likes: d.likes ?? d.likeCount ?? 0,
    created_at: d.created_at ?? d.createdAt ?? d.created ?? null,
  };
}

export default function TagResultPage() {
  const { name = "" } = useParams();
  const tag = decodeURIComponent(name);
  const navigate = useNavigate();

  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // (선택) 인증 헤더가 필요하면 여기서 꺼내 사용
  const authHeader = useMemo(() => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  useEffect(() => {
    if (!tag) {
      setRaw([]);
      setLoading(false);
      return;
    }

    const ac = new AbortController();

    async function fetchByTag() {
      setLoading(true);
      setErr("");
      try {
        const url = buildUrl("/api/posts", { tag, limit: 100 });
        const res = await fetch(url, {
          headers: { "Content-Type": "application/json", ...authHeader },
          credentials: "include",
          signal: ac.signal,
        });
        if (!res.ok) {
          const msg = await res.text().catch(() => "");
          throw new Error(`[${res.status}] ${msg || res.statusText}`);
        }
        const text = await res.text();
        const json = text ? JSON.parse(text) : [];
        setRaw(Array.isArray(json) ? json.map(mapItem) : []);
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || String(e));
      } finally {
        setLoading(false);
      }
    }

    fetchByTag();
    return () => ac.abort();
  }, [tag, authHeader]);

  // 서버가 정렬을 안 해주는 경우 대비: 최신순 정렬
  const posts = useMemo(() => {
    const base = [...raw];
    base.sort((a, b) => {
      const aa = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bb = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bb - aa;
    });
    return base;
  }, [raw]);

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/tags/search");
  };

  return (
    <div
      style={{
        padding: 12,
        maxWidth: 480,
        margin: "0 auto",
        paddingBottom: 90,
      }}
    >
      {/* 상단 바: 뒤로가기 + 태그 칩 */}
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

        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              background: "linear-gradient(180deg, #ffa94d, #ff7d3a)",
              color: "#fff",
              fontWeight: 800,
              boxShadow: "0 6px 14px rgba(255,125,58,0.25)",
              minWidth: 120,
              textAlign: "center",
            }}
          >
            {tag || "태그"}
          </span>
        </div>

        <div style={{ width: 36, height: 36 }} />
      </div>

      {/* 상태/그리드 */}
      {loading && <div>불러오는 중…</div>}
      {err && <div style={{ color: "#c00" }}>에러: {err}</div>}
      {!loading && !err && posts.length === 0 ? (
        <div style={{ opacity: 0.6, textAlign: "center", padding: 24 }}>
          이 태그의 게시물이 아직 없어요
        </div>
      ) : (
        !loading &&
        !err && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
