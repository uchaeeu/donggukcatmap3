import { Link, useLocation } from 'react-router-dom';

function IconHome({ active }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={active ? '#2563eb' : 'none'}
      stroke={active ? '#2563eb' : '#333'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10.5 12 3l9 7.5"></path>
      <path d="M5 10v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9"></path>
    </svg>
  );
}
function IconSearch({ active }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? '#2563eb' : '#333'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}
function IconHeart({ active }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={active ? '#ef4444' : 'none'}
      stroke={active ? '#ef4444' : '#333'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z"></path>
    </svg>
  );
}

export default function BottomNav() {
  const { pathname } = useLocation();

  const items = [
    { to: '/map', label: '홈', icon: IconHome, isActive: pathname === '/map' },
    {
      to: '/tags/search',
      label: '검색',
      icon: IconSearch,
      isActive: pathname.startsWith('/tags'),
    },
    {
      to: '/popular',
      label: '인기',
      icon: IconHeart,
      isActive: pathname.startsWith('/popular'),
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 12,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    >
      <nav
        style={{
          pointerEvents: 'auto',
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
          padding: '10px 18px',
          width: 'min(520px, 92%)',
        }}
      >
        <ul
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            margin: 0,
            padding: 0,
            listStyle: 'none',
          }}
        >
          {items.map(({ to, label, icon: Icon, isActive }) => (
            <li key={to}>
              <Link
                to={to}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  textDecoration: 'none',
                  color: isActive ? '#2563eb' : '#333',
                  fontSize: 12,
                  fontWeight: 600,
                }}
                aria-label={label}
              >
                <Icon active={isActive} />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
