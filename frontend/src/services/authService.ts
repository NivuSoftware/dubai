import { apiRequest } from "./apiClient";

export const ADMIN_TOKEN_KEY = "dubai_admin_token";

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
    is_verified: boolean;
    is_verification_requested: boolean;
    is_verification_rejected: boolean;
  };
}

export interface RegisterAdvertiserPayload {
  email: string;
  password: string;
}

export interface RegisterAdvertiserResponse {
  message: string;
  access_token: string;
  user: {
    id: number;
    email: string;
    role: string;
    is_verified: boolean;
    is_verification_requested: boolean;
    is_verification_rejected: boolean;
  };
}

export interface AdminMeResponse {
  message: string;
  user: {
    id: number;
    email: string;
    role: string;
    is_verified: boolean;
    is_verification_requested: boolean;
    is_verification_rejected: boolean;
    created_at: string;
  };
}

export interface AdvertiserMeResponse {
  message: string;
  user: {
    id: number;
    email: string;
    role: string;
    is_verified: boolean;
    is_verification_requested: boolean;
    is_verification_rejected: boolean;
    created_at: string;
  };
}

export interface RequestVerificationResponse {
  message: string;
  is_verification_requested: boolean;
  request_id?: number;
}

export function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function registerAdvertiser(
  payload: RegisterAdvertiserPayload
): Promise<RegisterAdvertiserResponse> {
  return apiRequest<RegisterAdvertiserResponse>("/api/auth/register-advertiser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function fetchAdminMe(token: string): Promise<AdminMeResponse> {
  return apiRequest<AdminMeResponse>("/api/admin/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function fetchAdvertiserMe(token: string): Promise<AdvertiserMeResponse> {
  return apiRequest<AdvertiserMeResponse>("/api/advertiser/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function requestAdvertiserVerification(
  token: string,
  payload: FormData
): Promise<RequestVerificationResponse> {
  return apiRequest<RequestVerificationResponse>("/api/advertiser/request-verification", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: payload,
  });
}
