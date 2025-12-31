// app/(main)/settings/page.jsx

'use client'

import React, { useState } from 'react'
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
  Sliders
} from 'lucide-react'

export default function SettingsPage() {
  const { user } = useUser()

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-700">
      <div className="space-y-10">
        <div className="mb-10">
          <h1 className="text-h1 text-slate-900 mb-2">Settings</h1>
          <p className="text-body text-slate-500">Manage your account preferences</p>
        </div>
          
          {/* Public Profile Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-h2 text-slate-900 mb-1">Public Profile</h2>
              <p className="text-body text-slate-500">This information will be displayed on your recruiter profile visible to candidates.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col md:flex-row items-center gap-8 group hover:border-primary/20 transition-all">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-md">
                  {user?.picture ? (
                    <Image src={user.picture} alt="Avatar" width={96} height={96} className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <User size={32} className="text-slate-300" />
                    </div>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg border border-slate-100 text-primary hover:bg-slate-50 transition-colors">
                  <Camera size={14} />
                </button>
              </div>

              <div className="flex-1 text-center md:text-left space-y-1">
                <h3 className="text-h3 text-slate-900">{user?.name || 'Jane Doe'}</h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 text-body text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-slate-400" /> Senior Technical Recruiter</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" /> San Francisco, CA</span>
                </div>
                <p className="text-label text-primary font-bold">Acme Corp • Global Talent Team</p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="text-body font-bold border-slate-200 h-10 px-4">Remove</Button>
                <Button className="text-body font-bold bg-primary hover:bg-primary-dark h-10 px-4">Change Photo</Button>
              </div>
            </div>
          </section>

          {/* Personal Information */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-h2 text-slate-900">Personal Information</h2>
              <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                <Shield size={18} />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-label text-slate-400 block px-1">First Name</label>
                  <Input defaultValue={user?.name?.split(' ')[0] || 'Jane'} className="h-11 rounded-xl border-slate-100 bg-slate-50/50 text-body font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-label text-slate-400 block px-1">Last Name</label>
                  <Input defaultValue={user?.name?.split(' ')[1] || 'Doe'} className="h-11 rounded-xl border-slate-100 bg-slate-50/50 text-body font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-label text-slate-400 block px-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input defaultValue={user?.email || 'jane.doe@acmecorp.com'} className="h-11 pl-11 rounded-xl border-slate-100 bg-slate-50/50 text-body font-medium" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-label text-slate-400 block px-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input defaultValue="+1 (555) 000-0000" className="h-11 pl-11 rounded-xl border-slate-100 bg-slate-50/50 text-body font-medium" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-label text-slate-400 block px-1">Bio</label>
                  <span className="text-helper text-slate-300">240/500 characters</span>
                </div>
                <Textarea 
                  className="rounded-xl border-slate-100 bg-slate-50/50 min-h-[120px] resize-none text-body leading-relaxed p-4" 
                  defaultValue="Experienced recruiter with over 8 years in the tech industry. Passionate about connecting top talent with innovative companies."
                />
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-h2 text-slate-900">Preferences</h2>
                <p className="text-body text-slate-400 mt-1">Manage your view and default settings</p>
              </div>
              <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                <Sliders size={18} />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
              <div className="flex items-center justify-between group">
                <div className="space-y-0.5">
                  <p className="text-body font-bold text-slate-700">Profile Visibility</p>
                  <p className="text-label text-slate-400">Allow candidates to view your full profile</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between group">
                <div className="space-y-0.5">
                  <p className="text-body font-bold text-slate-700">Show Availability Status</p>
                  <p className="text-label text-slate-400">Display when you are online to team members</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <Button variant="ghost" className="text-body text-slate-500 font-bold hover:bg-slate-50 h-11 px-6">Cancel</Button>
            <Button className="bg-primary hover:bg-primary-dark text-body font-bold h-11 px-8 shadow-lg shadow-primary/20 transition-all active:scale-95">
              Save Changes
            </Button>
          </div>

      </div>
    </div>
  )
}
