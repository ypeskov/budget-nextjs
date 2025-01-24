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

  expensesReport: (locale: string, fromDate: string, toDate: string, hideEmptyCategories: string) => 
    `/${locale}/reports/expenses-report?fromDate=${fromDate}&toDate=${toDate}&hideEmptyCategories=${hideEmptyCategories}`,
};
