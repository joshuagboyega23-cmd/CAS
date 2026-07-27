const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cas-ts71.onrender.com/api/v1';

export async function fetchAPI(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred while fetching data.');
  }

  return data;
}

export default fetchAPI;