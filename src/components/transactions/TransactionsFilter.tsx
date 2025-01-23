"use client";

import { useEffect, useState } from "react";
import { Account } from "@/types/accounts";
import { useTranslations } from "next-intl";

interface TransactionsFilterProps {
  accounts: Account[];
  locale: string;
  searchParams: Record<string, string | undefined>;
  isAccountDetailsPage?: boolean;
}

const TransactionsFilter = ({ accounts, locale, searchParams, isAccountDetailsPage }: TransactionsFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  isAccountDetailsPage = isAccountDetailsPage || false;
  const t = useTranslations('');
  // State initialization for filters
  const [types, setTypes] = useState<string[]>(() => searchParams.types?.split(",") || []);
  const [fromDate, setFromDate] = useState<string>(() => searchParams.fromDate || "");
  const [toDate, setToDate] = useState<string>(() => searchParams.toDate || "");
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>(() => searchParams.accounts?.split(",").map(Number) || []);


  useEffect(() => {
    setTypes(searchParams.types?.split(",") || []);
    setFromDate(searchParams.fromDate || "");
    setToDate(searchParams.toDate || "");
    setSelectedAccounts(searchParams.accounts?.split(",").map(Number) || []);
  }, [searchParams]);

  const toggleType = (type: string) => {
    setTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleAccount = (account: Account) => {
    setSelectedAccounts((prev) =>
      prev.includes(account.id) ? prev.filter((id) => id !== account.id) : [...prev, account.id]
    );
  }

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (types.length > 0) params.set("types", types.join(","));
    if (fromDate) params.set("fromDate", fromDate);
    if (toDate) params.set("toDate", toDate);
    if (selectedAccounts.length > 0) params.set("accounts", selectedAccounts.join(","));

    let newUrl;
    if (isAccountDetailsPage) {
      newUrl = `/${locale}/accountDetails/${selectedAccounts[0]}/?${params.toString()}`;
      window.location.href = newUrl;
      return;
    }
    newUrl = `/${locale}/transactions/?${params.toString()}`;
    window.location.href = newUrl;
  };

  const clearFilters = () => {
    setTypes([]);
    setFromDate("");
    setToDate("");
    setSelectedAccounts([]);
    const newUrl = `/${locale}/transactions/`;
    window.location.href = newUrl;
  };

  return (
    <div className="info-card relative w-full">
      <div
        className="bg-blue-600 text-white p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <span className="font-bold text-lg">{t('filterTransactions')}</span>
        <span className={`transition-transform ${isExpanded ? "rotate-180" : "rotate-0"}`}>
          ▼
        </span>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-screen" : "max-h-0"}`}
      >
        <div className="p-4 space-y-4">
          <div className="flex space-x-4 justify-between">
            {[t('expense'), t('income'), t('transfer')].map((type) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={types.includes(type)}
                  onChange={() => toggleType(type)}
                  className="rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="capitalize text-gray-700">{type}</span>
              </label>
            ))}
          </div>

          <div className="flex space-x-4 justify-between">
            <div className="flex flex-col">
              <label htmlFor="fromDate" className="mb-1 text-sm text-gray-600">{t('from')}</label>
              <input
                type="date"
                id="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="rounded border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="toDate" className="mb-1 text-sm text-gray-600">{t('to')}</label>
              <input
                type="date"
                id="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="rounded border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm text-gray-600">{t('accounts')}</h4>
            <div className="grid grid-cols-2 gap-2">
              {accounts.map((account) => (
                <label key={account.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedAccounts.includes(account.id)}
                    onChange={() => toggleAccount(account)}
                    className="rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-gray-700">{account.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-4 justify-between">
            <button
              onClick={applyFilters}
              className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {t('applyFilters')}
            </button>
            <button
              onClick={clearFilters}
              className="w-full rounded bg-red-500 p-2 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              {t('clearFilters')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsFilter;