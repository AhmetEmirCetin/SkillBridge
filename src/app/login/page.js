'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-2">Hoş Geldin 👋</h1>
        <p className="text-gray-400 mb-10">Hesabına giriş yap</p>

        {error && (
          <div className="mb-6 p-4 rounded-xl text-red-400 text-sm" style={{ backgroundColor: '#2a1a1a' }}>
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">E-posta</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@email.com"
            className="w-full px-4 py-3 rounded-xl text-white outline-none"
            style={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm text-gray-400 mb-2">Şifre</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl text-white outline-none"
            style={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-4 rounded-xl font-bold text-lg text-white mb-6"
          style={{ backgroundColor: '#6c47ff' }}
        >
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>

        <p className="text-center text-gray-400 text-sm">
          Hesabın yok mu?{' '}
          <Link href="/register" className="font-bold" style={{ color: '#6c47ff' }}>
            Kayıt Ol
          </Link>
        </p>
      </div>
    </main>
  );
}