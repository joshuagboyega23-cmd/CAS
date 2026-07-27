const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://cas-ts71.onrender.com').replace(/\/$/, '') + '/api/v1';

export async function fetchAPI(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: Bearer ${token} }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Server returned invalid response. Check backend status.`);
  }

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred while fetching data.');
  }

  return data;
}

// Export as default as well so both import styles work everywhere
export default fetchAPI;