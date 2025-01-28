import { getCookie } from "@/utils/cookies";
import { request as clientRequest } from "@/utils/request/fetch";

export async function request(url: string, options: RequestInit) {
  const token = getCookie("authToken");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "auth-token": token } : {}),
  };

  const response = await clientRequest(url, { ...options, headers });
  return await response.json();
}
