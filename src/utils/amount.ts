export function formatAmount(amount: number, 
  locale: string, 
  currencyCode: string,
  style?: "currency" | "decimal" | "percent",): string {

  if (!style) {
    style = "currency";
  }

  const formattedAmount = amount.toLocaleString(locale, {
    style: style,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    currency: currencyCode,
    currencyDisplay: 'code',
  });

  return formattedAmount;
}
