// app/(main)/dashboard/create-interview/[interview_id]/details/page.jsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  FileText, 
  Clock, 
  HelpCircle,
  Plus,
  GripVertical,
  Check,
  ChevronLeft,
  Trash2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/services/supabaseClient";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function InterviewDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const interviewId = params.interview_id;

  // Real State for Form Fields
  const [formData, setFormData] = useState({
    interviewName: "",
    jobRole: "",
    jobDescription: "",
    interviewType: "",
    duration: "",
  });

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New state for Edit Mode

  const GetInterviewDetails = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('interview_id', interviewId)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          interviewName: data.jobPosition || "",
          jobRole: data.jobPosition || "",
          jobDescription: data.jobDescription || "",
          interviewType: data.type || "Technical",
          duration: data.duration || "30m",
        });

        // Parse questions from questionList
        try {
          // Check if it's already an array or a string
          const rawQuestions = data.questionList;
          const parsedQuestions = typeof rawQuestions === 'string' 
            ? JSON.parse(rawQuestions) 
            : (rawQuestions || []);
          setQuestions(parsedQuestions);
        } catch (e) {
          console.error("Error parsing questions:", e);
          setQuestions([]);
        }
      }
    } catch (err) {
      console.error("Error fetching interview details:", err.message);
      toast.error("Failed to load interview details");
    } finally {
      setLoading(false);
    }
  }, [interviewId]);

  useEffect(() => {
    if (interviewId) {
      GetInterviewDetails();
    }
  }, [interviewId, GetInterviewDetails]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from("interviews")
        .update({
          jobPosition: formData.jobRole,
          jobDescription: formData.jobDescription,
          type: formData.interviewType,
          duration: formData.duration,
          questionList: questions,
        })
        .eq("interview_id", interviewId);

      if (error) throw error;

      setIsSuccessOpen(true);
      setIsEditing(false); // Turn off edit mode after saving
    } catch (err) {
      console.error("Error saving changes:", err.message);
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setIsEditing(false);
    GetInterviewDetails(); // Reset to original data
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(prev => prev.map((q, idx) => {
      // Use idx as fallback id if q.id is missing
      const match = q.id === id || idx + 1 === id;
      return match ? { ...q, [field]: value } : q;
    }));
  };

  const addQuestion = () => {
    const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    setQuestions([...questions, { id: newId, title: "New Question", text: "" }]);
  };

  const deleteQuestion = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-body">
      {/* Top Navigation */}
      <div className="px-6 py-4 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Edit Interview</h1>
            <p className="text-slate-500">Modify the settings and questions for the {formData.jobRole} interview.</p>
          </div>
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 px-8"
              >
                Edit
              </Button>
            ) : (
              <>
                <Button 
                    variant="outline" 
                    onClick={handleDiscard}
                    className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                >
                  Discard
                </Button>
                <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="bg-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          
          {/* 1. General Information */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">General Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Interview Name / Role</label>
                <Input 
                  value={formData.jobRole} 
                  disabled={!isEditing}
                  onChange={(e) => setFormData({...formData, jobRole: e.target.value})}
                  className="bg-slate-50/50 border-slate-200 focus:bg-white transition-all disabled:opacity-75 disabled:cursor-not-allowed" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Interview Types (Multi-select)</label>
                <div className="flex flex-wrap gap-2">
                  {["Technical", "Behavioral", "Experience", "Problem Solving", "Leadership"].map((type) => {
                    // Check if current type is in the interviewType string/array
                    const isSelected = formData.interviewType?.split(', ').includes(type);
                    
                    return (
                      <button
                        key={type}
                        type="button"
                        disabled={!isEditing}
                        onClick={() => {
                          let currentTypes = formData.interviewType?.split(', ').filter(Boolean) || [];
                          if (currentTypes.includes(type)) {
                            currentTypes = currentTypes.filter(t => t !== type);
                          } else {
                            currentTypes.push(type);
                          }
                          setFormData({...formData, interviewType: currentTypes.join(', ')});
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-bold border transition-all",
                          isSelected 
                            ? "bg-primary text-white border-primary shadow-sm" 
                            : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                          !isEditing && "cursor-default opacity-85"
                        )}
                      >
                        {type}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Job Description</label>
              <Textarea 
                value={formData.jobDescription} 
                disabled={!isEditing}
                onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
                className="min-h-[120px] bg-slate-50/50 border-slate-200 focus:bg-white transition-all resize-y disabled:opacity-75 disabled:cursor-not-allowed" 
              />
            </div>
          </section>

          {/* 2. Call Settings */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Call Settings</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Call Duration</label>
                <div className="grid grid-cols-4 gap-2 bg-slate-100/50 p-1 rounded-xl border border-slate-200 max-w-md">
                  {["15m", "30m", "45m", "60m"].map((dur) => (
                    <button
                      key={dur}
                      disabled={!isEditing}
                      onClick={() => setFormData({...formData, duration: dur})}
                      className={`text-sm font-medium py-2 rounded-lg transition-all ${
                        // Normalize duration comparison (e.g. 30 matches 30m)
                        formData.duration?.toString().replace('m', '') === dur.replace('m', '')
                          ? "bg-white text-primary shadow-sm ring-1 ring-slate-200" 
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                      } ${!isEditing && "cursor-default"}`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

           {/* 5. Interview Questions */}
           <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <HelpCircle className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Interview Questions</h2>
              </div>
              <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-wide">
                {questions.length} Questions
              </span>
            </div>

            <div className="space-y-4 mb-6">
              {questions.map((q, idx) => (
                <div key={idx} className="group relative flex gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-200 transition-all shadow-sm hover:shadow-md">
                  <div className="mt-1 text-slate-300">
                    <GripVertical size={20} />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                       <Input 
                        value={q.type || q.title || `Question ${idx + 1}`} 
                        disabled={!isEditing}
                        onChange={(e) => updateQuestion(q.id || idx + 1, 'type', e.target.value)}
                        className="font-bold text-slate-900 text-sm h-8 border-transparent focus:border-slate-200 bg-transparent focus:bg-slate-50 max-w-xs disabled:opacity-100 disabled:cursor-default"
                       />
                    </div>
                    <Textarea 
                       value={q.question || q.text || ""} 
                       disabled={!isEditing}
                       onChange={(e) => updateQuestion(q.id || idx + 1, 'question', e.target.value)}
                       className="text-slate-600 text-sm leading-relaxed min-h-[80px] border-slate-100 focus:border-slate-300 resize-none disabled:bg-transparent disabled:border-transparent disabled:p-0 disabled:opacity-85 disabled:cursor-default w-full"
                    />
                  </div>
                  {isEditing && (
                    <button 
                      onClick={() => deleteQuestion(q.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 h-fit"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <Button 
                variant="outline" 
                onClick={() => {
                  if (!isEditing) setIsEditing(true);
                  addQuestion();
                }}
                className="w-full border-dashed border-2 border-slate-200 bg-slate-50/50 text-primary hover:bg-blue-50 hover:border-blue-200 h-12 rounded-xl font-medium"
            >
              <Plus className="mr-2 w-4 h-4" /> Add Custom Question
            </Button>
          </section>

        </div>
      </div>
      
      {/* Success Modal */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="sm:max-w-md p-8 flex flex-col items-center text-center gap-4 rounded-2xl">
          <DialogHeader className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-2">
              <Check className="w-8 h-8 text-green-500" strokeWidth={3} />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">Changes saved successfully!</DialogTitle>
            <DialogDescription className="text-slate-500 text-sm">
              Your interview settings have been updated.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full">
            <Button 
              onClick={() => {
                  setIsSuccessOpen(false);
                  router.push('/schedule-interview');
              }} 
              className="w-full bg-primary hover:bg-blue-600 font-semibold h-11 text-base rounded-lg"
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
