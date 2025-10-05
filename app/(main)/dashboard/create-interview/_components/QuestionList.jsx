//app/(main)/dashboard/create-interview/_components/QuestionList.jsx
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import axios from 'axios';
import {toast} from 'sonner';

function QuestionList( { formData }) {

  const [loading, setLoading] = useState(true);

    useEffect(()=>{
        if(formData){
            //GenerateQuestionList();
        }
    },[formData])

    const GenerateQuestionList= async () => {
      setLoading(true);
      try{
         const result=await axios.post('/api/ai-model',{
           ...formData
      })
      console.log(result.data.content); 
      setLoading(false);

      }catch(e){
          const msg = e.response?.data?.error || "Server is busy, please try again later.";
          toast.error(msg);
          setLoading(false);
      }
    }
  return (
    <div>
      {loading &&
          <div className='p-5 bg-blue-50 rounded-xl border border-gray-100 flex gap-5 items-center'>
           <Loader2  className='animate-spin h-5 w-5 text-blue-500' />
           <div>
                <h2>Generating Interview Questions</h2>
                <p>Our AI is crafting personalized questions bases on your job position</p>
           </div>
      </div>

  }
    </div>
    
  )
}

export default QuestionList