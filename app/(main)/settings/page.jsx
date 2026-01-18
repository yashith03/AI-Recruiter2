// app/(main)/settings/page.jsx

'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useUser } from '@/app/provider'
import { 
  User, 
  Bell, 
  Settings as SettingsIcon, 
  Shield, 
  Users, 
  CreditCard, 
  ChevronRight,
  HelpCircle,
  Camera,
  LogOut,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Globe,
  Sliders,
  Moon,
  Sun,
  Monitor,
  ExternalLink,
  BellRing
} from 'lucide-react'
import { useTheme } from "next-themes"

import { toast } from "sonner"
import { supabase } from "@/services/supabaseClient"

export default function SettingsPage() {
  const { user, setUser } = useUser()
  const { setTheme, theme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    job: '',
    company: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        job: user.job || 'Senior Recruiter',
        company: user.company || 'Acme Corp'
      })
    }
  }, [user])

  const handleLogout = async () => {
  // Confirmation
  if (!confirm("Are you sure you want to log out?")) return

  try {
    await supabase.auth.signOut()
    setUser(null)
    toast.success("Logged out successfully")
    window.location.href = "/auth"
  } catch (error) {
    console.error("Logout error:", error)
    toast.error("Failed to log out")
  }
}

const handleSave = async () => {
  if (!user?.email) {
    toast.error("User not authenticated")
    return
  }

  setLoading(true)

  try {
    const { error } = await supabase
      .from("users")
      .update({
        name: formData.name,
        phone: formData.phone,
        job: formData.job,
        company: formData.company,
      })
      .eq("email", user.email)

    if (error) {
      console.error("Supabase update error:", error)
      toast.error(error.message || "Failed to update profile")
      return
    }

    // ✅ Sync local context state
    setUser(prev => ({
      ...prev,
      name: formData.name,
      phone: formData.phone,
      job: formData.job,
      company: formData.company,
    }))

    toast.success("Profile updated successfully")
    setIsEditing(false)
  } catch (err) {
    console.error("Unexpected error:", err)
    toast.error("Something went wrong")
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-700">
      <div className="space-y-10">
        <div className="mb-10">
          <h1 className="text-h1 text-foreground mb-2">Settings</h1>
          <p className="text-body text-muted-foreground">Manage your account preferences</p>
        </div>
          
          {/* Public Profile Section */}
          <section className="space-y-6">
            <div className="bg-card rounded-2xl border border-border shadow-sm p-8 flex flex-col md:flex-row items-center gap-8 group hover:border-primary/20 transition-all">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-md">
                  {user?.picture ? (
                    <Image src={user.picture} alt="Avatar" width={96} height={96} className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <User size={32} className="text-muted-foreground" />
                    </div>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-card p-2 rounded-full shadow-lg border border-border text-primary hover:bg-muted transition-colors">
                  <Camera size={14} />
                </button>
              </div>

              <div className="flex-1 text-center md:text-left space-y-1">
                <h3 className="text-h3 text-foreground">{formData.name || 'User Name'}</h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 text-body text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-muted-foreground" /> {formData.job || 'Job Title'}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-muted-foreground" /> {formData.company || 'Company'}</span>
                </div>
                <p className="text-label text-primary font-bold">Acme Corp • Global Talent Team</p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="text-body font-bold border-border h-10 px-4">Remove</Button>
                <Button className="text-body font-bold bg-primary hover:bg-primary-dark text-primary-foreground h-10 px-4">Change Photo</Button>
              </div>
            </div>
          </section>

          {/* Personal Information */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-h2 text-foreground">Personal Information</h2>
              <div className="p-2 bg-muted text-muted-foreground rounded-lg">
                <Shield size={18} />
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {[
                  { label: "Full Name", key: "name", icon: User },
                  { label: "Email Address", key: "email", icon: Mail },
                  { label: "Phone Number", key: "phone", icon: Phone },
                  { label: "Job Position", key: "job", icon: Briefcase },
                  { label: "Company", key: "company", icon: MapPin },
                ].map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-label text-muted-foreground block px-1">{field.label}</label>
                    <div className="relative group">
                      <field.icon className={`absolute left-3.5 top-1/2 -translate-y-1/2 size-4 transition-colors ${isEditing ? 'text-muted-foreground' : 'text-primary'}`} />
                      {isEditing ? (
                        <Input 
                          value={formData[field.key]} 
                          onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                          className="h-11 pl-11 rounded-xl border-border bg-background text-body font-medium" 
                          disabled={field.key === 'email'}
                        />
                      ) : (
                        <div className="h-11 pl-11 flex items-center text-body font-bold text-foreground border border-transparent px-3 rounded-xl bg-muted/30">
                          {formData[field.key]}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                {isEditing ? (
                  <Button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold h-10 px-6 gap-2"
                  >
                    {loading ? 'Saving...' : 'Save Information'}
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    onClick={() => setIsEditing(true)} 
                    className="border-primary/20 text-primary hover:bg-primary/5 font-bold h-10 px-6 gap-2"
                  >
                    Edit Details
                  </Button>
                )}
              </div>
            </div>
          </section>

     

          {/* Appearance Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-h2 text-foreground">Appearance</h2>
                <p className="text-body text-muted-foreground mt-1">Customize your interface experience</p>
              </div>
              <div className="p-2 bg-muted text-muted-foreground rounded-lg">
                {theme === 'dark' ? <Moon size={18} /> : theme === 'light' ? <Sun size={18} /> : <Monitor size={18} />}
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
              <div className="grid grid-cols-3 gap-4">
                <button 
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'light' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-slate-200 text-muted-foreground'}`}
                >
                  <Sun size={24} />
                  <span className="font-bold">Light</span>
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-slate-200 text-muted-foreground'}`}
                >
                  <Moon size={24} />
                  <span className="font-bold">Dark</span>
                </button>
                <button 
                  onClick={() => setTheme('system')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'system' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-slate-200 text-muted-foreground'}`}
                >
                  <Monitor size={24} />
                  <span className="font-bold">System</span>
                </button>
              </div>
            </div>
          </section>

          {/* Notification Preferences */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-h2 text-foreground">Notifications</h2>
                <p className="text-body text-muted-foreground mt-1">Manage how you receive updates</p>
              </div>
              <div className="p-2 bg-muted text-muted-foreground rounded-lg">
                <BellRing size={18} />
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm p-8 space-y-8">
              
              {/* Email Notifications */}
              <div className="space-y-4">
                <h3 className="text-body font-bold text-foreground flex items-center gap-2">
                  <Mail size={16} className="text-primary" /> Email Notifications
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Interview Completed', desc: 'Get notified when a candidate finishes an interview' },
                    { label: 'Candidate No-Show', desc: 'Alert when a scheduled interview is missed' },
                    { label: 'Feedback Generated', desc: 'Receive a digest when AI analysis is ready' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="space-y-0.5">
                        <p className="text-body font-medium text-foreground/80">{item.label}</p>
                        <p className="text-label text-muted-foreground">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full h-px bg-border"></div>

              {/* In-app Notifications */}
              <div className="flex items-center justify-between group">
                <div className="space-y-0.5">
                  <h3 className="text-body font-bold text-foreground flex items-center gap-2 mb-1">
                    <Bell size={16} className="text-primary" /> In-App Notifications
                  </h3>
                  <p className="text-label text-muted-foreground pl-6">Show badges and popups within the dashboard</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

            </div>
          </section>

          {/* Help & Support */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-h2 text-foreground">Help & Support</h2>
              <div className="p-2 bg-muted text-muted-foreground rounded-lg">
                <HelpCircle size={18} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Globe size={24} />
                  </div>
                  <ExternalLink size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-h3 text-foreground mb-1">Knowledge Base</h3>
                <p className="text-label text-muted-foreground">Guides, tutorials, and FAQs to help you get started.</p>
              </div>

              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <Mail size={24} />
                  </div>
                  <ExternalLink size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-h3 text-foreground mb-1">Contact Support</h3>
                <p className="text-label text-muted-foreground">Get in touch with our team for personalized help.</p>
              </div>
            </div>
          </section>

<div className="flex items-center justify-end pt-6">
  <Button
    onClick={handleLogout}
    variant="outline"
    className="h-11 px-6 font-bold text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 flex items-center gap-2"
  >
    <LogOut size={16} />
    Log out
  </Button>
</div>
      </div>
    </div>
  )
}
