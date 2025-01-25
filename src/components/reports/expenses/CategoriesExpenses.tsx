import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing"
import { CategoryExpense } from "@/types/categories";
import { amountPrecision } from "@/i18n/utils";
import routes from "@/routes/routes";

interface CategoriesExpensesProps {
  expenses: CategoryExpense[];
  locale: string;
  fromDate: string;
  toDate: string;
}

function calculateGroupTotal(expenses: CategoryExpense[], parentId: number | null): number {
  const children = expenses.filter((expense) => expense.parentId === parentId);
  const parentCategory = expenses.find((expense) => expense.id === parentId);

  const childrenTotal = children.reduce((sum, child) => sum + child.totalExpenses, 0);
  const parentTotal = parentCategory ? parentCategory.totalExpenses : 0;

  return childrenTotal + parentTotal;
}

export default async function CategoriesExpenses({ expenses, locale = "en", fromDate, toDate }: CategoriesExpensesProps) {
  const t = await getTranslations("");

  const topLevelCategories = expenses.filter((expense) => expense.parentId === null);

  const orphanCategories = expenses.filter(
    (expense) => expense.parentId !== null && !topLevelCategories.some((cat) => cat.id === expense.parentId)
  );

  const virtualTopLevelCategories = Array.from(
    new Set(orphanCategories.map((expense) => expense.parentId))
  ).map((parentId) => ({
    id: parentId,
    name: orphanCategories.find((expense) => expense.parentId === parentId)?.parentName || "Unknown",
    totalExpenses: 0,
    currencyCode: orphanCategories.find((expense) => expense.parentId === parentId)?.currencyCode || "",
  }));

  const allTopLevelCategories = [...topLevelCategories, ...virtualTopLevelCategories];

  allTopLevelCategories.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">
        {t("categoriesExpenses")}
      </h2>

      <div className="space-y-6">
        {allTopLevelCategories.map((category) => {
          const childCategories = expenses.filter(
            (expense) => expense.parentId === category.id
          );

          return (
            <div key={category.id} className="category-item-container mb-4">
              <div className="flex justify-between mb-2 items-center bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg p-2 shadow-sm">
                <Link className="w-full flex justify-between" 
                      href={routes.transactions({ fromDate: fromDate, toDate: toDate, categories: [category.id] })}>
                  <span className="font-medium text-gray-700">{category.name}</span>
                  <span className="font-normal text-gray-900">
                    {category.totalExpenses ? category.totalExpenses.toLocaleString(locale, amountPrecision) : ""}
                    {' '}
                    {category.totalExpenses ? category.currencyCode : ""}
                  </span>
                </Link>
              </div>

              {childCategories.map((child) => (
                <div
                  key={child.id}
                  className="ml-4 mb-2 flex justify-between items-center bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg p-2 shadow-sm"
                >
                  <Link className="w-full flex justify-between" href={routes.transactions({ fromDate: fromDate, toDate: toDate, categories: [child.id] })}>
                    <span className="font-medium text-gray-700">
                      {child.name.split('>>')[1]}
                    </span>

                    <span className="font-normal text-gray-900">
                      {child.totalExpenses.toLocaleString(locale, amountPrecision)}{" "}
                      {child.currencyCode}
                    </span>
                  </Link>
                </div>
              ))}

              {childCategories.length > 0 && (
                <div className="text-right font-bold text-gray-900 mt-2">
                  {calculateGroupTotal(expenses, category.id).toLocaleString(locale, amountPrecision)}{" "}
                  {category.currencyCode}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}