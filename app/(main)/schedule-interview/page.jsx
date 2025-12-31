// app/(main)/schedule-interview/page.jsx

"use client"
import React, { useState } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Clock, 
  Video, 
  Users, 
  Check, 
  Plus, 
  Search, 
  Calendar, 
  Info, 
  ExternalLink,
  Briefcase,
  X,
  Send,
  MoreVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import moment from 'moment'

export default function ScheduleInterviewPage() {
  const [selectedDuration, setSelectedDuration] = useState('45 min')
  const [selectedDate, setSelectedDate] = useState(10)
  const [selectedSlot, setSelectedSlot] = useState('10:30 AM')
  const [interviewers, setInterviewers] = useState([
    { name: 'Alex (You)', id: 'me', avatar: '' },
    { name: 'Emily Chen', id: 'emily', avatar: '' }
  ])

  const durations = ['15 min', '30 min', '45 min', '1 hour']
  const slots = [
    { time: '9:30 AM', meta: '30 min available', status: 'available' },
    { time: '10:30 AM', meta: 'High Match', status: 'recommended', tag: 'star' },
    { time: '11:15 AM', meta: 'With Emily Chen', status: 'conflict-partial' },
    { time: '1:00 PM', meta: '1 hr available', status: 'available' },
    { time: '2:30 PM', meta: 'Conflict: Team Sync', status: 'busy' },
    { time: '4:00 PM', meta: 'End of day', status: 'available' }
  ]

  const removeInterviewer = (id) => {
    setInterviewers(interviewers.filter(i => i.id !== id))
  }

  const handleSendInvitation = () => {
    toast.success("Invitation sent to Sarah Jenkins")
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-700">
      
      {/* Breadcrumb & Top Header */}
      <div className="flex flex-col gap-6 mb-8 mt-2">
        

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-h1 text-slate-900 mb-2">Schedule Interview</h1>
            <p className="text-body-lg text-slate-500 italic">Configure the details and select a time slot for the candidate.</p>
          </div>
          <Button variant="outline" className="bg-white border-slate-200 text-slate-600 text-body font-bold px-6 h-11 rounded-xl shadow-sm hover:shadow-md transition-all">
            Save Draft
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Info + Configuration */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Candidate Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center justify-between gap-8 group">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-slate-50 shadow-md">
                  <Image 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop" 
                    alt="Sarah Jenkins" 
                    width={80} 
                    height={80} 
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-h2 text-slate-900">Sarah Jenkins</h2>
                  <span className="bg-blue-50 text-primary text-label px-2.5 py-1 rounded-full border border-blue-100">
                    Screening
                  </span>
                </div>
                <p className="text-body-lg text-slate-500 font-bold mb-3">Senior UX Designer Applicant</p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5 text-slate-400 text-helper">
                    <MapPin size={14} /> New York, NY (Remote)
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-helper">
                    <Clock size={14} /> EST (GMT-5)
                  </div>
                </div>
              </div>
            </div>
            
            <Link href="#" className="flex items-center gap-1.5 text-primary text-body font-bold hover:underline">
              View Profile <ExternalLink size={16} />
            </Link>
          </div>

          {/* Configuration Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-50 text-primary rounded-xl">
                <Plus size={20} />
              </div>
              <h3 className="text-h3 text-slate-900">Configuration</h3>
            </div>

            <div className="space-y-8">
              {/* Type and Platform */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-label text-slate-400 block mb-1">Interview Type</label>
                  <Select defaultValue="technical">
                    <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:ring-primary">
                      <div className="flex items-center gap-3 text-body font-semibold text-slate-700">
                        <Video size={18} className="text-slate-400" />
                        <SelectValue placeholder="Select type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Interview</SelectItem>
                      <SelectItem value="behavioral">Behavioral Interview</SelectItem>
                      <SelectItem value="culture">Culture Fit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <label className="text-label text-slate-400 block mb-1">Platform</label>
                  <Select defaultValue="google-meet">
                    <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:ring-primary">
                      <div className="flex items-center gap-3 text-body font-semibold text-slate-700">
                        <Video size={18} className="text-slate-400" />
                        <SelectValue placeholder="Select platform" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google-meet">Google Meet</SelectItem>
                      <SelectItem value="zoom">Zoom</SelectItem>
                      <SelectItem value="teams">Microsoft Teams</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-3">
                <label className="text-label text-slate-400 block mb-1">Duration</label>
                <div className="flex flex-wrap gap-3">
                  {durations.map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDuration(d)}
                      className={`px-6 py-2.5 rounded-xl text-body font-bold border transition-all ${
                        selectedDuration === d 
                        ? 'bg-blue-50 border-primary text-primary shadow-sm shadow-primary/10' 
                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interviewers */}
              <div className="space-y-3">
                <label className="text-label text-slate-400 block mb-1">Interviewers</label>
                <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50/50 border border-slate-100 rounded-2xl min-h-[56px]">
                  {interviewers.map((inv) => (
                    <div key={inv.id} className="flex items-center gap-2 bg-white border border-slate-100 px-3 py-1.5 rounded-xl shadow-sm animate-in zoom-in duration-300">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-label text-slate-500">
                        {inv.name.charAt(0)}
                      </div>
                      <span className="text-body font-bold text-slate-700">{inv.name}</span>
                      <button onClick={() => removeInterviewer(inv.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <input 
                    placeholder="Add interviewer..." 
                    className="bg-transparent border-none focus:ring-0 text-body font-medium text-slate-600 outline-none ml-2 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-3">
                <label className="text-label text-slate-400 block mb-1">Internal Notes</label>
                <Textarea 
                  placeholder="Topics to cover: React hooks, State management preference, Portfolio review..." 
                  className="min-h-[120px] rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-primary p-5 text-body font-medium text-slate-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calendar & Slots */}
        <div className="space-y-8">
          
          {/* Calendar Widget */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 pb-4">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-h3 text-slate-800">October 2023</h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                  <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 text-center mb-4">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                  <span key={day} className="text-label text-slate-300">{day}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-y-2 mb-4">
                {/* Simplified static calendar for mockup */}
                {Array(6).fill(null).map((_, i) => <span key={`empty-${i}`} />)}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    className={`h-11 w-11 flex flex-col items-center justify-center rounded-xl text-body font-bold relative group transition-all ${
                      selectedDate === day 
                      ? 'bg-primary text-white shadow-lg shadow-primary/30 z-10' 
                      : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {day}
                    {day === 3 && <div className={`w-1 h-1 rounded-full absolute bottom-1.5 ${selectedDate === 3 ? 'bg-white' : 'bg-primary'}`} />}
                    {day === 11 && <div className={`w-1 h-1 rounded-full absolute bottom-1.5 ${selectedDate === 11 ? 'bg-white' : 'bg-green-500'}`} />}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Insight Box */}
            <div className="mx-6 mb-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex gap-4 animate-in slide-in-from-right duration-500">
              <div className="text-primary mt-1 shrink-0">
                <Plus size={18} className="text-primary rotate-45" />
              </div>
              <div>
                <span className="text-label text-primary block mb-1">AI Insight</span>
                <p className="text-helper text-blue-700/80 leading-relaxed font-bold">
                  Candidate is likely most responsive between <span className="text-blue-900">10:00 AM</span> and <span className="text-blue-900">1:00 PM</span> based on email activity.
                </p>
              </div>
            </div>

            <div className="p-8 pt-0 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-h3 text-slate-800">Available Slots (Oct {selectedDate})</h4>
                <span className="text-label text-slate-400">EST (GMT-5)</span>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {slots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => slot.status !== 'busy' && setSelectedSlot(slot.time)}
                    className={`w-full p-4 rounded-2xl border transition-all flex items-start justify-between text-left group ${
                      selectedSlot === slot.time 
                      ? 'bg-blue-50 border-primary shadow-sm ring-1 ring-primary/20' 
                      : slot.status === 'busy'
                        ? 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed'
                        : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-body font-bold ${selectedSlot === slot.time ? 'text-primary' : 'text-slate-900'}`}>{slot.time}</span>
                        {slot.status === 'recommended' && <Check size={14} className="text-green-500" />}
                        {slot.status === 'conflict-partial' && <div className="w-2 h-2 rounded-full bg-green-500" />}
                      </div>
                      <span className="text-label text-slate-400">{slot.meta}</span>
                    </div>
                    {slot.tag === 'star' && (
                       <div className="p-1 px-1.5 bg-primary text-white rounded-md animate-bounce transform -translate-y-2">
                         <Plus size={10} />
                       </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 md:px-10 z-50">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-100 p-4 rounded-3xl shadow-[0_-20px_50px_-15px_rgba(0,0,0,0.1)] flex items-center justify-end gap-3">
          <Button variant="ghost" className="rounded-xl px-8 h-12 text-body text-slate-500 font-bold hover:bg-slate-50" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button onClick={handleSendInvitation} className="rounded-xl px-12 h-12 bg-primary hover:bg-primary-dark text-white text-body font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 flex gap-2">
            <Send size={18} /> Send Invitation
          </Button>
        </div>
      </div>
    </div>
  )
}