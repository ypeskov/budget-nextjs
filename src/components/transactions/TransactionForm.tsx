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
  targetAccountId: number | null;
  targetAmount: number | null;
  categoryId: number | null;
  dateTime: string;
  notes: string;
  isTransfer: boolean;
  isIncome: boolean;
};

const fetchAccounts = async () => {
  const authToken = getCookie('authToken');
  const headers: HeadersInit = authToken ? { "auth-token": authToken } : {};
  const accounts = await fetch(ApiRoutes.accounts(), { headers });
  if (accounts.ok) {
    return accounts.json();
  }
  return [];
};

const fetchCategories = async () => {
  const authToken = getCookie('authToken');
  const headers: HeadersInit = authToken ? { "auth-token": authToken } : {};
  const categories = await fetch(ApiRoutes.categories(), { headers });
  if (categories.ok) {
    const data: Category[] = await categories.json();
    return {
      expenseCategories: data.filter(category => category.isIncome === false),
      incomeCategories: data.filter(category => category.isIncome === true),
    };
  }
  return { expenseCategories: [], incomeCategories: [] };
};

const submitTransaction = async (transactionRequest: TransactionRequest, isNewTransaction: boolean): Promise<Transaction | null> => {
  const authToken = getCookie('authToken');
  const headers: HeadersInit = authToken ? { "auth-token": authToken } : {};

  const method = isNewTransaction ? 'POST' : 'PUT';
  const response = await fetch(ApiRoutes.submitTransaction(), {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(transactionRequest),
  });
  if (response.ok) {
    return response.json();
  }
  console.error(response);
  return null;
};

export const TransactionForm = ({ locale, closeForm, transaction }: TransactionFormProps) => {
  const t = useTranslations('');
  const [label, setLabel] = useState(transaction?.label || '');
  const [account, setAccount] = useState(transaction?.account.id || '');
  const [amount, setAmount] = useState(transaction?.amount || 0);
  const [transactionType, setTransactionType] = useState(
    transaction?.isTransfer ? 'transfer' : transaction?.isIncome ? 'income' : 'expense'
  ); // "transfer", "income", "expense"
  const [category, setCategory] = useState(transaction?.category?.id || '');
  const [date, setDate] = useState(transaction ?
    DateTime.fromISO(transaction.dateTime).toFormat("yyyy-MM-dd") :
    DateTime.now().toFormat("yyyy-MM-dd"));
  const [time, setTime] = useState(transaction ?
    DateTime.fromISO(transaction.dateTime).toFormat("HH:mm") :
    DateTime.now().toFormat("HH:mm"));
  const [notes, setNotes] = useState(transaction?.notes || '');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [targetAccount, setTargetAccount] = useState(transaction?.targetAccountId || '');
  const [targetAmount, setTargetAmount] = useState(transaction?.targetAmount || 0);

  const router = useRouter();

  useEffect(() => {
    fetchAccounts().then(setAccounts);
    fetchCategories().then(({ expenseCategories, incomeCategories }) => {
      setExpenseCategories(expenseCategories);
      setIncomeCategories(incomeCategories);
    });
  }, []);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const transactionRequest: TransactionRequest = {
      id: transaction?.id || undefined,
      accountId: Number(account),
      targetAccountId: transactionType === 'transfer' ? Number(targetAccount) : null,
      label,
      amount,
      targetAmount: transactionType === 'transfer' ? Number(targetAmount) : null,
      categoryId: transactionType !== 'transfer' ? Number(category) : null,
      dateTime: DateTime.fromISO(date + 'T' + time).toFormat("yyyy-MM-dd'T'HH:mm:ss.SSS"),
      notes,
      isTransfer: transactionType === 'transfer',
      isIncome: transactionType === 'income',
    };

    const response = await submitTransaction(transactionRequest, transaction?.id ? false : true);
    if (response) {
      router.push(routes.transactionDetails({ locale, transactionId: response.id }));
      closeForm();
    }
  };

  const handleTransactionTypeChange = (type: string) => {
    setTransactionType(type);
    if (type === 'transfer') {
      setCategory('');
    }
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
      >
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-black hover:text-gray-800 cursor-pointer text-2xl border-black bg-gray-300"
          onClick={() => closeForm()}
        >
          ✖
        </button>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Transaction Type Switcher */}
          <div className="flex justify-around mb-4">
            <button type="button"
              className={`px-4 py-2 rounded-md ${transactionType === 'expense' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleTransactionTypeChange('expense')} >
              {t('expense')}
            </button>
            <button type="button"
              className={`px-4 py-2 rounded-md ${transactionType === 'income' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleTransactionTypeChange('income')} >
              {t('income')}
            </button>
            <button type="button"
              className={`px-4 py-2 rounded-md ${transactionType === 'transfer' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleTransactionTypeChange('transfer')} >
              {t('transfer')}
            </button>
          </div>

          {/* Label */}
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

          {/* Account */}
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
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
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

          {transactionType === 'transfer' && (
            <>
              {/* Target Account */}
              <div>
                <label htmlFor="targetAccount" className="block text-sm font-medium">
                  {t('targetAccount')}
                </label>
                <select
                  id="targetAccount"
                  name="targetAccount"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                  value={targetAccount}
                  onChange={(e) => setTargetAccount(e.target.value)}
                >
                  <option value="">{t('selectTargetAccount')}</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Amount */}
              <div>
                <label htmlFor="targetAmount" className="block text-sm font-medium">
                  {t('targetAmount')}
                </label>
                <input
                  type="number"
                  id="targetAmount"
                  name="targetAmount"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('enterTargetAmount')}
                  required
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Number(e.target.value))}
                />
              </div>
            </>
          )}

          {/* Category */}
          {transactionType !== 'transfer' && (
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
                {(transactionType === 'expense' ? expenseCategories : incomeCategories).map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date and time */}
          <div className="flex space-x-4">
            {/* Date */}
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

            {/* Time */}
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

          {/* Notes */}
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

          {/* Submit button */}
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