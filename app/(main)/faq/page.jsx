"use client"

import React, { useState } from 'react'
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  FileText,
  CreditCard,
  User,
  Zap
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const faqData = [
  {
    category: "General",
    icon: HelpCircle,
    items: [
      { q: "What is AI Recruiter?", a: "AI Recruiter is an automated platform that helps you screen candidates using AI-driven interviews, saving you time and ensuring consistent evaluation." },
      { q: "How do I get started?", a: "Simply create a new interview, set your questions or let AI generate them, and share the link with your candidates." },
    ]
  },
  {
    category: "Interviews",
    icon: FileText,
    items: [
      { q: "How are interviews graded?", a: "Our AI analyzes candidate responses based on relevance, technical accuracy, and communication skills to provide a comprehensive score." },
      { q: "Can I customize questions?", a: "Yes! You can manually input questions or select from our AI-generated suggestions tailored to the job role." },
      { q: "Is there a limit on candidates?", a: "Limits depend on your subscription plan. Check the Billing section for details on your current quota." },
    ]
  },
  {
    category: "Account & Billing",
    icon: CreditCard,
    items: [
      { q: "How do I upgrade my plan?", a: "Go to the Billing tab in the sidebar to view our plans and upgrade instantly." },
      { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time from the Billing settings. Your access will remain until the end of the billing period." },
    ]
  },
  {
    category: "Troubleshooting",
    icon: Zap,
    items: [
      { q: "My camera isn't working", a: "Please ensure you have granted browser permissions for camera and microphone access. Try refreshing the page or checking your browser settings." },
      { q: "I didn't receive an email", a: "Check your spam/junk folder. If you still can't find it, contact support@airecruiter.com." },
    ]
  }
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [openItems, setOpenItems] = useState({})

  const toggleItem = (categoryIndex, itemIndex) => {
    const key = `${categoryIndex}-${itemIndex}`
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const filteredFAQs = faqData.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0)

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-700">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-foreground">How can we help?</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Search our knowledge base or browse frequently asked questions below.
          </p>
          
          <div className="relative max-w-xl mx-auto mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              type="text" 
              placeholder="Search for answers..." 
              className="h-12 pl-12 rounded-full border-border bg-card shadow-sm text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* FAQ Grid */}
        <div className="space-y-10">
          {filteredFAQs.length > 0 ? filteredFAQs.map((category, catIndex) => (
            <div key={catIndex} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/30 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <category.icon size={20} />
                </div>
                <h3 className="text-xl font-bold text-foreground">{category.category}</h3>
              </div>
              
              <div className="divide-y divide-border">
                {category.items.map((item, itemIndex) => {
                  const isOpen = openItems[`${catIndex}-${itemIndex}`]
                  return (
                    <div key={itemIndex} className="group">
                      <button 
                        onClick={() => toggleItem(catIndex, itemIndex)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
                      >
                        <span className="font-medium text-foreground pr-8">{item.q}</span>
                        <ChevronDown 
                          className={`text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                          size={18}
                        />
                      </button>
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <p className="px-6 pb-6 text-muted-foreground leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Search className="text-muted-foreground" size={24} />
              </div>
              <h3 className="text-xl font-bold text-foreground">No results found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search terms</p>
            </div>
          )}
        </div>

        {/* Contact Support CTA */}
        <div className="mt-16 bg-primary/5 rounded-3xl p-8 md:p-12 text-center border border-primary/10">
          <h2 className="text-2xl font-bold text-foreground mb-3">Still need help?</h2>
          <p className="text-muted-foreground mb-8">Our team is available 24/7 to assist you with any questions.</p>
          <Button 
             className="h-11 px-8 font-bold bg-primary hover:bg-primary-dark text-primary-foreground rounded-full"
             onClick={() => window.location.href = "mailto:support@airecruiter.com"}
          >
            Contact Support
          </Button>
        </div>

      </div>
    </div>
  )
}
