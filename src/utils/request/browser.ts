import { getCookie } from "@/utils/cookies";
import { request as clientRequest } from "@/utils/request/fetch";
import { UnauthorizedError, ValidationError } from "./errors";

export async function request(url: string, options: RequestInit) {
  const token = getCookie("authToken");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "auth-token": token } : {}),
  };

  try {
    const response = await clientRequest(url, { ...options, headers });
    return await response.json();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      console.log("Unauthorized", error);
      throw error;
    }

    if (error instanceof ValidationError) {
      console.log("Validation error", error);
      throw error;
    }

    console.error(error);
    return null;
  }
}
