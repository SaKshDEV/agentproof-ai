import React from 'react'

const FeatureCard = ({icon,title,description}) => {
  return (
    <div className='group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.05]'>
        <div className='flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400'>
            {icon}

        </div>
        <h3 className='mt-5 text-lg font-semibold text-white'>
            {title}

        </h3>
        <p className='mt-3 text-sm leading-6 text-slate-400'>
            {description}

        </p>
    </div>
  )
}

export default FeatureCard