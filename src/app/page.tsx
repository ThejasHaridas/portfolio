'use client';

import dynamic from 'next/dynamic';

const Adventure3D = dynamic(() => import('@/components/Adventure3D'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-[#0a0a1a] flex items-center justify-center">
      <div className="font-pixel text-yellow-400 animate-pulse" style={{ fontSize: 10 }}>
        Loading 3D World...
      </div>
    </div>
  ),
});

export default function Home() {
  return <Adventure3D />;
}
