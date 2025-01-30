"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useUser } from "@/context/UserContext";
import GoogleLoginComponent from "./GoogleLogin";
import { request } from "@/utils/request/browser";
import routes from "@/routes/routes";
import apiRoutes from "@/routes/apiRoutes";

const SESSION_TIMEOUT_MINUTES = parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT || "30", 10);
const SESSION_TIMEOUT_SECONDS = SESSION_TIMEOUT_MINUTES * 60;

type FormData = {
  email: string;
  password: string;
}

type LoginPageProps = {
  locale: string;
}



export default function LoginPage({ locale }: LoginPageProps) {
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations('');
  const { setUser, resetTimer } = useUser();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const loginToken = await request(apiRoutes.login(), {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const accessToken: string = loginToken.accessToken;
      document.cookie = `authToken=${accessToken}; path=/; max-age=${SESSION_TIMEOUT_SECONDS};`;

      const userProfile = await request(apiRoutes.profile(), {});

      setUser({ email: userProfile.email, token: accessToken });
      resetTimer();
      router.push(routes.accounts({ locale }));
    } catch (error) {
      console.error("Error during login:", error);
      setError("Error of connection");
    }
  };



  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-md p-4 space-y-4 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">{t("login")}</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block">
              {t("email")}
            </label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="off"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block">
              {t("password")}
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-3 py-2 text-white bg-blue-500 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            >
              {t("login")}
            </button>
          </div>
        </form>

        <GoogleLoginComponent locale={locale} />
      </div>
    </div>
  );
}