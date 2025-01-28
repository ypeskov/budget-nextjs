import { TransactionDetails } from "@/components/transactions/TransactionDetails";
import { Transaction } from "@/types/transactions";
import apiRoutes from "@/routes/apiRoutes";
import { getAuthToken } from "@/utils/auth";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

interface TransactionPageProps {
  params: Promise<{ id: string, locale: string }>;
}

async function fetchTransaction(id: number): Promise<Transaction> {
  const response = await fetch(apiRoutes.transaction(id), {
    headers: { "auth-token": await getAuthToken() },
    cache: "no-store",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error('Failed to fetch transaction', error.detail);
    throw new Error('Failed to fetch transaction');
  }
  return response.json();
}

export default async function TransactionPage({ params }: TransactionPageProps) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  const locale = resolvedParams.locale;

  let transaction: Transaction;
  try {
    transaction = await fetchTransaction(id);
  } catch (error) {
    console.error('Failed to fetch transaction', error);
    return <div>Failed to fetch transaction</div>;
  }

  return (
    <div>
      <NextIntlClientProvider locale={locale} messages={await getMessages()}>
        <TransactionDetails locale={locale} transaction={transaction} />
      </NextIntlClientProvider>
    </div>
  );
}
