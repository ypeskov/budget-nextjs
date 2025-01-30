"use client";

import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import apiRoutes from "@/routes/apiRoutes";
import routes from "@/routes/routes";
import { request } from "@/utils/request/browser";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const SESSION_TIMEOUT_MINUTES = parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT || "30", 10);
const SESSION_TIMEOUT_SECONDS = SESSION_TIMEOUT_MINUTES * 60;

type GoogleLoginProps = {
  locale: string;
}

type LoginResponse = {
  accessToken: string;
  tokenType: string;
}

const GoogleLoginComponent: React.FC<GoogleLoginProps> = ({ locale }) => {
  const { setUser, resetTimer } = useUser();
  const router = useRouter();

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    const loginResponse: LoginResponse = await request(apiRoutes.oauth(), {
      method: "POST",
      body: JSON.stringify({ credential: credentialResponse.credential }),
    });
    document.cookie = `authToken=${loginResponse.accessToken}; path=/; max-age=${SESSION_TIMEOUT_SECONDS};`;

    const userResponse = await request(apiRoutes.profile(), {});

    setUser({ email: userResponse.email, token: loginResponse.accessToken });
    resetTimer();

    router.push(routes.accounts({ locale }));
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