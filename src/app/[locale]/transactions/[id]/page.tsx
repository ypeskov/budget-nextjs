import { TransactionDetails } from "@/components/transactions/TransactionDetails";
import { Transaction } from "@/types/transactions";
import apiRoutes from "@/routes/apiRoutes";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { request } from "@/utils/request/api";
import { UnauthorizedError, ValidationError } from "@/utils/request/errors";
import { redirect } from "next/navigation";
import routes from "@/routes/routes";

interface TransactionPageProps {
  params: Promise<{ id: string, locale: string }>;
}

async function fetchTransaction(id: number): Promise<Transaction | null> {
  try {
    const response = await request(apiRoutes.transaction(id), { cache: "no-store" });
    return response;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect(routes.login({}));
      return null;
    }
    if (error instanceof ValidationError) {
      return null;
    }
    console.error('Failed to fetch transaction', error);
    return null;
  }
}


export default async function TransactionPage({ params }: TransactionPageProps) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  const locale = resolvedParams.locale;

  let transaction: Transaction | null = null;
  console.log('--------------------------------');
  console.log('TransactionPage', id);
  console.log('--------------------------------');
  transaction = await fetchTransaction(id);

  return (
    <div>
      <NextIntlClientProvider locale={locale} messages={await getMessages()}>
        {transaction && <TransactionDetails locale={locale} transaction={transaction} />}
        {!transaction && <div className="flex justify-center items-center h-screen error-message">Transaction not found</div>}
      </NextIntlClientProvider>
    </div>
  );
}
