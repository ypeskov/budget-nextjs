const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default {
  oauth: () => `${API_URL}/auth/oauth`,
  profile: () => `${API_URL}/auth/profile`,
  expenses: () => `${API_URL}/reports/expenses-by-categories/`,
  expensesAggregate: () => `${API_URL}/reports/expenses-data/`,
  expensesDiagram: (fromDate: string, toDate: string) =>`${API_URL}/reports/diagram/pie/${fromDate}/${toDate}`,
};
