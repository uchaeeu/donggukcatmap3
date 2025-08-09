// src/routes/PostGridPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import styles from "../styles/Container.module.css";

/** CRA용 환경변수 (.env에 REACT_APP_API_BASE= http://localhost:3000 등) */
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3000";

function buildUrl(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  });
  return url.toString();
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

export default function PostGridPage({ mode }) {
  const { name } = useParams(); // /tags/:name
  const decodedTag = name ? decodeURIComponent(name) : "";

  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const authHeader = useMemo(() => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  useEffect(() => {
    const ac = new AbortController();

    async function fetchList() {
      setLoading(true);
      setErr("");
      try {
        const url =
          mode === "popular"
            ? buildUrl("/api/posts/trend", { limit: 100 })
            : buildUrl("/api/posts/by-tag", { tag: decodedTag, limit: 100 });

        const res = await fetch(url, {
          headers: { Accept: "application/json", "Content-Type": "application/json", ...authHeader },
          signal: ac.signal,
        });

        const ct = res.headers.get("content-type") || "";
        if (!res.ok || !ct.includes("application/json")) {
          const txt = await res.text().catch(() => "");
          throw new Error(`[${res.status}] ${txt || "Invalid response"}`);
        }

        const json = await res.json();
        const mapped = Array.isArray(json) ? json.map(mapItem) : [];
        setRaw(mapped);
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || String(e));
      } finally {
        setLoading(false);
      }
    }

    fetchList();
    return () => ac.abort();
  }, [mode, decodedTag, authHeader]);

  // 서버 미지원 대비해서 클라 보정
  const posts = useMemo(() => {
    let base = [...raw];
    if (mode === "popular") {
      base = base.filter((p) => (p.likes ?? 0) >= 10);
    } else {
      base = decodedTag ? base.filter((p) => (p.tags || []).includes(decodedTag)) : [];
    }
    base.sort((a, b) => {
      const aa = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bb = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bb - aa;
    });
    return base;
  }, [raw, mode, decodedTag]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.cardContainer}>
        {/* 상단 타이틀 */}
        {mode === "popular" ? (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#2563eb", marginBottom: 0 }}>
              동국대에서 만난 고양이
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: 30, fontWeight: 800, margin: 0 }}>인기 게시글</h2>
              <svg
                width="24" height="24" viewBox="0 0 24 24"
                fill="#ef4444" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden
              >
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z"></path>
              </svg>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#2563eb", marginBottom: 4 }}>
              동국대에서 만난 고양이
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
              태그: {decodedTag || "(선택한 태그 없음)"}
            </h2>
          </div>
        )}

        {/* 리스트/상태 */}
        {loading && <div>불러오는 중…</div>}
        {err && <div style={{ color: "#c00" }}>에러: {err}</div>}
        {!loading && !err && posts.length === 0 ? (
          <div style={{ opacity: 0.6 }}>결과가 없어요</div>
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
    </div>
  );
}
