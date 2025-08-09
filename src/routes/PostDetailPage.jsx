// src/pages/PostDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

/**
 * 예상 엔드포인트 (필요 시 수정)
 * GET   /api/posts/:id           → 게시물 상세
 * POST  /api/posts/:id/like      → 좋아요 +1
 * POST  /api/posts/:id/report    → 신고 +1
 *
 * 응답 필드명이 다르면 아래 mapField()에서 맞춰주면 됨.
 */
const API_BASE = import.meta.env?.VITE_API_BASE || "";

function buildUrl(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  });
  return url.toString().replace(window.location.origin, "");
}

// 백엔드 필드 → UI 필드 매핑
function mapField(d) {
  return {
    id: d.id ?? d.postId,
    title: d.title ?? d.name ?? "제목 없음",
    image_url: d.image_url ?? d.imageUrl ?? d.thumbnail ?? "",
    description: d.description ?? d.content ?? "",
    tags: d.tags ?? d.tagList ?? [],
    likes: d.likes ?? d.likeCount ?? 0,
    reports: d.reports ?? d.reportCount ?? 0,
  };
}

export default function PostDetailPage() {
  const { id } = useParams();
  const postId = Number(id);
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [reports, setReports] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // (선택) 인증 토큰 쓰면 공통 헤더
  const authHeader = useMemo(() => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  useEffect(() => {
    if (!postId) return;
    const ac = new AbortController();

    async function fetchDetail() {
      setLoading(true);
      setErr("");
      try {
        const url = buildUrl(`/api/posts/${postId}`);
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
        const json = text ? JSON.parse(text) : null;
        const mapped = json ? mapField(json) : null;
        setPost(mapped);
        setLikes(mapped?.likes ?? 0);
        setReports(mapped?.reports ?? 0);
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || String(e));
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
    return () => ac.abort();
  }, [postId, authHeader]);

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/map");
  };

  // 좋아요/신고 낙관적 업데이트
  const sendAction = async (type) => {
    const url = buildUrl(`/api/posts/${postId}/${type}`);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        credentials: "include",
        body: JSON.stringify({ id: postId }),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(`[${res.status}] ${msg || res.statusText}`);
      }
    } catch (e) {
      // 실패 시 롤백
      if (type === "like") setLikes((n) => Math.max(0, n - 1));
      if (type === "report") setReports((n) => Math.max(0, n - 1));
      console.error(e);
      alert("요청이 실패했어요. 잠시 후 다시 시도해 주세요.");
    }
  };

  const onLike = () => {
    setLikes((n) => n + 1);
    sendAction("like");
  };
  const onReport = () => {
    setReports((n) => n + 1);
    sendAction("report");
  };

  if (loading) return <div style={{ padding: 12 }}>불러오는 중…</div>;
  if (err) return <div style={{ padding: 12, color: "#c00" }}>에러: {err}</div>;
  if (!post) return <div style={{ padding: 12 }}>게시물을 찾을 수 없어요 😢</div>;

  return (
    <div
      style={{
        padding: 12,
        maxWidth: 480,
        margin: "0 auto",
        paddingBottom: 90,
      }}
    >
      {/* 상단 이미지 영역 */}
      <div style={{ position: "relative" }}>
        {/* 뒤로가기 버튼 */}
        <button
          onClick={goBack}
          aria-label="뒤로가기"
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            width: 36,
            height: 36,
            border: "none",
            background: "#fff",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
            cursor: "pointer",
          }}
        >
          {/* ← 아이콘 */}
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

        <img
          src={post.image_url || ""}
          alt={post.title}
          onError={(e) => (e.currentTarget.style.display = "none")}
          style={{
            width: "100%",
            height: 280,
            objectFit: "cover",
            borderRadius: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        />

        {/* 좋아요 버튼 (이미지 우하단) */}
        <button
          onClick={onLike}
          style={{
            position: "absolute",
            right: 12,
            bottom: 12,
            border: "none",
            background: "#fff",
            borderRadius: 20,
            padding: "8px 10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            cursor: "pointer",
          }}
          aria-label="좋아요"
        >
          ❤️ {likes}
        </button>
      </div>

      {/* 제목/메타 */}
      <h2
        style={{
          marginTop: 12,
          marginBottom: 6,
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        {post.title}
      </h2>
      <p style={{ color: "#555", fontSize: 14 }}>❤️ 받은 좋아요 수 {likes}</p>

      {/* 코멘트 */}
      <div
        style={{
          marginTop: 12,
          padding: 12,
          borderRadius: 12,
          background: "#f5f5f7",
          color: "#333",
          minHeight: 60,
        }}
      >
        {post.description}
      </div>

      {/* 태그 */}
      <div style={{ marginTop: 16, fontWeight: 700 }}>태그</div>
      <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
        {(post.tags || []).map((t) => (
          <span
            key={t}
            style={{
              fontSize: 12,
              background: "#eef6ff",
              color: "#0b69ff",
              padding: "6px 10px",
              borderRadius: 999,
            }}
          >
            #{t}
          </span>
        ))}
      </div>

      {/* 신고하기 */}
      <div style={{ marginTop: 18, textAlign: "right" }}>
        <button
          onClick={onReport}
          style={{
            border: "none",
            background: "#ffe8e8",
            color: "#e11",
            padding: "8px 12px",
            borderRadius: 12,
            cursor: "pointer",
          }}
        >
          🚨 신고하기 ({reports})
        </button>
      </div>
    </div>
  );
}
