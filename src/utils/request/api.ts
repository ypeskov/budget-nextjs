import { getAuthToken } from "@/utils/auth";
import { request as apiRequest } from "@/utils/request/fetch";

export async function request(url: string, options: RequestInit) {
  const token = await getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "auth-token": token } : {}),
  };

  return apiRequest(url, { ...options, headers });
}