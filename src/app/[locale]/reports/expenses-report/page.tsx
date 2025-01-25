import apiRoutes from "@/routes/apiRoutes";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import AggregatedExpenses from "@/components/reports/expenses/AggregatedExpenses";
import DatePicker from "@/components/reports/expenses/DatePicker";
import CategoriesExpenses from "@/components/reports/expenses/CategoriesExpenses";
import EmptyCategoriesChecker from "@/components/reports/expenses/EmptyCategoriesChecker";


interface ExpensesReportPageProps {
  params: Promise<Record<string, string | undefined>>;
  searchParams: Promise<Record<string, string | undefined>>;
}

const getExpenses = async (fromDate: string, toDate: string, hideEmptyCategories: boolean, authToken: string) => {
  const response = await fetch(apiRoutes.expenses(), {
    method: 'POST',
    body: JSON.stringify({
      startDate: fromDate,
      endDate: toDate,
      hideEmptyCategories: hideEmptyCategories,
    }),
    headers: {
      'Content-Type': 'application/json',
      'auth-token': authToken,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    for (const key in error.detail) {
      console.error(error.detail[key]);
    }
    return null;
  }

  return await response.json();
}

const getAggregatedExpenses = async (fromDate: string, toDate: string, hideEmptyCategories: boolean, authToken: string) => {
  const response = await fetch(apiRoutes.expensesAggregate(), {
    method: 'POST',
    body: JSON.stringify({
      startDate: fromDate,
      endDate: toDate,
      hideEmptyCategories: hideEmptyCategories,
    }),
    headers: {
      'Content-Type': 'application/json',
      'auth-token': authToken,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    for (const key in error.detail) {
      console.error(error.detail[key]);
    }
    return null;
  }
  return await response.json();
}

const getDiagramUrl = async (fromDate: string, toDate: string, authToken: string) => {
  const diagramUrl = apiRoutes.expensesDiagram(fromDate, toDate);
  const response = await fetch(diagramUrl, {
    headers: {
      'auth-token': authToken,
    },
  });
  if (!response.ok) {
    return null;
  }
  const { image } = await response.json();
  return image; // Base64 string
}

export default async function ExpensesReportPage({ params, searchParams }: ExpensesReportPageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale || 'en';
  const awaitedSearchParams = await searchParams;
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value || '';
  const t = await getTranslations('');
  const fromDateInitial = awaitedSearchParams.fromDate || new Date(new Date().setDate(1)).toISOString().split('T')[0];
  const toDateInitial = awaitedSearchParams.toDate || new Date().toISOString().split('T')[0];

  let hideEmptyCategoriesInitial;
  if (awaitedSearchParams.hideEmptyCategories === 'true' || awaitedSearchParams.hideEmptyCategories === undefined) {
    hideEmptyCategoriesInitial = true;
  } else {
    hideEmptyCategoriesInitial = false;
  }

  const [responseExpenses, responseAggregated, responseDiagram] = await Promise.all([
    getExpenses(fromDateInitial, toDateInitial, hideEmptyCategoriesInitial, authToken),
    getAggregatedExpenses(fromDateInitial, toDateInitial, hideEmptyCategoriesInitial, authToken),
    getDiagramUrl(fromDateInitial, toDateInitial, authToken),
  ])

  if (!responseExpenses || !responseAggregated) {
    return (<div>
      <h1 className="heading-lg">{t("expensesReport")}</h1>
      <p className="text-red-500 text-center text-lg font-bold mb-4 ">{t("noData")}</p>
    </div>);
  }

  const aggregatedSum = responseAggregated.reduce((sum: number, category: any) => sum + category.amount, 0);

  return (
    <>
      <div className="mb-4">
        <h1 className="heading-lg">{t("expensesReport")}</h1>
      </div>

      <div className="mb-4 flex space-x-4 justify-between">
        <DatePicker date={fromDateInitial}
          label={t("startDate")}
          isStartDate={true}
          locale={locale}
          fromDate={fromDateInitial}
          toDate={toDateInitial} />
        <DatePicker date={toDateInitial}
          label={t("endDate")}
          isStartDate={false}
          locale={locale}
          fromDate={fromDateInitial}
          toDate={toDateInitial} />
      </div>

      <div className="mb-4 flex items-center">
        <EmptyCategoriesChecker hideEmptyCategories={hideEmptyCategoriesInitial}
          locale={locale}
          fromDate={fromDateInitial}
          toDate={toDateInitial} />
      </div>

      {aggregatedSum > 0 && (
        <div className="mb-4 flex">
          <div className="w-1/2 flex justify-center items-center">
            <img src={responseDiagram || ''} alt={t("diagram")} />
          </div>

          <div className="w-1/2 flex justify-center items-center">
            <AggregatedExpenses
              aggregatedCategories={responseAggregated}
              aggregatedSum={aggregatedSum}
              currencyCode={responseExpenses[0].currencyCode} />
          </div>
        </div>
      )}

      {aggregatedSum > 0 && <CategoriesExpenses
        expenses={responseExpenses}
        locale={locale}
        fromDate={fromDateInitial}
        toDate={toDateInitial} />}
    </>
  );
}