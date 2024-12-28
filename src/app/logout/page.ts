"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    document.cookie = `authToken=; path=/; max-age=0;`;
    window.dispatchEvent(new Event("cookieChange"));
    router.push("/");
  }, [router]);

  return null;
}