// src/pages/TagPickPage.jsx
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ALL_TAGS = [
  '뚱냥이',
  '치즈냥이',
  '깜둥이',
  '동국이',
  '캠퍼스냥',
  '길냥이',
  '졸고있는냥',
  '까칠냥',
  '검은고양이',
  '검은냥이',
  '검정고양이',
];

export default function TagPickPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  // 보기 좋은 순서로 정렬(선택된 건 위로 올려주면 UX 좋음)
  const orderedTags = useMemo(() => {
    const sel = ALL_TAGS.filter((t) => selected.includes(t));
    const rest = ALL_TAGS.filter((t) => !selected.includes(t));
    return [...sel, ...rest];
  }, [selected]);

  const toggle = (tag) => {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/upload'); // 히스토리 없으면 업로드 페이지로
  };

  const confirm = () => {
    // 업로드 페이지로 "선택된 태그들"을 state로 넘김
    navigate('/upload', { state: { tags: selected } });
  };

  return (
    <div
      style={{
        padding: 12,
        maxWidth: 480,
        margin: '0 auto',
        paddingBottom: 140,
      }}
    >
      {/* 상단 뒤로가기 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
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
            border: 'none',
            background: '#fff',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
            cursor: 'pointer',
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

      {/* 리스트 (주황/흰색 번갈이, 선택되면 주황 + 체크 표시) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {orderedTags.map((tag, idx) => {
          const isSelected = selected.includes(tag);
          const isOrangeRow = idx % 2 === 0;

          const bg = isSelected
            ? 'linear-gradient(180deg, #ffa94d, #ff7d3a)'
            : isOrangeRow
            ? 'linear-gradient(180deg, #ffa94d, #ff7d3a)'
            : '#ffffff';

          const color = isSelected ? '#fff' : isOrangeRow ? '#fff' : '#111';
          const border = isSelected ? 'none' : isOrangeRow ? 'none' : '1px solid #eee';
          const shadow = isSelected
            ? '0 6px 14px rgba(255,125,58,0.25)'
            : isOrangeRow
            ? '0 6px 14px rgba(255,125,58,0.25)'
            : '0 4px 10px rgba(0,0,0,0.06)';

          return (
            <button
              key={tag}
              onClick={() => toggle(tag)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: 16,
                fontWeight: 800,
                background: bg,
                color,
                border,
                boxShadow: shadow,
                cursor: 'pointer',
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
        })}
      </div>

      {/* 하단 고정 '선택하기 →' 버튼 (하단 네비 위에 떠있게) */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 90, // BottomNav 위에 겹치지 않게
          display: 'flex',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        <button
          onClick={confirm}
          disabled={selected.length === 0}
          style={{
            minWidth: 200,
            padding: '12px 18px',
            borderRadius: 16,
            background:
              selected.length === 0
                ? '#f2f2f2'
                : 'linear-gradient(180deg, #ffa94d, #ff7d3a)',
            color: selected.length === 0 ? '#999' : '#fff',
            fontWeight: 800,
            border: 'none',
            boxShadow:
              selected.length === 0 ? 'none' : '0 12px 24px rgba(255,125,58,0.35)',
            cursor: selected.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          선택하기 →
        </button>
      </div>
    </div>
  );
}