import type { ToolContent } from "@/types";

// Intro, steps, method and FAQs per tool, keyed by slug.
// Finance tools have their full copy. The word-counter and password-generator
// entries are short drafts until their stages.
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
  "word-counter": {
    intro:
      "Paste or type your text to see how many words, characters, sentences and paragraphs it has, plus an estimated reading time.",
    steps: [
      "Paste or type your text into the box.",
      "Watch the counts update as you type.",
      "Edit your text until it fits your limit.",
    ],
    method: [
      "Words are counted by splitting the text on whitespace. Sentences are counted by sentence-ending punctuation, and paragraphs by blank lines between blocks of text.",
      "Reading time assumes an average adult reading speed of about 200 words per minute.",
    ],
    faqs: [
      {
        question: "How are words counted?",
        answer:
          "Any group of characters separated by spaces or line breaks counts as one word.",
      },
      {
        question: "How is reading time worked out?",
        answer: "It divides the word count by 200 words per minute.",
      },
      {
        question: "Is there a text length limit?",
        answer:
          "There is no fixed limit, but very large texts may slow down your browser.",
      },
      {
        question: "Is my text uploaded anywhere?",
        answer: "No. Your text stays in your browser and is never sent to a server.",
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
