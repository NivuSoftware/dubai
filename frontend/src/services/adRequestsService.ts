import { apiRequestWithAuth } from "./apiClient";

export interface AdRequestImage {
  id: number;
  path: string;
  url: string;
}

export interface AdRequestItem {
  id: number;
  owner_id: number;
  advertiser_email: string;
  titulo: string;
  descripcion: string;
  precio: number;
  ubicacion: string;
  plan: string;
  estado: string;
  pago: string;
  is_draft: boolean;
  fecha_hasta: string;
  created_at: string;
  imagen_comprobante_pago: string;
  imagen_comprobante_pago_url: string;
  images: AdRequestImage[];
}

export async function listAdRequests(token: string): Promise<AdRequestItem[]> {
  const response = await apiRequestWithAuth<{ items: AdRequestItem[] }>(token, "/api/admin/ad-requests");
  return response.items;
}

export async function listActiveAds(token: string): Promise<AdRequestItem[]> {
  const response = await apiRequestWithAuth<{ items: AdRequestItem[] }>(token, "/api/admin/active-ads");
  return response.items;
}

export function approveAdRequest(token: string, requestId: number): Promise<{ message: string }> {
  return apiRequestWithAuth<{ message: string }>(token, `/api/admin/ad-requests/${requestId}/approve`, {
    method: "POST",
  });
}

export function deactivateAdRequest(token: string, requestId: number): Promise<{ message: string }> {
  return apiRequestWithAuth<{ message: string }>(
    token,
    `/api/admin/ad-requests/${requestId}/deactivate`,
    {
      method: "POST",
    }
  );
}

export function deleteAdRequest(token: string, requestId: number): Promise<{ message: string }> {
  return apiRequestWithAuth<{ message: string }>(token, `/api/admin/ad-requests/${requestId}`, {
    method: "DELETE",
  });
}
