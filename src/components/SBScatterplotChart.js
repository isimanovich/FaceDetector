import React from 'react'
import { ScatterplotChart } from 'react-easy-chart'

const SBScatterplotChart = props => {
  const { data, width, height } = props

  const config = [
    {
      type: 'female',
      color: '#FF226B'
      
    },
    {
      type: 'male',
      color: '#0079D4'
    }
  ];

  return (
    <div className='chart meta'>
      <span>Ages</span>
      {data
        ? <ScatterplotChart
        
        Fluid
          margin={{top: 10, right: 0, bottom: 0, left: 30}}
          data={data}
          axes
          config={config}
          dotRadius={4}
          width={width}
          height={height}         
          grid
          />
        : null}

    </div>
  )
}

export default SBScatterplotChart
