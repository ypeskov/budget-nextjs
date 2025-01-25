'use client';

import routes from "@/routes/routes";
import { useTranslations } from "next-intl";

interface TransactionFormProps {
  locale: string;
  closeForm: () => void;
}

export const TransactionForm = ({ locale, closeForm }: TransactionFormProps) => {
  const t = useTranslations('');

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form submitted');
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
            >
              <option value="">{t('selectAccount')}</option>
              <option value="account1">Account 1</option>
              <option value="account2">Account 2</option>
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
            >
              <option value="">{t('selectCategory')}</option>
              <option value="category1">Category 1</option>
              <option value="category2">Category 2</option>
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