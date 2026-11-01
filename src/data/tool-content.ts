import type { ToolContent } from "@/types";

// Intro, steps, method and FAQs per tool, keyed by slug.
// Finance, Everyday Calculator and Text tools have their full copy. The
// password-generator entry is a short draft until Stage 5.
export const toolContent: Record<string, ToolContent> = {
  "emi-calculator": {
    intro:
      "An equated monthly instalment (EMI) is the fixed amount you repay every month until a loan is cleared. It is how most car loans, personal loans and home loans are structured. This calculator shows your monthly EMI, the total interest you will pay over the whole term, and the total amount repaid, so you can compare lenders before you sign.",
    steps: [
      "Enter the loan amount you want to borrow.",
      "Enter the annual interest rate quoted by the lender.",
      "Type the loan term and choose months or years.",
      "Read your monthly EMI, total interest and total payment, and check the chart for the split between principal and interest.",
    ],
    method: [
      "The calculator uses the standard reducing-balance formula: EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1). P is the loan amount, r is the monthly interest rate (the annual rate divided by 12 and by 100) and n is the number of monthly payments.",
      "Because interest is charged on the balance still owed, early payments are mostly interest and later ones are mostly principal, even though the EMI stays the same. Total payment is the EMI multiplied by n, and total interest is that figure minus the amount you borrowed. If the rate is 0%, the formula simplifies to the loan divided by the number of months.",
    ],
    faqs: [
      {
        question: "What does EMI stand for?",
        answer:
          "EMI stands for equated monthly instalment. It is the fixed payment you make every month, covering both interest and part of the loan itself, until the balance reaches zero.",
      },
      {
        question: "Does a longer term lower my EMI?",
        answer:
          "Yes. Spreading the same loan over more months makes each payment smaller, but you pay interest for longer, so the total interest is higher. Try changing the term to see the trade-off.",
      },
      {
        question: "Are fees and insurance included?",
        answer:
          "No. The result covers principal and interest only. Processing fees, insurance and late-payment charges are extra, so ask your lender for the full cost.",
      },
      {
        question: "Is this the same as a flat-rate loan?",
        answer:
          "No. This calculator assumes a reducing balance, where interest falls as you repay. Flat-rate loans charge interest on the original amount for the whole term, which costs more for the same quoted rate.",
      },
      {
        question: "Is my data stored anywhere?",
        answer:
          "No. All calculations run in your browser and nothing you enter is sent to a server.",
      },
    ],
  },
  "loan-calculator": {
    intro:
      "Use this loan calculator to see exactly what a loan costs, payment by payment. Besides your monthly payment, it builds a full amortization schedule that shows how each payment is split between interest and principal and how your balance falls over time. You can download the schedule as a CSV file for a spreadsheet.",
    steps: [
      "Enter the amount you plan to borrow and the annual interest rate.",
      "Choose the loan term in years or months.",
      "Optionally add a start date to see the date of every payment.",
      "Review the monthly payment, then scroll the schedule or download it as CSV.",
    ],
    method: [
      "The monthly payment comes from the fixed-payment loan formula: payment = P × r ÷ (1 − (1 + r)^−n), where P is the amount borrowed, r is the interest rate per month and n is the number of payments.",
      "To build the schedule, each month's interest is the opening balance multiplied by r. The rest of the payment reduces the principal, and the new balance becomes next month's opening balance. The final payment is adjusted by a few cents so the balance ends at exactly zero. Payment dates, when you give a start date, fall one month apart and move to the last day of shorter months. At 0% interest, every payment is simply the loan divided by the number of months.",
    ],
    faqs: [
      {
        question: "What is an amortization schedule?",
        answer:
          "It is a table listing every payment of a loan with the interest part, the principal part and the remaining balance after that payment.",
      },
      {
        question: "Why is most of my first payment interest?",
        answer:
          "Interest is calculated on the balance you still owe, which is highest at the start. As the balance falls, more of each payment goes to principal.",
      },
      {
        question: "Can I pay the loan off early?",
        answer:
          "Usually yes, and it reduces the total interest. This calculator assumes regular payments only, so check your lender's rules on early repayment fees.",
      },
      {
        question: "What does the CSV file contain?",
        answer:
          "One row per payment with the payment number, date (if you set a start date), payment amount, principal, interest and remaining balance. It opens in Excel, Google Sheets and Numbers.",
      },
      {
        question: "Does the calculator include fees?",
        answer:
          "No. It covers principal and interest only. Arrangement fees, insurance and other charges would raise the true cost.",
      },
    ],
  },
  "mortgage-calculator": {
    intro:
      "Buying a home means paying more than the loan itself. This mortgage calculator estimates your full monthly housing payment: the principal and interest on your loan, plus property tax and home insurance. Change the home price, down payment or rate to see how each choice moves your monthly cost.",
    steps: [
      "Enter the home price and your down payment.",
      "Enter the mortgage interest rate and the term in years.",
      "Add the yearly property tax rate and your annual home insurance cost.",
      "Read your total monthly payment and its breakdown, plus the loan amount and total interest.",
    ],
    method: [
      "The loan amount is the home price minus your down payment. Principal and interest are calculated with the standard mortgage formula: M = L × r × (1 + r)^n ÷ ((1 + r)^n − 1), where L is the loan, r is the monthly rate and n is the number of monthly payments.",
      "Property tax is the home price multiplied by the tax rate, divided by 12. Home insurance is the yearly premium divided by 12. Your total monthly payment is the sum of the three parts. Total interest is the principal-and-interest payment multiplied by n, minus the loan. Costs such as mortgage insurance, HOA fees and maintenance are not included, so treat the result as an estimate.",
    ],
    faqs: [
      {
        question: "How much should I put down on a home?",
        answer:
          "Many lenders ask for between 3% and 20%. A larger down payment lowers your loan, your monthly payment and your total interest, and may help you avoid mortgage insurance.",
      },
      {
        question: "What is included in the monthly payment?",
        answer:
          "Principal, interest, property tax and home insurance. This is often called PITI. Mortgage insurance and HOA dues are not included.",
      },
      {
        question: "How do I find my property tax rate?",
        answer:
          "Your local tax authority or the seller's listing usually shows it. As a rough guide, many areas charge between 0.5% and 2% of the home value per year.",
      },
      {
        question: "Does a shorter term save money?",
        answer:
          "Yes. A 15-year mortgage has a higher monthly payment than a 30-year one, but you pay far less total interest. Compare both terms here.",
      },
      {
        question: "Is the result a loan offer?",
        answer:
          "No. It is an estimate for planning. Your lender's quote will depend on your credit, fees and the exact loan product.",
      },
    ],
  },
  "compound-interest-calculator": {
    intro:
      "Compound interest means you earn interest on your interest, which is why savings and investments can grow faster over time. This calculator shows the final balance of a starting amount with optional monthly contributions, how much you paid in, how much interest you earned, and a year-by-year table of the growth.",
    steps: [
      "Enter your starting amount and the expected annual interest rate.",
      "Set the number of years and how often interest compounds.",
      "Add a monthly contribution if you plan to keep saving.",
      "Read the final balance, total contributions and interest earned, then check the year-by-year table.",
    ],
    method: [
      "Without deposits, the balance follows A = P × (1 + r/n)^(n×t), where P is the starting amount, r is the annual rate, n is the number of compounding periods per year and t is the number of years.",
      "To include monthly contributions for any compounding frequency, the calculator converts the rate to an effective monthly rate, (1 + r/n)^(n/12) − 1, and then moves month by month: the balance is multiplied by one plus that rate, and the contribution is added at the end of the month. Interest earned is the final balance minus your starting amount and all deposits. Results ignore taxes, fees and inflation, and real returns vary.",
    ],
    faqs: [
      {
        question: "What is the difference between simple and compound interest?",
        answer:
          "Simple interest is paid only on the original amount. Compound interest is paid on the original amount plus the interest already earned, so growth accelerates.",
      },
      {
        question: "Does compounding more often help?",
        answer:
          "Slightly. Monthly compounding earns a little more than annual compounding at the same rate, and daily is a little more again, but the rate and time matter much more.",
      },
      {
        question: "When are contributions added?",
        answer:
          "At the end of each month, after that month's interest has been applied.",
      },
      {
        question: "Can I use this for investments?",
        answer:
          "You can model a steady expected return, but investment returns are not guaranteed and change from year to year. Use the result as an illustration, not a forecast.",
      },
      {
        question: "Are taxes and inflation included?",
        answer:
          "No. Taxes, account fees and inflation would reduce your real growth, so your actual result may be lower.",
      },
    ],
  },
  "savings-goal-calculator": {
    intro:
      "Whether you are saving for a deposit, a holiday or an emergency fund, it helps to know how much to put aside each month. This savings goal calculator works out the monthly amount you need to reach a target by your deadline, taking into account what you already have saved and the interest you earn.",
    steps: [
      "Enter the amount you want to have saved.",
      "Enter how much you have saved so far and the interest rate on your account.",
      "Choose how long you have to reach the goal, in years or months.",
      "Read the monthly amount to save, the total deposits and the interest you will earn.",
    ],
    method: [
      "The calculator assumes interest compounds monthly and that you make a deposit at the end of every month. Your current savings grow to S × (1 + i)^n, where i is the monthly rate (annual rate ÷ 12) and n is the number of months.",
      "The shortfall between that figure and your goal must come from deposits. The monthly deposit is shortfall × i ÷ ((1 + i)^n − 1). With a 0% rate, it is simply the shortfall divided by the number of months. If your current savings will already grow past the goal, no deposits are needed and the tool tells you so. Interest earned is the goal minus your starting savings minus all deposits.",
    ],
    faqs: [
      {
        question: "How is the monthly amount calculated?",
        answer:
          "It is the level deposit that, together with interest on your balance, brings you exactly to your goal at the deadline.",
      },
      {
        question: "What if I do not earn any interest?",
        answer:
          "Enter 0 as the rate. The monthly amount is then your remaining goal divided by the number of months.",
      },
      {
        question: "Why is the answer lower than goal divided by months?",
        answer:
          "Because interest on your savings does part of the work, so you need to deposit less than the plain average.",
      },
      {
        question: "Can I change the deadline?",
        answer:
          "Yes. A longer deadline lowers the monthly amount. Try different terms to find a monthly figure that fits your budget.",
      },
      {
        question: "Do interest rates stay fixed?",
        answer:
          "Savings rates can change. The result assumes a constant rate, so recalculate if your bank changes it.",
      },
    ],
  },
  "discount-calculator": {
    intro:
      "Sales, coupons and clearance tags make it hard to see what you will really pay. This discount calculator turns an original price and a percentage off into the final price and the amount you save. You can also stack a second discount, such as an extra voucher on top of a sale price.",
    steps: [
      "Enter the original price of the item.",
      "Enter the discount percentage.",
      "If there is a second discount, enter it too. Leave it blank if not.",
      "Read the final price, the amount you save and the total discount.",
    ],
    method: [
      "A single discount is applied as final price = original price × (1 − discount ÷ 100). The amount saved is the original price minus the final price.",
      "A second discount is taken from the already reduced price, not from the original. The final price is therefore original × (1 − d1 ÷ 100) × (1 − d2 ÷ 100). That is why two discounts of 20% and 10% give 28% off in total, not 30%: the 10% applies to a smaller number. The total discount shown is the amount saved divided by the original price. Sales tax is not added, so use the Sales Tax calculator if tax applies where you shop.",
    ],
    faqs: [
      {
        question: "How do I calculate a percentage discount?",
        answer:
          "Multiply the price by the discount percent divided by 100 to get the saving, then subtract it from the price. This calculator does both steps.",
      },
      {
        question: "Why are two discounts not simply added together?",
        answer:
          "The second discount is applied to the price after the first one, so it takes off a smaller amount. Twenty percent followed by ten percent equals 28% off.",
      },
      {
        question: "Does the result include tax?",
        answer:
          "No. It shows the discounted price before any sales tax or VAT.",
      },
      {
        question: "Can I enter a discount of 100%?",
        answer:
          "Yes. The final price will be zero. Values above 100% are not accepted.",
      },
      {
        question: "Is the order of the two discounts important?",
        answer:
          "No. Applying 10% then 20% gives the same final price as 20% then 10%.",
      },
    ],
  },
  "sales-tax-vat-calculator": {
    intro:
      "Prices are often shown with tax in some countries and without it in others. This sales tax and VAT calculator adds tax to a net price, or removes it from a gross price, and shows the net amount, the tax and the gross amount. It works for any rate, including US sales tax, UK and EU VAT, Canadian GST and Australian GST.",
    steps: [
      "Choose whether to add tax to a price or remove it from a price.",
      "Enter the amount. This is the price before tax when adding, or including tax when removing.",
      "Enter the tax rate as a percentage.",
      "Read the net, tax and gross amounts.",
    ],
    method: [
      "To add tax, the tax amount is the net price × rate ÷ 100, and the gross price is the net price plus that tax. For example, 20% VAT on 100 adds 20 and gives 120.",
      "To remove tax from a price that already includes it, you cannot simply subtract the rate from the gross price, because the tax was calculated on the smaller net price. Instead, net = gross ÷ (1 + rate ÷ 100), and tax = gross − net. So removing 20% VAT from 120 gives a net of 100 and tax of 20, not 24. Rounding is applied only when results are displayed, to the nearest cent, so no accuracy is lost along the way.",
    ],
    faqs: [
      {
        question: "What is the difference between VAT and sales tax?",
        answer:
          "VAT is collected at every stage of production and is shown in the final price in many countries. US sales tax is charged once, at the till, and is usually added to the displayed price.",
      },
      {
        question: "Why is removing 20% not the same as subtracting 20%?",
        answer:
          "The tax was calculated on the net price, so it is 20% of the net, not of the gross. Dividing by 1.20 reverses it correctly.",
      },
      {
        question: "What are net and gross?",
        answer:
          "Net is the price before tax. Gross is the price including tax.",
      },
      {
        question: "Can I use it for GST?",
        answer:
          "Yes. GST works the same way. Enter your local rate and choose whether to add or remove it.",
      },
      {
        question: "Which tax rate should I use?",
        answer:
          "Use the rate that applies to your product and location. Rates differ by country, state and sometimes by item, so check your tax authority.",
      },
    ],
  },
  "tip-calculator": {
    intro:
      "Splitting a restaurant bill should not need mental maths. This tip calculator adds your chosen tip to the bill, then divides everything between the number of people, so you can see the tip, the total and what each person pays in seconds. Use the quick buttons for common tip percentages or type your own.",
    steps: [
      "Enter the bill amount before tip.",
      "Pick a tip percentage with the quick buttons or type your own.",
      "Enter how many people are sharing the bill.",
      "Read the tip, the total and the amount each person pays.",
    ],
    method: [
      "The tip is the bill multiplied by the tip percentage divided by 100. The total is the bill plus the tip, and each person's share is the total divided by the number of people. The tip per person is the tip divided by the same number.",
      "For example, an 85.50 bill with an 18% tip gives a tip of 15.39 and a total of 100.89. Shared between three people, each pays 33.63. The calculator splits the bill evenly and does not round up. If you prefer round figures, adjust the tip percentage until the per-person amount suits you. The tip is calculated on the pre-tax bill you enter, so enter the amount you want the tip based on.",
    ],
    faqs: [
      {
        question: "How much should I tip?",
        answer:
          "It depends on the country and the service. In the US, 15% to 20% is common in restaurants. In many other countries, tipping is smaller or included in the bill.",
      },
      {
        question: "Should I tip on the pre-tax amount?",
        answer:
          "Many people do, and this calculator works on whatever bill figure you enter, so you can choose either.",
      },
      {
        question: "Can I split the bill unevenly?",
        answer:
          "Not in this tool. It divides the total equally between the people you enter.",
      },
      {
        question: "What if the service charge is already included?",
        answer:
          "Set the tip to 0% to see the bill split without any extra tip.",
      },
      {
        question: "Why do I see fractions of a cent?",
        answer:
          "Amounts are rounded to two decimals for display. Small rounding differences of a cent may appear when you add up the shares.",
      },
    ],
  },
  "profit-margin-calculator": {
    intro:
      "Margin and markup are often confused, yet they give very different numbers for the same sale. This profit margin calculator takes your cost and either your selling price or your markup percentage, then shows the profit, the margin percentage and the markup percentage side by side, so you can price products with confidence.",
    steps: [
      "Enter what the item costs you.",
      "Choose whether you know the revenue (selling price) or the markup percentage.",
      "Enter that value.",
      "Read the profit, margin, markup and revenue.",
    ],
    method: [
      "Profit is revenue minus cost. Margin is profit divided by revenue, and markup is profit divided by cost, both shown as percentages. Because revenue is larger than cost on a profitable sale, margin is always lower than markup.",
      "For example, a product that costs 60 and sells for 100 earns a profit of 40. The margin is 40 ÷ 100 = 40%, while the markup is 40 ÷ 60 = 66.67%. If you start from markup instead, revenue is cost × (1 + markup ÷ 100): a 50% markup on a cost of 80 gives a selling price of 120 and a margin of 33.33%. If revenue is below cost, profit and margin are negative, which shows a loss. All figures exclude tax, shipping and overheads.",
    ],
    faqs: [
      {
        question: "What is the difference between margin and markup?",
        answer:
          "Margin is profit as a share of the selling price. Markup is profit as a share of the cost. A 50% markup equals a 33.3% margin.",
      },
      {
        question: "Which should I use to set prices?",
        answer:
          "Many businesses set prices using markup, because it is applied to cost, and judge performance using margin, because it is a share of sales.",
      },
      {
        question: "Can the margin be above 100%?",
        answer:
          "No. Margin cannot exceed 100% because profit cannot be more than revenue. Markup can be any size.",
      },
      {
        question: "What does a negative margin mean?",
        answer:
          "You are selling below cost and making a loss on that item.",
      },
      {
        question: "Are overheads included?",
        answer:
          "No. This is gross margin on the cost you enter. Add rent, wages and other expenses to your cost if you want a net figure.",
      },
    ],
  },
  "salary-hourly-converter": {
    intro:
      "Job offers, contracts and payslips quote pay in different ways, which makes them hard to compare. This salary and hourly converter takes pay in any one form, per hour, day, week, month or year, and shows the other four. You can set your own hours per week and weeks per year to match your job.",
    steps: [
      "Enter the amount you are paid and choose the pay period.",
      "Enter your usual hours per week.",
      "Enter the number of weeks you are paid per year.",
      "Read the hourly, daily, weekly, monthly and yearly equivalents.",
    ],
    method: [
      "Everything is converted through the hourly rate. Hours worked in a year are hours per week multiplied by weeks per year, so a 40-hour week over 52 weeks is 2,080 hours. A yearly salary divided by 2,080 gives the hourly rate, and an hourly rate multiplied by 2,080 gives the yearly salary.",
      "Weekly pay is the hourly rate times weekly hours. Daily pay assumes a five-day week, so it is the hourly rate times hours per week divided by five. Monthly pay is the yearly figure divided by twelve. If you take unpaid holidays, enter fewer weeks per year, such as 48, to see the effect. The figures are before tax and deductions, and overtime and bonuses are not included.",
    ],
    faqs: [
      {
        question: "How do I convert salary to an hourly rate?",
        answer:
          "Divide your yearly pay by the hours you work in a year. For a 40-hour week and 52 weeks, that is 2,080 hours.",
      },
      {
        question: "Is the result before or after tax?",
        answer:
          "Before tax. It uses the gross amount you enter, with no deductions.",
      },
      {
        question: "Why is monthly pay not weekly pay times four?",
        answer:
          "A year has about 4.33 weeks per month. Monthly pay here is the yearly figure divided by twelve, which is more accurate.",
      },
      {
        question: "How do I account for unpaid holiday?",
        answer:
          "Reduce the weeks per year. For example, enter 50 if you take two unpaid weeks.",
      },
      {
        question: "Does daily pay assume a five-day week?",
        answer:
          "Yes. Daily pay is based on five working days per week. For a different pattern, divide the weekly figure by your number of days.",
      },
    ],
  },
  "percentage-calculator": {
    intro:
      "Percentages show up everywhere: discounts, exam marks, tips, interest rates and price changes. This percentage calculator answers the three questions people ask most often. What is X percent of Y? X is what percent of Y? And by what percentage did a value go up or down? Pick a question, enter two numbers, and see the answer straight away.",
    steps: [
      "Choose the question you want to answer from the list.",
      "Enter your two values in the boxes. Both have example numbers to start from.",
      "Read the result, which updates as you type.",
      "Press the copy button to keep the answer with a short sentence describing it.",
    ],
    method: [
      "Each question uses one simple formula. To find X percent of Y, multiply: X × Y ÷ 100. So 20% of 150 is 20 × 150 ÷ 100 = 30. To find what percent X is of Y, divide and multiply by 100: X ÷ Y × 100. So 15 is 25% of 60.",
      "Percentage change compares an old value with a new one: (new − old) ÷ |old| × 100. Going from 80 to 100 is a 25% increase, but going from 100 back to 80 is only a 20% decrease, because the starting point is different. If the starting value is zero the change cannot be expressed as a percentage, so the tool asks for a different value. Results are shown with up to six decimal places.",
    ],
    faqs: [
      {
        question: "How do I calculate a percentage of a number?",
        answer:
          "Multiply the number by the percentage and divide by 100. For example, 15% of 200 is 15 × 200 ÷ 100 = 30.",
      },
      {
        question: "Why is a 25% increase not undone by a 25% decrease?",
        answer:
          "The second percentage is taken from the new, larger value. Raising 80 by 25% gives 100, and cutting 100 by 25% gives 75, not 80. A 20% decrease is needed to return to 80.",
      },
      {
        question: "Can I use negative numbers?",
        answer:
          "Yes. A negative percentage gives a negative amount, and a change between negative values is measured against the size of the starting number.",
      },
      {
        question: "What does percentage points mean?",
        answer:
          "A percentage point is the plain difference between two percentages. Moving from 10% to 12% is 2 percentage points, but it is a 20% relative increase.",
      },
      {
        question: "Why does the tool refuse to divide by zero?",
        answer:
          "A value cannot be a percentage of zero, and a change from zero has no percentage. The tool shows a message instead of an incorrect number.",
      },
    ],
  },
  "age-calculator": {
    intro:
      "Find out exactly how old someone is, in years, months and days, and how long until the next birthday. Enter a date of birth and the calculator uses today's date by default. You can also pick any other date to answer questions such as how old someone was on a particular day, or how old they will be at a future event.",
    steps: [
      "Enter the date of birth using the date picker or by typing it.",
      "Leave the 'Age as of' box empty to use today, or choose a different date.",
      "Read the age in years, months and days, along with the total number of days lived.",
      "Check the date of the next birthday and the days remaining.",
    ],
    method: [
      "Age is measured in complete calendar units. The calculator counts how many whole years fit between the two dates, then how many whole months are left over, then the remaining days. So someone born on 15 June 1990 is 36 years, 4 months and 18 days old on 2 November 2026.",
      "The total number of days is the difference between the two calendar dates. The next birthday is the date of birth moved forward by the next whole number of years. People born on 29 February celebrate on 28 February in years that are not leap years, which is how this tool treats them. If the 'as of' date is a birthday, the tool says so and shows zero days to go. Dates before 1900 and dates of birth after the chosen date are not accepted.",
    ],
    faqs: [
      {
        question: "How is age calculated in months and days?",
        answer:
          "After counting whole years, the tool counts whole months since the last birthday, then the days since the last monthly anniversary.",
      },
      {
        question: "Can I find my age on a past or future date?",
        answer:
          "Yes. Type that date in the 'Age as of' box. It works for dates before today, such as a historical event, and for dates in the future.",
      },
      {
        question: "What if I was born on 29 February?",
        answer:
          "In years without a 29 February, the birthday is counted on 28 February. Your age increases by one year on that date.",
      },
      {
        question: "Why is the result empty for a moment when the page loads?",
        answer:
          "The tool waits to read today's date from your device so that it is correct in your time zone. It appears as soon as the page is ready.",
      },
      {
        question: "Is my date of birth stored?",
        answer:
          "No. The calculation runs in your browser and your date of birth is never sent anywhere.",
      },
    ],
  },
  "date-difference-calculator": {
    intro:
      "How many days are there between two dates? This calculator finds the exact gap between a start date and an end date, and shows it as days, as weeks and days, and as years, months and days. It is useful for project deadlines, notice periods, trip planning, pregnancy and event countdowns, and contract terms.",
    steps: [
      "Choose the start date and the end date.",
      "Tick 'Include the end date' if both the first and last day should count.",
      "Read the total days, the weeks and days, and the years, months and days.",
      "Copy the summary if you need to paste it into a message or document.",
    ],
    method: [
      "The number of days is the difference between the two calendar dates, so 1 January to 25 December 2026 is 358 days. The tool uses whole calendar days, which avoids errors caused by clocks changing for daylight saving time.",
      "Counting the end date adds one day. That matters for questions such as how many days a hotel stay covers or how long a leave period lasts, where both the first and last day are included. Weeks and days come from dividing the total by seven. The years, months and days figure counts complete months first and then the leftover days, so it follows the actual lengths of the months in between, including leap years. If the end date is earlier than the start date the two dates are swapped and a note tells you.",
    ],
    faqs: [
      {
        question: "Does the calculation include the end date?",
        answer:
          "Not by default. Tick the box to count the end date too. For two identical dates the answer is 0 days, or 1 day with the end date included.",
      },
      {
        question: "Are leap years handled?",
        answer:
          "Yes. The tool uses the real calendar, so 28 February to 1 March spans two days in a leap year and one day otherwise.",
      },
      {
        question: "What if my end date is before my start date?",
        answer:
          "The dates are swapped for you, and a message explains it. The size of the gap is the same either way.",
      },
      {
        question: "Does it count working days?",
        answer:
          "No. It counts every calendar day, including weekends and public holidays.",
      },
      {
        question: "Why does years, months and days differ from total months?",
        answer:
          "Total months counts only complete months. The days left over are shown separately in the years, months and days line.",
      },
    ],
  },
  "bmi-calculator": {
    intro:
      "Body mass index, or BMI, compares your weight with your height to give a single number. Doctors and health websites use it as a quick screening guide for adults. Enter your height and weight in metric or imperial units to see your BMI, the standard category it falls into, and the weight range that is considered healthy for your height.",
    steps: [
      "Choose metric (centimetres and kilograms) or imperial (feet, inches and pounds).",
      "Enter your height.",
      "Enter your weight.",
      "Read your BMI, its category and the healthy weight range for your height.",
    ],
    method: [
      "BMI is your weight in kilograms divided by your height in metres squared. A person who is 1.75 m tall and weighs 70 kg has a BMI of 70 ÷ (1.75 × 1.75) = 22.9. For imperial units, the tool first converts pounds to kilograms and feet and inches to metres, so both systems give the same answer for the same person.",
      "The categories follow the World Health Organization's adult ranges: under 18.5 is underweight, 18.5 to 24.9 is a healthy weight, 25 to 29.9 is overweight and 30 or more is in the obesity range. The category is chosen from the BMI as it is displayed, rounded to one decimal place. The healthy weight range is the weight that would give a BMI between 18.5 and 24.9 at your height. BMI is only a guide for adults and is not medical advice.",
    ],
    faqs: [
      {
        question: "Is BMI accurate for everyone?",
        answer:
          "No. It does not measure body fat or muscle, so athletes can have a high BMI while being healthy. It is also not designed for children, pregnant women or older adults.",
      },
      {
        question: "What is a healthy BMI?",
        answer:
          "For most adults, the healthy range is a BMI from 18.5 to 24.9. Ranges can differ for some ethnic groups, so ask your doctor.",
      },
      {
        question: "Do metric and imperial give the same result?",
        answer:
          "Yes. The tool converts everything to kilograms and metres first, so the same person gets the same BMI either way.",
      },
      {
        question: "Why is my category based on the rounded BMI?",
        answer:
          "So that the number you see and the label shown always agree. A BMI of 24.96 is shown as 25.0 and labelled overweight.",
      },
      {
        question: "Is my data stored?",
        answer:
          "No. Your height and weight are used only in your browser to work out the result and are never sent anywhere.",
      },
    ],
  },
  "unit-converter": {
    intro:
      "Convert between everyday units in seconds. This unit converter covers length, weight, temperature, volume, speed and area, with both metric and imperial units. It works in both directions: type in either box and the other updates immediately, so you can check a recipe, a road sign, a floor plan or a shipping weight without a separate lookup.",
    steps: [
      "Choose what you want to convert, such as length or temperature.",
      "Pick the units in the 'From' and 'To' menus.",
      "Type a value in either box. The other box shows the converted amount.",
      "Use the swap button to reverse the units, and copy the result if needed.",
    ],
    method: [
      "For length, weight, volume, speed and area, every unit is defined by how many base units it contains: the metre, kilogram, litre, metre per second and square metre. A conversion multiplies your value by the size of the starting unit and divides by the size of the target unit. For example, one mile is 1,609.344 metres and one kilometre is 1,000 metres, so one mile is 1.609344 kilometres.",
      "Temperature scales do not share a zero point, so they use formulas instead: °F = °C × 9/5 + 32 and K = °C + 273.15. The tool converts through Celsius and refuses values below absolute zero. The definitions used are the international ones, and US and UK gallons are listed separately because they differ. Results show up to ten significant digits.",
    ],
    faqs: [
      {
        question: "Why are there US and UK gallons?",
        answer:
          "They are different sizes. A US gallon is 3.785 litres and a UK (imperial) gallon is 4.546 litres, so choose the one that matches where you are.",
      },
      {
        question: "How do I convert Celsius to Fahrenheit?",
        answer:
          "Multiply by 9, divide by 5 and add 32. For example, 100°C × 9 ÷ 5 + 32 = 212°F. The tool does this for you.",
      },
      {
        question: "Can I type in the second box?",
        answer:
          "Yes. Whichever box you type in is treated as the starting value and the other box is calculated.",
      },
      {
        question: "How precise are the results?",
        answer:
          "Results are rounded to ten significant digits, which is far more precise than any everyday use needs.",
      },
      {
        question: "Why can't I convert between different groups, such as metres and kilograms?",
        answer:
          "They measure different things. Choose a group first, then pick units from that group only.",
      },
    ],
  },
  "time-zone-converter": {
    intro:
      "Planning a call with colleagues abroad or a live stream for friends in another country? This time zone converter shows what a given date and time is in other cities around the world. Pick a time in one city, add as many other cities as you like, and see the local time, the date and the offset from UTC for each one.",
    steps: [
      "Choose the date and time you want to convert.",
      "Select the city or time zone that the time is in.",
      "Add the cities you want to compare using the 'Add a time zone' menu.",
      "Read the local times, dates and UTC offsets, and copy them to share.",
    ],
    method: [
      "The converter treats the time you enter as the wall-clock time in the source city. It finds the exact moment in time, known as the UTC instant, at which that city's clocks show that time. It then reads the local time of every other city at the same instant, using your browser's built-in Intl time zone database.",
      "This means daylight saving time is handled correctly for the date you chose, because cities change their clocks on different days. For example, between the US clock change in March and the UK clock change a few weeks later, the gap between New York and London is four hours instead of five. A time that does not exist because clocks skip forward is rejected with an explanation. Where clocks go back and a time happens twice, the first occurrence is used.",
    ],
    faqs: [
      {
        question: "Does the converter handle daylight saving time?",
        answer:
          "Yes. It uses the rules for the exact date you choose, so the offsets can be different in summer and winter.",
      },
      {
        question: "What does UTC mean?",
        answer:
          "UTC is Coordinated Universal Time, the world's time standard. Local times are described as a number of hours ahead of or behind UTC.",
      },
      {
        question: "Why do some times show a different date?",
        answer:
          "When a city is far ahead or behind, it can already be the next day or still the previous day there. The tool labels these as a day later or earlier.",
      },
      {
        question: "Why was my time rejected?",
        answer:
          "When clocks spring forward, one hour is skipped and does not exist locally, for example 2:30 am on the day the US clocks change. Choose a nearby time instead.",
      },
      {
        question: "Is my location used?",
        answer:
          "No. The tool never asks for your location. You choose all the cities yourself.",
      },
    ],
  },
  "word-counter": {
    intro:
      "Writers, students and marketers often need to know exactly how long a text is. This word counter shows the number of words, characters, sentences and paragraphs in your text as you type or paste, along with an estimated reading time. It works well for essays with a word limit, articles, emails, product descriptions and social media posts.",
    steps: [
      "Type or paste your text into the box.",
      "Watch the counts update as you edit.",
      "Check the reading and speaking time to judge how long your text will take.",
      "Use the clear button to start again, or copy the counts to share them.",
    ],
    method: [
      "A word is any group of characters separated by spaces, tabs or line breaks, so well-known counts as one word. Characters are counted as visible Unicode characters, so an emoji or an accented letter counts once, and a second figure shows the count without spaces.",
      "A sentence ends with a full stop, question mark or exclamation mark followed by a space or the end of the text. Decimals such as 3.14 and repeated marks such as ?! do not create extra sentences. Paragraphs are blocks of text separated by at least one blank line. Reading time divides the word count by 200 words per minute, a typical adult reading speed, and speaking time uses 130 words per minute, a comfortable pace for a talk. Abbreviations such as Dr. can make the sentence count slightly high.",
    ],
    faqs: [
      {
        question: "How does the word counter decide what a word is?",
        answer:
          "Anything separated by whitespace is one word. Hyphenated terms like well-known and numbers each count as a single word.",
      },
      {
        question: "Does it count characters with spaces?",
        answer:
          "Yes. It shows both totals: characters including spaces and characters without spaces.",
      },
      {
        question: "How is reading time estimated?",
        answer:
          "It assumes 200 words per minute. Slower or more technical text takes longer, so treat it as a guide.",
      },
      {
        question: "Is there a limit to the text length?",
        answer:
          "There is no fixed limit. Very large documents can feel slow on older phones, because everything is counted in your browser.",
      },
      {
        question: "Is my text sent to a server?",
        answer:
          "No. The counting happens on your device and your text is never uploaded.",
      },
    ],
  },
  "character-counter": {
    intro:
      "Many places limit how much you can write: a post on X, an Instagram caption, a text message, a page title in search results. This character counter shows how many characters your text has, with and without spaces, and how many you have left under a limit. Choose a preset for popular platforms or enter your own limit.",
    steps: [
      "Type or paste your text into the box.",
      "Choose a preset such as X, Instagram, SMS or SEO title, or type your own limit.",
      "Watch the bar and the remaining count as you edit.",
      "Trim your text until the counter shows that you are within the limit.",
    ],
    method: [
      "The counter measures your text in Unicode characters, so a letter with an accent or an emoji counts as one character instead of several bytes. It shows the total including spaces, the total without spaces and the number of lines. If you set a limit, the remaining figure is the limit minus your total, and the bar shows the percentage used. Going past the limit turns the bar and message red and shows how many characters you are over.",
      "The presets are common limits: 280 characters for a post on X, 2,200 for an Instagram caption, 160 for a single SMS, about 60 for a search result title and about 155 for a meta description. Some platforms count certain items differently, for example links, emoji or non-Latin text, so leave a small safety margin when you are close to a limit.",
    ],
    faqs: [
      {
        question: "Do spaces count as characters?",
        answer:
          "Yes, in most limits. Spaces and line breaks count, which is why the tool shows the total with spaces as the main figure.",
      },
      {
        question: "What are the limits for popular platforms?",
        answer:
          "Typical limits are 280 for a post on X, 2,200 for an Instagram caption, 160 for a single SMS, around 60 for a search title and around 155 for a meta description.",
      },
      {
        question: "Why does an SMS over 160 characters get split?",
        answer:
          "A single message holds 160 characters of standard text. Longer messages are sent as several parts, and special characters can lower the limit further.",
      },
      {
        question: "How are emoji counted?",
        answer:
          "As one character here. Some platforms count them as two, so keep some spare room if your text has many emoji.",
      },
      {
        question: "Is my text saved?",
        answer:
          "No. Everything stays in your browser and nothing is uploaded.",
      },
    ],
  },
  "case-converter": {
    intro:
      "Typed a whole paragraph with caps lock on, or need a heading in title case? This case converter changes the capitalisation of your text in one click. It supports uppercase, lowercase, title case and sentence case for writing, plus camelCase, snake_case and kebab-case for programmers who need names for variables, files or web addresses.",
    steps: [
      "Type or paste your text into the first box.",
      "Click the case you want, such as Title Case or snake_case.",
      "Read the converted text in the second box.",
      "Copy the result, or use it as the new input to apply another change.",
    ],
    method: [
      "Uppercase and lowercase change every letter. Title case makes the first letter of each word a capital and keeps short words such as of, the and to in lowercase unless they come first or last, which matches common headline style. Sentence case makes the first letter of each sentence a capital, lowercases the rest and fixes a lone i to I.",
      "The three programming styles first split your text into words. The tool breaks on spaces, hyphens, underscores and punctuation, and also where a lowercase letter meets a capital, so helloWorld becomes hello and World. It then joins the words as camelCase with no separators, snake_case with underscores, or kebab-case with hyphens. These styles work line by line, so a list of names converts in one go. Names of people and brands are not recognised, so check proper nouns.",
    ],
    faqs: [
      {
        question: "What is the difference between title case and sentence case?",
        answer:
          "Title case capitalises most words, like in a book title. Sentence case capitalises only the first word of each sentence and any names you add yourself.",
      },
      {
        question: "Which words stay lowercase in title case?",
        answer:
          "Short words such as a, an, the, and, but, or, of, in, on, at and to stay lowercase, unless they are the first or last word.",
      },
      {
        question: "What are camelCase, snake_case and kebab-case used for?",
        answer:
          "They are naming styles in programming and web addresses. camelCase is common for variables, snake_case for Python and databases, and kebab-case for URLs and CSS.",
      },
      {
        question: "Will it keep my line breaks?",
        answer:
          "Yes. Line breaks are kept, and the programming styles convert each line separately.",
      },
      {
        question: "Does it work with other languages?",
        answer:
          "Yes for letters with accents and most alphabets, because capitalisation uses Unicode rules. The short-word list in title case is English only.",
      },
    ],
  },
  "remove-duplicate-lines": {
    intro:
      "Got a long list with repeated entries, such as email addresses, keywords, product codes or log lines? This tool removes the duplicate lines and keeps one copy of each. You can ignore differences in capital letters, trim stray spaces, drop empty lines and sort the result, and it tells you how many duplicates it found.",
    steps: [
      "Paste your list into the box with one item on each line.",
      "Choose your options: ignore case, trim spaces, remove empty lines and sort order.",
      "Check how many duplicates were removed in the summary.",
      "Copy the unique lines from the result box.",
    ],
    method: [
      "The tool reads your text line by line and remembers each line it has already seen. The first time a line appears it is kept, and any later copy is dropped, so the original order is preserved unless you choose to sort. A single line break at the very end of your text is ignored instead of being counted as an empty line.",
      "By default two lines must match exactly. If you tick 'Ignore upper and lower case', Apple and apple count as the same line and the first spelling is kept. Trimming removes spaces and tabs from both ends of each line before comparing, which catches duplicates that only differ by invisible spacing. With 'Remove empty lines' ticked, blank lines are removed and counted separately from duplicates. Sorting uses alphabetical order, from A to Z or Z to A, with numbers compared as text.",
    ],
    faqs: [
      {
        question: "Which copy of a duplicate line is kept?",
        answer:
          "The first one. Later copies are removed, so the order of your list is preserved unless you sort it.",
      },
      {
        question: "Why are two lines that look identical not removed?",
        answer:
          "They may differ by a space at the end or by capital letters. Turn on 'Trim spaces' and 'Ignore upper and lower case' to treat them as the same.",
      },
      {
        question: "Can it handle large lists?",
        answer:
          "Yes. Lists with tens of thousands of lines are processed instantly in your browser. Extremely large files may slow down older devices.",
      },
      {
        question: "Are empty lines counted as duplicates?",
        answer:
          "Without the empty-line option, only the first blank line is kept and the rest count as duplicates. With the option on, all blank lines are removed and counted separately.",
      },
      {
        question: "Is my list uploaded?",
        answer:
          "No. The list is processed in your browser and never leaves your device.",
      },
    ],
  },
  "text-diff-checker": {
    intro:
      "Need to see exactly what changed between two versions of a document, an email, a contract clause or a piece of code? Paste the original text on the left and the changed text on the right. The diff checker highlights what was added and what was removed, and counts the changes, so nothing slips through when you proofread or review an edit.",
    steps: [
      "Paste the original text into the first box.",
      "Paste the changed text into the second box.",
      "Choose whether to compare by words or by lines.",
      "Read the highlighted result: additions are underlined and removals are crossed out.",
    ],
    method: [
      "The tool finds the smallest set of changes that turns the first text into the second, using the standard longest-common-subsequence approach that underlies tools such as Git. Anything the two texts share is shown normally, text that appears only in the original is marked as removed, and text that appears only in the changed version is marked as added.",
      "Comparing by words is best for prose, because a single changed word is shown on its own and differences in spacing are ignored. Comparing by lines is better for lists, configuration files and code, because a whole line is marked when any part of it changes. The comparison is case sensitive, so Hello and hello are different. To keep your browser responsive, each text is limited to 200,000 characters. Added and removed items are counted in words or lines, depending on the mode you pick.",
    ],
    faqs: [
      {
        question: "What is the difference between word and line mode?",
        answer:
          "Word mode highlights individual words that changed. Line mode marks entire lines, which suits code, lists and files where each line is a unit.",
      },
      {
        question: "How are additions and removals shown?",
        answer:
          "Added text is underlined with a green background and removed text is crossed out with a red background, so they can be told apart without relying on colour.",
      },
      {
        question: "Is the comparison case sensitive?",
        answer:
          "Yes. A change from Hello to hello is shown as a difference.",
      },
      {
        question: "Why does word mode ignore extra spaces?",
        answer:
          "Differences in spacing are rarely meaningful in prose, so word mode concentrates on the words. Use line mode if exact spacing matters.",
      },
      {
        question: "Are my documents uploaded?",
        answer:
          "No. Both texts stay in your browser, which makes the tool safe for private drafts.",
      },
    ],
  },
  "lorem-ipsum-generator": {
    intro:
      "Designers and developers use placeholder text to show how a page will look before the real words are ready. This lorem ipsum generator creates as many paragraphs, sentences or words as you need. Choose an amount, decide whether to begin with the traditional opening line, and copy the text into your design, template or prototype.",
    steps: [
      "Choose whether to generate paragraphs, sentences or words.",
      "Enter how many you need.",
      "Tick or untick the option to start with 'Lorem ipsum dolor sit amet'.",
      "Press 'Generate again' for different text, then copy it.",
    ],
    method: [
      "Lorem ipsum is scrambled Latin that looks like real text but carries no meaning, so readers focus on the layout instead of the content. This tool builds its text from a pool of classic Latin words. Each sentence has between six and fourteen words, starts with a capital letter, ends with a full stop and sometimes has a comma in the middle. A paragraph has between three and six sentences.",
      "The generator uses a seeded random sequence, which means the same settings always give the same text and pressing 'Generate again' moves to a new sequence. When the opening line is switched on, the text begins with 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', which is the version most designers expect to see. When you ask for an exact number of words, you get exactly that many. Limits are 50 paragraphs, 200 sentences or 5,000 words.",
    ],
    faqs: [
      {
        question: "What does lorem ipsum mean?",
        answer:
          "It is a scrambled passage of Latin that has been used as dummy text since the 1500s. The words do not form a meaningful message.",
      },
      {
        question: "Why use placeholder text?",
        answer:
          "It lets people judge fonts, spacing and layout without being distracted by readable content that is still being written.",
      },
      {
        question: "Can I get an exact number of words?",
        answer:
          "Yes. Choose Words and enter a number, and the text will contain exactly that many words.",
      },
      {
        question: "Why does the text stay the same when I reload the page?",
        answer:
          "The text is generated from a fixed starting point, so the same settings give the same result. Use 'Generate again' for a fresh version.",
      },
      {
        question: "Is the generated text copyrighted?",
        answer:
          "No. The text is made up of common Latin words arranged randomly, and you can use it freely in any project.",
      },
    ],
  },
  "password-generator": {
    intro:
      "Generate a strong, random password with the length and character types you choose. It is created in your browser and never leaves your device.",
    steps: [
      "Choose the password length.",
      "Select the character types to include.",
      "Copy the generated password.",
    ],
    method: [
      "Each character is picked using the browser's secure random number generator (crypto.getRandomValues), which is suitable for security use, unlike Math.random.",
      "Strength depends on length and the size of the character set: every extra character multiplies the number of possible passwords.",
    ],
    faqs: [
      {
        question: "Is this password generator secure?",
        answer:
          "Yes. It uses the secure random generator built into your browser.",
      },
      {
        question: "How long should my password be?",
        answer: "Use at least 12 characters, and 16 or more for important accounts.",
      },
      {
        question: "Are passwords saved?",
        answer: "No. Passwords are never stored or sent anywhere.",
      },
      {
        question: "Should I reuse passwords?",
        answer:
          "No. Use a different password for each account, ideally with a password manager.",
      },
    ],
  },
};
