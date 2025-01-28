import { BaseCurrency, Accounts } from '@/types/accounts';
import AccountsList from '@/components/accounts/AccountsList';
import FilterControls from "@/components/accounts/FilterControls";
import { request } from "@/utils/request/api";
import routes from "@/routes/apiRoutes";
import { getAuthToken } from "@/utils/auth";

type AccountsPageParams = {
  searchParams: Promise<Record<string, string | undefined>>;
  params: Promise<{ locale: string }>
}

export default async function AccountsPage({
  searchParams,
  params
}: AccountsPageParams) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const awaitedSearchParams = await searchParams;
  const authToken = await getAuthToken();

  const accountsSearchParams = new URLSearchParams({
    includeHidden: awaitedSearchParams.includeHidden === "true" ? "true" : "false",
    includeArchived: awaitedSearchParams.includeArchived === "true" ? "true" : "false",
    archivedOnly: awaitedSearchParams.archivedOnly === "true" ? "true" : "false",
  });
  const accountsUrl = `${routes.accounts()}?${accountsSearchParams.toString()}`;
  const baseCurrencyUrl = routes.baseCurrency();

  // Fetch accounts and base currency on the server
  const [accounts, baseCurrency]: [Accounts, BaseCurrency] = await Promise.all([
    request(accountsUrl, { headers: { 'auth-token': authToken }, cache: 'no-store' }),
    request(baseCurrencyUrl, { headers: { 'auth-token': authToken }, cache: 'force-cache' }),
  ]);

  return (
    <>
      <FilterControls locale={locale} />
      <AccountsList accounts={accounts} baseCurrency={baseCurrency} locale={locale} />
    </>
  );
}