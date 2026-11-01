import type { ToolContent } from "@/types";

// Intro, steps, method and FAQs per tool, keyed by slug.
// Stage 1 text is a short draft for the sample tools; the full unique copy
// (300+ words per page) is written when each tool is built.
export const toolContent: Record<string, ToolContent> = {
  "emi-calculator": {
    intro:
      "An equated monthly instalment (EMI) is the fixed amount you repay every month on a loan. This calculator shows your EMI, the total interest and the total you will pay back.",
    steps: [
      "Enter the loan amount.",
      "Enter the annual interest rate.",
      "Choose the loan term in months or years.",
      "Read your monthly EMI, total interest and total payment.",
    ],
    method: [
      "The EMI is calculated as P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where P is the loan amount, r is the monthly interest rate (the annual rate divided by 12 and by 100) and n is the number of monthly payments.",
      "Total payment is the EMI multiplied by n, and total interest is the total payment minus the original loan amount.",
    ],
    faqs: [
      {
        question: "What does EMI stand for?",
        answer:
          "EMI stands for equated monthly instalment, the fixed payment you make each month until the loan is repaid.",
      },
      {
        question: "Does a longer term lower my EMI?",
        answer:
          "Yes, a longer term lowers each payment, but you pay more interest overall.",
      },
      {
        question: "Does this include fees?",
        answer:
          "No. The result covers principal and interest only. Processing fees and insurance are extra.",
      },
      {
        question: "Is my data stored?",
        answer:
          "No. Everything is calculated in your browser and nothing is sent to a server.",
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
