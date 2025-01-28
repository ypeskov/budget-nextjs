"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/context/UserContext";
import routes from "@/routes/routes";

export default function LogoutPage() {
    const router = useRouter();
    const locale = useLocale();
    const { setUser } = useUser();
    
    useEffect(() => {
        document.cookie = "authToken=; path=/; max-age=0;";
        setUser({ email: null, token: null });
        router.push(routes.login(locale));
    }, [router, locale]);

    return null;
}