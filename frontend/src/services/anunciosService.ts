import { apiRequest, apiRequestWithAuth } from "./apiClient";

export interface AnuncioImage {
  id: number;
  path: string;
  url: string;
}

export interface Anuncio {
  id: number;
  owner_id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  ubicacion: string;
  contact_country_code: string;
  contact_number: string;
  whatsapp_url: string;
  estado: string;
  pago: string;
  plan: "monthly" | "quarterly" | "semiannual";
  imagen_comprobante_pago: string;
  imagen_comprobante_pago_url: string;
  fecha_hasta: string;
  created_at: string;
  updated_at: string;
  images: AnuncioImage[];
}

export async function listPublicAnuncios(): Promise<Anuncio[]> {
  const response = await apiRequest<{ items: Anuncio[] }>("/api/anuncios");
  return response.items;
}

export function getPublicAnuncio(id: string): Promise<Anuncio> {
  return apiRequest<Anuncio>(`/api/anuncios/${id}`);
}

export interface AnuncioPayload {
  titulo: string;
  descripcion: string;
  precio: number;
  ubicacion: string;
  contact_country_code: string;
  contact_number: string;
  plan: "monthly" | "quarterly" | "semiannual";
  payment_receipt_image: File;
  images: File[];
}

export interface AnuncioUpdatePayload {
  titulo: string;
  descripcion: string;
  precio: number;
  ubicacion: string;
  contact_country_code: string;
  contact_number: string;
}

export interface AnuncioReactivatePayload {
  plan: "monthly" | "quarterly" | "semiannual";
  payment_receipt_image: File;
}

export async function listAdvertiserAnuncios(token: string): Promise<Anuncio[]> {
  const response = await apiRequestWithAuth<{ items: Anuncio[] }>(token, "/api/advertiser/anuncios");
  return response.items;
}

export async function createAdvertiserAnuncio(token: string, payload: AnuncioPayload): Promise<Anuncio> {
  const formData = new FormData();
  formData.append("titulo", payload.titulo);
  formData.append("descripcion", payload.descripcion);
  formData.append("precio", String(payload.precio));
  formData.append("ubicacion", payload.ubicacion);
  formData.append("contact_country_code", payload.contact_country_code);
  formData.append("contact_number", payload.contact_number);
  formData.append("plan", payload.plan);
  formData.append("payment_receipt_image", payload.payment_receipt_image);
  payload.images.forEach((file) => formData.append("images", file));

  const response = await apiRequestWithAuth<{ message: string; item: Anuncio }>(
    token,
    "/api/advertiser/anuncios",
    {
      method: "POST",
      body: formData,
    }
  );
  return response.item;
}

export function updateAdvertiserAnuncio(
  token: string,
  anuncioId: number,
  payload: AnuncioUpdatePayload
): Promise<Anuncio> {
  return apiRequestWithAuth<Anuncio>(token, `/api/advertiser/anuncios/${anuncioId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function deleteAdvertiserAnuncio(
  token: string,
  anuncioId: number
): Promise<{ message: string }> {
  return apiRequestWithAuth<{ message: string }>(token, `/api/advertiser/anuncios/${anuncioId}`, {
    method: "DELETE",
  });
}

export async function reactivateAdvertiserAnuncio(
  token: string,
  anuncioId: number,
  payload: AnuncioReactivatePayload
): Promise<Anuncio> {
  const formData = new FormData();
  formData.append("plan", payload.plan);
  formData.append("payment_receipt_image", payload.payment_receipt_image);

  const response = await apiRequestWithAuth<{ message: string; item: Anuncio }>(
    token,
    `/api/advertiser/anuncios/${anuncioId}/reactivate`,
    {
      method: "POST",
      body: formData,
    }
  );
  return response.item;
}

export async function uploadAdvertiserAnuncioImages(
  token: string,
  anuncioId: number,
  files: File[]
): Promise<Anuncio> {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const response = await apiRequestWithAuth<{ message: string; item: Anuncio }>(
    token,
    `/api/advertiser/anuncios/${anuncioId}/images`,
    {
      method: "POST",
      body: formData,
    }
  );
  return response.item;
}

export function deleteAdvertiserAnuncioImage(
  token: string,
  anuncioId: number,
  imageId: number
): Promise<{ message: string }> {
  return apiRequestWithAuth<{ message: string }>(
    token,
    `/api/advertiser/anuncios/${anuncioId}/images/${imageId}`,
    {
      method: "DELETE",
    }
  );
}
