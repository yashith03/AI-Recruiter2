// app/(main)/dashboard/create-interview/_components/QuestionsListContainer.jsx

import React from 'react'

function QuestionsListContainer({ questionList }) {
  return (
    <div className="space-y-6">
        <h2 className='text-h3 text-slate-900'>Generated Interview Questions</h2>
          <div className='p-6 border border-slate-100 rounded-2xl bg-white shadow-sm'>
            {questionList?.map((item, index) => (
              <div key={index} className='p-4 border border-slate-50 rounded-xl mb-4 bg-slate-50/30 last:mb-0'>
                <h2 className='text-body font-semibold text-slate-800 mb-1 leading-relaxed'>{item.question}</h2>
                <h2 className='text-label text-slate-400 font-bold uppercase tracking-wider'>Type: {item?.type || 'Standard'}</h2>
              </div>
            ))}
          </div>
    </div>
  )
}

export default QuestionsListContainer