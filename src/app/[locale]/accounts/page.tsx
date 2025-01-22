import { cookies } from 'next/headers';
import { Account, BaseCurrency, Accounts } from '@/types/accounts';
import AccountsList from '@/components/accounts/AccountsList';
import FilterControls from "@/components/accounts/FilterControls";

function UnauthorizedMsg() {
  return <div className="text-center text-red-500 text-3xl">Unauthorized</div>;
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function AccountsPage({
  searchParams,
  params
}: {
  searchParams: Promise<Record<string, string | undefined>>;
  params: Promise<{ locale: string }>
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const awaitedSearchParams = await searchParams;
  console.log(awaitedSearchParams);
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value || '';
  const includeHidden = awaitedSearchParams.includeHidden === "true";
  const includeArchived = awaitedSearchParams.includeArchived === "true";
  const archivedOnly = awaitedSearchParams.archivedOnly === "true";

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

  const accounts: Accounts = await accountsResponse.json();
  const baseCurrency: BaseCurrency = await baseCurrencyResponse.json();

  return (
    <>
      <FilterControls locale={locale} />
      <AccountsList accounts={accounts} baseCurrency={baseCurrency} locale={locale} />
    </>
  );
}