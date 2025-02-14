'use client';
import { useState } from "react";
import { useTranslations } from "next-intl";
import routes from "@/routes/routes";
import { TransactionForm } from "./TransactionForm";
import { Transaction } from "@/types/transactions";

type TransactionsMenuProps = {
  locale: string;
  isNewTransaction: boolean;
  transaction?: Transaction;
}

export const TransactionsMenu = ({ locale, isNewTransaction, transaction }: TransactionsMenuProps) => {
  const t = useTranslations('');
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);

  const closeForm = () => {
    setIsTransactionFormOpen(false);
  }

  return (
    <div className="relative w-full mb-4 flex justify-between">
      <button className="bg-gray-200 text-gray-900 p-4 cursor-pointer flex items-center justify-between rounded-lg"
        onClick={() => setIsTransactionFormOpen(true)}>
        <span className="font-bold text-lg">{isNewTransaction ? t('newTransaction') : t('editTransaction')}</span>
      </button>
      {isNewTransaction && (<button className="bg-gray-200 text-gray-900 p-4 cursor-pointer flex items-center justify-between rounded-lg">
        <span className="font-bold text-lg"
          onClick={() => { window.location.href = routes.transactions({ locale }); }}>
          {t('resetFilters')}
        </span>
      </button>
      )}
      {isTransactionFormOpen && <TransactionForm locale={locale} closeForm={closeForm} transaction={transaction} />}
    </div>
  );
};