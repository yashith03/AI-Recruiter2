'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Bell, 
  CheckCheck, 
  Calendar, 
  Bot, 
  UserPlus, 
  AlertTriangle, 
  ClipboardList,
  ChevronRight,
  MoreVertical
} from 'lucide-react'

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('all')

  const notifications = [
    {
      id: 1,
      type: 'interview',
      title: 'Interview Scheduled: Sarah Jenkins',
      description: 'Sarah has accepted the invite for 2:00 PM EST today. Prepare for the technical screening.',
      time: '2 hours ago',
      isUnread: true,
      group: 'Today',
      icon: Calendar,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      actionLabel: 'View Details'
    },
    {
      id: 2,
      type: 'ai',
      title: 'AI Screening Complete',
      description: 'Top 5 candidates identified for Senior Backend Developer role based on resume match.',
      time: '4 hours ago',
      isUnread: true,
      group: 'Today',
      icon: Bot,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50',
      actionLabel: 'Review Results'
    },
    {
      id: 3,
      type: 'applicant',
      title: 'New Applicant: Michael Scott',
      description: 'Applied for Regional Manager position.',
      time: 'Yesterday at 9:42 AM',
      isUnread: false,
      group: 'Yesterday',
      icon: UserPlus,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50'
    },
    {
      id: 4,
      type: 'subscription',
      title: 'Subscription Alert',
      description: 'Your premium job posting quota is running low. Only 2 posts remaining.',
      time: 'Yesterday at 4:15 PM',
      isUnread: false,
      group: 'Yesterday',
      icon: AlertTriangle,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-50',
      actionLabel: 'Upgrade Plan'
    },
    {
      id: 5,
      type: 'feedback',
      title: 'Hiring Manager Feedback',
      description: 'Jim Halpert submitted feedback for candidate Dwight Schrute.',
      time: 'Mon, Oct 24 at 11:30 AM',
      isUnread: false,
      group: 'Earlier this week',
      icon: ClipboardList,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50',
      actionLabel: 'View Feedback',
      actionIcon: ChevronRight
    }
  ]

  const unreadCount = notifications.filter(n => n.isUnread).length

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => n.isUnread)
    : notifications

  const groupedNotifications = filteredNotifications.reduce((acc, curr) => {
    if (!acc[curr.group]) acc[curr.group] = []
    acc[curr.group].push(curr)
    return acc
  }, {})

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-700">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-h1 text-foreground mb-2">Notifications</h1>
            <p className="text-body text-muted-foreground">Stay updated on your hiring pipeline</p>
          </div>
          <Button variant="outline" className="text-body font-bold border-border h-10 px-4 gap-2 text-muted-foreground hover:text-foreground">
            <CheckCheck size={18} />
            Mark all as read
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-8">
            {[
              { id: 'all', label: 'All Notifications' },
              { id: 'unread', label: 'Unread', count: unreadCount },
              { id: 'mentions', label: 'Mentions' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-body font-bold transition-all relative ${
                  activeTab === tab.id 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </div>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notification List */}
        <div className="space-y-10">
          {Object.entries(groupedNotifications).map(([group, items]) => (
            <div key={group} className="space-y-4">
              <h2 className="text-h3 text-foreground font-bold">{group}</h2>
              <div className="space-y-3">
                {items.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`group relative bg-card rounded-2xl border border-border shadow-sm p-5 transition-all hover:border-primary/20 ${
                      notification.isUnread ? 'border-l-4 border-l-primary' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`p-3 rounded-xl ${notification.iconBg}`}>
                        <notification.icon className={`size-6 ${notification.iconColor}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-body font-bold text-foreground">
                            {notification.title}
                          </h3>
                          {notification.isUnread && (
                            <div className="size-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-body text-muted-foreground leading-relaxed md:max-w-2xl">
                          {notification.description}
                        </p>
                        <p className="text-label text-muted-foreground pt-1">
                          {notification.time}
                        </p>
                      </div>

                      {/* Action */}
                      <div className="hidden md:block">
                        {notification.actionLabel ? (
                          <Button 
                            variant={
                              notification.actionLabel === 'View Details' ? 'default' : 
                              notification.actionLabel === 'View Feedback' ? 'ghost' : 'outline'
                            }
                            className={`text-label font-bold h-9 px-4 ${
                              notification.actionLabel === 'View Details' 
                                ? 'bg-primary hover:bg-primary-dark text-primary-foreground shadow-sm shadow-primary/20' 
                                : notification.actionLabel === 'View Feedback'
                                  ? 'text-primary hover:text-primary-dark hover:bg-primary/5 gap-1.5'
                                  : 'border-border text-foreground hover:bg-muted'
                            }`}
                          >
                            {notification.actionLabel}
                            {notification.actionIcon && <notification.actionIcon size={14} className="group-hover:translate-x-0.5 transition-transform" />}
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-full">
                            <MoreVertical size={18} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
