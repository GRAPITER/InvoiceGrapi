type diffCurr = {
  amount: number;
  currency: "USD" | "EUR";
};

export function formetCurrency({ amount, currency }: diffCurr) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}
