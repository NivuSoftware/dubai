import { apiRequest } from "./apiClient";

export const ADMIN_TOKEN_KEY = "dubai_admin_token";
export const USER_ROLE_KEY = "dubai_user_role";

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
    has_used_free_trial: boolean;
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
    has_used_free_trial: boolean;
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
    has_used_free_trial: boolean;
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
    has_used_free_trial: boolean;
    created_at: string;
  };
}

export interface RequestVerificationResponse {
  message: string;
  is_verification_requested: boolean;
  request_id?: number;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ValidateResetPasswordTokenResponse {
  message: string;
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
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

export function requestPasswordReset(
  payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> {
  return apiRequest<ForgotPasswordResponse>("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function validateResetPasswordToken(
  token: string
): Promise<ValidateResetPasswordTokenResponse> {
  return apiRequest<ValidateResetPasswordTokenResponse>(
    `/api/auth/reset-password/validate?token=${encodeURIComponent(token)}`,
    {
      method: "GET",
    }
  );
}

export function resetPassword(
  payload: ResetPasswordPayload
): Promise<ResetPasswordResponse> {
  return apiRequest<ResetPasswordResponse>("/api/auth/reset-password", {
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
