import React, { useState } from 'react'
import Markdown from 'react-markdown'

const CreationsItems = ({ item }) => {

  const [expanded, setExpanded] =  useState(false)

  return (
    <div onClick={() => setExpanded (!expanded)} className='p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-md transition hover:shadow-purple-400/30 cursor-pointer'>
      <div className='flex justify-between items-center gap-4'>

        <div className='text-white'>
          <h2 className='font-medium text-base mb-1'>{item.prompt}</h2>
          <p className='text-sm text-white/70'>
            {item.type} • {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>

        <button className='px-4 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow hover:shadow-lg transition'>
          {item.type}
        </button>
      </div>
      {
        expanded && (
          <div>
            {item.type==='image' ? (
              <div>
                <img src = {item.content} alt="image" className='mt-3 w-full max-w-md'/>
              </div>
            ): (
              <div className='mt-3 h-full overflow--y-auto text-sm text-black '>
                <div className='reset-tw'>
                  <Markdown>{item.content}</Markdown>
                </div>
              </div>
            )}
          </div>
        )
      }
    </div>
  )
}

export default CreationsItems
