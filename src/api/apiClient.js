// src/api/apiClient.js
export const API_BASE = import.meta.env?.VITE_API_BASE || "";

// 쿼리스트링 유틸
export function buildUrl(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  });
  // 상대경로 유지 (프록시 사용할 때 유용)
  return url.toString().replace(window.location.origin, "");
}

export async function api(path, { method = "GET", body, headers, signal } = {}) {
  const token = localStorage.getItem("access_token"); // 없으면 자동 무시
  const res = await fetch(path.startsWith("http") ? path : buildUrl(path), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include", // 쿠키 인증이면 유지, 아니라면 지워도 됨
    signal,
  });

  if (!res.ok) {
    let msg = "";
    try { msg = await res.text(); } catch {}
    throw new Error(`[${res.status}] ${msg || res.statusText}`);
  }

  // 204 등 빈 응답 처리
  const text = await res.text().catch(() => "");
  return text ? JSON.parse(text) : null;
}
