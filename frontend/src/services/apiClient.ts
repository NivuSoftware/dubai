const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("Falta VITE_API_BASE_URL en frontend/.env");
}

export const API_BASE_URL = apiBaseUrl.replace(/\/$/, "");

async function parseError(response: Response, fallbackMessage: string): Promise<never> {
  const errorText = await response.text();
  if (!errorText) {
    throw new Error(fallbackMessage);
  }

  let parsedMessage = "";
  try {
    const parsed = JSON.parse(errorText) as { message?: string };
    parsedMessage = parsed.message || "";
  } catch {
    // Ignore JSON parse failures and fall back to raw text below.
  }

  throw new Error(parsedMessage || errorText || fallbackMessage);
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  if (!response.ok) {
    return parseError(response, "Error en la solicitud");
  }
  return response.json() as Promise<T>;
}

export async function apiRequestWithAuth<T>(
  token: string,
  path: string,
  init?: RequestInit
): Promise<T> {
  return apiRequest<T>(path, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  });
}
