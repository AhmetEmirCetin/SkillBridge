'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı.');
      return;
    }

    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });

    if (error) {
      setError(error.message);
    } else {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        full_name: fullName,
      });
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-2">Hesap Oluştur 🚀</h1>
        <p className="text-gray-400 mb-10">Yol haritanı oluşturmaya başla</p>

        {error && (
          <div className="mb-6 p-4 rounded-xl text-red-400 text-sm" style={{ backgroundColor: '#2a1a1a' }}>
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Ad Soyad</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Adın Soyadın"
            className="w-full px-4 py-3 rounded-xl text-white outline-none"
            style={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}
          />
        </div>

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
            placeholder="En az 6 karakter"
            className="w-full px-4 py-3 rounded-xl text-white outline-none"
            style={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-4 rounded-xl font-bold text-lg text-white mb-6"
          style={{ backgroundColor: '#6c47ff' }}
        >
          {loading ? 'Hesap oluşturuluyor...' : 'Kayıt Ol'}
        </button>

        <p className="text-center text-gray-400 text-sm">
          Zaten hesabın var mı?{' '}
          <Link href="/login" className="font-bold" style={{ color: '#6c47ff' }}>
            Giriş Yap
          </Link>
        </p>
      </div>
    </main>
  );
}