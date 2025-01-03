"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { jwtVerify } from "jose";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useUser } from "@/context/UserContext";

interface FormData {
  email: string;
  password: string;
}

interface LoginPageProps {
  locale: string;
}

export default function LoginPage({ locale }: LoginPageProps) {
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUser } = useUser();
  const t = useTranslations("LoginPage");

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
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data: { accessToken: string } = await response.json();
        document.cookie = `authToken=${data.accessToken}; path=/; max-age=3600;`;

        const secretKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET_KEY || "your-secret-key");
        const { payload } = await jwtVerify(data.accessToken, secretKey);
        const decoded = payload as { email: string };

        setUser({ email: decoded.email, token: data.accessToken });
        router.push(`/${locale}/accounts`);
      } else {
        const errorData: { message: string } = await response.json();
        setError(errorData.message || "Authentication failed");
      }
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
      </div>
    </div>
  );
}