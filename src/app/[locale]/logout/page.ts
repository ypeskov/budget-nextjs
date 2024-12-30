"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/context/UserContext";

export default function LogoutPage() {
    const router = useRouter();
    const { setUser } = useUser();

    useEffect(() => {
        document.cookie = "authToken=; path=/; max-age=0;";
        setUser({ email: null, token: null });
        router.push("/");
    }, [router]);

    return null;
}