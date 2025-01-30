"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DateTime } from "luxon";
import { Account } from "@/types/accounts";
import { useTranslations } from "next-intl";
import routes from "@/routes/routes";
import ConfirmPopup from "@/components/common/ConfirmPopup";
import { request } from "@/utils/request/browser";
import apiRoutes from "@/routes/apiRoutes";
import { UnauthorizedError, ValidationError } from "@/utils/request/errors";

interface EditAccountProps {
  account?: Account;
  closeForm: () => void;
  locale: string;
}

type AccountType = {
  id: number;
  type_name: string;
  is_credit: boolean;
}

type Currency = {
  id: number;
  code: string;
  name: string;
}

const parseLocalizedNumber = (value: string): number => {
  const cleanedValue = value.replace(/[^\d.,]/g, '');
  const normalizedValue = cleanedValue.replace(',', '.');
  return parseFloat(normalizedValue);
};

const getFormattedNumber = (value: number, locale: string): string => {
  return value.toLocaleString(locale, {
    style: "decimal",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

const NewAccount: React.FC<EditAccountProps> = ({ account, closeForm, locale }) => {
  const router = useRouter();
  const t = useTranslations('');

  const formattedBalance = account?.balance ? getFormattedNumber(account.balance, locale) : "0.00";
  const formattedCreditLimit = account?.creditLimit ? getFormattedNumber(account.creditLimit, locale) : "0.00";
  const formattedInitialBalance = account?.balance ? getFormattedNumber(account.initialBalance, locale) : "0.00";

  const [error, setError] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<number>(1);
  const [currency, setCurrency] = useState<number>(1);
  const [name, setName] = useState<string>(account?.name ? account.name : "");
  const [balance, setBalance] = useState<string>(formattedBalance);
  const [initialBalance, setInitialBalance] = useState<string>(formattedInitialBalance);
  const [creditLimit, setCreditLimit] = useState<string>(formattedCreditLimit);
  const [openingDate, setOpeningDate] = useState<string>(
    account?.openingDate ? account.openingDate : DateTime.now().toISO()
  );
  const [comment, setComment] = useState<string>("");
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [showInReports, setShowInReports] = useState<boolean>(false);
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
  const [currencies, setCurrencies] = useState([]);
  const [showConfirmPopupArchive, setShowConfirmPopupArchive] = useState(false);

  useEffect(() => {
    if (account) {
      setAccountType(account.accountTypeId);
      setCurrency(account.currencyId);
      setName(account.name);
      setBalance(formattedBalance);
      setCreditLimit(formattedCreditLimit);
      setComment(account.comment);
      setIsHidden(account.isHidden);
      setShowInReports(account.showInReports);
    }
  }, [account, formattedBalance, formattedCreditLimit]);

  useEffect(() => {
    async function fetchData() {
      try {
        const types: AccountType[] = await request(apiRoutes.accountTypes(), {});
        const currencies = await request(apiRoutes.currencies(), {});
        setAccountTypes(types);
        setCurrencies(currencies);
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          router.push(routes.login({ locale }));
        } else if (error instanceof ValidationError) {
          setError(error.message);
        } else {
          console.error("Failed to fetch data", error);
        }
      }
    }

    fetchData();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const accountData = {
      id: account?.id,
      accountTypeId: accountType,
      currencyId: currency,
      name,
      balance: parseLocalizedNumber(balance),
      initialBalance: parseLocalizedNumber(initialBalance),
      creditLimit: parseLocalizedNumber(creditLimit),
      openingDate: DateTime.fromISO(openingDate).toFormat("yyyy-MM-dd'T'HH:mm:ss.SSS"),
      comment,
      isHidden,
      showInReports,
    };

    try {
      const url = account ? apiRoutes.account(account.id) : apiRoutes.accounts();
      const method = account ? "PUT" : "POST";

      const newAccount = await request(url, {
        method,
        body: JSON.stringify(accountData),
      });

      router.push(routes.accountDetails({ locale, accountId: newAccount.id }));
      closeForm();
    } catch (error) {
      if (error instanceof ValidationError) {
        setError(error.message);
      } else {
        console.error(error);
        setError(t('addError'));
      }
    }
  };

  const confirmArchive = async () => {
    const response = await request(apiRoutes.setArchiveStatus(), {
      method: "PUT",
      body: JSON.stringify({
        accountId: account?.id,
        isArchived: true
      }),
    });
    if (!response) {
      throw new Error(`Failed to archive account`);
    }
    
    router.push(routes.accounts({ locale, archivedOnly: true }));
  }

  const cancelArchive = () => {
    setShowConfirmPopupArchive(false);
  }


  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl p-6 relative"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}>
        <button className="absolute top-3 right-3 text-black hover:text-gray-800" onClick={() => closeForm()}>✖</button>

        {/* Display error message */}
        {error && (<div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">{error}</div>)}

        <h1 className="text-xl font-bold mb-4">{t("editAccount")}</h1>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">{t("name")}:</label>
            <input type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">{t("currency")}:</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(parseInt(e.target.value, 10))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              {currencies.map((currency: Currency) => (
                <option key={currency.id} value={currency.id}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">{t("accountType")}:</label>
            <select
              value={accountType}
              onChange={(e) => setAccountType(parseInt(e.target.value, 10))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              {accountTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.type_name}
                </option>
              ))}
            </select>
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
            <label className="block text-sm font-medium">{t("initialBalance")}:</label>
            <input
              type="text"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
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
              value={DateTime.fromISO(openingDate).toFormat("yyyy-MM-dd'T'HH:mm")}
              onChange={(e) => {
                const newDate = DateTime.fromFormat(e.target.value, "yyyy-MM-dd'T'HH:mm");
                setOpeningDate(newDate.isValid ? newDate.toISO() : openingDate);
              }}
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
          <div className="flex justify-between">
            <button type="button" className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={() => closeForm()}>
              {t("cancel")}
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {t("save")}
            </button>
            {account?.id && (
              <button type="button" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={() => setShowConfirmPopupArchive(true)}>
                {t("archive")}
              </button>
            )}
          </div>
        </form>
      </div>

      {showConfirmPopupArchive && (
        <ConfirmPopup
          title={t('confirmArchive')}
          message={t('confirmArchiveMessage')}
          cancelButtonText={t('cancel')}
          confirmButtonText={t('confirm')}
          onConfirm={confirmArchive}
          onCancel={cancelArchive}
        />
      )}
    </div>
  );
};

export default NewAccount;