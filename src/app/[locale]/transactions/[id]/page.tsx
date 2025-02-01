import { TransactionDetails } from "@/components/transactions/TransactionDetails";
import { Transaction } from "@/types/transactions";
import apiRoutes from "@/routes/apiRoutes";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { request } from "@/utils/request/api";
import { UnauthorizedError, ValidationError } from "@/utils/request/errors";
import { redirect } from "@/i18n/routing";
import routes from "@/routes/routes";
import HiddenAuth from "@/components/common/HiddenAuth";

interface TransactionPageProps {
  params: Promise<{ id: string, locale: string }>;
}

async function fetchTransaction(id: number, locale: string): Promise<{ data: Transaction, newToken: string | null } | null> {
  try {
    const response = await request(apiRoutes.transaction(id), { cache: "no-store" });
    return { data: response.data, newToken: response.newToken };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect({ href: routes.login({}), locale });
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

  let transaction: { data: Transaction, newToken: string | null } | null = null;
  transaction = await fetchTransaction(id, locale);

  return (
    <div>
      <NextIntlClientProvider locale={locale} messages={await getMessages()}>
        <HiddenAuth newAccessToken={transaction?.newToken || ''} />
        {transaction && <TransactionDetails locale={locale} transaction={transaction.data} />}
        {!transaction && <div className="flex justify-center items-center h-screen error-message">Transaction not found</div>}
      </NextIntlClientProvider>
    </div>
  );
}
