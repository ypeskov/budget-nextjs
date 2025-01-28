export default {
  accounts: ({ locale,
    archivedOnly = false,
    includeHidden = false,
    includeArchived = false }:
    { locale?: string, 
      archivedOnly?: boolean, 
      includeHidden?: boolean, 
      includeArchived?: boolean }) => {
    const params = new URLSearchParams();

    const basePath = locale ? `/${locale}/accounts` : `/accounts`;

    if (archivedOnly) params.append('archivedOnly', 'true');
    if (includeHidden) params.append('includeHidden', 'true');
    if (includeArchived) params.append('includeArchived', 'true');

    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  },

  transactions: (
    { locale,
      accountIds,
      fromDate,
      toDate,
      types,
      categories,
    }: {
      locale?: string,
      accountIds?: number[],
      fromDate?: string,
      toDate?: string,
      types?: string[],
      categories?: (number | null)[]
    }) => {

    const params = new URLSearchParams({
      ...(accountIds && { accountIds: accountIds.join(",") }),
      ...(fromDate && { fromDate }),
      ...(toDate && { toDate }),
      ...(types && { types: types.join(",") }),
      ...(categories && { categories: categories.join(",") }),
    });

    const queryString = params.toString();
    const basePath = locale ? `/${locale}/transactions` : `/transactions`;

    return queryString ? `${basePath}?${queryString}` : basePath;
  },


  transactionDetails: ({ locale, transactionId }: { locale?: string, transactionId: number }) => {
    const basePath = locale ? `/${locale}/transactions` : `/transactions`;
    return `${basePath}/${transactionId}`;
  },

  categories: (locale: string) => `/${locale}/categories`,

  reports: (locale: string) => `/${locale}/reports`,

  settings: (locale: string) => `/${locale}/settings`,

  expensesReport: (locale?: string, fromDate?: string, toDate?: string, hideEmptyCategories?: string) => {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    if (hideEmptyCategories) params.append('hideEmptyCategories', hideEmptyCategories);

    const basePath = locale ? `/${locale}/reports/expenses-report` : `/reports/expenses-report`;
    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  },

  cashFlowReport: (locale?: string) => {
    const basePath = locale ? `/${locale}/reports/cash-flow` : `/reports/cash-flow`;
    return basePath;
  },

  balanceReport: (locale?: string) => {
    const basePath = locale ? `/${locale}/reports/balance` : `/reports/balance`;
    return basePath;
  },


  login: (locale?: string) => {
    const basePath = locale ? `/${locale}/login` : `/login`;
    return basePath;
  },

  logout: (locale?: string) => {
    const basePath = locale ? `/${locale}/logout` : `/logout`;
    return basePath;
  },
};
