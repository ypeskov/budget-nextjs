import { cookies } from 'next/headers';
import { Account, BaseCurrency, Accounts } from '@/types/accounts';
import AccountsList from '@/components/accounts/AccountsList';
import FilterControls from "@/components/accounts/FilterControls";

function UnauthorizedMsg() {
  return <div className="text-center text-red-500 text-3xl">Unauthorized</div>;
}

export default async function AccountsPage({
  searchParams
}: {
  searchParams: Record<string, string | undefined>,
}) {
  const awaitedSearchParams = await searchParams;
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value || '';

  if (!authToken) {
    return <UnauthorizedMsg />;
  }

  const includeHidden = awaitedSearchParams.includeHidden === "true";
  const includeArchived = awaitedSearchParams.includeArchived === "true";
  const archivedOnly = awaitedSearchParams.archivedOnly === "true";

  let error = null;
  const apiBaseUrl = process.env.API_BASE_URL;
  const accountsUrl = `${apiBaseUrl}/accounts/?includeHidden=${includeHidden}` +
    `&includeArchived=${includeArchived}` +
    `&archivedOnly=${archivedOnly}`;
  const baseCurrencyUrl = `${apiBaseUrl}/settings/base-currency`;

  // Fetch accounts and base currency on the server
  const [accountsResponse, baseCurrencyResponse] = await Promise.all([
    fetch(accountsUrl, { headers: { 'auth-token': authToken }, cache: 'no-store' }),
    fetch(baseCurrencyUrl, { headers: { 'auth-token': authToken }, cache: 'force-cache' }),
  ]);

  if (!accountsResponse.ok || !baseCurrencyResponse.ok) {
    if (accountsResponse.status === 401 || baseCurrencyResponse.status === 401) {
      return <UnauthorizedMsg />;
    }
    const error = 'Some error occurred while fetching data';
    return <div className="text-center text-red-500 text-3xl">{error}</div>;
  }

  const balanceClass = (balance: number) => (balance < 0 ? 'text-red-500' : 'text-green-500');

  const availableBalanceCC = (acc: Account) => acc.balance + acc.creditLimit;

  const amountPrecision = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };

  const accounts: Accounts = await accountsResponse.json();
  const baseCurrency: BaseCurrency = await baseCurrencyResponse.json();

  return (
    <>
      <FilterControls />
      <AccountsList accounts={accounts} baseCurrency={baseCurrency} />
    </>
  );
}