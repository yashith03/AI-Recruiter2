"use client"

import React, { useState } from 'react'
import { 
  Mail, 
  User, 
  MessageSquare, 
  Send,
  Loader2,
  Clock,
  MapPin
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from "sonner"

export default function ContactSupportPage() {
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

    console.log("Form submitted:", formData)
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
    <div className="max-w-2xl mx-auto pb-20 animate-in fade-in duration-700">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-foreground">Get in touch</h1>
          <p className="text-muted-foreground">
            Have a question or need assistance? Fill out the form and our team will get back to you within 24 hours.
          </p>
        </div>

        {/* Section: Send us a message */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-foreground mb-6">Send us a message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">First name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    name="name"
                    placeholder="John Doe" 
                    className="pl-10" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    name="email"
                    type="email" 
                    placeholder="john@example.com" 
                    className="pl-10" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Subject</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  name="subject"
                  placeholder="How can we help?" 
                  className="pl-10"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Message</label>
              <Textarea 
                name="message"
                placeholder="Tell us more about your inquiry..." 
                className="min-h-[120px] resize-none"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full font-bold bg-primary hover:bg-primary-dark text-primary-foreground gap-2"
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

        {/* Section: Email Us */}
        <div className="bg-card rounded-2xl border border-border p-6 flex items-start gap-4 shadow-sm hover:border-primary/20 transition-colors">
          <div className="p-3 bg-primary/10 rounded-xl text-primary mt-1">
            <Mail size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Email Us</h3>
            <p className="text-muted-foreground mb-1">Our friendly team is here to help.</p>
            <a href="mailto:support@airecruiter.com" className="text-primary font-medium hover:underline">support@airecruiter.com</a>
          </div>
        </div>

        {/* Section: Visit Us */}
        <div className="bg-card rounded-2xl border border-border p-6 flex items-start gap-4 shadow-sm hover:border-primary/20 transition-colors">
          <div className="p-3 bg-primary/10 rounded-xl text-primary mt-1">
            <MapPin size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Visit Us</h3>
            <p className="text-muted-foreground mb-1">Come say hello at our office HQ.</p>
            <p className="text-foreground font-medium">100 Smith Street, Collingwood VIC 3066 AU</p>
          </div>
        </div>

    

      </div>
    </div>
  )
}
