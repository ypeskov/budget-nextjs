import Link from 'next/link';
import { Account, BaseCurrency, Accounts } from '@/types/accounts';

const CREDIT_CARD_ACCOUNT_TYPE_ID = 4;

export default function AccountsPageContainer({
  accounts,
  baseCurrency,
}: {
  accounts: Accounts;
  baseCurrency: BaseCurrency;
}) {
  const balanceClass = (balance: number) => (balance < 0 ? 'text-red-500' : 'text-green-500');
  const availableBalanceCC = (acc: Account) => acc.balance + acc.creditLimit;
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balanceInBaseCurrency, 0);

  function accountAmmounts(acc: Account) {
    return (
      <>
        <div>
          <span className="font-bold">{acc.balance.toLocaleString(undefined, amountPrecision)}</span>
          {acc.accountTypeId === CREDIT_CARD_ACCOUNT_TYPE_ID && (
            <span className="ml-2">
              ({availableBalanceCC(acc).toLocaleString(undefined, amountPrecision)})
            </span>
          )}
          {' '}
          {acc.currency.code}

        </div>
        <div className="text-gray-500">
          ({acc.balanceInBaseCurrency.toLocaleString(undefined, amountPrecision)} {baseCurrency.code || 'N/A'})
        </div>
      </>
    )
  }

  const amountPrecision = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center">Your Accounts</h1>
        <p className="text-center text-gray-700 text-2xl">
          <span>Total Balance: </span>
          <span className="text-2xl font-bold">{totalBalance.toLocaleString(undefined, amountPrecision)}{' '}{baseCurrency.code || 'N/A'}</span>
        </p>
      </div>
      <ul className="space-y-4">
        {accounts.map((acc) => (
          <li key={acc.id} className="list-item">
            <Link href={`/accountDetails/${acc.id}`} className="block no-underline text-gray-800">
              <div className="flex justify-between text-2xl">
                <div className="truncate max-w-xs font-medium">{acc.name}</div>
                <div className={`text-right ${balanceClass(acc.balance)}`}>
                  {accountAmmounts(acc)}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}