// app/(main)/dashboard/create-interview/_components/QuestionsListContainer.jsx

import React from 'react'

function QuestionsListContainer({ questionList }) {
  return (
    <div>
        <h2 className='font-bold text-lg mb-5'>Generated Interview Questions</h2>
          <div className='p-5 border border-gray-300 rounded-xl background-white'>
            {questionList?.map((item, index) => (
              <div key={index} className='p-3 border border-gray-200 rounded-xl mb-3'>
                <h2 className='font-medium'>{item.question}</h2>
                <h2 className='text-sm text-gray-500'>Type: {item?.type}</h2>
              </div>
            ))}
          </div>
    </div>
  )
}

export default QuestionsListContainer