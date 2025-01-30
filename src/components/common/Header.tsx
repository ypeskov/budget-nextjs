"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function Header() {
  const { user, expireTime } = useUser();
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const t = useTranslations("");

  useEffect(() => {
    if (!expireTime) return;

    const updateTimer = () => {
      const remaining = Math.max(expireTime - Date.now(), 0);
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setTimeLeft(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expireTime]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <div className="text-xl font-bold">AnotherBudgeter</div>
        {timeLeft && <div className="text-sm text-gray-500">{t("sessionExpiresIn", { timeLeft })}</div>}
        <div className="mt-2 md:mt-0">
          <button className="p-2 hover:scale-110 transition">
            <img src="/images/icons/settings-icon.svg" alt="Settings" title="Settings" className="h-6 w-6" />
          </button>
        </div>
      </div>

      <header>
        <nav className="flex flex-wrap gap-4 my-4">
          {!user.token && (
            <Link href="/">
              <Image src="/images/icons/home-icon.svg" alt="Home" title="Home" className="h-10 w-10 hover:scale-110 transition" width={40} height={40} />
            </Link>
          )}
          {user.token && (
            <>
              <Link href="/accounts">
                <Image src="/images/icons/accounts-icon.svg" alt="Accounts" title="Accounts" className="h-10 w-10 hover:scale-110 transition" width={40} height={40} />
              </Link>
              <Link href="/transactions">
                <Image src="/images/icons/transactions-icon.svg" alt="Transactions" title="Transactions" className="h-10 w-10 hover:scale-110 transition" width={40} height={40} />
              </Link>
              <Link href="/reports">
                <Image src="/images/icons/reports-icon.svg" alt="Reports" title="Reports" className="h-10 w-10 hover:scale-110 transition" width={40} height={40} />
              </Link>
              <Link href="/budgets">
                <Image src="/images/icons/budgets-icon.svg" alt="Budgets" title="Budgets" className="h-10 w-10 hover:scale-110 transition" width={40} height={40} />
              </Link>
            </>)}
          {user.token ? (
            <>
              <Link href="/logout">
                <Image src="/images/icons/exit-icon.svg" alt="Logout" title="Logout" className="h-10 w-10 hover:scale-110 transition" width={40} height={40} />
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Image src="/images/icons/enter-icon.svg" alt="Login" title="Login" className="h-10 w-10 hover:scale-110 transition" width={40} height={40} />
              </Link>
              <Link href="/register">
                <Image src="/images/icons/register-icon.svg" alt="Register" title="Register" className="h-10 w-10 hover:scale-110 transition" width={40} height={40} />
              </Link>
            </>
          )}
        </nav>
      </header>
    </div>
  );
}