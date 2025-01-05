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
  const [showConfirmPopup, setShowConfirmPopup] = useState(false); // State for popup visibility
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
  };

  const handleDeleteClick = () => {
    setShowConfirmPopup(true); // Show the popup
  };

  const confirmDelete = () => {
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
      })
      .finally(() => {
        setShowConfirmPopup(false); // Close the popup
      });
  };

  const cancelDelete = () => {
    setShowConfirmPopup(false); // Close the delete confirmation popup
  };

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
              alt={t('editAccount')}
              onClick={toggleEditForm}
              width="24"
              height="24"
              title={t('editAccount')}/>
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
              onClick={handleDeleteClick} // Show confirmation popup
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

      {/* Delete Confirmation Popup */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('confirmDelete')}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{t('deleteConfirmationMessage')}</p>
            <div className="flex justify-between space-x-4 mt-4">
              <button onClick={cancelDelete} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">{t('cancel')}</button>
              <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">{t('confirm')}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}