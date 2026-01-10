// app/(main)/manage-subscription/page.jsx

'use client'

import React, { useState } from 'react'
import { 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  MessageCircle, 
  BookOpen,
  Zap,
  ShieldCheck,
  Building2,
  Clock,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const plans = [
  {
    name: 'Starter',
    price: '$0',
    description: 'Perfect for small teams trying out AI hiring.',
    features: [
      { name: '5 Active Jobs', included: true },
      { name: 'Basic AI Matching', included: true },
      { name: 'Email Support', included: true },
      { name: 'Resume Parsing', included: false },
    ],
    buttonText: 'Current Plan',
    current: true,
  },
  {
    name: 'Monthly',
    price: '1000LKR',
    description: 'For growing companies needing automation.',
    features: [
      { name: 'Unlimited Jobs', included: true },
      { name: 'Advanced AI Scoring', included: true },
      { name: 'Resume Parsing', included: true },
      { name: 'Priority Email Support', included: true },
    ],
    buttonText: 'Upgrade to Monthly Plan',
    popular: true,
  },
  {
    name: 'Yearly',
    price: '10,000LKR',
    description: 'Custom solutions for high-volume recruitment.',
    features: [
   { name: 'Unlimited Jobs', included: true },
      { name: 'Advanced AI Scoring', included: true },
      { name: 'Resume Parsing', included: true },
      { name: 'Priority Email Support', included: true }
    ],
    buttonText: 'Upgrade to Yearly Plan',
    popular: true,
    saveLabel: 'SAVE 20%'
  },
]

export default function ManageSubscription() {
  const [billingCycle, setBillingCycle] = useState('Monthly')
  const [isCompareOpen, setIsCompareOpen] = useState(false)

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-[40px] font-black text-slate-900 tracking-tight">Manage Subscription</h1>
        <p className="text-body-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Choose the plan that fits your hiring needs. Upgrade anytime to access more AI-powered features.
        </p>
      </div>

      {/* Current Plan Overview */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden mb-12 group hover:shadow-xl hover:border-primary/20 transition-all duration-500">
        <div className="p-10 flex flex-col lg:flex-row gap-10 items-center">
          <div className="flex-1 space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-h2 text-slate-900">Current Plan: Starter</h2>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-slate-200">
                ACTIVE
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-body text-slate-500">
                <Clock size={18} className="text-slate-400" />
                <span>Your plan renews on <span className="font-bold text-slate-700">Oct 24, 2023</span>.</span>
              </div>
              <p className="text-body text-slate-500">
                You have used <span className="font-bold text-slate-700">4 of 5</span> active job slots.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button variant="outline" className="h-12 px-8 rounded-xl bg-slate-50 border-slate-100 text-body font-bold text-slate-600 hover:bg-slate-100 hover:border-slate-200 shadow-sm transition-all">
                Billing History
              </Button>
              <Button variant="ghost" className="h-12 px-8 rounded-xl text-body font-bold text-primary hover:bg-primary/5 transition-all">
                Cancel Subscription
              </Button>
            </div>
          </div>
          
          <div className="w-full lg:w-[400px] h-[200px] relative rounded-2xl overflow-hidden shadow-inner bg-slate-900">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent z-10" />
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/30 via-transparent to-transparent animate-pulse" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="text-primary w-24 h-24" />
            </div>
          </div>
        </div>
      </div>



      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-stretch">
        {plans.map((plan, idx) => (
          <div 
            key={idx}
            className={`relative flex flex-col bg-white rounded-[32px] p-10 border transition-all duration-500 group hover:shadow-2xl hover:-translate-y-2 ${
              plan.popular 
              ? 'border-primary ring-1 ring-primary shadow-xl shadow-primary/10' 
              : 'border-slate-100 shadow-sm'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-lg shadow-primary/30 z-20">
                MOST POPULAR
              </div>
            )}

            <div className="mb-8">
              {plan.saveLabel && (
                 <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-600 text-[10px] font-black uppercase tracking-widest mb-3 inline-block">
                  {plan.saveLabel}
                </span>
              )}
              <h3 className="text-h3 font-black text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-body text-slate-500 leading-relaxed">{plan.description}</p>
            </div>

            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-[48px] font-black text-slate-900 tracking-tighter">{plan.price}</span>
              {plan.price !== 'Custom' && <span className="text-body-lg text-slate-400 font-bold">/mo</span>}
            </div>

            <Button 
                className={`w-full h-14 rounded-2xl text-body font-black uppercase tracking-widest transition-all ${
                plan.current 
                ? 'bg-white border-2 border-slate-100 text-slate-300 hover:bg-slate-50 cursor-default' 
                : plan.popular
                ? 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30 active:scale-95'
                : 'bg-slate-50 text-slate-900 border border-slate-100 hover:bg-slate-100 active:scale-95'
              }`}
            >
              {plan.buttonText}
            </Button>

            <div className="mt-12 space-y-5">
              {plan.features.map((feature, fIdx) => (
                <div key={fIdx} className="flex items-center gap-4">
                  <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${feature.included ? 'text-primary' : 'text-slate-200'}`}>
                    {feature.included ? <Check size={16} strokeWidth={4} /> : <X size={16} strokeWidth={4} />}
                  </div>
                  <span className={`text-body-lg font-medium ${feature.included ? 'text-slate-600' : 'text-slate-300'}`}>
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

   

      {/* Bottom Footer Section */}
      <div className="text-center space-y-6">
        <p className="text-body text-slate-500 font-medium tracking-tight">
          Need help choosing? <button className="text-primary hover:underline font-bold transition-all">Chat with our sales team</button> or check out our <button className="text-primary hover:underline font-bold transition-all">documentation</button>.
        </p>
      </div>
    </div>
  )
}
