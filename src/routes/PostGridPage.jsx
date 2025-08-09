// src/pages/PostGridPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";

/**
 * 예상 엔드포인트
 * GET /api/posts?tag={name}&popular=1
 *  - 쿼리는 백엔드가 지원하면 서버에서 필터링
 *  - 미지원이어도 클라이언트에서 한 번 더 필터링해 안전하게 동작
 *
 * 응답 필드명이 다르면 mapItem()에서 맞춰줘.
 */
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
    // 필요한 필드는 더 매핑 가능
  };
}

export default function PostGridPage({ mode }) {
  const { name } = useParams(); // /tags/:name
  const decodedTag = name ? decodeURIComponent(name) : "";

  const [raw, setRaw] = useState([]);      // 가져온 원본(매핑 후)
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // (선택) 토큰 쓰면 공통 헤더 구성
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
        const url = buildUrl("/api/posts", {
          tag: mode === "byTag" ? decodedTag : undefined,
          popular: mode === "popular" ? 1 : undefined,
          limit: 100,
        });
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

  // 서버가 쿼리 필터를 지원하지 않는 경우를 대비해 클라이언트에서도 한 번 더 필터링/정렬
  const posts = useMemo(() => {
    let base = [...raw];

    if (mode === "popular") {
      // 기준치(예: 10)는 필요하면 조정
      base = base.filter((p) => (p.likes ?? 0) >= 10);
    } else if (mode === "byTag") {
      base = decodedTag ? base.filter((p) => (p.tags || []).includes(decodedTag)) : [];
    }

    // 최신순 정렬 (created_at이 없으면 그대로 둠)
    base.sort((a, b) => {
      const aa = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bb = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bb - aa;
    });

    return base;
  }, [raw, mode, decodedTag]);

  return (
    <div
      style={{
        padding: 16,
        maxWidth: 480,
        margin: "0 auto",
        paddingBottom: 90,
      }}
    >
      {/* 상단 타이틀 영역 */}
      {mode === "popular" ? (
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#2563eb",
              marginBottom: 4,
            }}
          >
            동국대에서 만난 고양이
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>인기 게시글</h2>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#ef4444"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z"></path>
            </svg>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#2563eb",
              marginBottom: 4,
            }}
          >
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
  );
}
