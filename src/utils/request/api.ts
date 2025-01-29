import { getAuthToken } from "@/utils/auth";
import { request as apiRequest } from "@/utils/request/fetch";
import { UnauthorizedError } from "./errors";

export async function request(url: string, options: RequestInit) {
  const token = await getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "auth-token": token } : {}),
  };

  try {
    const response = await apiRequest(url, { ...options, headers });
    return await response.json();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      console.log('Unauthorized');
      throw error;
    }
    throw new Error('Unknown error', { cause: error });
  }
}
