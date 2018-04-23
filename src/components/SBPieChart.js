import React from 'react'
import { PieChart } from 'react-easy-chart'
import { getPieData } from '../Util'
const SBPieChart = props => {
  const { data, size } = props

  return (
    <div className='chart'>

      {data
        ? <PieChart size={size} innerHoleSize={0} data={getPieData(data)} />
        : null}

    </div>
  )
}

export default SBPieChart
