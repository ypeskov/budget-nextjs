import { getCookie } from "@/utils/cookies";
import { request as clientRequest } from "@/utils/request/fetch";
import { UnauthorizedError, ValidationError } from "./errors";
import { useSessionStore } from "@/store/sessionStore";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function request(url: string, options: RequestInit) {
  url = API_URL + url;
  const token = getCookie("authToken");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "auth-token": token } : {}),
  };

  try {
    const response = await clientRequest(url, { ...options, headers });

    const newToken = response.headers.get("new_access_token");
    if (newToken) {
      console.log("New token", newToken);
      useSessionStore.getState().resetTimer(); // Вызов без хуков
    }

    return await response.json();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      console.log("Unauthorized", JSON.stringify(error));
      throw error;
    }

    if (error instanceof ValidationError) {
      console.log("Validation error", JSON.stringify(error));
      throw error;
    }

    console.error(error);
    throw error;
  }
}
