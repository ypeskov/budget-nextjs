import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import TransactionsListView from '@/components/transactions/TransactionsListView';
import { Transaction } from '@/types/transactions';
import { prepareRequestUrl } from '@/utils/transactions';
import TransactionsFilter from '@/components/transactions/TransactionsFilter';
import { Account } from '@/types/accounts';
import { TransactionsMenu } from '@/components/transactions/TransactionsMenu';
import { request } from '@/utils/request/api';
import apiRoutes from '@/routes/apiRoutes';
import { UnauthorizedError } from '@/utils/request/errors';
import routes from '@/routes/routes';
import { redirect } from 'next/navigation';
import HiddenAuth from '@/components/common/HiddenAuth';

interface TransactionsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

async function fetchWithErrorHandling(url: string): Promise<{ data: Transaction[] | Account[] | null, newToken: string | null }> {
  try {
    const response = await request(url, { cache: "no-store" });

    return { data: response.data, newToken: response.newToken };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect(routes.login({}));
    }
    return { data: null, newToken: null };
  }
}

async function fetchTransactions(searchParams: Record<string, string | undefined>): Promise<{ transactions: Transaction[], newToken: string | null }> {
  const transactionsUrl = prepareRequestUrl(1, searchParams); // get only the first page of transactions
  const { data: transactions, newToken: transactionsNewToken } = await fetchWithErrorHandling(transactionsUrl);
  return { transactions: transactions as Transaction[], newToken: transactionsNewToken };
}

async function fetchAccounts(): Promise<{ accounts: Account[], newToken: string | null }> {
  const accountsUrl = apiRoutes.accounts();
  const { data: accounts, newToken: accountsNewToken } = await fetchWithErrorHandling(accountsUrl);
  return { accounts: accounts as Account[], newToken: accountsNewToken };
}

const TransactionsPage = async ({ params, searchParams }: TransactionsPageProps) => {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const resolvedSearchParams = await searchParams;

  const { transactions, newToken: transactionsNewToken } = await fetchTransactions(resolvedSearchParams);
  const { accounts, newToken: accountsNewToken } = await fetchAccounts();

  const newAccessToken = transactionsNewToken || accountsNewToken || '';

  return (
    <>
      <NextIntlClientProvider locale={locale} messages={await getMessages()}>
        <HiddenAuth newAccessToken={newAccessToken} />
        <TransactionsMenu locale={locale} isNewTransaction={true} />
        <TransactionsFilter accounts={accounts} locale={locale} searchParams={resolvedSearchParams} />
        <TransactionsListView transactions={transactions} locale={locale} searchParams={resolvedSearchParams} />
      </NextIntlClientProvider>
    </>
  );
};

export default TransactionsPage;