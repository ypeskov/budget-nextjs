'use client'

import { useRouter } from 'next/navigation';
import routes from '@/routes/routes';

interface DatePickerProps {
  date: string;
  label: string;
  isStartDate: boolean;
  locale: string;
  fromDate: string;
  toDate: string;
}

export default function DatePicker({ date, label, isStartDate, locale, fromDate, toDate }: DatePickerProps) {
  const router = useRouter();

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isStartDate) {
      router.push(routes.expensesReport({ locale, fromDate: event.target.value, toDate }));
    } else {
      router.push(routes.expensesReport({ locale, fromDate, toDate: event.target.value }));
    }
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="start-date"
        className="block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>

      <input
        id="start-date"
        type="date"
        className="w-full p-2 bg-white border border-gray-200 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm hover:shadow-md transition-shadow"
        value={date}
        onChange={handleDateChange}
      />
    </div>
  );
}
