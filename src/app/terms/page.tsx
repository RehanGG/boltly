import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalSection } from "@/components/layout/LegalPage";
import { CONTACT_EMAIL, LEGAL } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Terms of Use – Boltly",
  "The rules for using Boltly's free online tools and calculators, including notices that results are estimates and not professional advice.",
  "/terms/",
);

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      path="/terms/"
      updated={LEGAL.updated}
      intro="By using Boltly you agree to these terms. Please read them. They are short, and we have tried to keep them clear."
    >
      <LegalSection title="Who we are and what these terms cover">
        <p>
          Boltly (boltly.io) is run by {LEGAL.operator}. These terms apply to the website and to all the free tools and calculators on it.
          If you do not agree with them, please do not use the site.
        </p>
      </LegalSection>

      <LegalSection title="Using the tools">
        <p>
          The tools are free to use for personal and business purposes. You agree to use them lawfully and not to:
        </p>
        <ul>
          <li>try to disrupt, overload or break into the site or the networks it runs on;</li>
          <li>use automated means to copy or scrape the site in a way that harms it or breaks the law;</li>
          <li>use the tools to create or share unlawful, harmful or misleading material;</li>
          <li>copy the written content of the site and present it as your own.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Results are estimates, not advice">
        <p>
          The tools give general information and estimates. Financial calculators, such as loan, mortgage, savings and tax tools, assume
          simple, regular payments and the figures you enter. They do not include fees, changing rates, taxes or your personal circumstances.
          The BMI calculator is a general guide for adults and is not medical advice.
        </p>
        <p>
          Nothing on Boltly is financial, tax, legal, medical or other professional advice. Check important results yourself and speak to a
          qualified professional before making a decision that matters to you.
        </p>
      </LegalSection>

      <LegalSection title="Your content">
        <p>
          What you enter into a tool, and the files you choose, belong to you. They are processed in your browser and we do not receive
          them, so we cannot access, back up or recover them. Keep your own copies of anything important, including originals of images you
          compress, resize or convert.
        </p>
      </LegalSection>

      <LegalSection title="Our content">
        <p>
          The design, text, code and brand of Boltly belong to us or our licensors and are protected by copyright and other laws. You may
          link to our pages and quote short extracts with a link back to the source. You may not republish whole pages or tools without our
          written permission.
        </p>
      </LegalSection>

      <LegalSection title="Advertising and third-party links">
        <p>
          The site shows advertising and may link to other websites. We do not control those sites or the ads shown and are not responsible
          for them. Our <Link href="/privacy-policy/">Privacy Policy</Link> explains how advertising and cookies work here.
        </p>
      </LegalSection>

      <LegalSection title="No warranty">
        <p>
          We work to make the tools accurate and reliable, but they are provided &quot;as is&quot; and &quot;as available&quot;, without
          promises that they are error-free, always available or suited to your purpose. Results can differ from those of other tools or
          institutions because of different assumptions or rounding.
        </p>
      </LegalSection>

      <LegalSection title="Limit of our responsibility">
        <p>
          To the extent the law allows, we are not liable for any loss or damage that comes from using, or not being able to use, the site
          or its tools, including decisions you make based on a result. Nothing in these terms limits liability that cannot be limited by
          law, such as for death or personal injury caused by negligence, or for fraud.
        </p>
      </LegalSection>

      <LegalSection title="Changes to the site and to these terms">
        <p>
          We may change, add or remove tools, or stop the service, at any time. We may also update these terms. The date at the top shows
          when they last changed, and using the site after a change means you accept the new version.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>These terms are governed by the laws of {LEGAL.governingLaw}, and its courts can settle any dispute, unless the law where you live gives you other rights.</p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these terms? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or visit our{" "}
          <Link href="/contact/">Contact page</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
