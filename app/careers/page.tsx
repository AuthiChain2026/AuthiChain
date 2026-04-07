'use client'

import Link from 'next/link'
import { Shield, Briefcase, Code, Globe, Palette, BarChart3, Cpu, Users, ArrowRight } from 'lucide-react'

const PLATFORMS = [
  {
    name: 'AuthiChain',
    url: 'https://authichain.com',
    color: 'emerald',
    tagline: 'AI-Powered Blockchain Product Authentication',
    description: 'Fight counterfeits across luxury, pharma, fashion, and 10+ industries using AI classification and blockchain verification.',
  },
  {
    name: 'StrainChain',
    url: 'https://strainchain.io',
    color: 'green',
    tagline: 'Cannabis Authentication & Compliance',
    description: 'Blockchain-based seed-to-sale tracking and METRC-integrated compliance for the regulated cannabis industry.',
  },
  {
    name: 'QRON',
    url: 'https://qron.space',
    color: 'purple',
    tagline: 'AI QR Code Art Generator',
    description: 'Transform standard QR codes into AI-generated art. The creative layer of the AuthiChain Protocol.',
  },
]

const INTERNSHIPS = [
  {
    title: 'Frontend Engineering Intern',
    platform: 'AuthiChain / QRON',
    icon: Code,
    type: 'Internship',
    location: 'Remote',
    description: 'Build production UI components with React 19, Next.js 15, and Tailwind CSS. Work on dashboards, verification flows, and AI-powered interfaces.',
    skills: ['React / Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    title: 'Blockchain Developer Intern',
    platform: 'AuthiChain / StrainChain',
    icon: Shield,
    type: 'Internship',
    location: 'Remote',
    description: 'Write and deploy Solidity smart contracts (ERC-721) on Polygon and VeChain. Integrate NFT minting and verification into production apps.',
    skills: ['Solidity', 'Hardhat', 'Ethers.js', 'ERC-721'],
  },
  {
    title: 'AI / Machine Learning Intern',
    platform: 'AuthiChain',
    icon: Cpu,
    type: 'Internship',
    location: 'Remote',
    description: 'Improve GPT-4 Vision product classification pipelines. Build confidence scoring, image preprocessing, and multi-model evaluation systems.',
    skills: ['Python', 'OpenAI API', 'Computer Vision', 'Data pipelines'],
  },
  {
    title: 'Full-Stack Developer Intern',
    platform: 'StrainChain',
    icon: Globe,
    type: 'Internship',
    location: 'Remote',
    description: 'Build seed-to-sale tracking features, METRC API integrations, and compliance dashboards for the cannabis authentication platform.',
    skills: ['Next.js', 'Supabase', 'PostgreSQL', 'REST APIs'],
  },
  {
    title: 'UI/UX Design Intern',
    platform: 'QRON / AuthiChain',
    icon: Palette,
    type: 'Internship',
    location: 'Remote',
    description: 'Design intuitive interfaces for AI QR code generation, product verification flows, and enterprise dashboards. Create design systems in Figma.',
    skills: ['Figma', 'Design Systems', 'Prototyping', 'User Research'],
  },
  {
    title: 'Growth & Marketing Intern',
    platform: 'All Platforms',
    icon: BarChart3,
    type: 'Internship',
    location: 'Remote',
    description: 'Drive user acquisition across AuthiChain, QRON, and StrainChain. Run SEO experiments, content campaigns, and lead nurture sequences.',
    skills: ['SEO', 'Content Marketing', 'Analytics', 'Email Campaigns'],
  },
  {
    title: 'DevOps / Infrastructure Intern',
    platform: 'AuthiChain / QRON',
    icon: Globe,
    type: 'Internship',
    location: 'Remote',
    description: 'Manage Vercel deployments, Cloudflare Workers, Supabase infrastructure, and CI/CD pipelines across multiple production applications.',
    skills: ['Cloudflare Workers', 'Vercel', 'CI/CD', 'PostgreSQL'],
  },
  {
    title: 'Community & Developer Relations Intern',
    platform: 'All Platforms',
    icon: Users,
    type: 'Internship',
    location: 'Remote',
    description: 'Build developer documentation, create tutorials, manage Discord/Telegram communities, and support enterprise onboarding.',
    skills: ['Technical Writing', 'Community Management', 'API Docs', 'Public Speaking'],
  },
]

const ENTRY_LEVEL = [
  {
    title: 'Junior Full-Stack Engineer',
    platform: 'AuthiChain',
    icon: Code,
    type: 'Entry-Level',
    location: 'Remote',
    description: 'Own features end-to-end across the AuthiChain platform. Build APIs, React components, and database schemas for blockchain product authentication.',
    skills: ['Next.js 15', 'TypeScript', 'Supabase', 'Drizzle ORM'],
  },
  {
    title: 'Junior Smart Contract Engineer',
    platform: 'AuthiChain / StrainChain',
    icon: Shield,
    type: 'Entry-Level',
    location: 'Remote',
    description: 'Develop and audit ERC-721 contracts, implement token economics, and build cross-chain verification systems.',
    skills: ['Solidity', 'OpenZeppelin', 'Polygon', 'VeChain'],
  },
  {
    title: 'Junior AI Engineer',
    platform: 'QRON / AuthiChain',
    icon: Cpu,
    type: 'Entry-Level',
    location: 'Remote',
    description: 'Build and optimize AI pipelines for QR code art generation (Fal.ai) and product classification (GPT-4 Vision). Ship models to production.',
    skills: ['Python', 'OpenAI', 'Fal.ai', 'Image Generation'],
  },
]

const BENEFITS = [
  'Work on production apps used by real customers',
  'Ship code to blockchain networks (Polygon, VeChain)',
  'Mentorship from senior engineers and founders',
  'Flexible remote schedule — work from anywhere',
  'Exposure to AI, blockchain, and enterprise SaaS',
  'Potential conversion to full-time roles',
  'Letter of recommendation upon completion',
  'Build a portfolio with real-world impact',
]

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Shield className="h-6 w-6 text-emerald-400" />
          AuthiChain
        </Link>
        <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition">← Back</Link>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <div className="inline-block bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-1 text-purple-400 text-sm font-medium mb-6">
          Internships & Entry-Level Roles
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Build the future of<br />
          <span className="text-emerald-400">product authentication.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Join our ecosystem of three platforms — AuthiChain, QRON, and StrainChain — and work on
          AI, blockchain, and enterprise SaaS that protects brands and consumers worldwide.
        </p>
      </section>

      {/* Platforms */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-xl font-bold mb-6 text-center text-gray-300">Our Platforms</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLATFORMS.map(p => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-emerald-500/40 transition group"
            >
              <h3 className="text-lg font-bold mb-1 group-hover:text-emerald-400 transition">{p.name}</h3>
              <p className="text-sm text-purple-400 mb-3">{p.tagline}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{p.description}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Internships */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold mb-2 text-center">Internship Opportunities</h2>
        <p className="text-gray-500 text-center mb-8">Gain hands-on experience shipping production code across AI, blockchain, and web platforms.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INTERNSHIPS.map(role => {
            const Icon = role.icon
            return (
              <div key={role.title} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-500/40 transition">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-purple-500/10 rounded-lg p-2.5">
                    <Icon className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{role.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">{role.type}</span>
                      <span className="text-xs text-gray-500">{role.platform}</span>
                      <span className="text-xs text-gray-600">{role.location}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{role.description}</p>
                <div className="flex flex-wrap gap-2">
                  {role.skills.map(s => (
                    <span key={s} className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 text-gray-400">{s}</span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Entry-Level */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold mb-2 text-center">Entry-Level Roles</h2>
        <p className="text-gray-500 text-center mb-8">Ready to go full-time? These roles are ideal for recent graduates or career changers.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ENTRY_LEVEL.map(role => {
            const Icon = role.icon
            return (
              <div key={role.title} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-emerald-500/40 transition">
                <div className="bg-emerald-500/10 rounded-lg p-2.5 w-fit mb-4">
                  <Icon className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-lg mb-1">{role.title}</h3>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">{role.type}</span>
                  <span className="text-xs text-gray-500">{role.platform}</span>
                </div>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{role.description}</p>
                <div className="flex flex-wrap gap-2">
                  {role.skills.map(s => (
                    <span key={s} className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 text-gray-400">{s}</span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Why Join Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BENEFITS.map(b => (
            <div key={b} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-lg p-4">
              <ArrowRight className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300 text-sm">{b}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Apply CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <div className="bg-gradient-to-br from-purple-500/10 to-emerald-500/10 border border-white/10 rounded-2xl p-10">
          <Briefcase className="h-10 w-10 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Ready to Apply?</h2>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            Send your resume, a brief intro, and the role you&apos;re interested in. Include any relevant GitHub repos or portfolio links.
          </p>
          <a
            href="mailto:authichain@gmail.com?subject=Internship%20%2F%20Entry-Level%20Application%20—%20AuthiChain"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-8 py-3 rounded-full transition text-sm"
          >
            Apply Now <ArrowRight className="h-4 w-4" />
          </a>
          <p className="text-gray-600 text-xs mt-4">authichain@gmail.com</p>
        </div>
      </section>
    </main>
  )
}
