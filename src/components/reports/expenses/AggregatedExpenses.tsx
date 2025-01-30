import { getTranslations } from "next-intl/server";
import { amountPrecision } from "@/i18n/utils";
import { AggregatedExpense } from "@/types/reports";

interface AggregatedExpensesProps {
  aggregatedCategories: AggregatedExpense[];
  aggregatedSum: number;
  currencyCode: string;
}

export default async function AggregatedExpenses({ aggregatedCategories, aggregatedSum, currencyCode }: AggregatedExpensesProps) {
  const t = await getTranslations('');

  return (
    <div className="w-full">
      <ul className="list-none">
        {aggregatedCategories.map((category: AggregatedExpense) => (
          <li key={category.category_id} className="flex justify-between py-2 rounded-lg shadow p-4 transition my-2">
            <span>{category.label}</span>
            <span>
              {category.amount.toLocaleString(undefined, amountPrecision)} {currencyCode}
            </span>
          </li>
        ))}
        <li className="font-bold border-t border-gray-300 pt-2 flex justify-between rounded-lg shadow p-4 transition my-2 bg-gray-200">
          <span>{t("totalExpenses")}</span>
          <span>
            {aggregatedSum.toLocaleString(undefined, amountPrecision)} {currencyCode}
          </span>
        </li>
      </ul>
    </div>
  )
}
