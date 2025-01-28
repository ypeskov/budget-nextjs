import TransactionsListView from "@/components/transactions/TransactionsListView";
import AccountDetails from "@/components/accounts/AccountDetails";
import { Account } from "@/types/accounts";
import { Transaction } from "@/types/transactions";
import TransactionsFilter from '@/components/transactions/TransactionsFilter';
import { request } from "@/utils/request/api";
import routes from "@/routes/apiRoutes";

interface RequestParams {
  params: Promise<{ id: string, locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

async function fetchAccount(id: number): Promise<Account> {
  return request(routes.account(id), {
    cache: "no-store",
  });
}

async function fetchTransactions(accountId: number): Promise<Transaction[]> {
  const transactionsUrl = routes.transactions(1, { accounts: String(accountId) });
  return request(transactionsUrl, {
    cache: "no-store",
  });
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

      <div className="mt-4 mb-4">
        <TransactionsFilter accounts={[account]} locale={locale} searchParams={resolvedSearchParams} />
      </div>

      <TransactionsListView transactions={transactions} locale={locale} searchParams={resolvedSearchParams} />
    </>
  );
}