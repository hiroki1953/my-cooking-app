// utils/fetch.ts
export async function fetchFromApi(endpoint: string, options?: RequestInit) {
  const baseUrl =
    "https://my-cooking-9p60aapqg-hiroki1953s-projects.vercel.app/" ||
    "http://localhost:3000";
  const fullUrl = `${baseUrl}${endpoint}`;

  const res = await fetch(fullUrl, options);
  if (!res.ok) {
    throw new Error(
      `API call failed with status ${res.status}: ${res.statusText}`
    );
  }

  return res.json();
}
