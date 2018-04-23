import React from 'react'
import { getEmotionName, getEmotionChart, hasMoustache, isBald } from '../Util'
import SBPieChart from './SBPieChart'


const FaceMetaData = props => {
  const limit = 60;
  const gstyle = 'upper ' + props.gender;
  const { gender, age, faceattributes } = props;
  let ag = parseInt(age,0);
  let finalacc = '';

  if (faceattributes.accessories.length > 0) {
    let val = []
    for (let i = 0; i < faceattributes.accessories.length; i++) {
      val.push(faceattributes.accessories[i].type)
    }
    finalacc = val.join(', ')
  }
  if (ag > limit) {ag = parseInt(ag - 15,10)}
  return (
    <div className='meta'>

      <div className='metabeta'>
        <div>
          Emotion: <span
            className={getEmotionName(faceattributes.emotion).name + ' score'}
          >
            {getEmotionName(faceattributes.emotion).name}
          </span>
        </div>

        <div>
          Confidence: <span
            className={getEmotionName(faceattributes.emotion).score}
          >
            {getEmotionName(faceattributes.emotion).score}%
          </span>
        </div>

        <div>Gender: <span className={gstyle}>{gender}</span></div>
        <div>Age: {ag}</div>
        {hasMoustache(faceattributes.facialHair)
          ? <div>
              Attr: {hasMoustache(faceattributes.facialHair)}
          </div>
          : null}

        {isBald(faceattributes.hair)
          ? <div>
              Hair: {isBald(faceattributes.hair)}
          </div>
          : null}

        {finalacc
          ? <div>
              Accs: {finalacc}
          </div>
          : null}
      </div>
      <SBPieChart size={100} data={getEmotionChart(faceattributes.emotion)} />
    </div>
  )
}

export default FaceMetaData
