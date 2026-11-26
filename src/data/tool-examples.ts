import type { WorkedExample } from "@/types";

// One worked example per calculator, keyed by tool slug. The results are the tool's
// own output for these inputs; src/data/tool-examples.test.ts recalculates them.
export const toolExamples: Record<string, WorkedExample> = {
  "emi-calculator": {
    title: "A $200,000 loan at 6% a year over 30 years",
    steps: [
      "Monthly rate: 6% ÷ 12 = 0.5%, or 0.005.",
      "Number of payments: 30 × 12 = 360.",
      "EMI = 200,000 × 0.005 × 1.005^360 ÷ (1.005^360 − 1) = $1,199.10.",
      "Total repaid over 360 payments: $431,676.38.",
    ],
    result:
      "The monthly EMI is $1,199.10. Over 30 years you repay $431,676.38, of which $231,676.38 is interest, more than the amount you borrowed.",
  },
  "loan-calculator": {
    title: "A $25,000 car loan at 7% over 5 years, starting on 15 January 2027",
    steps: [
      "Monthly rate: 7% ÷ 12 ≈ 0.5833%, over 60 payments. The monthly payment is $495.03.",
      "Payment 1 (15 Feb 2027): interest is $25,000 × 0.5833% = $145.83, so $349.20 repays the loan and the balance falls to $24,650.80.",
      "Payment 12 (15 Jan 2028): $122.76 interest and $372.27 principal, leaving $20,672.55.",
      "Payment 60 (15 Jan 2032): $2.87 interest and $492.16 principal, leaving $0.00.",
    ],
    result:
      "You pay $495.03 a month and $29,701.80 in total, so the loan costs $4,701.80 in interest. Notice how the interest part shrinks with every payment.",
  },
  "mortgage-calculator": {
    title: "A $400,000 home with $80,000 down at 6.5% over 30 years",
    steps: [
      "Loan amount: $400,000 − $80,000 = $320,000, a 20% down payment.",
      "Principal and interest on $320,000 at 6.5% over 360 months: $2,022.62.",
      "Property tax, using an example rate of 1.1% a year: $400,000 × 1.1% ÷ 12 = $366.67.",
      "Home insurance of $1,500 a year: $1,500 ÷ 12 = $125.00.",
    ],
    result:
      "The monthly payment is $2,514.28. Over the 30 years, interest alone comes to $408,142.36. Use your own tax rate and insurance quote for a real estimate.",
  },
  "compound-interest-calculator": {
    title: "$10,000 at 5% compounded monthly for 10 years, adding $200 a month",
    steps: [
      "Monthly rate: 5% ÷ 12 ≈ 0.4167%, with $200 added at the end of each month.",
      "After 1 year: $12,967.39, of which $567.39 is interest.",
      "After 5 years: $26,434.80, from $22,000 paid in.",
      "After 10 years: $47,526.55.",
    ],
    result:
      "You pay in $34,000 ($10,000 plus 120 deposits of $200) and earn $13,526.55 in interest, for a final balance of $47,526.55.",
  },
  "savings-goal-calculator": {
    title: "Saving $15,000 in 3 years, with $2,000 already saved at 4% interest",
    steps: [
      "Monthly rate: 4% ÷ 12 ≈ 0.3333%, over 36 months.",
      "Your $2,000 grows to $2,254.54 on its own.",
      "Deposits must cover the rest: $15,000 − $2,254.54 = $12,745.46.",
      "Monthly deposit = 12,745.46 × 0.003333 ÷ (1.003333^36 − 1) = $333.81.",
    ],
    result:
      "Save $333.81 a month. Your deposits add up to $12,017.22, and interest makes up the other $982.78 of growth.",
  },
  "discount-calculator": {
    title: "A $120 jacket at 25% off, with an extra 10% off at the till",
    steps: [
      "First discount: $120 × 25% = $30, leaving $90.",
      "Second discount: $90 × 10% = $9, leaving $81.",
      "Amount saved: $120 − $81 = $39.",
    ],
    result: "You pay $81.00 and save $39.00. That is 32.5% off in total, not the 35% you get by adding the two discounts.",
  },
  "sales-tax-vat-calculator": {
    title: "Taking 20% VAT out of a £84 receipt",
    steps: [
      "Price before VAT: £84 ÷ 1.20 = £70.00.",
      "VAT: £84 − £70 = £14.00.",
      "Check: 20% of £70 is £14, which brings the price back to £84.",
    ],
    result: "The price before VAT is £70.00 and the VAT is £14.00. Taking 20% of £84 instead would give £16.80, which is too much.",
  },
  "sales-tax-calculator-usa": {
    title: "A $250 purchase in Michigan",
    steps: [
      "Michigan's statewide rate is 6%, and Michigan does not allow local sales taxes, so the combined rate is 6%.",
      "Sales tax: $250 × 6% = $15.00.",
      "Total: $250 + $15 = $265.00.",
    ],
    result: "You pay $265.00, including $15.00 of sales tax.",
  },
  "tip-calculator": {
    title: "A $64.80 dinner bill with a 20% tip, split between 4 people",
    steps: [
      "Tip: $64.80 × 20% = $12.96.",
      "Total: $64.80 + $12.96 = $77.76.",
      "Each person: $77.76 ÷ 4 = $19.44, of which $3.24 is tip.",
    ],
    result: "Each of the four people pays $19.44, and the restaurant receives $77.76 including a $12.96 tip.",
  },
  "profit-margin-calculator": {
    title: "A product that costs $45 and sells for $72",
    steps: ["Profit: $72 − $45 = $27.", "Margin: $27 ÷ $72 = 37.5%.", "Markup: $27 ÷ $45 = 60%."],
    result: "You make $27.00 on each sale, which is a 37.5% margin and a 60% markup on the same product.",
  },
  "salary-hourly-converter": {
    title: "A $62,400 salary for a 37.5-hour week, paid for 52 weeks a year",
    steps: [
      "Hours a year: 37.5 × 52 = 1,950.",
      "Hourly: $62,400 ÷ 1,950 = $32.00.",
      "Weekly: $32 × 37.5 = $1,200.00, and daily over five days: $240.00.",
      "Monthly: $62,400 ÷ 12 = $5,200.00.",
    ],
    result: "The salary works out at $32.00 an hour, $240.00 a day, $1,200.00 a week and $5,200.00 a month, all before tax.",
  },
  "percentage-calculator": {
    title: "A test score of 42 out of 60, and a price rise from $48 to $54",
    steps: [
      "What percent of 60 is 42? 42 ÷ 60 × 100 = 70%.",
      "Percentage change from 48 to 54: (54 − 48) ÷ 48 × 100 = 12.5%.",
    ],
    result: "The score is 70%, and the price went up by 12.5%. The $6 rise counts as 12.5% because it is measured against the old price of $48.",
  },
  "age-calculator": {
    title: "Someone born on 1 March 1985, on 26 November 2026",
    steps: [
      "Whole years: 1 March 1985 to 1 March 2026 is 41 years.",
      "Whole months: 1 March 2026 to 1 November 2026 is 8 months.",
      "Days left over: 1 November to 26 November is 25 days.",
      "Next birthday: Monday, 1 March 2027, which is 95 days away.",
    ],
    result: "They are 41 years, 8 months and 25 days old, or 15,245 days.",
  },
  "date-difference-calculator": {
    title: "From 14 February 2026 to 30 September 2026",
    steps: [
      "Days: 14 left in February, 184 in March to August, and 30 in September, for 228 days.",
      "Weeks: 228 ÷ 7 = 32 weeks and 4 days.",
      "Months: 14 February to 14 September is 7 months, plus 16 days.",
      "Counting the end date as well adds one day, for 229 days.",
    ],
    result: "The gap is 228 days, which is 32 weeks and 4 days, or 7 months and 16 days.",
  },
  "bmi-calculator": {
    title: "An adult who is 5 ft 10 in tall and weighs 185 lb",
    steps: [
      "Height: 70 inches × 0.0254 = 1.778 m.",
      "Weight: 185 lb × 0.45359237 = 83.9 kg.",
      "BMI: 83.9 ÷ (1.778 × 1.778) = 26.5.",
    ],
    result:
      "The BMI is 26.5, which is in the overweight range of 25 to 29.9. A healthy weight for this height would be about 128.9 to 173.5 lb.",
  },
  "unit-converter": {
    title: "A 26.2-mile marathon in kilometres",
    steps: ["One mile is exactly 1,609.344 metres, or 1.609344 km.", "26.2 × 1.609344 = 42.1648128 km."],
    result:
      "26.2 miles is 42.1648128 km, about 42.16 km. The official marathon distance of 42.195 km is a little more than 26.2 miles.",
  },
  "time-zone-converter": {
    title: "A 10:00 AM call in New York on Tuesday 2 February 2027",
    steps: [
      "In February, New York is on standard time (UTC-5), so 10:00 AM there is 15:00 UTC.",
      "London (UTC): 3:00 PM on Tuesday.",
      "Mumbai / Delhi (UTC+5:30): 8:30 PM on Tuesday.",
      "Tokyo (UTC+9): 12:00 AM on Wednesday 3 February, a day later.",
    ],
    result:
      "Midnight is too late for Tokyo. Moving the call to 8:00 AM in New York makes it 10:00 PM in Tokyo and 1:00 PM in London.",
  },
};
