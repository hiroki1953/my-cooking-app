export async function fetchFromApi(endpoint: string, options?: RequestInit) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  const fullUrl = `${baseUrl}${endpoint}`;

  const res = await fetch(fullUrl, options);

  if (!res.ok) {
    throw new Error(
      `API call failed with status ${res.status}: ${res.statusText}`
    );
  }

  return res.json();
}
