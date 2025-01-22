'use client'
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

export default function ExpensesReportPage() {
  const t = useTranslations('');
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hideEmptyCategories, setHideEmptyCategories] = useState(true);
  const [pieDiagramUrl, setPieDiagramUrl] = useState("");
  const [aggregatedCategories, setAggregatedCategories] = useState([]);
  const [aggregatedSum, setAggregatedSum] = useState(0);

  useEffect(() => {
    // Mock function calls for fetching data
    async function fetchData() {
      // Fetch and set diagram URL, categories, and total sum
    }
    fetchData();
  }, [startDate, endDate, hideEmptyCategories]);

  return (
    <main className="container mx-auto px-4">
      <div className="mb-4">
        <h1 className="heading-lg">{t("expensesReport")}</h1>
      </div>

      <div className="mb-4 flex space-x-4">
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium">
            {t("startDate")}
          </label>
          <input
            id="start-date"
            type="date"
            className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium">
            {t("endDate")}
          </label>
          <input
            id="end-date"
            type="date"
            className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4 flex items-center">
        <input
          id="hide-empty-categories"
          type="checkbox"
          className="form-checkbox h-5 w-5 text-blue-600"
          checked={hideEmptyCategories}
          onChange={(e) => setHideEmptyCategories(e.target.checked)}
        />
        <label
          htmlFor="hide-empty-categories"
          className="ml-2 text-sm font-medium"
        >
          {t("hideEmptyCategories")}
        </label>
      </div>

      {aggregatedSum > 0 && (
        <div className="mb-4 flex">
          <div className="w-1/2 flex justify-center items-center">
            {pieDiagramUrl ? (
              <img src={pieDiagramUrl} alt={t("loadingDiagram")} className="rounded shadow" />
            ) : (
              <span className="text-gray-500">{t("loadingDiagram")}</span>
            )}
          </div>
          <div className="w-1/2">
            <ul className="list-none">
              {aggregatedCategories.map((category: any) => (
                <li key={category.id} className="flex justify-between py-2">
                  <span>{category.label}</span>
                  <span>
                    {category.amount}, {t("baseCurrency")}
                  </span>
                </li>
              ))}
              <li className="font-bold border-t border-gray-300 pt-2">
                <span>{t("totalExpenses")}</span>
                <span>
                  {aggregatedSum} {t("baseCurrency")}
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}

      <div>
        <p className="text-gray-500">{t("noData")}</p>
      </div>
    </main>
  );
}