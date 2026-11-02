import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalSection } from "@/components/layout/LegalPage";
import { CONTACT_EMAIL } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Contact Boltly – Questions, Feedback and Privacy Requests",
  "Get in touch with Boltly to report a problem, suggest a tool or make a privacy request. Find our email address and what to include.",
  "/contact/",
);

export default function ContactPage() {
  return (
    <LegalPage
      title="Contact"
      path="/contact/"
      intro="The quickest way to reach us is by email. We read every message, although we cannot promise a reply to each one."
    >
      <LegalSection title="Email us">
        <p>
          Write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>

      <LegalSection title="What to write to us about">
        <ul>
          <li>
            <strong>A mistake or a bug.</strong> Tell us the tool, what you entered, what you expected and what you saw. Mention your browser and
            device if you can. Please do not send us personal or financial documents.
          </li>
          <li>
            <strong>A tool you would like.</strong> Describe the job you need to do and we will consider it.
          </li>
          <li>
            <strong>A privacy request.</strong> You can ask to see, correct or delete personal information, or ask a question about our{" "}
            <Link href="/privacy-policy/">Privacy Policy</Link>. Because the tools run in your browser, we hold very little about you, but
            we will help where we can.
          </li>
          <li>
            <strong>Business or advertising questions.</strong> Include your company name and what you have in mind.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="What we cannot help with">
        <p>
          We cannot give personal financial, tax, medical or legal advice, and we cannot recover files from your device, because we never
          receive them. For advice about your own situation, please speak to a qualified professional.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
