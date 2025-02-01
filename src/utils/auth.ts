import { cookies } from 'next/headers';

export async function getAuthToken() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value || '';
  
  return authToken; 
}