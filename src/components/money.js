export function calculateItemTotal(price, quantity) {
  let [dollars, cents] = price.split(".");
  const totalCents = (parseInt(dollars) * 100 + parseInt(cents)) * quantity;
  dollars = Math.floor(totalCents / 100);
  cents = totalCents % 100;
  return `${dollars}.${cents < 10 ? "0" : ""}${cents}`;
}

export function addMonies(monies) {
  let totalDollars = 0;
  let totalCents = 0;
  for (const money of monies) {
    const [dollars, cents] = money.split(".");
    totalDollars += parseInt(dollars);
    totalCents += parseInt(cents);
  }
  const dollarsFromCents = Math.floor(totalCents / 100);
  const remainingCents = totalCents % 100;
  totalDollars += dollarsFromCents;
  return `${totalDollars}.${remainingCents < 10 ? "0" : ""}${remainingCents}`;
}

export function calculateSubtotal(items) {
  let subtotals = items.map((item) =>
    calculateItemTotal(item.product.price, item.quantity)
  );
  return addMonies(subtotals);
}
