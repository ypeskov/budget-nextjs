import { getAuthToken } from "@/utils/auth";
import { request as apiRequest } from "@/utils/request/fetch";
import { UnauthorizedError, ValidationError } from "./errors";

export const API_URL = process.env.API_BASE_URL || "";

export async function request(url: string, options: RequestInit) {
  url = API_URL + url;
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
    if (error instanceof ValidationError) {
      console.log(`ValidationError: ${JSON.stringify(error)}`);
      throw error;
    }
    throw new Error('Unknown error', { cause: error });
  }
}
