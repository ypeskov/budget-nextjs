'use client';

import { useTranslations } from "next-intl";
import { Transaction } from "@/types/transactions";
import { useEffect, useState } from "react";
import ApiRoutes from "@/routes/apiRoutes";
import { getCookie } from "@/utils/cookies";
import { Account } from "@/types/accounts";
import { Category } from "@/types/categories";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import routes from "@/routes/routes";

interface TransactionFormProps {
  locale: string;
  closeForm: () => void;
  transaction?: Transaction;
}

type TransactionRequest = {
  id?: number;
  accountId?: number;
  label: string;
  amount: number;
  categoryId: number;
  dateTime: string;
  notes: string;
  isTransfer: boolean;
  isIncome: boolean;
}

const fetchAccounts = async () => {
  const authToken = getCookie('authToken');
  const headers: HeadersInit = authToken ? { "auth-token": authToken } : {};
  const accounts = await fetch(ApiRoutes.accounts(), { headers });
  if (accounts.ok) {
    return accounts.json();
  }
  return [];
}

const fetchCategories = async () => {
  const authToken = getCookie('authToken');
  const headers: HeadersInit = authToken ? { "auth-token": authToken } : {};
  const categories = await fetch(ApiRoutes.categories(), { headers });
  if (categories.ok) {
    return categories.json();
  }
  return [];
}

const submitTransaction = async (transactionRequest: TransactionRequest, isNewTransaction: boolean): Promise<Transaction | null> => {
  const authToken = getCookie('authToken');
  const headers: HeadersInit = authToken ? { "auth-token": authToken } : {};

  const method = isNewTransaction ? 'POST' : 'PUT';
  const response = await fetch(ApiRoutes.submitTransaction(), {
    method: method,
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(transactionRequest)
  });
  if (response.ok) {
    return response.json();
  }
  console.error(response);
  return null;
}

export const TransactionForm = ({ locale, closeForm, transaction }: TransactionFormProps) => {
  const t = useTranslations('');
  const [label, setLabel] = useState(transaction?.label || '');
  const [account, setAccount] = useState(transaction?.account.id || '');
  const [amount, setAmount] = useState(transaction?.amount || 0);
  const [category, setCategory] = useState(transaction?.category?.id || '');
  const [date, setDate] = useState(transaction ? new Date(transaction.dateTime).toISOString().split('T')[0] : '');
  const [time, setTime] = useState(transaction ? new Date(transaction.dateTime).toISOString().split('T')[1].split('.')[0] : '');
  const [notes, setNotes] = useState(transaction?.notes || '');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const router = useRouter();
  useEffect(() => {
    fetchAccounts().then(setAccounts);
    fetchCategories().then(setCategories);
  }, []);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const transactionRequest: TransactionRequest = {
      id: transaction?.id || undefined,
      accountId: Number(account),
      label,
      amount,
      categoryId: Number(category),
      dateTime: DateTime.fromISO(date + 'T' + time).toFormat("yyyy-MM-dd'T'HH:mm:ss.SSS"),
      notes,
      isTransfer: false,
      isIncome: false,
    };

    const response = await submitTransaction(transactionRequest, transaction?.id ? false : true);
    if (response) {
      router.push(routes.transactionDetails({ locale, transactionId: response.id }));
      closeForm();
    }
  };

  const handlePopupClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className="rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl p-6 relative"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
        onClick={handlePopupClick}
      >
        <button
          className="absolute top-2 right-2 text-black hover:text-gray-800 cursor-pointer text-2xl border-black bg-gray-300"
          onClick={() => closeForm()}
        >
          ✖
        </button>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="label" className="block text-sm font-medium">
              {t('label')}
            </label>
            <input
              type="text"
              id="label"
              name="label"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('transactionName')}
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="account" className="block text-sm font-medium">
              {t('account')}
            </label>
            <select
              id="account"
              name="account"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              value={account}
              onChange={(e) => setAccount(e.target.value)}
            >
              <option value="">{t('selectAccount')}</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium">
              {t('amount')}
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('enterAmount')}
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium">
              {t('category')}
            </label>
            <select
              id="category"
              name="category"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">{t('selectCategory')}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="date" className="block text-sm font-medium">
                {t('date')}
              </label>
              <input
                type="date"
                id="date"
                name="date"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="time" className="block text-sm font-medium">
                {t('time')}
              </label>
              <input
                type="time"
                id="time"
                name="time"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium">
              {t('notes')}
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder={t('additionalNotes')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {t('submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};