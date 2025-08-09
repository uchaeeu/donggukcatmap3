import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <Link
      to={`/post/${post.id}`}
      style={{
        display: 'block',
        border: '1px solid #eee',
        borderRadius: 12,
        padding: 8,
        textDecoration: 'none',
        color: 'inherit',
        background: '#fff',
      }}
    >
      <img
        src={post.image_url}
        alt={post.title}
        style={{
          width: '100%',
          height: 120,
          objectFit: 'cover',
          borderRadius: 8,
        }}
      />
      <div style={{ marginTop: 6, fontWeight: 600 }}>{post.title}</div>
      <div style={{ fontSize: 12, opacity: 0.7 }}>❤️ {post.likes}</div>
    </Link>
  );
}
