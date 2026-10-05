import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { goal, level, hoursPerDay, location } = await request.json();

    if (!goal || !level || !hoursPerDay) {
      return NextResponse.json(
        { error: 'Lütfen hedef, seviye ve günlük çalışma süresini belirtin.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY sunucu ortam değişkeni tanımlanmamış. Lütfen .env dosyanızı kontrol edin.' },
        { status: 500 }
      );
    }

    const prompt = `
Sen bir kariyer koçusun ve öğrenme yol haritası uzmanısın.

Kullanıcı bilgileri:
- Hedef: ${goal}
- Mevcut seviye: ${level}
- Günlük müsait süre: ${hoursPerDay} saat
- Konum: ${location || 'Belirtilmemiş'}

Lütfen bu kullanıcıya özel, haftalık bir öğrenme müfredatı oluştur.
Sadece ücretsiz kaynaklar kullan (YouTube, resmi dokümantasyon, ücretsiz makaleler).

Şu formatta yanıt ver:
- Toplam tahmini süre
- Hafta hafta plan (Hafta 1, Hafta 2, ...)
- Her hafta için: konu, kaynaklar, hedef

Türkçe yanıt ver.
    `.trim();

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Groq API hatası oluştu.' },
        { status: response.status }
      );
    }

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: 'Yol haritası oluşturulamadı, API boş yanıt döndü.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Roadmap Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Sunucu hatası oluştu.' },
      { status: 500 }
    );
  }
}
