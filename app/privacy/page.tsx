import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - AuthiChain",
  description: "AuthiChain Privacy Policy — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Effective Date: March 29, 2026</p>
        <p className="mb-6">
          AuthiChain (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy. This
          Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit
          our website authichain.com, use our services, or interact with us.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">1. Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong className="text-foreground">Personal Data:</strong> Name, email, company (from /me endpoint or sign-up).</li>
          <li><strong className="text-foreground">Usage Data:</strong> IP address, browser type, access times, API calls (/classify, /verify).</li>
          <li><strong className="text-foreground">Product Data:</strong> UPC/GS1 codes, images for verification (not stored long-term).</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Provide verification services (AI classification, blockchain minting).</li>
          <li>Improve services, analytics.</li>
          <li>Comply with DSCSA (pharma), METRC (cannabis) standards where applicable.</li>
          <li>Send updates (with opt-out).</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">3. Legal Basis (GDPR)</h2>
        <p className="text-muted-foreground">Processing is based on contract performance, legitimate interests, or consent.</p>

        <h2 className="text-xl font-semibold mt-8 mb-3">4. Sharing Your Information</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Service providers (Supabase, Cloudflare).</li>
          <li>Compliance authorities (FDA DSCSA reports if required).</li>
          <li>No sale of personal data.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">5. Data Retention</h2>
        <p className="text-muted-foreground">Verification results: 30 days (KV cache); personal data: as needed for service + 1 year.</p>

        <h2 className="text-xl font-semibold mt-8 mb-3">6. Your Rights (GDPR/CCPA)</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Access, correct, delete, portability, object.</li>
          <li>Contact: privacy@authichain.com</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">7. International Transfers</h2>
        <p className="text-muted-foreground">Data processed in US/EU via Supabase/Cloudflare (SCCs in place).</p>

        <h2 className="text-xl font-semibold mt-8 mb-3">8. Security</h2>
        <p className="text-muted-foreground">HTTPS, API keys, encryption at rest/transit.</p>

        <h2 className="text-xl font-semibold mt-8 mb-3">9. Children&apos;s Privacy</h2>
        <p className="text-muted-foreground">Not for under 13.</p>

        <h2 className="text-xl font-semibold mt-8 mb-3">10. Changes</h2>
        <p className="text-muted-foreground">Updates posted here.</p>
      </div>
    </main>
  );
}
