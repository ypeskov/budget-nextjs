const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const transactionsPerPage = Number(process.env.NEXT_PUBLIC_TRANSACTIONS_PER_PAGE);

export function prepareRequestUrl(page: number, searchParams: Record<string, string | undefined>): string {
  const params = new URLSearchParams({
    per_page: transactionsPerPage.toString(),
    page: page.toString(),
    ...(searchParams.accounts && { accounts: searchParams.accounts }),
    ...(searchParams.types && { types: searchParams.types }),
    ...(searchParams.fromDate && { from_date: searchParams.fromDate }),
    ...(searchParams.toDate && { to_date: searchParams.toDate }),
    ...(searchParams.categories && { categories: searchParams.categories }),
  });

  return `${apiBaseUrl}/transactions/?${params.toString()}`;
}