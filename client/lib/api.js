let baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://cas-ts71.onrender.com').replace(/\/$/, '');

// Ensure /api/v1 is appended exactly once
if (!baseUrl.endsWith('/api/v1')) {
  baseUrl += '/api/v1';
}

const API_URL = baseUrl;

export async function fetchAPI(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = Bearer ${token};
  }

  // Ensure endpoint starts with a slash
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : /${endpoint};

  const response = await fetch(`${API_URL}${formattedEndpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Server returned an invalid response. Please verify backend status.');
  }

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred while fetching data.');
  }

  return data;
}

export default fetchAPI;