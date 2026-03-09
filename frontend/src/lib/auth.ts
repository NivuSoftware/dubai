export const ADMIN_TOKEN_KEY = "dubai_admin_token";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("Falta VITE_API_BASE_URL en frontend/.env");
}

const API_BASE_URL = apiBaseUrl.replace(/\/$/, "");

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

export interface AdminMeResponse {
  message: string;
  user: {
    id: number;
    email: string;
    role: string;
    created_at: string;
  };
}

export interface ModeloPayload {
  nombre: string;
  edad: number;
  descripcion: string;
  disponibilidad: string;
  ubicacion: string;
  categoria: string;
  precio: number;
}

export interface ModeloImage {
  id: number;
  path: string;
  url: string;
}

export interface Modelo {
  id: number;
  nombre: string;
  edad: number;
  descripcion: string;
  disponibilidad: string;
  ubicacion: string;
  categoria: string;
  precio: number;
  created_at: string;
  updated_at: string;
  images: ModeloImage[];
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "No se pudo iniciar sesion");
  }

  return response.json();
}

export async function fetchAdminMe(token: string): Promise<AdminMeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/admin/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "No autorizado");
  }

  return response.json();
}

async function requestWithAuth<T>(
  token: string,
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error en la solicitud");
  }

  return response.json();
}

export async function listModelos(token: string): Promise<Modelo[]> {
  const response = await requestWithAuth<{ items: Modelo[] }>(token, "/api/admin/modelos");
  return response.items;
}

export function createModelo(token: string, payload: ModeloPayload): Promise<Modelo> {
  return requestWithAuth<Modelo>(token, "/api/admin/modelos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function updateModelo(token: string, id: number, payload: ModeloPayload): Promise<Modelo> {
  return requestWithAuth<Modelo>(token, `/api/admin/modelos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function deleteModelo(token: string, id: number): Promise<{ message: string }> {
  return requestWithAuth<{ message: string }>(token, `/api/admin/modelos/${id}`, {
    method: "DELETE",
  });
}

export function uploadModeloImages(
  token: string,
  modeloId: number,
  files: File[]
): Promise<{ message: string; images: ModeloImage[] }> {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  return requestWithAuth<{ message: string; images: ModeloImage[] }>(
    token,
    `/api/admin/modelos/${modeloId}/images`,
    {
      method: "POST",
      body: formData,
    }
  );
}

export function deleteModeloImage(
  token: string,
  modeloId: number,
  imageId: number
): Promise<{ message: string }> {
  return requestWithAuth<{ message: string }>(
    token,
    `/api/admin/modelos/${modeloId}/images/${imageId}`,
    {
      method: "DELETE",
    }
  );
}

export async function listPublicModelos(): Promise<Modelo[]> {
  const response = await fetch(`${API_BASE_URL}/api/modelos`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "No se pudo obtener modelos");
  }
  const data: { items: Modelo[] } = await response.json();
  return data.items;
}

export async function getPublicModelo(id: string): Promise<Modelo> {
  const response = await fetch(`${API_BASE_URL}/api/modelos/${id}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "No se pudo obtener la modelo");
  }
  return response.json();
}
