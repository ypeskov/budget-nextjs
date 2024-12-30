import { DateTime } from "luxon";
import TransactionsListView from "@/components/transactions/TransactionsListView";
import NewAccount from "@/components/accounts/NewAccount";
// import { Services } from "@/services/servicesConfig";
import { CREDIT_CARD_ACCOUNT_TYPE_ID } from "@/constants";
import { Account } from "@/types/accounts";

async function fetchAccountDetails(id: number): Promise<Account> {
  // return await Services.accountsService.getAccountDetails(id);
  return {
    id: 1,
    userId: 1,
    accountTypeId: 1,
    currencyId: 1,
    initialBalance: 0,
    balance: 0,
    creditLimit: 0,
    name: "Test Account",
    openingDate: "2022-01-01",
    comment: "",
    isHidden: false,
    showInReports: true,
    currency: {
      id: 1,
      code: "USD",
      name: "US Dollar",
    },
    accountType: {
      id: 1,
      type_name: "Cash",
      is_credit: false,
    },
    isDeleted: false,
    balanceInBaseCurrency: 0,
    archivedAt: "",
  };
}


export default async function AccountDetails({ id }: Account) {
  const accountDetails: Account = await fetchAccountDetails(id);

  const formattedBalance = accountDetails.balance
    ? accountDetails.balance.toLocaleString("ru-UA", {
      style: "decimal",
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })
    : "0.00";

  const availableBalanceCC = accountDetails.balance + accountDetails.creditLimit;

  return (
    <>
      <div className="bg-gray-200 p-4 rounded-md mb-4">
        <div className="flex justify-between items-center">
          <span>
            Account: <strong>{accountDetails.name}</strong>
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
            {accountDetails.accountTypeId === CREDIT_CARD_ACCOUNT_TYPE_ID && (
              <span>({availableBalanceCC})</span>
            )}
            &nbsp;{accountDetails?.currency?.code}
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
            <b>{DateTime.fromISO(accountDetails?.openingDate).toISODate()}</b>
          </span>
        </div>
      </div>

      {/* <TransactionsListView accountId={id} isAccountDetails={true} /> */}
    </>
  );
}