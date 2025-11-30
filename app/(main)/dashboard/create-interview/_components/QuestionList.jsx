// app/(main)/dashboard/create-interview/_components/QuestionList.jsx

import React, { useEffect, useState } from 'react'
import { Loader, Loader2 } from 'lucide-react'
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button'
import QuestionsListContainer from './QuestionsListContainer';
import { userAgent } from 'next/server';
import { useUser } from '@/app/provider';
import {v4 as uuidv4} from 'uuid';
import { supabase } from '@/services/supabaseClient';


function QuestionList({ formData ,onCreateLink}) {
  const [loading, setLoading] = useState(true);
  const [questionList, setQuestionList] = useState([]);
  const {user} = useUser();
    const [saving, setSaving] = useState(false);
    

  // Move this function OUTSIDE onFinish so useEffect can call it
  const GenerateQuestionList = async () => {
    setLoading(true);
    try {
      const result = await axios.post('/api/ai-model', {
        ...formData
      });

      const payload = result.data;
      console.log('AI API payload:', payload);

      if (payload?.result && typeof payload.result === 'object') {
        setQuestionList(payload.result.interviewQuestions || []);
      } else if (payload?.content && typeof payload.content === 'string') {
        const Content = payload.content;
        const cleaned = Content.replace(/"?```json\s*/i, '').replace(/```/g, '');
        try {
          setQuestionList(JSON.parse(cleaned)?.interviewQuestions || []);
        } catch (err) {
          console.warn('Failed to parse AI content string', err);
          setQuestionList([]);
        }
      } else {
        console.warn('Unexpected AI payload shape', payload);
        setQuestionList([]);
      }

      setLoading(false);
    } catch (e) {
      const msg = e.response?.data?.error || "Server is busy, please try again later.";
      toast.error(msg);
      setLoading(false);
    }
  };

  // useEffect calling the function correctly
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      GenerateQuestionList();
    }
  }, [formData]);

  const onFinish = async () => {
      console.log('🔵 onFinish called');
      console.log('User:', user);
      console.log('FormData:', formData);
      console.log('QuestionList:', questionList);

      if (!user?.email) {
        toast.error('User not logged in. Please sign in first.');
        return;
      }

      setSaving(true);
    const interview_id = uuidv4();

    const { data, error } = await supabase
        .from('interviews')
        .insert([
          {
            jobPosition: formData.jobPosition,
            jobDescription: formData.jobDescription,
            duration: formData.duration,
            type: Array.isArray(formData.type) ? formData.type.join(', ') : formData.type,
            questionList: questionList,
            userEmail: user?.email,
            interview_id: interview_id
          }
        ])
        .select();

    setSaving(false);
    onCreateLink(interview_id);

    if (error) {
      console.error('Error saving interview:', error);
      toast.error('Failed to save interview: ' + error.message);
      return;
    }

    console.log('✅ Interview saved:', data);
    toast.success('Interview created successfully!');
  };

  return (
    <div>
      {loading && (
        <div className='p-5 bg-blue-50 rounded-xl border border-primary flex gap-5 items-center'>
          <Loader2 className='animate-spin h-5 w-5 text-blue-500' />
          <div>
            <h2 className='font-medium'>Generating Interview Questions</h2>
            <p className='text-primary'>Our AI is crafting personalized questions based on your job position</p>
          </div>
        </div>
      )}

      {!loading && questionList.length > 0 && (
        <div>
         <QuestionsListContainer questionList={questionList} />
        </div>
      )}

      {!loading && questionList.length === 0 && (
        <div className='p-5'>
          <p className='text-sm text-muted-foreground'>
            No questions generated. Try adjusting the job description or retrying.
          </p>
        </div>
      )}

      <div className='flex justify-end mt-10'>
        <Button onClick={() => onFinish()} disabled={saving}>
          {saving&& <Loader className='animate-spin h-4 w-4 mr-2' />}
          Create Interview Link & Finish</Button>

      </div>
    </div>
  );
}

export default QuestionList;

