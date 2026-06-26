'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { generateRoadmap } from '../../lib/groq';

export default function DashboardPage() {
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState('');
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('create');
  const router = useRouter();

  useEffect(() => {
    checkUser();
    fetchHistory();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
    } else {
      setUser(user);
    }
  };

  const fetchHistory = async () => {
    const { data } = await supabase
      .from('roadmaps')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setHistory(data);
  };

  const handleSubmit = async () => {
    if (!goal || !level || !hoursPerDay) return;

    setLoading(true);
    try {
      const content = await generateRoadmap({ goal, level, hoursPerDay, location });
      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from('roadmaps').insert({
        user_id: user.id,
        goal, level,
        hours_per_day: hoursPerDay,
        location, content,
      });

      setRoadmap(content);
      setActiveTab('result');
      fetchHistory();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleDelete = async (id) => {
    await supabase.from('roadmaps').delete().eq('id', id);
    fetchHistory();
  };

  return (
    <main className="min-h-screen px-6 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">
          Skill<span style={{ color: '#6c47ff' }}>Bridge</span> AI
        </h1>
        <button onClick={handleLogout} className="text-red-400 font-bold">
          Çıkış
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {['create', 'history', 'result'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-5 py-2 rounded-xl font-bold text-sm"
            style={{
              backgroundColor: activeTab === tab ? '#6c47ff' : '#1e1e1e',
              color: '#fff',
            }}
          >
            {tab === 'create' ? '✨ Oluştur' : tab === 'history' ? '📚 Geçmiş' : '🗺️ Sonuç'}
          </button>
        ))}
      </div>

      {/* Create Tab */}
      {activeTab === 'create' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Ne öğrenmek istiyorsun?</label>
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Örn: Embedded Systems, Web Geliştirme"
              className="w-full px-4 py-3 rounded-xl text-white outline-none"
              style={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Mevcut seviyeni tarif et</label>
            <input
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="Örn: Hiç bilmiyorum, Temel Python bilgim var"
              className="w-full px-4 py-3 rounded-xl text-white outline-none"
              style={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Günlük kaç saatin var?</label>
            <input
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(e.target.value)}
              placeholder="Örn: 2"
              type="number"
              className="w-full px-4 py-3 rounded-xl text-white outline-none"
              style={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Şehrin (opsiyonel)</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Örn: Ankara"
              className="w-full px-4 py-3 rounded-xl text-white outline-none"
              style={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-lg text-white mt-4"
            style={{ backgroundColor: '#6c47ff' }}
          >
            {loading ? 'Oluşturuluyor...' : 'Yol Haritamı Oluştur ✨'}
          </button>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {history.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">Henüz yol haritası oluşturmadın.</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl" style={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{item.goal}</h3>
                  <button onClick={() => handleDelete(item.id)} className="text-red-400 text-sm">Sil</button>
                </div>
                <p className="text-gray-400 text-sm mb-1">{item.hours_per_day} saat/gün • {item.level}</p>
                <p className="text-gray-600 text-xs mb-4">{new Date(item.created_at).toLocaleDateString('tr-TR')}</p>
                <button
                  onClick={() => { setRoadmap(item.content); setActiveTab('result'); }}
                  className="text-sm font-bold"
                  style={{ color: '#6c47ff' }}
                >
                  Görüntüle →
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Result Tab */}
      {activeTab === 'result' && (
        <div>
          {roadmap ? (
            <div className="p-6 rounded-2xl whitespace-pre-wrap leading-7 text-gray-300"
              style={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}>
              {roadmap}
            </div>
          ) : (
            <p className="text-gray-400 text-center mt-10">Henüz bir yol haritası oluşturmadın.</p>
          )}
        </div>
      )}
    </main>
  );
}