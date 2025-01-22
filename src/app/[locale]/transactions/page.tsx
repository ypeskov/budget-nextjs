import { getTranslations } from 'next-intl/server';
import TransactionsListView from '@/components/transactions/TransactionsListView';
import { getAuthToken } from '@/utils/auth';
import { Transaction } from '@/types/transactions';
import { prepareRequestUrl } from '@/utils/transactions';
import TransactionsFilter from '@/components/transactions/TransactionsFilter';
import { Account } from '@/types/accounts';

interface TransactionsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchWithErrorHandling(url: string): Promise<any> {
  const response = await fetch(url, {
    headers: { "auth-token": await getAuthToken() },
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`HTTP ${response.status}: ${error.detail || 'Error occurred'}`);
  }

  return response.json();
}

async function fetchTransactions(searchParams: Record<string, string | undefined>): Promise<Transaction[]> {
  const transactionsUrl = prepareRequestUrl(1, searchParams); // get only the first page of transactions
  const transactions = await fetchWithErrorHandling(transactionsUrl);
  return transactions;
}

async function fetchAccounts(): Promise<Account[]> {
  const accountsUrl = `${apiBaseUrl}/accounts?includeHidden=true`;
  return fetchWithErrorHandling(accountsUrl);
}

const TransactionsPage = async ({ params, searchParams }: TransactionsPageProps) => {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations('');

  const transactions = await fetchTransactions(resolvedSearchParams);
  const accounts = await fetchAccounts();

  return (
    <>
      <TransactionsFilter accounts={accounts} locale={locale} searchParams={resolvedSearchParams} />
      <TransactionsListView transactions={transactions} locale={locale} searchParams={resolvedSearchParams} />
    </>
  );
};

export default TransactionsPage;