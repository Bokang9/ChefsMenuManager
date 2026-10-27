export const formatCurrency = (value) => {
  const amount = Number(value) || 0;
  return `R ${amount.toFixed(2)}`;
};