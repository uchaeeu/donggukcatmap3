// src/routes/TagSearchPage.jsx
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Container.module.css'; // ★ 폰 프레임 CSS

const ALL_TAGS = [
  '뚱냥이','치즈냥이','깜둥이','동국이','캠퍼스냥','길냥이',
  '졸고있는냥','까칠냥','검은고양이','검은냥이','검정고양이',
];

export default function TagSearchPage() {
  const [keyword, setKeyword] = useState('');

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    if (!k) return ALL_TAGS;
    return ALL_TAGS.filter((t) => t.toLowerCase().includes(k));
  }, [keyword]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.cardContainer} style={{ paddingBottom: 90 }}>
        {/* 타이틀 */}
        <div style={{ fontSize: 20, fontWeight: 700, color: '#2563eb', marginBottom: 0 }}>
          동국대에서 만난 고양이
        </div>

        {/* 큰 제목 + 아이콘 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
           <h2 style={{ fontSize: 30, fontWeight: 800, margin: 0 }}>어떤 고양이가 궁금하신가요?</h2>
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
            background: '#f1f5f9',
            borderRadius: 24,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="해시태그를 입력하세요."
            style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: 14 }}
          />
        </div>

        {/* 결과 리스트 */}
        <div className={styles.formSections}>
          {filtered.length === 0 ? (
            <div style={{ opacity: 0.6, textAlign: 'center', padding: 16 }}>
              해당 키워드를 포함한 태그가 없어요
            </div>
          ) : (
            filtered.map((tag, idx) => {
              const isOrange = idx % 2 === 0;
              return (
                <Link
                  key={tag}
                  to={`/tags/${encodeURIComponent(tag)}`}
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    fontWeight: 700,
                    textAlign: 'center',
                    padding: '16px 18px',
                    borderRadius: 24,
                    color: isOrange ? '#fff' : '#111',
                    // ★ 두 번째 버튼과 같은 가로 그라데이션
                    background: isOrange
                      ? 'linear-gradient(90deg, #FF9800 0%, #FFA000 100%)'
                      : '#ffffff',
                    boxShadow: isOrange
                      ? '0 10px 18px rgba(255,160,0,0.25)'
                      : '0 4px 10px rgba(0,0,0,0.06)',
                    border: isOrange ? 'none' : '1px solid #eee',
                  }}
                >
                  #{tag}
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
