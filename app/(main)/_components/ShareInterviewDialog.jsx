"use client"

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, MessageSquare, Copy, Link as LinkIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useUser } from '@/app/provider'

const ShareInterviewDialog = ({ open, onClose, interview }) => {
  const { user } = useUser()
  const interviewUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/interview/${interview?.interview_id}`

  const onCopyLink = async () => {
    await navigator.clipboard.writeText(interviewUrl)
    toast.success("Interview link copied to clipboard")
  }

  const shareEmail = () => {
    const subject = `Interview Invite: ${interview?.jobPosition || 'AI Interview'}`
    const body = `Hi there,\n\nYou have been invited to an interview for the position of ${interview?.jobPosition || 'Candidate'}.\n\nPlease join using this link: ${interviewUrl}\n\nGood luck!`
    
    const encodedSubject = encodeURIComponent(subject)
    const encodedBody = encodeURIComponent(body)
    const userEmail = user?.email?.toLowerCase() || ''

    let emailUrl = `mailto:?subject=${encodedSubject}&body=${encodedBody}`

    // Intelligent provider detection
    if (userEmail.includes('@gmail.com') || userEmail.includes('@googlemail.com')) {
      emailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=${encodedSubject}&body=${encodedBody}`
    } else if (
      userEmail.includes('@outlook.com') || 
      userEmail.includes('@hotmail.com') || 
      userEmail.includes('@live.com') || 
      userEmail.includes('@msn.com')
    ) {
      emailUrl = `https://outlook.office.com/mail/deeplink/compose?subject=${encodedSubject}&body=${encodedBody}`
    } else if (userEmail.includes('@yahoo.com')) {
      emailUrl = `https://compose.mail.yahoo.com/?to=&subj=${encodedSubject}&body=${encodedBody}`
    }

    window.open(emailUrl, '_blank')
  }

  const shareWhatsApp = () => {
    const text = `Hi, please join the interview for ${interview?.jobPosition || 'the position'} using this link: ${interviewUrl}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const shareSlack = () => {
    const text = `Interview Link for ${interview?.jobPosition || 'Candidate'}: ${interviewUrl}`
    window.open(`https://slack.com/share?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl border-slate-100 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-h2 text-slate-900">Share Interview</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Link Section */}
          <div className="space-y-3">
            <h4 className="text-label text-slate-500 font-bold uppercase tracking-wider px-1">Interview Link</h4>
            <div className="flex gap-2 items-center">
              <Input 
                value={interviewUrl} 
                readOnly 
                className="h-11 rounded-xl border-slate-100 bg-slate-50/50 text-body font-medium" 
              />
              <Button 
                onClick={onCopyLink}
                size="icon"
                aria-label="Copy Link"
                className="h-11 w-11 shrink-0 rounded-xl bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20"
              >
                <Copy size={18} />
              </Button>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full" />

          {/* Share Options */}
          <div className="space-y-3">
            <h4 className="text-label text-slate-500 font-bold uppercase tracking-wider px-1">Share via</h4>
            <div className="grid grid-cols-1 gap-2">
              <Button 
                variant="outline" 
                onClick={shareEmail}
                className="h-12 justify-start rounded-xl border-slate-100 hover:bg-slate-50 text-body font-bold flex gap-3 px-4"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Mail size={18} className="text-orange-500" />
                </div>
                Email / Webmail
              </Button>
              <Button 
                variant="outline" 
                onClick={shareWhatsApp}
                className="h-12 justify-start rounded-xl border-slate-100 hover:bg-slate-50 text-body font-bold flex gap-3 px-4"
              >
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <MessageSquare size={18} className="text-green-500" />
                </div>
                WhatsApp
              </Button>
              <Button 
                variant="outline" 
                onClick={shareSlack}
                className="h-12 justify-start rounded-xl border-slate-100 hover:bg-slate-50 text-body font-bold flex gap-3 px-4"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <MessageSquare size={18} className="text-purple-500" />
                </div>
                Slack
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShareInterviewDialog
