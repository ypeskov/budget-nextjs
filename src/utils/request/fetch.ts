export async function request(url: string, options: RequestInit) {
  let response;
  try {
    response = await fetch(url, { ...options });

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}