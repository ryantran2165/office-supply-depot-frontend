export function calculateItemSubweight(weight, quantity) {
  // Database stores weights as floats, so decimal is not always included
  weight = weight.toString();

  if (weight.includes(".")) {
    let [whole, decimal] = weight.split(".");
    const totalDecimal = (parseInt(whole) * 10 + parseInt(decimal)) * quantity;

    whole = Math.floor(totalDecimal / 10);
    decimal = totalDecimal % 10;

    return `${whole}.${decimal}`;
  } else {
    return `${weight * quantity}.0`;
  }
}

export function addWeights(weights) {
  let totalWhole = 0;
  let totalDecimal = 0;

  for (let weight of weights) {
    // Database stores weights as floats, so decimal is not always included
    weight = weight.toString();

    if (weight.includes(".")) {
      const [whole, decimal] = weight.split(".");

      totalWhole += parseInt(whole);
      totalDecimal += parseInt(decimal);
    } else {
      totalWhole += parseInt(weight);
    }
  }
  const wholesFromDecimals = Math.floor(totalDecimal / 10);
  const remainingCents = totalDecimal % 10;

  totalWhole += wholesFromDecimals;
  return `${totalWhole}.${remainingCents}`;
}

export function calculateItemSubtotal(price, quantity) {
  // Database stores prices as strings, so decimal is always included
  let [dollars, cents] = price.split(".");
  const totalCents = (parseInt(dollars) * 100 + parseInt(cents)) * quantity;

  dollars = Math.floor(totalCents / 100);
  cents = totalCents % 100;

  return `${dollars}.${cents < 10 ? "0" : ""}${cents}`;
}

export function addPrices(prices) {
  let totalDollars = 0;
  let totalCents = 0;

  for (const price of prices) {
    // Database stores prices as strings, so decimal is always included
    const [dollars, cents] = price.split(".");

    totalDollars += parseInt(dollars);
    totalCents += parseInt(cents);
  }
  const dollarsFromCents = Math.floor(totalCents / 100);
  const remainingCents = totalCents % 100;

  totalDollars += dollarsFromCents;
  return `${totalDollars}.${remainingCents < 10 ? "0" : ""}${remainingCents}`;
}
