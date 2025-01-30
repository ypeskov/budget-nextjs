import { Transaction } from "@/types/transactions";
import { useTranslations } from "next-intl";
import { TransactionsMenu } from "./TransactionsMenu";
import { formatAmount } from "@/utils/amount";

type TransactionDetailsProps = {
  locale: string;
  transaction: Transaction;
}

const formatDateTime = (dateTime: string, locale: string): string => {
  const date = new Date(dateTime);
  const formattedDate = date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  return `${formattedDate}, ${formattedTime}`;
};


export const TransactionDetails = ({ locale, transaction }: TransactionDetailsProps) => {
  const t = useTranslations('');

  const categoryName = transaction.category ? transaction.category.name : '';

  return (
    <>
      <TransactionsMenu locale={locale} isNewTransaction={false} transaction={transaction} />

      <div className="mx-auto bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 border-b border-gray-300 pb-2">
          {t('transactionDetails')}
        </h1>
        <div className="space-y-3 text-2xl">
          <div className="grid grid-cols-2 gap-4 hover:bg-gray-100 p-2 rounded-md">
            <span className="text-gray-900 font-bold">{t('transactionName')}:</span>
            <span className="font-medium text-gray-900">{transaction.label}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 hover:bg-gray-100 p-2 rounded-md">
            <span className="text-gray-900 font-bold">{t('transactionAccount')}:</span>
            <span className="font-medium text-gray-900">{transaction.account.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 hover:bg-gray-100 p-2 rounded-md">
            <span className="text-gray-900 font-bold">{t('transactionAmount')}:</span>
            <span className="font-medium text-gray-900">
              {formatAmount(transaction.amount, locale, transaction.account.currency.code, "currency")}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 hover:bg-gray-100 p-2 rounded-md">
            <span className="text-gray-900 font-bold">{t('transactionCategory')}:</span>
            <span className="font-medium text-gray-900">{categoryName}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 hover:bg-gray-100 p-2 rounded-md">
            <span className="text-gray-900 font-bold">{t('transactionDateTime')}:</span>
            <span className="font-medium text-gray-900">{formatDateTime(transaction.dateTime, locale)}</span>
          </div>
        </div>
      </div>
    </>
  );
}