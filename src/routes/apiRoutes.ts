const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const transactionsPerPage = Number(process.env.NEXT_PUBLIC_TRANSACTIONS_PER_PAGE);

export default {
  oauth: () => `${API_URL}/auth/oauth`,
  profile: () => `${API_URL}/auth/profile`,
  expenses: () => `${API_URL}/reports/expenses-by-categories/`,
  expensesAggregate: () => `${API_URL}/reports/expenses-data/`,
  expensesDiagram: (fromDate: string, toDate: string) =>`${API_URL}/reports/diagram/pie/${fromDate}/${toDate}`,
  transaction: (id: number) => `${API_URL}/transactions/${id}`,
  submitTransaction: () => `${API_URL}/transactions`,
  accounts: () => `${API_URL}/accounts`,
  categories: () => `${API_URL}/categories`,
  account: (id: number) => `${API_URL}/accounts/${id}`,

  transactions: (page: number, searchParams: Record<string, string | undefined>): string => {
    const params = new URLSearchParams({
      per_page: transactionsPerPage.toString(),
      page: page.toString(),
      ...(searchParams.accounts && { accounts: searchParams.accounts }),
      ...(searchParams.types && { types: searchParams.types }),
      ...(searchParams.fromDate && { from_date: searchParams.fromDate }),
      ...(searchParams.toDate && { to_date: searchParams.toDate }),
      ...(searchParams.categories && { categories: searchParams.categories }),
    });
  
    return `${API_URL}/transactions/?${params.toString()}`;
  },
};