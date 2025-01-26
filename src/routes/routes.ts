export default {
  accounts: (locale: string, archivedOnly = false, includeHidden = false, includeArchived = false) => {
    const params = new URLSearchParams();

    if (archivedOnly) params.append('archivedOnly', 'true');
    if (includeHidden) params.append('includeHidden', 'true');
    if (includeArchived) params.append('includeArchived', 'true');

    const queryString = params.toString();
    return `/${locale}/accounts${queryString ? `?${queryString}` : ''}`;
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

    let url = '/reports/expenses-report';
    if (locale) {
      url = `/${locale}${url}`;
    }
    const queryString = params.toString();
    return `${url}${queryString ? `?${queryString}` : ''}`;
  },

  cashFlowReport: (locale?: string) => {
    let url = '/reports/cash-flow';
    if (locale) {
      url = `/${locale}${url}`;
    }
    return url;
  },

  balanceReport: (locale?: string) => {
    let url = '/reports/balance';
    if (locale) {
      url = `/${locale}${url}`;
    }
    return url;
  },

};
