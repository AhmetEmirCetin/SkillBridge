const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

export async function generateRoadmap({ goal, level, hoursPerDay, location }) {
  const prompt = `
Sen bir kariyer koçusun ve öğrenme yol haritası uzmanısın.

Kullanıcı bilgileri:
- Hedef: ${goal}
- Mevcut seviye: ${level}
- Günlük müsait süre: ${hoursPerDay} saat
- Konum: ${location}

Lütfen bu kullanıcıya özel, haftalık bir öğrenme müfredatı oluştur.
Sadece ücretsiz kaynaklar kullan (YouTube, resmi dokümantasyon, ücretsiz makaleler).

Şu formatta yanıt ver:
- Toplam tahmini süre
- Hafta hafta plan (Hafta 1, Hafta 2, ...)
- Her hafta için: konu, kaynaklar, hedef

Türkçe yanıt ver.
  `;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'API hatası oluştu');
  }

  return data.choices[0].message.content;
}