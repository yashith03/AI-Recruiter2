// app/interview/[interview_id]/page.jsx

'use client'
import React, { useEffect, useState, useContext } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { InterviewDataContext } from '@/context/interviewDataContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Clock, 
  Video, 
  User, 
  Mail, 
  CheckCircle2, 
  Mic, 
  Loader2, 
  Sparkles, 
  ArrowRight,
  Wifi,
  Camera
} from 'lucide-react'

function Interview() {
    const { interview_id } = useParams();
    const [interviewData, setInterviewData] = useState();
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const { setInterviewInfo } = useContext(InterviewDataContext);
    const router = useRouter();

    useEffect(() => {
        if (!interview_id) return;

        async function GetInterviewDetails() {
            setLoading(true);
            console.log("Fetching interview details via server:", interview_id);
            try {
                // Call our new server-side API instead of direct Supabase
                const fetchPromise = fetch(`/api/interviews/${interview_id}/details`);

                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error("Server request timed out after 60s")), 60000)
                );

                console.log("Waiting for Server response...");
                const response = await Promise.race([fetchPromise, timeoutPromise]);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to fetch interview details");
                }

                const data = await response.json();
                console.log("Interview data received successfully");

                setInterviewData(data);
                setLoading(false);
            } catch (e) {
                console.error("GetInterviewDetails Catch Global Error:", e);
                setLoading(false);
                const isTimeout = e.message.includes("timeout");
                toast.error(isTimeout 
                    ? "The connection is slow. Please check your internet and try again." 
                    : "Incorrect Interview Link or error fetching details.");
            }
        }

        GetInterviewDetails();
    }, [interview_id]);

    const onJoinInterview = async () => {
        if (!userName || !userEmail) {
            toast("Please enter both your name and email.");
            return;
        }

        if (!interviewData) {
            toast.error("Interview details not loaded yet. Please refresh.");
            return;
        }

        setJoining(true);
        console.log("Joining interview with existing data...");

        setInterviewInfo({
            userName: userName,
            userEmail: userEmail,
            interviewData: interviewData
        });

        router.push('/interview/' + interview_id + '/start');
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="animate-spin h-10 w-10 text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="w-full px-6 py-4 flex items-center justify-between bg-white border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <Image src="/logo.png" alt="logo" width={140} height={50} className="h-10 w-auto object-contain" />
                </div>
                <div className="flex items-center gap-6">
                    <Link href="/candidate-support" className="text-body text-slate-500 hover:text-slate-900 transition-colors">
                        Support
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-6xl bg-white rounded-[32px] shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
                    
                    {/* Left Column: Job Info */}
                    <div className="w-full lg:w-[45%] bg-slate-50 border-r border-slate-100 p-10 flex flex-col relative overflow-hidden group">
                         {/* Abstract background elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

                        <div className="relative z-10 flex-1">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-label mb-8">
                                <Sparkles size={12} />
                                AI-Powered Interview
                            </div>

                            <div className="space-y-4 mb-8">
                                <h1 className="text-h1 text-slate-900">
                                    {interviewData?.jobPosition || "Software Engineer"}
                                </h1>
                             <p className="text-body-lg text-slate-500">
                                   {/* Senior Level • Full-time */}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 mb-12">
                                <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm text-title text-slate-700">
                                    <Clock size={16} className="text-slate-400" />
                                    {interviewData?.duration || "15 Min"}
                                </div>
                                <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm text-title text-slate-700">
                                    <Video size={16} className="text-slate-400" />
                                    {Array.isArray(interviewData?.type) 
                                        ? interviewData.type[0] 
                                        : (interviewData?.type || "Video Call")
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Quote Box */}
                        <div className="relative mt-auto">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-100 via-orange-50 to-transparent opacity-80 rounded-2xl" />
                            <div className="relative z-10 p-8 rounded-2xl border border-orange-100/50">
                                <p className="text-slate-700 font-medium italic text-center leading-relaxed">
                                    &quot;Your skills are what matters most to us.&quot;
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="w-full lg:w-[55%] p-10 lg:p-14 flex flex-col justify-center">
                        <div className="max-w-md mx-auto w-full space-y-8">
                            <div className="space-y-2">
                                <h2 className="text-h2 text-slate-900">Welcome!</h2>
                                <p className="text-body text-slate-500">Please confirm your details to join the session.</p>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-title text-slate-700 ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <Input 
                                            placeholder="e.g. John Doe"
                                            className="pl-11 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary text-body-lg"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-title text-slate-700 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <Input 
                                            placeholder="Enter your email" 
                                            className="pl-11 h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-primary text-body-lg"
                                            value={userEmail}
                                            onChange={(e) => setUserEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                    <span className="text-title text-slate-900">Before you begin</span>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        { icon: Wifi, title: "Stable Internet", desc: "Ensure you have a strong connection." },
                                        { icon: Mic, title: "Test Microphone", desc: "We need to hear you clearly." },
                                        { icon: Camera, title: "Check Camera", desc: "Ensure good lighting and position." },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100 group hover:border-blue-100 transition-colors">
                                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-blue-600 shadow-sm">
                                                <item.icon size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-title text-slate-900">{item.title}</h4>
                                                <p className="text-helper text-slate-500">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button 
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-title h-14 rounded-xl shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all"
                                onClick={onJoinInterview}
                                disabled={joining}
                            >
                                {joining ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Joining...
                                    </>
                                ) : (
                                    <>
                                        Join Interview <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-8 text-center text-body text-slate-400 space-x-6">
                <Link href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
                <span className="text-slate-300">•</span>
                <Link href="#" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
                <span className="text-slate-300">•</span>
                <Link href="#" className="hover:text-slate-600 transition-colors">Technical Help</Link>
            </footer>
        </div>
    )
}

export default Interview
