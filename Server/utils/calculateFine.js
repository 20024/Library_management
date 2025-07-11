export const calculateFine = (dueDate, returnDate = new Date()) => {
  if (!dueDate) return 0;

  const due = new Date(dueDate);
  const ret = new Date(returnDate);

  if (ret <= due) return 0;

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLate = Math.ceil((ret - due) / msPerDay);

  const finePerDay = 10; // ₹10 per day fine
  return daysLate * finePerDay;
};
