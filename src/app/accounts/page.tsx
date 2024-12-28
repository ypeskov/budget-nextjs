import { cookies } from 'next/headers';
import Link from 'next/link';
import { Account, BaseCurrency, Accounts } from '@/types/accounts';
import AccountsList from '@/components/accounts/AccountsList';

export default async function AccountsPage({ params }: { params: any }) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value || '';

  if (!authToken) {
    return <div className="text-center text-red-500 text-3xl">Unauthorized</div>;
  }

  let error = null;
  const accountsUrl = 'http://localhost:8000/accounts/?includeHidden=false&includeArchived=false&archivedOnly=false';
  const baseCurrencyUrl = 'http://localhost:8000/settings/base-currency';

   // Fetch accounts and base currency on the server
   const [accountsResponse, baseCurrencyResponse] = await Promise.all([
    fetch(accountsUrl, { headers: { 'auth-token': authToken }, cache: 'no-store' }),
    fetch(baseCurrencyUrl, { headers: { 'auth-token': authToken }, cache: 'force-cache' }),
  ]);

  if (!accountsResponse.ok || !baseCurrencyResponse.ok) {
    const error = !accountsResponse.ok ? 'Failed to fetch accounts' : 'Failed to fetch base currency';
    console.error(error);
    return <div className="text-center text-red-500">{error}</div>;
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
    <AccountsList accounts={accounts} baseCurrency={baseCurrency} />
  );
}