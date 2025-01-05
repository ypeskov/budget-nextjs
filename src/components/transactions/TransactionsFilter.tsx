"use client";

import { useState } from "react";

interface TransactionsFilterProps {
  accounts: string[];
  locale: string;
  searchParams: Record<string, string | undefined>;
}

const TransactionsFilter = ({ accounts, locale, searchParams }: TransactionsFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // State initialization for filters
  const [types, setTypes] = useState<string[]>(() => searchParams.types?.split(",") || []);
  const [fromDate, setFromDate] = useState<string>(() => searchParams.fromDate || "");
  const [toDate, setToDate] = useState<string>(() => searchParams.toDate || "");
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(() => searchParams.accounts?.split(",") || []);

  const toggleType = (type: string) => {
    setTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleAccount = (account: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(account) ? prev.filter((a) => a !== account) : [...prev, account]
    );
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (types.length > 0) params.set("types", types.join(","));
    if (fromDate) params.set("fromDate", fromDate);
    if (toDate) params.set("toDate", toDate);
    if (selectedAccounts.length > 0) params.set("accounts", selectedAccounts.join(","));

    const newUrl = `/${locale}/transactions/?${params.toString()}`;
    window.location.href = newUrl;
  };

  return (
    <div className="info-card relative w-full">
      <div
        className="bg-blue-600 text-white p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <span className="font-bold text-lg">Filter Transactions</span>
        <span className={`transition-transform ${isExpanded ? "rotate-180" : "rotate-0"}`}>
          ▼
        </span>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-screen" : "max-h-0"}`}
      >
        <div className="p-4 space-y-4">
          <div className="flex space-x-4">
            {["expense", "income", "transfer"].map((type) => (
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

          <div className="flex space-x-4">
            <div className="flex flex-col">
              <label htmlFor="fromDate" className="mb-1 text-sm text-gray-600">From</label>
              <input
                type="date"
                id="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="rounded border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="toDate" className="mb-1 text-sm text-gray-600">To</label>
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
            <h4 className="mb-2 text-sm text-gray-600">Accounts</h4>
            <div className="grid grid-cols-2 gap-2">
              {accounts.map((account) => (
                <label key={account} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedAccounts.includes(account)}
                    onChange={() => toggleAccount(account)}
                    className="rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-gray-700">{account}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={applyFilters}
            className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsFilter;