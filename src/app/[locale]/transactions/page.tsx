import { getTranslations } from 'next-intl/server';
import TransactionsListView from '@/components/transactions/TransactionsListView';
import { getAuthToken } from '@/utils/auth';
import { Transaction } from '@/types/transactions';

interface TransactionsPageProps {
  locale: string;
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const transactionsPerPage = Number(process.env.NEXT_PUBLIC_TRANSACTIONS_PER_PAGE);

async function fetchWithErrorHandling(url: string): Promise<any> {
  const response = await fetch(url, {
    headers: { "auth-token": await getAuthToken() },
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json();
    console.log(error.detail);
    throw new Error(`HTTP ${response.status}: ${error.detail || 'Error occurred'}`);
  }

  return response.json();
}

async function fetchTransactions(): Promise<Transaction[]> {
  const transactionsUrl = `${apiBaseUrl}/transactions/?`
    + `&per_page=${transactionsPerPage}`
    + "&page=1";

  return fetchWithErrorHandling(transactionsUrl);
}

const TransactionsPage = async ({ params }: { params: Promise<TransactionsPageProps> }) => {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const t = await getTranslations('');

  const transactions = await fetchTransactions();

  return (
    <>
      <TransactionsListView transactions={transactions} locale={locale} />
    </>
  );
};

export default TransactionsPage;