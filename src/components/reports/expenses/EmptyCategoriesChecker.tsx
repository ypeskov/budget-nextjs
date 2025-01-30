"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import routes from "@/routes/routes";

interface EmptyCategoriesCheckerProps {
  hideEmptyCategories: boolean;
  locale: string;
  fromDate: string;
  toDate: string;
}

export default function EmptyCategoriesChecker({ hideEmptyCategories, locale, fromDate, toDate }: EmptyCategoriesCheckerProps) {
  const t = useTranslations('');
  const router = useRouter();

  const handleHideEmptyCategories = () => {
    router.push(routes.expensesReport({ locale, fromDate, toDate, hideEmptyCategories: !hideEmptyCategories ? 'true' : 'false' }));
  };

  return (
    <>
      <input
        id="hide-empty-categories"
        type="checkbox"
        className="form-checkbox h-5 w-5 text-blue-600"
        checked={hideEmptyCategories}
        onChange={handleHideEmptyCategories}
      />
      <label
        htmlFor="hide-empty-categories"
        className="ml-2 text-sm font-medium"
      >
        {t("hideEmptyCategories")}
      </label>
    </>
  );
}