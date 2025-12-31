// app/(main)/dashboard/phone-screening/page.jsx

"use client"
import React, { useState } from 'react'
import { 
  Plus, 
  Search, 
  Phone, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Copy, 
  ArrowRight,
  GripVertical,
  X,
  Mic2,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import Link from 'next/link'

export default function PhoneScreeningPage() {
  const [questions, setQuestions] = useState([
    { id: 1, text: 'Are you currently available for this role?', checked: true },
    { id: 2, text: 'What is your notice period?', checked: true },
    { id: 3, text: 'What are your salary expectations?', checked: true }
  ])

  const [duration, setDuration] = useState('5m')

  const results = [
    { name: 'Jane Doe', duration: '5m 2s', status: 'Passed', confidence: 88, summary: 'Strong communication skills. Clearly articulated experience with React and...', avatar: 'JD' },
    { name: 'Mark Smith', duration: '3m 45s', status: 'Failed', confidence: 42, summary: 'Candidate lacked clarity on notice period. Experience did not match...', avatar: 'MS' },
    { name: 'Ada Lovelace', duration: '4m 50s', status: 'Passed', confidence: 95, summary: 'Exceptional technical background. Provided detailed examples of past...', avatar: 'AL' }
  ]

  const activeScreens = [
    { title: 'Frontend Developer', sub: 'Initial Phone Screen', time: '5 min', stats: { total: 12, pass: 6, fail: 4, pending: 2 } },
    { title: 'Product Manager', sub: 'Screening Round 1', time: '10 min', stats: { total: 8, pass: 3, fail: 5, pending: 0 } }
  ]

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-700">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 mt-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Phone Screening</h1>
          <p className="text-slate-500 font-medium italic">
            Create short automated calls to quickly filter candidates before the main interview.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-primary/20 gap-2">
          <Plus size={20} /> Create Phone Screen
        </Button>
      </div>

      {/* Main Creation Form Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl mb-12 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Create New Phone Screen</h2>
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Screen Name</label>
              <Input placeholder="e.g. Frontend Developer – Initial Phone Screen" className="h-12 rounded-xl border-slate-100 bg-slate-50/50" />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Job Role (Optional)</label>
              <Input placeholder="e.g. Frontend Developer" className="h-12 rounded-xl border-slate-100 bg-slate-50/50" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Call Duration</label>
              <div className="flex bg-slate-100/50 p-1 rounded-xl">
                {['3m', '5m', '10m'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setDuration(t)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${duration === t ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Language</label>
              <Select defaultValue="en-us">
                <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-us">English (US)</SelectItem>
                  <SelectItem value="en-gb">English (UK)</SelectItem>
                  <SelectItem value="es-es">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">AI Voice</label>
              <div className="flex items-center gap-6 h-12">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">Female</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-primary transition-colors">
                  </div>
                  <span className="text-sm font-bold text-slate-500 group-hover:text-primary transition-colors">Male</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Screening Questions</label>
              <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                <Plus size={14} /> Custom Question
              </button>
            </div>
            <div className="space-y-3">
              {questions.map(q => (
                <div key={q.id} className="flex items-center gap-4 bg-white border border-slate-100 p-4 rounded-xl group hover:border-primary/20 transition-all">
                  <input type="checkbox" checked={q.checked} className="w-5 h-5 accent-primary cursor-pointer" readOnly />
                  <span className="flex-1 text-sm font-bold text-slate-700">{q.text}</span>
                  <button className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-4 bg-slate-50/50 border border-dashed border-slate-200 p-4 rounded-xl">
                <GripVertical className="text-slate-300" size={18} />
                <Input variant="ghost" placeholder="Briefly describe your most recent role." className="bg-transparent border-none focus-visible:ring-0 p-0 h-auto font-medium" />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-50">
            <div className="w-full md:w-96 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pass / Fail Logic</label>
              <Select defaultValue="70">
                <SelectTrigger className="h-11 rounded-xl border-slate-100 bg-slate-50/50 text-sm">
                  <SelectValue placeholder="Select Logic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="70">Pass if candidate answers at least 70% of questions clearly</SelectItem>
                  <SelectItem value="50">Pass if candidate answers at least 50% of questions clearly</SelectItem>
                  <SelectItem value="100">Must answer all questions perfectly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white font-bold h-12 px-12 rounded-xl shadow-lg shadow-primary/20">
              Create Phone Screen
            </Button>
          </div>
        </div>
      </div>

      {/* Active Screens Section */}
      <div className="space-y-6 mb-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Active Phone Screens</h2>
          <Link href="/all-phone-screenings" className="text-primary text-sm font-bold hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeScreens.map((screen, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{screen.title}</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-tight">{screen.sub}</p>
                </div>
                <span className="bg-blue-50 text-primary text-[10px] font-black px-2 py-0.5 rounded-lg">{screen.time}</span>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-8">
                {Object.entries(screen.stats).map(([key, val]) => (
                  <div key={key} className="text-center">
                    <div className="text-lg font-black text-slate-800">{val}</div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{key}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="rounded-xl border-slate-100 text-slate-600 font-bold text-xs h-10 gap-2">
                  <Copy size={14} /> Copy Link
                </Button>
                <Button variant="outline" className="rounded-xl border-slate-100 text-slate-600 font-bold text-xs h-10">
                  View Results
                </Button>
              </div>
            </div>
          ))}
          <div className="bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 group cursor-pointer hover:border-primary/50 hover:bg-white transition-all min-h-[250px]">
            <div className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-300 group-hover:border-primary group-hover:text-primary transition-all mb-4">
              <Plus size={24} />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">Create Another Screen</h3>
            <p className="text-xs text-slate-400 text-center font-medium px-4">Set up a new automated interviewer for a different role.</p>
          </div>
        </div>
      </div>

      {/* Recent Results Table */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-900">Recent Results</h2>
          <div className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full border border-slate-200">
            Frontend Developer
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Confidence</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Summary</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {results.map((res, i) => (
                <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-xs font-black text-primary border border-blue-100 shadow-inner">
                        {res.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm hover:text-primary transition-colors cursor-pointer">{res.name}</div>
                        <div className="text-[10px] font-bold text-slate-400">{res.duration}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                      res.status === 'Passed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {res.status === 'Passed' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {res.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 min-w-[180px]">
                    <div className="flex items-center gap-3">
                      <Progress value={res.confidence} className={`h-1.5 flex-1 ${res.confidence > 70 ? 'bg-blue-100' : 'bg-red-100'}`} />
                      <span className="text-xs font-black text-slate-700">{res.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 max-w-sm">
                    <p className="text-xs text-slate-500 font-medium leading-relaxed italic">{res.summary}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {res.status === 'Passed' ? (
                      <Link href="/schedule-interview">
                        <Button className="bg-primary hover:bg-primary-dark text-white font-bold text-[11px] h-9 px-4 rounded-lg shadow-md shadow-primary/10">
                          Schedule Interview
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" className="border-slate-100 text-slate-500 font-bold text-[11px] h-9 px-4 rounded-lg hover:bg-white hover:border-slate-200">
                        View Details
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
