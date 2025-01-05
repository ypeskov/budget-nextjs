import { Link } from '@/i18n/routing';
import { Account, BaseCurrency, Accounts } from '@/types/accounts';
import { useTranslations } from 'next-intl';
import { CREDIT_CARD_ACCOUNT_TYPE_ID } from '@/constants';

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
  const t = useTranslations('');

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
      <div className="mb-4 mt-4">
        <h1 className="heading-lg">{t('yourAccounts')}</h1>
        <p className="text-center text-gray-700 text-2xl">
          <span>{t('totalBalance')} </span>
          <span className="text-2xl font-bold">{totalBalance.toLocaleString(undefined, amountPrecision)}{' '}{baseCurrency.code || 'N/A'}</span>
        </p>
      </div>
      <ul className="space-y-4">
        {accounts.map((acc) => (
          <li key={acc.id} className="list-item">
            <Link href={`/accountDetails/${acc.id}`} className="link-default link-hover">
              <div className="list-item-container">
                <div className="list-item-label">{acc.name}</div>
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