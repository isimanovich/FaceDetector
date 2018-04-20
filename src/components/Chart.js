import React from 'react'
import { BarChart } from 'react-easy-chart'

const Chart = props => {
const { data, size } = props

  return (
    <div className='chart'>

      {data
        ? <BarChart
            axisLabels={{ x: 'Emotions', y: 'Score' }}
            margin={{ top: 10, right: 0, bottom: 30, left: 25 }}
            fluid
            axes
            colorBars
            grid
            width={size}
            height={size / 2}
            data={data}
          />
        : null}
    </div>
  )
}

export default Chart
