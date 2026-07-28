// Strip any trailing slashes or existing /api/v1 from the base domain
const BASE_DOMAIN = (process.env.NEXT_PUBLIC_API_URL || 'https://cas-ts71.onrender.com')
  .replace(/\/api\/v1\/?$/, '')
  .replace(/\/$/, '');

export async function fetchAPI(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = Bearer ${token};
  }

  // Strip any leading slashes or duplicate /api/v1 from the endpoint string
  const cleanEndpoint = endpoint.replace(/^\/?(api\/v1)?\/?/, '');
  
  // Construct the exact URL cleanly: https://cas-ts71.onrender.com/api/v1/auth/login
  const fullUrl = ${BASE_DOMAIN}/api/v1/${cleanEndpoint};

  const response = await fetch(fullUrl, {
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