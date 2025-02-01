const transactionsPerPage = Number(process.env.NEXT_PUBLIC_TRANSACTIONS_PER_PAGE);

const apiRoutes = {
  login: () => `/auth/login/`,
  oauth: () => `/auth/oauth/`,
  profile: () => `/auth/profile/`,
  expenses: () => `/reports/expenses-by-categories/`,
  expensesAggregate: () => `/reports/expenses-data/`,
  expensesDiagram: (fromDate: string, toDate: string) => `/reports/diagram/pie/${fromDate}/${toDate}`,
  transaction: (id: number) => `/transactions/${id}`,
  submitTransaction: () => `/transactions/`,
  accounts: () => `/accounts/`,
  categories: () => `/categories/`,
  account: (id: number) => `/accounts/${id}`,

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

    return `/transactions/?${params.toString()}`;
  },

  baseCurrency: () => `/settings/base-currency/`,

  accountTypes: () => `/accounts/types/`,

  currencies: () => `/currencies/`,

  setArchiveStatus: () => `/accounts/set-archive-status`,
};

export default apiRoutes;