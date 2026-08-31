import React from 'react'

const MetricCard = ({title, value, change}) => {
  return (
    <div className='rounded-xl border border-white/10 bg-white/5 p-5'>
        <p className='text-sm text-slate-400'>
            {title}

        </p>

        <div className='mt-3 flex items-end justify-between'>
            <h3 className='text-2xl font-bold text-white'>
                {value}
            
            </h3>
            <span className='text-sm font-medium text-emerald-400'>
                {change}

            </span>
        </div>
    </div>
  )
}

export default MetricCard