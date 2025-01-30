import { getTranslations } from "next-intl/server";
import apiRoutes from "@/routes/apiRoutes";
import AggregatedExpenses from "@/components/reports/expenses/AggregatedExpenses";
import DatePicker from "@/components/reports/expenses/DatePicker";
import CategoriesExpenses from "@/components/reports/expenses/CategoriesExpenses";
import EmptyCategoriesChecker from "@/components/reports/expenses/EmptyCategoriesChecker";
import { request } from "@/utils/request/api";
import { redirect } from "next/navigation";
import routes from "@/routes/routes";
import { UnauthorizedError } from "@/utils/request/errors";
import { AggregatedExpense } from "@/types/reports";

type ExpensesReportPageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
  params: Promise<{ locale: string }>
}

const getExpenses = async (fromDate: string, toDate: string, hideEmptyCategories: boolean, locale: string) => {
  try {
    const expenses = await request(apiRoutes.expenses(), {
      method: 'POST',
      body: JSON.stringify({
        startDate: fromDate,
        endDate: toDate,
        hideEmptyCategories: hideEmptyCategories,
      }),
    });
    return expenses;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect(routes.login({ locale }));
    }
    console.error(error);
    return null;
  }
}

const getAggregatedExpenses = async (fromDate: string, toDate: string, hideEmptyCategories: boolean, locale: string) => {
  try {
    const aggregatedExpenses = await request(apiRoutes.expensesAggregate(), {
      method: 'POST',
      body: JSON.stringify({
        startDate: fromDate,
        endDate: toDate,
        hideEmptyCategories: hideEmptyCategories,
      }),
    });

    return aggregatedExpenses;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect(routes.login({ locale }));
    }
    console.error(error);
    return null;
  }
}

const getDiagramUrl = async (fromDate: string, toDate: string, locale: string) => {
  const diagramUrl = apiRoutes.expensesDiagram(fromDate, toDate);
  try {
    const diagram = await request(diagramUrl, {});
    return diagram.image; // Base64 string
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect(routes.login({ locale: locale }));
    }
    console.error(error);
    return null;
  }
}

async function ExpensesReportPage({ searchParams, params }: ExpensesReportPageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const t = await getTranslations('');
  const awaitedSearchParams = await searchParams;
  const fromDateInitial = awaitedSearchParams.fromDate || new Date(new Date().setDate(1)).toISOString().split('T')[0];
  const toDateInitial = awaitedSearchParams.toDate || new Date().toISOString().split('T')[0];

  let hideEmptyCategoriesInitial;
  if (awaitedSearchParams.hideEmptyCategories === 'true' || awaitedSearchParams.hideEmptyCategories === undefined) {
    hideEmptyCategoriesInitial = true;
  } else {
    hideEmptyCategoriesInitial = false;
  }

  const [responseExpenses, responseAggregated, responseDiagram] = await Promise.all([
    getExpenses(fromDateInitial, toDateInitial, hideEmptyCategoriesInitial, locale),
    getAggregatedExpenses(fromDateInitial, toDateInitial, hideEmptyCategoriesInitial, locale),
    getDiagramUrl(fromDateInitial, toDateInitial, locale),
  ])

  if (!responseExpenses || !responseAggregated) {
    return (<div>
      <h1 className="heading-lg">{t("expensesReport")}</h1>
      <p className="text-red-500 text-center text-lg font-bold mb-4 ">{t("noData")}</p>
    </div>);
  }

  const aggregatedSum = responseAggregated.reduce((sum: number, category: AggregatedExpense) => sum + category.amount, 0);

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
            {/* eslint-disable-next-line @next/next/no-img-element */}
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

export default ExpensesReportPage;