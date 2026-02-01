// app/(main)/billing/page.jsx

'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  CreditCard, 
  Plus, 
  Edit2, 
  Download, 
  CheckCircle2, 
  Clock, 
  HeadphonesIcon,
  ChevronRight,
  ExternalLink,
  Info,
  Calendar,
  DollarSign,
  FileText,
  Filter,
   Brain, 
   Briefcase,
   Loader2,
   ShieldCheck
} from 'lucide-react'
import { useUser } from '@/app/provider'
import { supabase } from '@/services/supabaseClient'
import { useSearchParams } from 'next/navigation'
import moment from 'moment'
import { toast } from 'sonner'

export default function BillingPage() {
  const { user } = useUser()
  const searchParams = useSearchParams()
  const [invoices, setInvoices] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')

  React.useEffect(() => {
    if (success) toast.success('Payment successful!')
    if (canceled) toast.error('Payment canceled.')
  }, [success, canceled])

  React.useEffect(() => {
    const fetchBillingData = async () => {
      if (!user?.email) return
      setLoading(true)

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.email) // Matching the email as ID used in webhook
        .order('created_at', { ascending: false })

      if (!error && data) {
        setInvoices(data.map(inv => ({
          date: moment(inv.created_at).format('MMM DD, YYYY'),
          amount: `${inv.amount} ${inv.currency.toUpperCase()}`,
          id: inv.stripe_session_id.slice(-12),
          status: inv.status
        })))
      }
      setLoading(false)
    }

    fetchBillingData()
  }, [user])

  if (loading && !user) {
     return (
       <div className="flex h-[50vh] items-center justify-center">
         <Loader2 className="animate-spin text-primary" size={48} />
       </div>
     )
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-h1 text-slate-900 mb-2">Billing & Subscription</h1>
          <p className="text-body text-slate-500 font-medium">Manage your plan, billing details, and invoices.</p>
        </div>
        <Link href="/contact-support">
          <Button variant="outline" className="flex items-center gap-2 border-slate-100 h-11 px-5 rounded-xl text-body font-bold text-slate-600 hover:bg-slate-50">
            <HeadphonesIcon size={18} />
            Contact Support
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-primary/20 transition-all">
          <div className="flex items-center justify-between mb-6">
            <span className="text-label text-slate-400 font-bold uppercase tracking-widest">Current Plan</span>
            <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest border border-green-100">Active</span>
          </div>
          <div>
            <h2 className="text-h2 text-slate-900 mb-2">{user?.subscription_plan || 'Starter'}</h2>
            <Link href={'/manage-subscription'}>
              <button className="text-primary text-body font-bold flex items-center gap-1 hover:underline">
                {user?.subscription_plan ? 'Change Plan' : 'Upgrade Plan'} <ChevronRight size={14} />
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-primary/20 transition-all">
          <span className="text-label text-slate-400 font-bold uppercase tracking-widest mb-6 block">Billing Cycle</span>
          <div>
            <h2 className="text-h2 text-slate-900 mb-1">{user?.subscription_plan === 'Yearly' ? 'Annual' : 'Monthly'}</h2>
            <p className="text-helper text-slate-400 font-bold uppercase tracking-wider">{user?.subscription_plan ? 'Subscription' : 'Free Plan'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-primary/20 transition-all">
          <span className="text-label text-slate-400 font-bold uppercase tracking-widest mb-6 block">Available Credits</span>
          <div>
            <h2 className="text-h2 text-slate-900 mb-1 font-mono">{user?.credits || 0}</h2>
            <p className="text-helper text-slate-400 font-bold uppercase tracking-wider">AI Interview Credits</p>
          </div>
        </div>
      </div>

      {/* Plan Usage Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h3 className="text-h3 text-slate-900">Usage Overview</h3>
        </div>
        <div className="p-8">
          <div className="max-w-md space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 text-slate-500 rounded-lg">
                <Brain size={20} strokeWidth={1.75} />
              </div>
                <span className="text-body font-bold text-slate-700">Available Credits</span>
              </div>
              <span className="text-body font-black text-slate-900 font-mono">{user?.credits || 0}</span>
            </div>
            <Progress value={Math.min(((user?.credits || 0) / 100) * 100, 100)} className="h-2 bg-slate-100" />
            <p className="text-helper text-slate-400 font-bold uppercase tracking-wider">Total AI interview credits available.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Payment Management Section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-h3 text-slate-900">Payment & Billing</h3>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-400 text-label font-bold uppercase tracking-wider">
              <ShieldCheck size={14} className="text-blue-500" /> Secured by Stripe
            </span>
          </div>
          <div className="p-8 space-y-6">
            <p className="text-body text-slate-500 max-w-2xl leading-relaxed">
              We use Stripe to handle your payments securely. You can manage your saved payment methods, billing address, and subscription status directly through the secure Stripe Customer Portal.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button 
                variant="outline" 
                className="h-12 px-8 rounded-xl bg-slate-50 border-slate-100 text-body font-bold text-slate-600 hover:bg-slate-100 hover:border-slate-200 shadow-sm transition-all flex items-center gap-2"
                onClick={() => toast.info('Stripe Customer Portal coming soon!')}
              >
                <ExternalLink size={18} />
                Manage payment methods (via Stripe)
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice History Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-h3 text-slate-900">Invoice History</h3>
          <Button variant="ghost" size="sm" className="text-body font-bold text-slate-400 hover:text-slate-900 h-10 px-4">
            <Filter size={16} className="mr-2" /> Filter
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-50">
                <th className="px-6 py-5 text-label font-bold text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-label font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-5 text-label font-bold text-slate-400 uppercase tracking-widest">Descriptor</th>
                <th className="px-6 py-5 text-label font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-label font-bold text-slate-400 uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-400 font-medium">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-4 text-body font-semibold text-slate-600">{invoice.date}</td>
                    <td className="px-6 py-4 text-body font-black text-slate-900 font-mono">{invoice.amount}</td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-mono uppercase tracking-tighter">{invoice.id}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                        invoice.status === 'Paid' 
                          ? 'bg-green-50 text-green-600 border-green-100' 
                          : 'bg-slate-50 text-slate-500 border-slate-100'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-primary hover:bg-primary/5 transition-all">
                          <Download size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
