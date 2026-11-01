// Loan maths shared by the EMI, Loan and Mortgage calculators.

// Fixed monthly payment: P×r×(1+r)^n / ((1+r)^n − 1), or P/n at 0% interest.
export function monthlyPayment(
  principal: number,
  annualRatePct: number,
  months: number,
): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRatePct / 1200;
  if (r === 0) return principal / months;
  const growth = Math.pow(1 + r, months);
  return (principal * r * growth) / (growth - 1);
}

export interface ScheduleRow {
  n: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

// Month-by-month repayment table. The last row clears the balance exactly.
export function amortize(
  principal: number,
  annualRatePct: number,
  months: number,
): ScheduleRow[] {
  const rows: ScheduleRow[] = [];
  if (principal <= 0 || months <= 0) return rows;
  const r = annualRatePct / 1200;
  const payment = monthlyPayment(principal, annualRatePct, months);
  let balance = principal;
  for (let n = 1; n <= months; n++) {
    const interest = balance * r;
    const last = n === months;
    const principalPart = last ? balance : payment - interest;
    balance = last ? 0 : Math.max(0, balance - principalPart);
    rows.push({
      n,
      payment: principalPart + interest,
      principal: principalPart,
      interest,
      balance,
    });
  }
  return rows;
}
