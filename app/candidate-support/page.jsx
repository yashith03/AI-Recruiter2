"use client"

import React, { useState } from 'react'
import { 
  Mail, 
  User, 
  MessageSquare, 
  Send,
  Loader2,
  MapPin,
  Sparkles,
  ArrowLeft
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from "sonner"
import Link from 'next/link'
import Image from 'next/image'

export default function CandidateSupportPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    console.log("Candidate Support Form submitted:", formData)
    toast.success("Message sent successfully! We'll get back to you soon.")
    
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
    setLoading(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-slate-50 font-display">
       {/* Simple Header */}
       <header className="w-full px-6 py-4 flex items-center justify-between bg-white border-b border-slate-100">
          <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="AI Recruiter Logo" width={140} height={50} className="h-10 w-auto object-contain" />
          </div>
          <div>
            {/* Optional: Add Back link if needed, or just leave empty */}
          </div>
       </header>

       <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in duration-700">
        
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Candidate Support</h1>
          <p className="text-slate-500 max-w-lg mx-auto">
            Encountered an issue during your interview? Need help? Fill out the form below and our support team will assist you shortly.
          </p>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Send us a message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input 
                    name="name"
                    placeholder="Jane Doe" 
                    className="pl-10 border-slate-200 focus:border-blue-500" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input 
                    name="email"
                    type="email" 
                    placeholder="jane@example.com" 
                    className="pl-10 border-slate-200 focus:border-blue-500" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Subject</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input 
                  name="subject"
                  placeholder="Issue with recording, etc." 
                  className="pl-10 border-slate-200 focus:border-blue-500"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Message</label>
              <Textarea 
                name="message"
                placeholder="Describe your issue or question..." 
                className="min-h-[120px] resize-none border-slate-200 focus:border-blue-500"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full font-bold bg-blue-600 hover:bg-blue-700 text-white gap-2 h-11"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-slate-400">
           &copy; {new Date().getFullYear()} AI Recruiter. All rights reserved.
        </div>

      </div>
    </div>
  )
}
