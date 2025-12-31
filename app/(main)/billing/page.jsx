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
  Filter
} from 'lucide-react'

export default function BillingPage() {
  const invoices = [
    { date: 'Sep 24, 2023', amount: '$299.00', id: 'INV-2023-009', status: 'Paid' },
    { date: 'Aug 24, 2023', amount: '$299.00', id: 'INV-2023-008', status: 'Paid' },
    { date: 'Jul 24, 2023', amount: '$299.00', id: 'INV-2023-007', status: 'Paid' },
    { date: 'Jun 24, 2023', amount: '$299.00', id: 'INV-2023-006', status: 'Refunded' },
  ]

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-h1 text-slate-900 mb-2">Billing & Subscription</h1>
          <p className="text-body text-slate-500 font-medium">Manage your plan, billing details, and invoices.</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2 border-slate-100 h-11 px-5 rounded-xl text-body font-bold text-slate-600 hover:bg-slate-50">
          <HeadphonesIcon size={18} />
          Contact Support
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-primary/20 transition-all">
          <div className="flex items-center justify-between mb-6">
            <span className="text-label text-slate-400 font-bold uppercase tracking-widest">Current Plan</span>
            <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest border border-green-100">Active</span>
          </div>
          <div>
            <h2 className="text-h2 text-slate-900 mb-2">Enterprise AI</h2>
            <Link href={'/manage-subscription'}>
              <button className="text-primary text-body font-bold flex items-center gap-1 hover:underline">
                Change Plan <ChevronRight size={14} />
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-primary/20 transition-all">
          <span className="text-label text-slate-400 font-bold uppercase tracking-widest mb-6 block">Next Billing Date</span>
          <div>
            <h2 className="text-h2 text-slate-900 mb-1">Oct 24, 2023</h2>
            <p className="text-helper text-slate-400 font-bold uppercase tracking-wider">Auto-renewal enabled</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-primary/20 transition-all">
          <span className="text-label text-slate-400 font-bold uppercase tracking-widest mb-6 block">Monthly Cost</span>
          <div>
            <h2 className="text-h2 text-slate-900 mb-1">$299.00</h2>
            <p className="text-helper text-slate-400 font-bold uppercase tracking-wider">Billed annually</p>
          </div>
        </div>
      </div>

      {/* Plan Usage Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h3 className="text-h3 text-slate-900">Plan Usage</h3>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 text-slate-500 rounded-lg">
                  <span className="material-symbols-outlined text-[20px]">psychology</span>
                </div>
                <span className="text-body font-bold text-slate-700">AI Candidate Matches</span>
              </div>
              <span className="text-body font-black text-slate-900 font-mono">450 <span className="text-slate-300 font-normal">/ 500</span></span>
            </div>
            <Progress value={90} className="h-2 bg-slate-100" />
            <p className="text-helper text-slate-400 font-bold uppercase tracking-wider">90% of monthly quota used. <Link href={'/manage-subscription'} className="text-primary hover:underline">Upgrade for more</Link></p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 text-slate-500 rounded-lg">
                  <span className="material-symbols-outlined text-[20px]">work</span>
                </div>
                <span className="text-body font-bold text-slate-700">Active Job Posts</span>
              </div>
              <span className="text-body font-black text-slate-900 font-mono">12 <span className="text-slate-300 font-normal">/ 20</span></span>
            </div>
            <Progress value={60} className="h-2 bg-slate-100" />
            <p className="text-helper text-slate-400 font-bold uppercase tracking-wider">60% of monthly quota used.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Method */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-h3 text-slate-900">Payment Method</h3>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-400 text-label font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px]">lock</span> Secured by Stripe
            </span>
          </div>
          <div className="p-8 space-y-6">
            <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between group hover:border-slate-200 transition-all">
              <div className="flex items-center gap-5">
                <div className="w-12 h-8 bg-slate-900 rounded flex items-center justify-center p-1 overflow-hidden">
                  <span className="text-[10px] text-white font-black italic">VISA</span>
                </div>
                <div>
                  <h4 className="text-body font-bold text-slate-900">Visa ending in 4242</h4>
                  <p className="text-label text-slate-400 font-bold uppercase tracking-wider mt-0.5">Expires 12/2025 • Default</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-body font-bold text-slate-400 hover:text-slate-900 flex items-center gap-1.5 px-4 h-10">
                <Edit2 size={14} /> Edit
              </Button>
            </div>
            <button className="flex items-center gap-2 text-primary text-body font-bold hover:underline px-2">
              <Plus size={18} /> Add payment method
            </button>
          </div>
        </div>

        {/* Billing Details */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:border-primary/20 transition-all">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-h3 text-slate-900">Billing Details</h3>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-primary transition-colors">
              <Edit2 size={18} />
            </Button>
          </div>
          <div className="p-8 space-y-7 flex-1">
            <div>
              <span className="text-label text-slate-400 font-bold uppercase tracking-widest block mb-2">Company Name</span>
              <p className="text-body font-bold text-slate-800">Acme Corp Inc.</p>
            </div>
            <div>
              <span className="text-label text-slate-400 font-bold uppercase tracking-widest block mb-2">Billing Email</span>
              <p className="text-body font-bold text-slate-800">billing@acmecorp.com</p>
            </div>
            <div>
              <span className="text-label text-slate-400 font-bold uppercase tracking-widest block mb-2">Address</span>
              <p className="text-body font-bold text-slate-800 leading-relaxed">
                123 Innovation Dr, Suite 400<br />
                San Francisco, CA 94103
              </p>
            </div>
            <div>
              <span className="text-label text-slate-400 font-bold uppercase tracking-widest block mb-2">Tax ID</span>
              <p className="text-body font-bold text-slate-800">US-123456789</p>
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
                <th className="px-6 py-5 text-label font-bold text-slate-400 uppercase tracking-widest">Invoice #</th>
                <th className="px-6 py-5 text-label font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-label font-bold text-slate-400 uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invoices.map((invoice, idx) => (
                <tr key={idx} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-6 py-4 text-body font-semibold text-slate-600">{invoice.date}</td>
                  <td className="px-6 py-4 text-body font-black text-slate-900 font-mono">{invoice.amount}</td>
                  <td className="px-6 py-4 text-body text-slate-500 font-mono">{invoice.id}</td>
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
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-5 border-t border-slate-50 text-center">
          <button className="text-body font-bold text-primary hover:underline transition-all">View all invoices</button>
        </div>
      </div>
    </div>
  )
}
