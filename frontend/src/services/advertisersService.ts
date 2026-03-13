import { apiRequestWithAuth } from "./apiClient";

export interface Advertiser {
  id: number;
  email: string;
  role: string;
  is_verified: boolean;
  is_verification_requested: boolean;
  is_verification_rejected: boolean;
  created_at: string;
}

export interface AdvertiserPayload {
  email: string;
  password: string;
  is_verified?: boolean;
  is_verification_requested?: boolean;
  is_verification_rejected?: boolean;
}

export interface AdvertiserUpdatePayload {
  email?: string;
  password?: string;
  is_verified?: boolean;
  is_verification_requested?: boolean;
  is_verification_rejected?: boolean;
}

export async function listAdvertisers(token: string): Promise<Advertiser[]> {
  const response = await apiRequestWithAuth<{ items: Advertiser[] }>(token, "/api/admin/advertisers");
  return response.items;
}

export function createAdvertiser(token: string, payload: AdvertiserPayload): Promise<Advertiser> {
  return apiRequestWithAuth<Advertiser>(token, "/api/admin/advertisers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function updateAdvertiser(
  token: string,
  advertiserId: number,
  payload: AdvertiserUpdatePayload
): Promise<Advertiser> {
  return apiRequestWithAuth<Advertiser>(token, `/api/admin/advertisers/${advertiserId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function deleteAdvertiser(token: string, advertiserId: number): Promise<{ message: string }> {
  return apiRequestWithAuth<{ message: string }>(token, `/api/admin/advertisers/${advertiserId}`, {
    method: "DELETE",
  });
}
