import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - AuthiChain",
  description: "AuthiChain Terms of Service — usage terms for our product authentication platform.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Effective Date: March 29, 2026</p>

        <h2 className="text-xl font-semibold mt-8 mb-3">1. Acceptance</h2>
        <p className="text-muted-foreground">Using AuthiChain (site, API) binds you to these Terms.</p>

        <h2 className="text-xl font-semibold mt-8 mb-3">2. Services</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>AI product classification (/classify).</li>
          <li>Blockchain verification/minting (/verify, /mintNft).</li>
          <li>Industry compliance checks.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">3. Accounts &amp; API Keys</h2>
        <p className="text-muted-foreground">Secure your API key; responsible for all activity.</p>

        <h2 className="text-xl font-semibold mt-8 mb-3">4. Fees</h2>
        <p className="text-muted-foreground">Free tier + paid plans via Stripe/RapidAPI.</p>

        <h2 className="text-xl font-semibold mt-8 mb-3">5. Prohibited Use</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>No illegal/counterfeit promotion.</li>
          <li>No excessive calls (rate limits apply).</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">6. DSCSA/METRC Compliance</h2>
        <p className="text-muted-foreground">For pharma/cannabis: Results aid serialization/tracking; not legal advice.</p>

        <h2 className="text-xl font-semibold mt-8 mb-3">7. Limitation of Liability</h2>
        <p className="text-muted-foreground">No warranties; max liability = fees paid.</p>

        <h2 className="text-xl font-semibold mt-8 mb-3">8. Governing Law</h2>
        <p className="text-muted-foreground">Michigan, US.</p>

        <h2 className="text-xl font-semibold mt-8 mb-3">9. Termination</h2>
        <p className="text-muted-foreground">We may suspend for violations.</p>
      </div>
    </main>
  );
}
