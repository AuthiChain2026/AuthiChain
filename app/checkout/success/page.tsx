import Link from 'next/link'
import { CheckCircle, ArrowRight, LayoutDashboard, Zap } from 'lucide-react'

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">You're all set!</h1>
        <p className="text-gray-400 text-lg mb-2">
          Your AuthiChain subscription is now active.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          A welcome email is on its way with setup instructions. Check your inbox.
        </p>

        <div className="bg-gray-900/60 border border-gray-700/60 rounded-2xl p-6 mb-8 text-left space-y-4">
          <h2 className="text-white font-semibold mb-3">Get started in 3 steps</h2>
          {[
            { step: '1', title: 'Go to your Dashboard', desc: 'View your account and subscription details.', href: '/dashboard' },
            { step: '2', title: 'Register your first product', desc: 'Upload a product image — AI classifies it instantly.', href: '/upload' },
            { step: '3', title: 'Share your TrueMark™ QR code', desc: 'Customers can verify authenticity anywhere in the world.', href: '/dashboard' },
          ].map((item) => (
            <Link key={item.step} href={item.href} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-800/50 transition-colors group">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-sm shrink-0">
                {item.step}
              </div>
              <div>
                <p className="text-white font-medium group-hover:text-purple-300 transition-colors">{item.title}</p>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition-colors ml-auto mt-1 shrink-0" />
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-500 hover:to-cyan-500 transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            Open Dashboard
          </Link>
          <Link
            href="/upload"
            className="flex items-center justify-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 border border-gray-600 transition-all"
          >
            <Zap className="w-4 h-4" />
            Register First Product
          </Link>
        </div>
      </div>
    </main>
  )
}
