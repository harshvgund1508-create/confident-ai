/**
 * ConfidentAI API Client
 * Connects frontend to the FastAPI Machine Learning backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function submitAssessment(formData) {
  const res = await fetch(`${API_BASE_URL}/api/assessment`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Assessment failed' }));
    throw new Error(err.detail || 'Failed to submit assessment');
  }
  return res.json();
}

export async function directPredict(payload) {
  const res = await fetch(`${API_BASE_URL}/api/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Direct prediction failed');
  return res.json();
}

export async function analyzeText(text, speaking_duration = 45.0) {
  const res = await fetch(`${API_BASE_URL}/api/analyze-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, speaking_duration }),
  });
  if (!res.ok) throw new Error('Text analysis failed');
  return res.json();
}

export async function getProgress() {
  const res = await fetch(`${API_BASE_URL}/api/progress`);
  if (!res.ok) throw new Error('Failed to fetch progress');
  return res.json();
}

export async function getHistory(limit = 20) {
  const res = await fetch(`${API_BASE_URL}/api/history?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

export async function completeExercise(payload) {
  const res = await fetch(`${API_BASE_URL}/api/exercises/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to log exercise completion');
  return res.json();
}

export async function resetHistory() {
  const res = await fetch(`${API_BASE_URL}/api/history/reset`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to reset history');
  return res.json();
}

export async function getRecommendations() {
  const res = await fetch(`${API_BASE_URL}/api/recommendations`);
  if (!res.ok) throw new Error('Failed to fetch recommendations');
  return res.json();
}

export async function getExercises() {
  const res = await fetch(`${API_BASE_URL}/api/exercises`);
  if (!res.ok) throw new Error('Failed to fetch exercises');
  return res.json();
}

export async function getModelMetrics() {
  const res = await fetch(`${API_BASE_URL}/api/model-metrics`);
  if (!res.ok) throw new Error('Failed to fetch model metrics');
  return res.json();
}

export async function getDemoProfiles() {
  const res = await fetch(`${API_BASE_URL}/api/demo/profiles`);
  if (!res.ok) throw new Error('Failed to fetch demo profiles');
  return res.json();
}

export async function seedDemoJourney() {
  const res = await fetch(`${API_BASE_URL}/api/demo/seed`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to seed demo data');
  return res.json();
}
