import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Button from '../components/ui/Button'
import { Users, Filter, Shield, DownloadCloud, ArrowRight, CheckCircle2, BarChart3 } from 'lucide-react'

// Professional feature card with subtle hover effect
const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div className="group p-6 bg-white dark:bg-slate-900/80 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  </div>
)

// Simulated dashboard table rows for the hero mockup
const DemoTable = () => (
  <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-gray-100 dark:border-gray-800 shadow-lg overflow-hidden">
    {/* Table header */}
    <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-gray-50 dark:bg-slate-800/50 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      <span>Name</span>
      <span>Company</span>
      <span>Status</span>
      <span className="text-right">Value</span>
    </div>
    {/* Rows */}
    {[
      { name: 'Emma Watson', company: 'Stripe', status: 'Qualified', value: '$24K', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
      { name: 'Liam Chen', company: 'Vercel', status: 'Contacted', value: '$18K', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
      { name: 'Sophia Lee', company: 'Notion', status: 'New Lead', value: '$12K', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
      { name: 'Noah Kim', company: 'Linear', status: 'Proposal', value: '$32K', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    ].map((row, i) => (
      <div key={i} className="grid grid-cols-4 gap-4 px-6 py-3 border-t border-gray-50 dark:border-gray-800 text-sm hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
        <span className="font-medium text-gray-800 dark:text-gray-200">{row.name}</span>
        <span className="text-gray-500 dark:text-gray-400">{row.company}</span>
        <span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.color}`}>
            {row.status}
          </span>
        </span>
        <span className="text-right font-mono text-gray-800 dark:text-gray-200">{row.value}</span>
      </div>
    ))}
  </div>
)

// Interactive mockup panels for the product preview
const MockupPanel = ({ tab }: { tab: 'filter' | 'status' | 'roles' }) => {
  if (tab === 'filter')
    return (
      <div className="space-y-3 text-sm">
        <div className="flex gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs">Status: Qualified</span>
          <span className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs">Value &gt; $10K</span>
          <span className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs">Date: Last 7d</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <CheckCircle2 size={14} className="text-emerald-500" />
          <span>Saved filter applied • 23 leads</span>
        </div>
      </div>
    )
  if (tab === 'status')
    return (
      <div className="space-y-2 text-xs">
        {[
          { text: 'Lead moved to Qualified by Sarah', time: '2m ago', color: 'bg-emerald-500' },
          { text: 'Call scheduled with Liam Chen', time: '18m ago', color: 'bg-blue-500' },
          { text: 'Note added to Sophia Lee', time: '1h ago', color: 'bg-gray-400' },
        ].map((event, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className={`w-2 h-2 mt-1 rounded-full ${event.color}`} />
            <div>
              <span className="text-gray-700 dark:text-gray-200">{event.text}</span>
              <span className="text-gray-400 ml-2">{event.time}</span>
            </div>
          </div>
        ))}
      </div>
    )
  return (
    <div className="grid grid-cols-2 gap-3 text-xs">
      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
        <div className="font-semibold text-indigo-600 dark:text-indigo-400 mb-1">Admin View</div>
        <p className="text-gray-500 dark:text-gray-400">All leads • Team analytics • Bulk assign</p>
      </div>
      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
        <div className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Sales Rep View</div>
        <p className="text-gray-500 dark:text-gray-400">My leads only • Quick actions • Daily targets</p>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [tab, setTab] = useState<'filter' | 'status' | 'roles'>('filter')

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 selection:bg-indigo-200 dark:selection:bg-indigo-800">
      {/* Subtle grid background */}
      <div className="fixed inset-0 -z-10 opacity-[0.02] dark:opacity-[0.04] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzR6bTAgMHYyaC0ydi0yaDJ6TTYgNnYySDR2LTJoMnptMCAwdjJoLTJ2LTJoMnoiLz48L2c+PC9nPjwvc3ZnPg==')] bg-repeat" />

      <Navbar />

      <main className="pt-24 pb-20 max-w-7xl mx-auto px-6">
        {/* Hero */}
        <section className="grid gap-12 lg:grid-cols-2 items-center mb-24">
          <div>
            <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800 text-xs font-medium text-indigo-700 dark:text-indigo-300">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Now with real‑time collaboration
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white">
              Turn leads into{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                revenue
              </span>{' '}
              faster
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              A lightweight, lightning-fast CRM built for modern sales teams. Track,
              filter, and close deals effortlessly with a clean interface that gets out of your way.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <Link to="/register">
                <Button className="shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30 hover:shadow-xl transition-shadow" size="md">
                  Start free trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Sign in to your account
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-4">
                Trusted by forward‑thinking teams
              </p>
              <div className="flex flex-wrap items-center gap-6 opacity-70 grayscale dark:opacity-50">
                <span className="text-lg font-bold text-gray-400 dark:text-gray-600">Acme Inc</span>
                <span className="text-lg font-bold text-gray-400 dark:text-gray-600">Stripe</span>
                <span className="text-lg font-bold text-gray-400 dark:text-gray-600">Vercel</span>
                <span className="text-lg font-bold text-gray-400 dark:text-gray-600">Notion</span>
              </div>
            </div>
          </div>

          {/* Hero visual: realistic lead table */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-2xl blur-3xl" />
            <div className="relative">
              <DemoTable />
            </div>
          </div>
        </section>

        {/* Features with refined layout */}
        <section className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Everything you need to close more deals
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              From lead capture to reporting, one tool that grows with your team.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon={<Users className="w-5 h-5" />} title="Real‑time Lead Management" desc="Full CRUD interface with inline editing and bulk operations." />
            <FeatureCard icon={<Filter className="w-5 h-5" />} title="Multi‑dimensional Filters" desc="Combine fields, save presets, and apply actions instantly." />
            <FeatureCard icon={<Shield className="w-5 h-5" />} title="Role‑based Access Control" desc="Granular permissions for admins and sales representatives." />
            <FeatureCard icon={<DownloadCloud className="w-5 h-5" />} title="Seamless Data Export" desc="Export CSV reports from any filtered view with one click." />
          </div>
        </section>

        {/* Interactive product preview */}
        <section className="mb-24">
          <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 lg:p-12">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  See it in action
                </h3>
                <div className="flex gap-2 mb-8">
                  {(['filter', 'status', 'roles'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        tab === t
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {t === 'filter' && 'Smart Filter'}
                      {t === 'status' && 'Activity'}
                      {t === 'roles' && 'Roles'}
                    </button>
                  ))}
                </div>
                <MockupPanel tab={tab} />
              </div>
              <div className="bg-gray-50 dark:bg-slate-800/30 p-8 lg:p-12 flex items-center justify-center">
                <div className="w-full max-w-sm rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="h-5 w-5 text-indigo-600" />
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Lead Pipeline</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>New Leads</span><span>34</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                      <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '40%' }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Qualified</span><span>21</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                      <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '65%' }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Proposal</span><span>8</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                      <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '25%' }} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-6 text-center">Syncs in real time</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section>
          <div className="relative rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-10 md:p-14 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGgyMHYyMEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-3xl font-bold text-white">Ready to supercharge your pipeline?</h3>
                <p className="mt-3 text-indigo-100 max-w-lg">
                  Join thousands of sales professionals who close more deals with Smart Leads Dashboard.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button className="bg-yellow-800 text-indigo-700 hover:bg-indigo-50 shadow-xl shadow-indigo-900/20" size="md">
                    Get started free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/contact" className="flex items-center justify-center px-6 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors text-sm font-medium">
                  Talk to sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} Smart Leads Dashboard</span>
            <span className="hidden sm:inline mx-2">·</span>
            <span>All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">GitHub</a>
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Docs</a>
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Terms</a>
          </div>
        </footer>
      </main>
    </div>
  )
}