"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener("cookieChange", checkAuth);

    return () => window.removeEventListener("cookieChange", checkAuth);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <div className="text-xl font-bold">AnotherBudgeter</div>
        <div className="mt-2 md:mt-0">
          <button className="p-2 hover:scale-110 transition">
            <img
              src="/images/icons/settings-icon.svg"
              alt="Settings"
              title="Settings"
              className="h-6 w-6"
            />
          </button>
        </div>
      </div>

      <header>
        <nav className="flex flex-wrap gap-4 my-4">
          <Link href="/">
            <img
              src="/images/icons/home-icon.svg"
              className="h-10 w-10 hover:scale-110 transition"
              alt="Home"
              title="Home"
            />
          </Link>
          <Link href="/accounts">
            <img
              src="/images/icons/accounts-icon.svg"
              className="h-10 w-10 hover:scale-110 transition"
              alt="Accounts"
              title="Accounts"
            />
          </Link>
          <Link href="/transactions">
            <img
              src="/images/icons/transactions-icon.svg"
              className="h-10 w-10 hover:scale-110 transition"
              alt="Transactions"
              title="Transactions"
            />
          </Link>
          <Link href="/reports">
            <img
              src="/images/icons/reports-icon.svg"
              className="h-10 w-10 hover:scale-110 transition"
              alt="Reports"
              title="Reports"
            />
          </Link>
          <Link href="/budgets">
            <img
              src="/images/icons/budgets-icon.svg"
              className="h-10 w-10 hover:scale-110 transition"
              alt="Budgets"
              title="Budgets"
            />
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/logout">
                <img
                  src="/images/icons/exit-icon.svg"
                  className="h-10 w-10 hover:scale-110 transition"
                  alt="Logout"
                  title="Logout"
                />
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <img
                  src="/images/icons/enter-icon.svg"
                  className="h-10 w-10 hover:scale-110 transition"
                  alt="Login"
                  title="Login"
                />
              </Link>
              <Link href="/register">
                <img
                  src="/images/icons/register-icon.svg"
                  className="h-10 w-10 hover:scale-110 transition"
                  alt="Register"
                  title="Register"
                />
              </Link>
            </>
          )}
        </nav>
      </header>
    </div>
  );
}