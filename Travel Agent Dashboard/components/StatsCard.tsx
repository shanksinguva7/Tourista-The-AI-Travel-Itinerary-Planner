import React from 'react'
import { calculateTrendPercentage } from '../app/lib/utils'
import { clsx as cn } from 'clsx';
const StatsCard = ({
  headerTitle,
  total,
  lastMonthCount,
  currentMonthCount
}: StatsCard) => {
  const{trend, percentage} = calculateTrendPercentage(currentMonthCount, lastMonthCount);

  const isDecrement = trend == 'decrement';

  return (
    <article className="states-card">
      <h3 className="text-base font-medium">
        {headerTitle}
      </h3>

      <div className="content">
        <div className="flex flex-col gap-4">
            <h2 className="text-4xl font-semibold">
              {total}
            </h2>
            <div className="flex items-center gap-2">
              <figure className="flex items">
                <img src= {`/assets/icons/${isDecrement ? 'arrow-down-red.svg' : 'arrow-up-green.svg'}`} className='size-5' alt = 'arrow'/>

                <figcaption className={cn('text-sm font-medium', isDecrement ? 'text-red-500' : 'text-success-700')}>
                  {Math.round(percentage)}%
                </figcaption>
              </figure>
              <p className='text-sm font-medium text-grey-100 truncate'>vs Last Month</p>
            </div>
        </div>
        <img src= {`/assets/icons/${isDecrement ? 'decrement.svg' : 'increment.svg'}`} className='xl:w-32 w-full h-full md:h-32 xll: h-full' alt="trend graph"  />
      </div>
    </article>
  )
}

export default StatsCard


