import { getAuthToken } from "@/utils/auth";
import { request as apiRequest } from "@/utils/request/fetch";
import { UnauthorizedError, ValidationError } from "./errors";

export const API_URL = process.env.API_BASE_URL || "";

export async function request(url: string, options: RequestInit): Promise<{ data: any, newToken: string | null }> {
  url = API_URL + url;
  const token = await getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "auth-token": token } : {}),
  };

  try {
    const response = await apiRequest(url, { ...options, headers });
    const newToken = response.headers.get("new_access_token");
    let data;
    if (response instanceof Response && response) {
      data = await response.json();
    } else {
      data = response;
    }

    return { data, newToken };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      console.log('Unauthorized', JSON.stringify(error));
      throw error;
    }
    if (error instanceof ValidationError) {
      console.log(`ValidationError: ${JSON.stringify(error)}`);
      throw error;
    }
    console.log('error', error);
    throw new Error('Unknown error', { cause: error });
  }
}
