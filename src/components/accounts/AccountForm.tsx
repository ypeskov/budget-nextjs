"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DateTime } from "luxon";
import { Account } from "@/types/accounts";
import { getCookie } from "@/utils/cookies";
import { useTranslations } from "next-intl";

interface NewAccountProps {
  account: Account;
  closeForm: () => void;
  locale: string;
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const parseLocalizedNumber = (value: string): number => {
  const cleanedValue = value.replace(/[^\d.,]/g, '');
  const normalizedValue = cleanedValue.replace(',', '.');
  return parseFloat(normalizedValue);
};

const NewAccount: React.FC<NewAccountProps> = ({ account, closeForm, locale }) => {
  const router = useRouter();
  const t = useTranslations("AccountDetailsPage");

  const formattedBalance = account.balance
    ? account.balance.toLocaleString(locale, {
        style: "decimal",
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      })
    : "0.00";

  const [accountType, setAccountType] = useState<number>(1);
  const [currency, setCurrency] = useState<number>(1);
  const [name, setName] = useState<string>(account.name);
  const [balance, setBalance] = useState<string>(formattedBalance);
  const [creditLimit, setCreditLimit] = useState<string>('0.00');
  const [openingDate, setOpeningDate] = useState<string>(DateTime.now().toISO());
  const [comment, setComment] = useState<string>("");
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [showInReports, setShowInReports] = useState<boolean>(false);
  const [accountTypes, setAccountTypes] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  const authToken = getCookie("authToken");
  const headers: HeadersInit = authToken ? { "auth-token": authToken } : {};

  useEffect(() => {
    if (account) {
      setAccountType(account.accountTypeId);
      setCurrency(account.currencyId);
      setName(account.name);
      setBalance(formattedBalance);
      setCreditLimit(account.creditLimit.toString());
      setOpeningDate(DateTime.fromISO(account.openingDate).toISO() as string);
      setComment(account.comment);
      setIsHidden(account.isHidden);
      setShowInReports(account.showInReports);
    }
  }, [account]);

  useEffect(() => {
    async function fetchData() {
      try {
        const types = await fetch(`${apiBaseUrl}/accounts/types/`, { headers }).then((res) =>
          res.json()
        );
        const currencies = await fetch(`${apiBaseUrl}/currencies/`, { headers }).then((res) =>
          res.json()
        );
        setAccountTypes(types);
        setCurrencies(currencies);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    }

    fetchData();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedBalance = parseLocalizedNumber(balance);
    const normalizedCreditLimit = parseLocalizedNumber(creditLimit);

    const accountData = {
      id: account?.id,
      accountTypeId: accountType,
      currencyId: currency,
      name,
      balance: normalizedBalance,
      creditLimit: normalizedCreditLimit,
      openingDate,
      comment,
      isHidden,
      showInReports,
    };

    try {
      if (account) {
        headers["auth-token"] = authToken == null ? "" : authToken;
        headers["Content-Type"] = "application/json";
        await fetch(`${apiBaseUrl}/accounts/${account.id}`, {
          method: "PUT",
          headers: headers,
          body: JSON.stringify(accountData),
        });
      } else {
        await fetch("/api/accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(accountData),
        });
      }
      router.push(`/${locale}/accountDetails/${account.id}`);
      closeForm();
    } catch (error) {
      console.error("Failed to submit form", error);
    }
  };

  const closeNewAccForm = () => {
    closeForm();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className="rounded-lg shadow-lg w-1/3 p-6"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={closeNewAccForm}
        >
          ✖
        </button>
        <h1 className="text-xl font-bold mb-4">{t("editAccount")}</h1>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">{t("name")}:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">{t("balance")}:</label>
            <input
              type="text"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">{t("creditLimit")}:</label>
            <input
              type="text"
              value={creditLimit}
              onChange={(e) => setCreditLimit(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">{t("openingDate")}:</label>
            <input
              type="datetime-local"
              value={openingDate}
              onChange={(e) => setOpeningDate(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">{t("comment")}:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">
              <input
                type="checkbox"
                checked={isHidden}
                onChange={(e) => setIsHidden(e.target.checked)}
              />{" "}
              {t("isHidden")}
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">
              <input
                type="checkbox"
                checked={showInReports}
                onChange={(e) => setShowInReports(e.target.checked)}
              />{" "}
              {t("showInReports")}
            </label>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={closeNewAccForm}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAccount;