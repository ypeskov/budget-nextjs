export default {
  accounts: (locale: string, archivedOnly = false, includeHidden = false, includeArchived = false) => {
    const params = new URLSearchParams();
  
    if (archivedOnly) params.append('archivedOnly', 'true');
    if (includeHidden) params.append('includeHidden', 'true');
    if (includeArchived) params.append('includeArchived', 'true');
  
    const queryString = params.toString();
    return `/${locale}/accounts${queryString ? `?${queryString}` : ''}`;
  },

  transactions: (locale: string) => `/${locale}/transactions`,

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

  cashFlowReport: (locale: string) => `/${locale}/reports/cash-flow`,

  balanceReport: (locale: string) => `/${locale}/reports/balance`,

};
