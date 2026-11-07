import Link from "next/link";
import SectionHeader from "./SectionHeader";

// A short, plain description of the site for readers and search engines.
export default function AboutBoltly() {
  return (
    <section aria-labelledby="about-boltly-heading">
      <SectionHeader id="about-boltly-heading" title="Free online tools for everyday tasks" />
      <div className="max-w-3xl space-y-3 text-text">
        <p>
          Boltly brings 30 free online tools together in one fast, simple place. Work out a monthly loan payment with the{" "}
          <Link href="/finance/emi-calculator/" className="text-primary underline">EMI calculator</Link>, check a percentage or your exact age,
          count the words in an essay, compress a photo before you email it, or make a QR code for your Wi-Fi.
        </p>
        <p>
          Every tool runs in your web browser, so there is nothing to install and no account to create, and the numbers, text and images you
          use stay on your own device. Each page explains how its result is worked out, with short steps and answers to common questions, so
          you always know what the tool is doing.
        </p>
      </div>
    </section>
  );
}
