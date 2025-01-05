import React from 'react';
import {getTranslations} from 'next-intl/server';

interface TransactionsPageProps {
  locale: string;
}

const TransactionsPage = async ({ params }: { params: Promise<TransactionsPageProps> }) => {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const t = await getTranslations('');

  return (
    <div>
      <h1>{t('yourTransactions')}</h1>
      <p>Locale: {locale}</p>
    </div>
  );
};

export default TransactionsPage;