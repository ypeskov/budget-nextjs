const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default {
  oauth: () => `${API_URL}/auth/oauth`,
  profile: () => `${API_URL}/auth/profile`,
};
