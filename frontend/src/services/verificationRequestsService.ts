import { apiRequestWithAuth } from "./apiClient";

export interface VerificationRequestItem {
  id: number;
  user_id: number;
  advertiser_email: string;
  full_name: string;
  document_number: string;
  birth_date: string;
  document_image_path: string;
  portrait_image_path: string;
  document_image_url: string;
  portrait_image_url: string;
  status: string;
  created_at: string;
}

export async function listVerificationRequests(token: string): Promise<VerificationRequestItem[]> {
  const response = await apiRequestWithAuth<{ items: VerificationRequestItem[] }>(
    token,
    "/api/admin/verification-requests"
  );
  return response.items;
}

export function approveVerificationRequest(
  token: string,
  requestId: number
): Promise<{ message: string }> {
  return apiRequestWithAuth<{ message: string }>(
    token,
    `/api/admin/verification-requests/${requestId}/approve`,
    {
      method: "POST",
    }
  );
}

export function rejectVerificationRequest(
  token: string,
  requestId: number
): Promise<{ message: string }> {
  return apiRequestWithAuth<{ message: string }>(
    token,
    `/api/admin/verification-requests/${requestId}/reject`,
    {
      method: "POST",
    }
  );
}
