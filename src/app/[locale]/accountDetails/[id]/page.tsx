import { DateTime } from "luxon";
import TransactionsListView from "@/components/transactions/TransactionsListView";
import NewAccount from "@/components/accounts/NewAccount";
import getRequestConfig from "@/i18n/request";
// import { Services } from "@/services/servicesConfig";
import { CREDIT_CARD_ACCOUNT_TYPE_ID } from "@/constants";
import { Account } from "@/types/accounts";
import { Transaction } from "@/types/transactions";
import { getAuthToken } from "@/utils/auth";
import { get } from "http";

const apiBaseUrl = process.env.API_BASE_URL;
const transactionsPerPage = process.env.TRANSACTIONS_PER_PAGE;

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

export default async function AccountDetails({ params }: { params: Promise<RequestParams> }) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  const locale = resolvedParams.locale;

  const [account, transactions] = await Promise.all([
    fetchAccount(id),
    fetchTransactions(id),
  ]);

  const formattedBalance = account.balance
    ? account.balance.toLocaleString(locale, {
      style: "decimal",
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })
    : "0.00";

  const availableBalanceCC = account.balance + account.creditLimit;

  return (
    <>
      <div className="info-card">
        <div className="flex justify-between items-center">
          <span>
            Account: <strong>{account.name}</strong>
          </span>
          <button className="text-blue-500">
            <img
              src="/images/icons/edit-icon.svg"
              alt="Edit account"
              width="24"
              height="24"
              title="Edit Account"
            />
          </button>
        </div>

        <div className="flex justify-between items-center mt-2">
          <span>
            Balance: <b>{formattedBalance}</b>
            {account.accountTypeId === CREDIT_CARD_ACCOUNT_TYPE_ID && (
              <span>({availableBalanceCC})</span>
            )}
            &nbsp;{account?.currency?.code}
          </span>
          <button className="text-red-500">
            <img
              src="/images/icons/delete-icon.svg"
              alt="Delete account"
              width="24"
              height="24"
              title="Delete Account"
            />
          </button>
        </div>

        <div className="mt-2">
          <span>
            Created:{" "}
            <b>{DateTime.fromISO(account?.openingDate).toISODate()}</b>
          </span>
        </div>
      </div>

      <TransactionsListView transactions={transactions} locale={locale} />
    </>
  );
}