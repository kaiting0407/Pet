"use client";
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <div style={{ position: 'fixed', top: '16px', left: '16px' }}>
      <button 
        style={{
          padding: '10px 20px',
          backgroundColor: 'black',
          color: 'white',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          transition: 'background-color 0.3s ease'
        }}
        onClick={() => router.back()}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'gray'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'black'}
      >
        回上一頁
      </button>
    </div>
  );
}
