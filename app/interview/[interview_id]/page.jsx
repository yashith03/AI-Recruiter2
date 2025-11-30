//app/interview/[interview_id]/page.jsx
'use client'
import { Clock, Loader2 } from 'lucide-react'
import React from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Video } from 'lucide-react'
import { useParams } from 'next/navigation'
import { supabase } from '@/services/supabaseClient'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useContext } from 'react'
import { InterviewDataContext } from '@/context/interviewDataContext'
import QuestionList from '@/app/(main)/dashboard/create-interview/_components/QuestionList'
import { useRouter } from 'next/navigation'




function Interview() {

    const {interview_id} = useParams();
    console.log(interview_id);
    const [interviewData, setInterviewData] = useState();
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(false);
    const {interviewInfo,setInterviewInfo} = useContext(InterviewDataContext);
    const router=useRouter();
    

    useEffect(()=>{
        interview_id && GetInterviewDetails();
    },[interview_id]);

    const GetInterviewDetails= async()=>{
        setLoading(true);

        try{
        let { data: interviews, error } = await supabase
            .from('Interviews')
            .select("jobPosition, jobDescription, duration, type")
            .eq('interview_id', interview_id)
        setInterviewData(interviews[0]); 
         setLoading(false);
        if (interviews?.length === 0) 
        {
            toast('Incorrect Interview Link');
            return;
        }
        }     
        catch(e)
        {
            setLoading(false);
            toast('Incorrect Interview Link');
        } 
    }
    const onJoinInterview = async()=>{

        setLoading(true);

        let {data : Interviews,error }= await supabase
            .from('Interviews')
            .select('*')
            .eq('interview_id',interview_id);

            console.log(Interviews[0]);
            setInterviewInfo({
                userName: userName,
                interviewData: Interviews[0]
            });
            router.push('/interview/'+interview_id+'/start');
            setLoading(false);
    }

  return (
    <div className='px-10 md:px-28 lg:px-48 xl:px-80 mt-7   '>
        <div className='flex flex-col items-center jsutify-center border rounded-lg bg-white 
        p-7 lg:px-33 px-52 mb-20'>
            <Image src={'/logo.png'} alt="logo" width={200} height={100}
            className='w-[140px]'
            />
            <h2 className='mt-3'>AI-Powered Interview Platform</h2>

            <Image src={'/interview.png'} alt='interview'
             width={500} 
             height={500}
             className= 'w-[280px] my-6'
             />

             <h2 className='font-bold text-xl '>{interviewData?.jobPosition}</h2>
             <h2 className='flex gap-2 items-center text-gray-500 mt-3 '>
                <Clock className='h-4 w-4'/>{interviewData?.duration}</h2>

            <div className='w-full'>
                <h2>Enter your full name</h2>
                 <Input
                     placeholder='e.g. John Doe'
                     onChange={(event) => setUserName(event.target.value)}
                />
            </div>

             <div>
                <h2>Before you begin</h2>
                <ul>
                    <li>Ensure your caera and microphone are working</li>
                    <li>Ensure you have a stable Internet Connection</li>
                    <li>Find a Quiet place for the Interview</li>
                </ul>
             </div>

             <Button className={'mt-5 w-full font-bold'}
                disabled={loading || !userName}
                onClick= {() => onJoinInterview()}
             >
                     <Video/>{loading && <Loader2 className="ml-2 animate-spin"/>}Join Interview</Button>
        </div>
    </div>
  )
}

export default Interview
