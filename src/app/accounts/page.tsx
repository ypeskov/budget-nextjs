import { cookies } from 'next/headers';
import Link from 'next/link';

export interface Account {
  userId: number;
  accountTypeId: number;
  currencyId: number;
  initialBalance: number;
  balance: number;
  creditLimit: number;
  name: string;
  openingDate: string;
  comment: string;
  isHidden: boolean;
  showInReports: boolean;
  id: number;
  currency: {
    id: number;
    code: string;
    name: string;
  };
  accountType: {
    id: number;
    type_name: string;
    is_credit: boolean;
  };
  isDeleted: boolean;
  balanceInBaseCurrency: number;
  archivedAt: string;
}

interface BaseCurrency {
  id: number;
  code: string;
  name: string;
}

export type Accounts = Account[];

export default async function AccountsPage({ params }: { params: any }) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value || '';

  let error = null;
  const url = 'http://localhost:8000/accounts/?includeHidden=false&includeArchived=false&archivedOnly=false';
  const response: Response = await fetch(url, {
    cache: 'no-store',
    headers: {
      'auth-token': authToken,
    },
  });

  if (!response.ok) {
    error = response.status === 401 ? 'Unauthorized' : 'Failed to fetch accounts';
    console.error(error);
    return <div className="text-center text-red-500">{error}</div>;
  }

  const baseCurrencyRes: Response = await fetch('http://localhost:8000/settings/base-currency', {
    cache: 'force-cache',
    headers: {
      'auth-token': authToken,
    },
  });

  const baseCurrency: BaseCurrency = await baseCurrencyRes.json();
  const accounts: Accounts = await response.json();

  const balanceClass = (balance: number) => (balance < 0 ? 'text-red-500' : 'text-green-500');

  const availableBalanceCC = (acc: Account) => acc.balance + acc.creditLimit;

  const amountPrecision = { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center">Your Accounts</h1>
        <p className="text-center text-gray-700 text-2xl">
          <span>Total Balance: </span>
          <span className="text-3xl font-bold"></span>{accounts.reduce((sum, acc) => 
            sum + acc.balanceInBaseCurrency, 0).toLocaleString(undefined, amountPrecision)}{' '}
          {baseCurrency.code || 'N/A'}
        </p>
      </div>
      <ul className="space-y-4">
        {accounts.map((acc) => (
          <li key={acc.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
            <Link href={`/accountDetails/${acc.id}`} className="block no-underline text-gray-800">
              <div className="flex justify-between text-2xl">
                <div className="truncate max-w-xs font-medium">{acc.name}</div>
                <div className={`text-right ${balanceClass(acc.balance)}`}>
                  <div>
                    <span className="font-bold">{acc.balance.toLocaleString(undefined, amountPrecision)}</span>
                    {acc.accountTypeId === 4 && (
                      <span className="ml-2">
                        ({availableBalanceCC(acc).toLocaleString(undefined, amountPrecision)})
                      </span>
                    )}
                    {' '}
                    {acc.currency.code}
                  </div>
                  <div className="text-gray-500">({acc.balanceInBaseCurrency.toLocaleString(undefined, amountPrecision)} {baseCurrency.code || 'N/A'})
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}