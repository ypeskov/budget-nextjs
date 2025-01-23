'use client'

import { useTranslations } from 'next-intl';
import { Account } from '@/types/accounts';
import { getCookie } from '@/utils/cookies';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AccountArchivedProps {
  account: Account;
}

const AccountArchived = ({ account }: AccountArchivedProps) => {
  const t = useTranslations('');
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | null>(null);
  
  useEffect(() => {
    const authToken = getCookie('authToken');
    setAuthToken(authToken);
  }, []);

  const handleRestore = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const headers: HeadersInit = {
      ...(authToken && { "auth-token": authToken }),
      "Content-Type": "application/json",
    };
    
    const response = await fetch(`${apiBaseUrl}/accounts/set-archive-status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ 
        accountId: account.id,
        isArchived: false
      }),
    });

    if (response.ok) {
      router.refresh();
    }
  }

  return (
    <>
      <div className="text-right">
        <button onClick={handleRestore} className="ml-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 e-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" >{t('restore')}</button>
      </div>
    </>
  );
}

export default AccountArchived;