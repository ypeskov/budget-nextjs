export async function request(url: string, options: RequestInit) {
  let response;
  try {
    response = await fetch(url, { ...options });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}