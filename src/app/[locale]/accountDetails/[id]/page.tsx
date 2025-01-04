import { DateTime } from "luxon";
import TransactionsListView from "@/components/transactions/TransactionsListView";
import AccountDetails from "@/components/accounts/AccountDetails";
import { Account } from "@/types/accounts";
import { Transaction } from "@/types/transactions";
import { getAuthToken } from "@/utils/auth";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const transactionsPerPage = Number(process.env.NEXT_PUBLIC_TRANSACTIONS_PER_PAGE);

interface RequestParams {
  id: string;
  locale: string;
}

async function fetchAccount(id: number): Promise<Account> {
  const authToken = await getAuthToken();

  const account: Account = await fetch(`${apiBaseUrl}/accounts/${id}`, {
    headers: { "auth-token": authToken },
    cache: "no-store",
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching account details", error);
      throw error;
    });

  return account;
}

async function fetchTransactions(accountId: number): Promise<Transaction[]> {
  const authToken = await getAuthToken();

  const transactionsUrl = `${apiBaseUrl}/transactions/?accounts=${accountId}`
    + `&per_page=${transactionsPerPage}`
    + "&page=1";

  const transactions = await fetch(transactionsUrl, {
    headers: { "auth-token": authToken },
    cache: "no-store",
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching transactions", error);
      throw error;
    });

  return transactions;
}

export default async function AccountDetailsPage({ params }: { params: Promise<RequestParams> }) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  const locale = resolvedParams.locale;
  

  const [account, transactions] = await Promise.all([
    fetchAccount(id),
    fetchTransactions(id),
  ]);

  return (
    <>
      <AccountDetails account={account} locale={locale} />
      <TransactionsListView transactions={transactions} locale={locale} accountId={id} />
    </>
  );
}