const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const transactionsPerPage = Number(process.env.NEXT_PUBLIC_TRANSACTIONS_PER_PAGE);

export function prepareRequestUrl(page: number, searchParams: Record<string, string | undefined>): string {
  let transactionsUrl = `${apiBaseUrl}/transactions/?`;
  transactionsUrl += `per_page=${transactionsPerPage}`;
  transactionsUrl += `&page=${page}`;

  if (searchParams.accounts) {
    transactionsUrl += `&accounts=${searchParams.accounts}`;
  }

  if (searchParams.types) {
    transactionsUrl += `&types=${searchParams.types}`;
  }

  if (searchParams.fromDate) {
    transactionsUrl += `&from_date=${searchParams.fromDate}`;
  }

  // console.log(transactionsUrl);
  return transactionsUrl;
}