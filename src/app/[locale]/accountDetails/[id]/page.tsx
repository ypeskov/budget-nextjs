import { DateTime } from "luxon";
import TransactionsListView from "@/components/transactions/TransactionsListView";
import AccountDetails from "@/components/accounts/AccountDetails";
import { Account } from "@/types/accounts";
import { Transaction } from "@/types/transactions";
import { getAuthToken } from "@/utils/auth";
import { prepareRequestUrl } from "@/utils/transactions";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

interface RequestParams {
  params: Promise<{ id: string, locale : string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

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

async function fetchAccount(id: number): Promise<Account> {
  return fetchWithErrorHandling(`${apiBaseUrl}/accounts/${id}`);
}

async function fetchTransactions(accountId: number): Promise<Transaction[]> {
  const transactionsUrl = prepareRequestUrl(1, { accounts: String(accountId) });
  return fetchWithErrorHandling(transactionsUrl);
}

export default async function AccountDetailsPage({ params, searchParams }: RequestParams) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  const locale = resolvedParams.locale;
  const resolvedSearchParams = await searchParams;
  resolvedSearchParams['accounts'] = String(id);

  let account: Account | undefined;
  let transactions: Transaction[] | undefined;
  try {
    [account, transactions] = await Promise.all([
      fetchAccount(id),
      fetchTransactions(id),
    ]);
  } catch (error) {
    console.error("Error fetching account details and transactions", error);
  }

  if (!account || !transactions) {
    return <div className="error-msg">Error loading account details</div>;
  }

  return (
    <>
      <AccountDetails account={account} locale={locale} />
      <TransactionsListView transactions={transactions} locale={locale} searchParams={resolvedSearchParams} />
    </>
  );
}