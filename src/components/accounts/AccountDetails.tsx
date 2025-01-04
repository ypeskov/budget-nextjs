"use client";

import { DateTime } from "luxon";
import { useTranslations } from 'next-intl';
import { CREDIT_CARD_ACCOUNT_TYPE_ID } from "@/constants";
import { Account } from "@/types/accounts";
import { useState } from "react";
import AccountForm from "@/components/accounts/AccountForm";
import { getCookie } from "@/utils/cookies";
import { useRouter } from "next/navigation";

interface AccountDetailsProps {
  account: Account;
  locale: string;
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AccountDetails({ account, locale }: AccountDetailsProps) {
  const t = useTranslations("AccountDetailsPage");
  const [showEditForm, setShowEditForm] = useState(false);
  const availableBalanceCC = account.balance + account.creditLimit;
  const router = useRouter();

  const formattedBalance = account.balance
    ? account.balance.toLocaleString(locale, {
      style: "decimal",
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })
    : "0.00";

  const toggleEditForm = () => {
    setShowEditForm(!showEditForm);
  }

  const deleteAccount = () => {
    const authToken = getCookie('authToken');
    const headers: HeadersInit = authToken ? { "auth-token": authToken } : {};
    fetch(`${apiBaseUrl}/accounts/${account.id}`, {
      method: 'DELETE',
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          console.log('Account deleted');
          router.push(`/${locale}/accounts`);
        } else {
          console.error('Error deleting account');
        }
      })
      .catch((error) => {
        console.error('Error deleting account', error);
      });
  }

  return (
    <>
      <div className="info-card">
        <div className="flex justify-between items-center">
          <span>
            {t('account')}: <strong>{account.name}</strong>
          </span>
          <button className="text-blue-500">
            <img
              src="/images/icons/edit-icon.svg"
              alt="Edit account"
              onClick={toggleEditForm}
              width="24"
              height="24"
              title="Edit Account"
            />
          </button>
        </div>

        <div className="flex justify-between items-center mt-2">
          <span>
            {t('balance')}: <b>{formattedBalance}</b>
            {account.accountTypeId === CREDIT_CARD_ACCOUNT_TYPE_ID && (
              <span>({availableBalanceCC})</span>
            )}
            &nbsp;{account?.currency?.code}
          </span>
          <button className="text-red-500">
            <img
              src="/images/icons/delete-icon.svg"
              alt={t('deleteAccount')}
              width="24"
              height="24"
              onClick={deleteAccount}
              title={t('deleteAccount')}
            />
          </button>
        </div>

        <div className="mt-2">
          <span>{t('created')}:{" "}<b>{DateTime.fromISO(account?.openingDate).toISODate()}</b>
          </span>
        </div>
      </div>

      {showEditForm && <AccountForm account={account} closeForm={toggleEditForm} locale={locale} />}
    </>
  );
}
