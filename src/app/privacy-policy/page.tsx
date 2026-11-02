import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalSection } from "@/components/layout/LegalPage";
import { CONTACT_EMAIL, LEGAL } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Privacy Policy – Boltly",
  "How Boltly handles your data: tools run in your browser, files are not uploaded, and analytics cookies are used only if you agree.",
  "/privacy-policy/",
);

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy-policy/"
      updated={LEGAL.updated}
      intro="This policy explains, in plain language, what information Boltly collects, why, and the choices you have."
    >
      <LegalSection title="Who we are">
        <p>
          Boltly (boltly.io) is operated by {LEGAL.operator} (&quot;we&quot;, &quot;us&quot;). We are responsible for your personal
          information on this website. You can contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>

      <LegalSection title="The short version">
        <ul>
          <li>The numbers, text and images you put into a tool are processed in your browser. We do not receive them.</li>
          <li>There are no accounts, and we do not ask for your name or email address to use a tool.</li>
          <li>Analytics cookies are used only if you accept them. You can change your mind at any time.</li>
          <li>We keep a few small settings in your browser, such as your theme and recently used tools.</li>
        </ul>
      </LegalSection>

      <LegalSection title="What stays on your device">
        <p>
          Calculators, text tools, image tools and generators all run locally. When you choose an image, paste text or enter a number, the work
          is done by your own browser and the information is not sent to us or to anyone else. Generated passwords, QR codes and barcodes are
          created on your device and are not stored by us. Closing or reloading the page clears what you entered.
        </p>
      </LegalSection>

      <LegalSection title="Information stored in your browser">
        <p>We use your browser&apos;s local storage, which stays on your device, for these small items:</p>
        <ul>
          <li>Your light or dark theme choice.</li>
          <li>The last few tools you opened, so we can show them under &quot;Recently used&quot;.</li>
          <li>Your answer to our cookie question, so we do not ask again on every page.</li>
        </ul>
        <p>These are needed for the site to work the way you expect. You can delete them at any time in your browser settings.</p>
      </LegalSection>

      <LegalSection title="Information collected when you accept cookies">
        <p>
          If you click Accept on our cookie notice, we use a third-party analytics service. If you click Reject, we do not load it.
        </p>
        <ul>
          <li>
            <strong>Analytics (Google Analytics 4).</strong> This tells us which pages are visited, how people find the site, and roughly what
            device, browser and country they use. It sets cookies such as <code>_ga</code> and may use your IP address to work out an
            approximate location. We use it to improve the site.
          </li>
          {/* Add back when AdSense is live:
          <li>
            <strong>Advertising (Google AdSense).</strong> This shows ads that help pay for the site. Google and its partners may set cookies
            or use similar technology to show and measure ads, and, depending on your settings and location, to show ads based on your
            earlier visits to this and other websites.
          </li>
          */}
        </ul>
        <p>
          We also do not load fonts or other files from third parties when you use a tool. Our fonts are served from our own site.
        </p>
      </LegalSection>

      <LegalSection title="Cookies and similar technologies">
        <ul>
          <li>
            <strong>Essential (local storage):</strong> theme, recently used tools and your cookie choice. Not shared with anyone.
          </li>
          <li>
            <strong>Analytics (only if you accept):</strong> Google Analytics cookies, which usually last up to two years.
          </li>
          {/* Add back when AdSense is live:
          <li>
            <strong>Advertising (only if you accept):</strong> cookies from Google and its advertising partners. Their lifetimes vary.
          </li>
          */}
        </ul>
        <p>
          You can change your choice at any time with the cookie settings link at the bottom of any page. If you withdraw consent, new
          tracking stops straight away, and cookies already set can be deleted in your browser settings. Some changes fully apply the next time
          you load a page.
        </p>
      </LegalSection>

      {/* Add back when AdSense is live:
      <LegalSection title="Advertising and Google">
        <p>
          Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s previous visits to this website or other
          websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site
          and other sites on the internet.
        </p>
        <p>You can learn more and control personalised advertising here:</p>
        <ul>
          <li>
            <a href="https://adssettings.google.com" rel="noopener noreferrer">Google Ads Settings</a>, to turn off personalised ads.
          </li>
          <li>
            <a href="https://policies.google.com/technologies/partner-sites" rel="noopener noreferrer">
              How Google uses information from sites that use its services
            </a>
            .
          </li>
          <li>
            <a href="https://www.aboutads.info/choices/" rel="noopener noreferrer">aboutads.info/choices</a> (US) and{" "}
            <a href="https://www.youronlinechoices.eu" rel="noopener noreferrer">youronlinechoices.eu</a> (Europe), to opt out of
            interest-based advertising from participating companies.
          </li>
        </ul>
      </LegalSection>
      */}

      <LegalSection title="Hosting and technical logs">
        <p>
          Like most websites, the service that hosts Boltly may automatically record technical details of each request, such as your IP
          address, the page requested, your browser type and the time. These logs are used to keep the site secure and running, and are kept
          for a limited time.
        </p>
      </LegalSection>

      <LegalSection title="Why we use your information (legal bases)">
        <p>If you are in the UK or the European Economic Area, we rely on:</p>
        <ul>
          <li>
            <strong>Your consent</strong> for analytics cookies. You can withdraw it at any time.
          </li>
          <li>
            <strong>Our legitimate interests</strong> in keeping the site secure, working properly and free from abuse, for essential storage
            and technical logs.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Who we share information with">
        <p>
          We do not sell your personal information. Information is shared only with the service providers described above: Google (analytics,
          when you accept) and our hosting provider. They may process information outside your country, including in the
          United States, under safeguards required by law.
        </p>
      </LegalSection>

      <LegalSection title="How long we keep information">
        <p>
          Items in your browser stay until you delete them. Analytics data is kept by Google for the limited period we have set in our account.
          Technical logs are kept for a short time. If you email us, we keep your message for as long as needed to deal with it and for any
          legal reason to keep a record.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          Depending on where you live, you may have the right to ask for a copy of your personal information, to have it corrected or deleted,
          to object to or limit how it is used, to withdraw consent, and to complain to your data protection authority (in the UK, the
          Information Commissioner&apos;s Office). If you live in California or another US state with a privacy law, you may have similar
          rights, including the right to opt out of the sale or sharing of personal information. We do not sell personal information. To use
          your rights, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We may need to confirm who you are first.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          Boltly is a general-audience website and is not aimed at children under 13 (or under 16 where the law sets a higher age). We do not
          knowingly collect personal information from children. If you think a child has given us personal information, please contact us and
          we will delete it.
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          We may update this policy from time to time. The date at the top shows when it last changed. If we make a significant change, we
          will take reasonable steps to let you know, for example by asking for your cookie choice again.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about this policy? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or visit our{" "}
          <Link href="/contact/">Contact page</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
