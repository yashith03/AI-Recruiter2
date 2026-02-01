// app/(main)/settings/page.jsx

'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
  BellRing,
  ExternalLink,
  Loader2
} from 'lucide-react'

import { toast } from "sonner"
import { supabase } from "@/services/supabaseClient"

export default function SettingsPage() {
  const { user, setUser } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    job: '',
    company: ''
  })
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailInterviewCompleted: true,
    emailCandidateNoShow: true,
    emailFeedbackGenerated: true,
    inAppNotifications: true
  })

  const handleNotificationToggle = (key) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

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
    console.log("Starting profile save...")
    if (!user?.email) {
      console.error("No user email found")
      toast.error("User not authenticated")
      return
    }

    setLoading(true)

    try {
      console.log("Updating users table for email:", user.email)
      
      const { data, error } = await supabase
        .from("users")
        .update({
          name: formData.name,
          phone: formData.phone,
          job: formData.job,
          company: formData.company,
        })
        .eq("email", user.email)
        .select() // Request return data to verify update

      if (error) {
        console.error("Supabase update error object:", error)
        throw error
      }

      if (!data || data.length === 0) {
        console.error("Update succeeded but returned no data. Possible RLS issue.")
        throw new Error("Update failed: No changes saved. Please check your permissions.")
      }

      console.log("Supabase update successful:", data)
      
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
      console.error("HandleSave unexpected error:", err)
      toast.error(err.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoUpload = async (event) => {
    if (uploading) return
    
    console.log("Starting photo upload...")
    const file = event.target.files?.[0]
    if (!file) return

    // Clear input immediately to prevent change event loop
    if (fileInputRef.current) fileInputRef.current.value = ''

    console.log("File selected:", file.name, "Size:", file.size)

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB")
      return
    }

    setUploading(true)
    
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.email}-${Math.random()}.${fileExt}`
      const filePath = `${fileName}`
      
      console.log("Uploading to storage bucket 'avatars', path:", filePath)
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        console.error("Storage upload error:", uploadError)
        throw uploadError
      }
      console.log("Upload successful:", uploadData)

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)
      
      console.log("Generated public URL:", publicUrl)

      const { error: updateError } = await supabase
        .from('users')
        .update({ picture: publicUrl })
        .eq('email', user.email)

      if (updateError) {
         console.error("Database update error (picture):", updateError)
         throw updateError
      }

      setUser(prev => ({ ...prev, picture: publicUrl }))
      toast.success("Profile photo updated")
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error('Error uploading avatar: ' + (error.message || "Unknown error"))
    } finally {
      setUploading(false)
    }
  }

  const handleRemovePhoto = async () => {
    console.log("Removing photo...")
    if (!user?.picture) return
    if(!confirm("Are you sure you want to remove your profile photo?")) return

    setUploading(true)
    try {
      // Attempt to delete from storage if we can parse the path
      if (user.picture.includes('/avatars/')) {
        const filePath = user.picture.split('/avatars/')[1]
        if (filePath) {
           console.log("Deleting file from storage:", filePath)
           const { error: removeError } = await supabase.storage
            .from('avatars')
            .remove([filePath])
            
           if (removeError) {
             console.error("Error removing file from storage:", removeError)
             // We continue to remove from DB even if storage delete fails
           }
        }
      }

      const { error } = await supabase
        .from('users')
        .update({ picture: null })
        .eq('email', user.email)

      if (error) {
        console.error("Error removing photo from DB:", error)
        throw error
      }

      setUser(prev => ({ ...prev, picture: null }))
      toast.success("Profile photo removed")
    } catch (error) {
      console.error('Error removing avatar:', error)
      toast.error('Failed to remove photo')
    } finally {
      setUploading(false)
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
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-md flex items-center justify-center bg-slate-100">
                  {uploading ? (
                    <Loader2 className="animate-spin text-primary" size={32} />
                  ) : user?.picture ? (
                    <Image src={user.picture} alt="Avatar" width={96} height={96} className="object-cover w-full h-full" />
                  ) : (
                    <User size={32} className="text-slate-400" />
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-card p-2 rounded-full shadow-lg border border-border text-primary hover:bg-muted transition-colors"
                >
                  <Camera size={14} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                  accept="image/*" 
                />
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
                <Button 
                  onClick={handleRemovePhoto}
                  variant="outline" 
                  disabled={!user?.picture || uploading}
                  className="text-body font-bold border-border h-10 px-4"
                >
                  Remove
                </Button>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="text-body font-bold bg-primary hover:bg-primary-dark text-primary-foreground h-10 px-4"
                >
                  {uploading ? 'Uploading...' : 'Change Photo'}
                </Button>
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

          


          {/* Notification Preferences */}
           


          {/* Help & Support */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-h2 text-foreground">Help & Support</h2>
              <div className="p-2 bg-muted text-muted-foreground rounded-lg">
                <HelpCircle size={18} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/faq" className="block h-full">
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      <Globe size={24} />
                    </div>
                    <ExternalLink size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-h3 text-foreground mb-1">FAQ</h3>
                  <p className="text-label text-muted-foreground">Frequently Asked Questions.</p>
                </div>
              </Link>

              <Link href="/contact-support" className="block h-full">
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                      <Mail size={24} />
                    </div>
                    <ExternalLink size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-h3 text-foreground mb-1">Contact Support</h3>
                  <p className="text-label text-muted-foreground">Get in touch with our team for personalized help.</p>
                </div>
              </Link>
            </div>
          </section>

<div className="flex items-center justify-end pt-6">
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button
        variant="outline"
        className="h-11 px-6 font-bold text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 flex items-center gap-2"
      >
        <LogOut size={16} />
        Log out
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action will log you out of your account. You will need to log in again to access your dashboard.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
          Yes, Log Out
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</div>
      </div>
    </div>
  )
}
