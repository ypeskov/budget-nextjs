import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
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

interface TransactionsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

async function fetchWithErrorHandling(url: string): Promise<Transaction[] | Account[] | null> {
  try {
    const response = await request(url, { cache: "no-store" });

    return response;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect(routes.login({}));
    }
    return null;
  }
}

async function fetchTransactions(searchParams: Record<string, string | undefined>): Promise<Transaction[]> {
  const transactionsUrl = prepareRequestUrl(1, searchParams); // get only the first page of transactions
  const transactions = await fetchWithErrorHandling(transactionsUrl);
  return transactions as Transaction[];
}

async function fetchAccounts(): Promise<Account[]> {
  const accountsUrl = apiRoutes.accounts();
  const accounts = await fetchWithErrorHandling(accountsUrl);
  return accounts as Account[];
}

const TransactionsPage = async ({ params, searchParams }: TransactionsPageProps) => {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const resolvedSearchParams = await searchParams;

  const transactions = await fetchTransactions(resolvedSearchParams);
  const accounts = await fetchAccounts();

  return (
    <>
      <NextIntlClientProvider locale={locale} messages={await getMessages()}>
        <TransactionsMenu locale={locale} isNewTransaction={true} />
        <TransactionsFilter accounts={accounts} locale={locale} searchParams={resolvedSearchParams} />
        <TransactionsListView transactions={transactions} locale={locale} searchParams={resolvedSearchParams} />
      </NextIntlClientProvider>
    </>
  );
};

export default TransactionsPage;