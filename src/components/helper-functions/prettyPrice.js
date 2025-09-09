function prettyPrice(inputPrice) {
  if (isNaN(+inputPrice))
    throw new Error("TypeError, a non number passed as price");
  if (+inputPrice < 0) throw new Error("ValueError, prices can't be negative");
  let priceStr = `${Math.round(inputPrice * 100) / 100}`;

  if (!priceStr.includes(".")) priceStr += ".";
  while (priceStr.length < 4 || priceStr.charAt(priceStr.length - 3) !== ".")
    priceStr += "0";

  return priceStr;
}

export default prettyPrice;
