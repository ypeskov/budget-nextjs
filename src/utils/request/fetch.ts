import { UnauthorizedError, ValidationError } from "./errors";

export async function request(url: string, options: RequestInit) {
  let response;
  try {
    response = await fetch(url, { ...options });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new UnauthorizedError();
      }

      if (response.status === 422) {
        const error = await response.json();
        throw new ValidationError(error.detail);
      }

      throw new Error('Unknown error', { cause: response });
    }

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}