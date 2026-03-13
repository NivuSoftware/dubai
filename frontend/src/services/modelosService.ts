import { apiRequest, apiRequestWithAuth } from "./apiClient";

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

export async function listModelos(token: string): Promise<Modelo[]> {
  const response = await apiRequestWithAuth<{ items: Modelo[] }>(token, "/api/admin/modelos");
  return response.items;
}

export function createModelo(token: string, payload: ModeloPayload): Promise<Modelo> {
  return apiRequestWithAuth<Modelo>(token, "/api/admin/modelos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function updateModelo(token: string, id: number, payload: ModeloPayload): Promise<Modelo> {
  return apiRequestWithAuth<Modelo>(token, `/api/admin/modelos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function deleteModelo(token: string, id: number): Promise<{ message: string }> {
  return apiRequestWithAuth<{ message: string }>(token, `/api/admin/modelos/${id}`, {
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

  return apiRequestWithAuth<{ message: string; images: ModeloImage[] }>(
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
  return apiRequestWithAuth<{ message: string }>(
    token,
    `/api/admin/modelos/${modeloId}/images/${imageId}`,
    {
      method: "DELETE",
    }
  );
}

export async function listAdvertiserModelos(token: string): Promise<Modelo[]> {
  const response = await apiRequestWithAuth<{ items: Modelo[] }>(token, "/api/advertiser/modelos");
  return response.items;
}

export function createAdvertiserModelo(token: string, payload: ModeloPayload): Promise<Modelo> {
  return apiRequestWithAuth<Modelo>(token, "/api/advertiser/modelos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function updateAdvertiserModelo(
  token: string,
  id: number,
  payload: ModeloPayload
): Promise<Modelo> {
  return apiRequestWithAuth<Modelo>(token, `/api/advertiser/modelos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function deleteAdvertiserModelo(token: string, id: number): Promise<{ message: string }> {
  return apiRequestWithAuth<{ message: string }>(token, `/api/advertiser/modelos/${id}`, {
    method: "DELETE",
  });
}

export function uploadAdvertiserModeloImages(
  token: string,
  modeloId: number,
  files: File[]
): Promise<{ message: string; images: ModeloImage[] }> {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  return apiRequestWithAuth<{ message: string; images: ModeloImage[] }>(
    token,
    `/api/advertiser/modelos/${modeloId}/images`,
    {
      method: "POST",
      body: formData,
    }
  );
}

export function deleteAdvertiserModeloImage(
  token: string,
  modeloId: number,
  imageId: number
): Promise<{ message: string }> {
  return apiRequestWithAuth<{ message: string }>(
    token,
    `/api/advertiser/modelos/${modeloId}/images/${imageId}`,
    {
      method: "DELETE",
    }
  );
}

export async function listPublicModelos(): Promise<Modelo[]> {
  const data = await apiRequest<{ items: Modelo[] }>("/api/modelos");
  return data.items;
}

export function getPublicModelo(id: string): Promise<Modelo> {
  return apiRequest<Modelo>(`/api/modelos/${id}`);
}
