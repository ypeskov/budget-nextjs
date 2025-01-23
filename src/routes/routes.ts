export default {
  accounts: (locale: string, archivedOnly: boolean = false, includeHidden: boolean = false, includeArchived: boolean = false) => {
    let url = `/${locale}/accounts`;
    let params = [];

    if (includeHidden || includeArchived || archivedOnly) {
      params.push('?');
    }

    if (archivedOnly) {
      params.push('archivedOnly=true');
    }
    if (includeHidden) {
      params.push('includeHidden=true');
    }
    if (includeArchived) {
      params.push('includeArchived=true');
    }

    return url + params.join('&');
  },
  transactions: (locale: string) => `/${locale}/transactions`,
  categories: (locale: string) => `/${locale}/categories`,
  reports: (locale: string) => `/${locale}/reports`,
  settings: (locale: string) => `/${locale}/settings`,
};