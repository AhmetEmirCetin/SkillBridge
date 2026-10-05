/**
 * Client-side helper function to request a roadmap from our Next.js API route.
 * This keeps the GROQ_API_KEY secure on the server.
 */
export async function generateRoadmap({ goal, level, hoursPerDay, location }) {
  const response = await fetch('/api/roadmap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ goal, level, hoursPerDay, location }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Yol haritası oluşturulurken bir hata meydana geldi.');
  }

  return data.content;
}