"use client";

import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import apiRoutes from "@/routes/apiRoutes";
import routes from "@/routes/routes";
// const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

interface GoogleLoginProps {
  locale: string;
}

const GoogleLoginComponent: React.FC<GoogleLoginProps> = ({ locale }) => {
  const { setUser } = useUser();
  const router = useRouter();

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    const response = await fetch(apiRoutes.oauth(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credential: credentialResponse.credential }),
    });
    const jwt = await response.json();
    document.cookie = `authToken=${jwt.accessToken}; path=/; max-age=3600;`;

    const userResponse = await fetch(apiRoutes.profile(), {
      headers: {
        "auth-token": jwt.accessToken,
      },
    });
    const user = await userResponse.json();
    setUser({ email: user.email, token: jwt.accessToken });

    router.push(routes.accounts(locale));
  };

  const handleLoginError = () => {
    console.log("Error logging in with Google");
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={handleLoginError}
        text="continue_with"
        shape="circle"
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginComponent;