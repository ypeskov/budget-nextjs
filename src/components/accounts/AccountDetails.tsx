"use client";

import { DateTime } from "luxon";
import { useTranslations } from 'next-intl';
import { CREDIT_CARD_ACCOUNT_TYPE_ID } from "@/constants";
import { Account } from "@/types/accounts";
import { useState } from "react";
import AccountForm from "@/components/accounts/AccountForm";
import { useRouter } from "next/navigation";
import { formatAmount } from "@/utils/amount";
import ConfirmPopup from "../common/ConfirmPopup";
import apiRoutes from "@/routes/apiRoutes";
import { request } from "@/utils/request/browser";
import routes from "@/routes/routes";

interface AccountDetailsProps {
  account: Account;
  locale: string;
}

export default function AccountDetails({ account, locale }: AccountDetailsProps) {
  const t = useTranslations('');
  const [error, setError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false); // State for popup visibility
  const router = useRouter();

  const formattedBalance = account.balance
    ? formatAmount(account.balance, locale, account.currency.code) : "0.00";

  let formattedCreditLimit = "0.00";
  if (account.accountTypeId === CREDIT_CARD_ACCOUNT_TYPE_ID) {
    formattedCreditLimit =
      formatAmount(account.creditLimit + account.balance,
        locale,
        account.currency.code,
        'decimal');
  }

  const toggleEditForm = () => {
    setShowEditForm(!showEditForm);
  };

  const handleDeleteClick = () => {
    setShowConfirmPopup(true); // Show the popup
  };

  const confirmDelete = async () => {
    try {
      const response = await request(apiRoutes.account(account.id), {
        method: 'DELETE',
      })
      if (response.deleted) {
        router.push(routes.accounts({ locale }));
      } else {
        setError('Error deleting account');
      }
    } catch (error) {
      setError('Error deleting account');
    }
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/icons/edit-icon.svg"
              alt={t('editAccount')}
              onClick={toggleEditForm}
              width="24"
              height="24"
              title={t('editAccount')} />
          </button>
        </div>

        <div className="flex justify-between items-center mt-2">
          <span>
            {t('balance')}: <b>{formattedBalance}</b>
            {account.accountTypeId === CREDIT_CARD_ACCOUNT_TYPE_ID && (
              <span>({formattedCreditLimit})</span>
            )}
          </span>
          <button className="text-red-500">
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
        <ConfirmPopup
          title={t('deleteAccount')}
          message={t('deleteAccountConfirmation')}
          cancelButtonText={t('cancel')}
          confirmButtonText={t('confirm')}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </>
  );
}