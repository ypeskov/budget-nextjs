"use client";

import { Link } from "@/i18n/routing";
import { useUser } from "@/context/UserContext";

export default function Header() {
  const { user } = useUser();

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <div className="text-xl font-bold">AnotherBudgeter</div>
        <div className="mt-2 md:mt-0">
          <button className="p-2 hover:scale-110 transition">
            <img src="/images/icons/settings-icon.svg" alt="Settings" title="Settings" className="h-6 w-6"/>
          </button>
        </div>
      </div>

      <header>
        <nav className="flex flex-wrap gap-4 my-4">
          {!user.token && (
            <Link href="/">
              <img src="/images/icons/home-icon.svg" alt="Home" title="Home" className="h-10 w-10 hover:scale-110 transition" />
            </Link>
          )}
          {user.token && (
            <>
              <Link href="/accounts">
                <img src="/images/icons/accounts-icon.svg" alt="Accounts" title="Accounts" className="h-10 w-10 hover:scale-110 transition" />
              </Link>
              <Link href="/transactions">
                <img src="/images/icons/transactions-icon.svg" alt="Transactions" title="Transactions" className="h-10 w-10 hover:scale-110 transition" />
              </Link>
              <Link href="/reports">
                <img src="/images/icons/reports-icon.svg" alt="Reports" title="Reports" className="h-10 w-10 hover:scale-110 transition" />
              </Link>
              <Link href="/budgets">
                <img src="/images/icons/budgets-icon.svg" alt="Budgets" title="Budgets" className="h-10 w-10 hover:scale-110 transition" />
              </Link>
            </>)}
          {user.token ? (
            <>
              <Link href="/logout">
                <img src="/images/icons/exit-icon.svg" alt="Logout" title="Logout" className="h-10 w-10 hover:scale-110 transition" />
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <img src="/images/icons/enter-icon.svg" alt="Login" title="Login" className="h-10 w-10 hover:scale-110 transition"/>
              </Link>
              <Link href="/register">
                <img src="/images/icons/register-icon.svg" alt="Register" title="Register" className="h-10 w-10 hover:scale-110 transition"/>
              </Link>
            </>
          )}
        </nav>
      </header>
    </div>
  );
}