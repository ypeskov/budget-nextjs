'use server';

import { BaseCurrency, Accounts } from '@/types/accounts';
import AccountsList from '@/components/accounts/AccountsList';
import FilterControls from "@/components/accounts/FilterControls";
import { request } from "@/utils/request/api";
import apiRoutes from "@/routes/apiRoutes";
import { cookies } from 'next/headers';
import HiddenAuth from '@/components/common/HiddenAuth';

type AccountsPageParams = {
  searchParams: Promise<Record<string, string | undefined>>;
  params: Promise<{ locale: string }>
}

export async function setAuthToken(token: string) {
  "use server";
  const cookieStore = await cookies();
  console.log("setAuthToken called on server with token:", token);
  cookieStore.set('authToken', token);
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
  const baseCurrencyUrl = apiRoutes.baseCurrency();

  // Fetch accounts and base currency on the server
  const [accounts, baseCurrency]: 
    [{ data: Accounts, newToken: string | null }, { data: BaseCurrency, newToken: string | null } ] = await Promise.all([
    request(accountsUrl, {  cache: 'no-store' }),
    request(baseCurrencyUrl, { cache: 'force-cache' }),
  ]);

  const newAccessToken = accounts.newToken || '';

  return (
    <>
      <HiddenAuth newAccessToken={newAccessToken} />
      <FilterControls locale={locale} />
      <AccountsList accounts={accounts.data} baseCurrency={baseCurrency.data} locale={locale} />
    </>
  );
}