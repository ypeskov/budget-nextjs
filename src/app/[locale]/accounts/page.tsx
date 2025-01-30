import { BaseCurrency, Accounts } from '@/types/accounts';
import AccountsList from '@/components/accounts/AccountsList';
import FilterControls from "@/components/accounts/FilterControls";
import { request } from "@/utils/request/api";
import apiRoutes from "@/routes/apiRoutes";

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

  const accountsSearchParams = new URLSearchParams({
    includeHidden: awaitedSearchParams.includeHidden === "true" ? "true" : "false",
    includeArchived: awaitedSearchParams.includeArchived === "true" ? "true" : "false",
    archivedOnly: awaitedSearchParams.archivedOnly === "true" ? "true" : "false",
  });
  const accountsUrl = `${apiRoutes.accounts()}?${accountsSearchParams.toString()}`;
  console.log(accountsUrl);
  const baseCurrencyUrl = apiRoutes.baseCurrency();
  console.log(baseCurrencyUrl);
  
  // Fetch accounts and base currency on the server
  const [accounts, baseCurrency]: [Accounts, BaseCurrency] = await Promise.all([
    request(accountsUrl, {  cache: 'no-store' }),
    request(baseCurrencyUrl, { cache: 'force-cache' }),
  ]);

  return (
    <>
      <FilterControls locale={locale} />
      <AccountsList accounts={accounts} baseCurrency={baseCurrency} locale={locale} />
    </>
  );
}