import type { Guide } from "@/types";

// Every fact in a guide must come from an official source. The sources for this guide
// are the state tax agencies linked in src/tools/finance/sales-tax-calculator-usa/rates.ts.
export const guides: Guide[] = [
  {
    slug: "how-to-estimate-sales-tax",
    title: "How to Estimate Sales Tax in the US",
    metaTitle: "How to Estimate Sales Tax in the US, Step by Step",
    metaDescription:
      "Estimate sales tax on any US purchase in three steps: find your state rate, add the local rate and multiply. With a worked example and a free calculator.",
    summary: "Three quick steps to estimate the sales tax on any US purchase, with a worked example.",
    toolSlug: "sales-tax-calculator-usa",
    published: "2026-11-14",
    updated: "2026-11-14",
    intro: [
      "Knowing roughly how much sales tax you will pay helps you budget for a big purchase, compare prices between towns or check a receipt. Estimating it takes only three numbers: the price, your state's rate and your local rate.",
      "This guide walks through each step with a worked example. If you would rather skip the arithmetic, the US Sales Tax Calculator does it for you with the official statewide rate for all 50 states and Washington, DC.",
    ],
    sections: [
      {
        heading: "Step 1: Find your state's rate",
        paragraphs: [
          "Every state sets its own sales tax, so the first number you need is the statewide rate where the purchase takes place. Rates range widely: Colorado's statewide rate is 2.9%, Texas charges 6.25% and California's statewide base rate is 7.25%.",
          "Five states have no statewide sales tax at all: Alaska, Delaware, Montana, New Hampshire and Oregon. Even there, check the details. Some local governments in Alaska charge their own sales tax, and New Hampshire applies an 8.5% tax to meals, room rentals and motor vehicle rentals.",
        ],
      },
      {
        heading: "Step 2: Add the local rate",
        paragraphs: [
          "In many states, cities, counties and special districts add their own tax on top of the state rate, so two shops a few miles apart can charge different totals for the same item. The local rate depends on the exact address, which makes the rate lookup or rate table on your state tax agency's website the most reliable source.",
          "A few states keep it simple. Connecticut, Kentucky, Maryland and Michigan have no local sales taxes, and Delaware has none at either level. In those places, the statewide rate is the only one you need.",
        ],
      },
      {
        heading: "Step 3: Do the math",
        paragraphs: [
          "Add the state and local rates to get your combined rate, then turn it into a decimal by dividing by 100. Multiply the price by that decimal to get the tax, and add the tax to the price for the total.",
        ],
        list: [
          "Combined rate = state rate + local rate",
          "Sales tax = price × combined rate ÷ 100",
          "Total = price + sales tax",
        ],
      },
    ],
    example: {
      heading: "Worked example: a pair of shoes in Texas",
      steps: [
        "Price: $80.00.",
        "State rate: Texas charges 6.25%.",
        "Local rate: local taxes in Texas can add up to 2%, so assume a city that charges the full 2%.",
        "Combined rate: 6.25% + 2% = 8.25%, which is 0.0825 as a decimal.",
        "Sales tax: $80.00 × 0.0825 = $6.60.",
        "Total: $80.00 + $6.60 = $86.60.",
      ],
      result:
        "You would pay $86.60. In a part of Texas with no local tax, the same shoes would cost $85.00, because the tax would be $80.00 × 0.0625 = $5.00.",
    },
    afterExample: [
      {
        heading: "Working backwards from a receipt",
        paragraphs: [
          "Sometimes you know the total and need the price before tax, for example when you claim back an expense. Divide the total by one plus the combined rate as a decimal. A receipt for $108.25 at 8.25% gives $108.25 ÷ 1.0825 = $100.00, so the tax was $8.25.",
          "For a quick mental check, round the combined rate to the nearest whole number. At about 8%, the tax is roughly 8 cents for every dollar, or about $8 on a $100 purchase.",
        ],
      },
      {
        heading: "Why your estimate might be off",
        paragraphs: ["An estimate built on the general rate is close for most everyday purchases, but a few things can move the real figure."],
        list: [
          "Some goods have their own rates. Tennessee taxes food and food ingredients at a 4% state rate, and Virginia taxes groceries at 1%.",
          "A few states use a different kind of tax. Hawaii has a 4% general excise tax on businesses, which sellers may pass on to customers, and New Mexico has a gross receipts tax.",
          "Rates change. States and local governments update them, so check the official figure before you rely on an estimate for anything important.",
          "Tax is charged in whole cents, so a receipt can differ from a rough estimate by a cent or two.",
        ],
      },
    ],
    closing:
      "Estimating sales tax comes down to two rates and one multiplication. Once you know your state and local rate, you can check any price in seconds, or open the US Sales Tax Calculator, pick your state and add your local rate to get the exact figure.",
    faqs: [
      {
        question: "What is the quickest way to estimate sales tax?",
        answer:
          "Multiply the price by your combined state and local rate written as a decimal. For a rough figure, use the nearest whole percentage: at around 7%, budget 7 cents of tax for each dollar you spend.",
      },
      {
        question: "Do I owe tax when an online seller does not charge it?",
        answer:
          "Often, yes. Many states, including Massachusetts, Michigan and Vermont, expect you to pay use tax at the same rate as their sales tax when a seller does not collect it. Check your own state's rules.",
      },
      {
        question: "Why does my receipt not match my estimate?",
        answer:
          "The usual reasons are a local rate you did not include, a reduced rate for that type of item, or rounding to the cent. In many states, the place where you take delivery decides which local rate applies to an order.",
      },
      {
        question: "Is sales tax the same everywhere in a state?",
        answer:
          "Not always. The statewide rate applies everywhere, but local taxes vary by city, county or district. Some states, such as Connecticut and Michigan, have no local sales taxes, so their general rate is the same statewide.",
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export function guidesForTool(toolSlug: string): Guide[] {
  return guides.filter((g) => g.toolSlug === toolSlug);
}
