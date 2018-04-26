import React from 'react'
import { getEmotionName, getEmotionChart, hasMoustache, isBald } from '../Util'
import SBPieChart from './SBPieChart'

const FaceMetaData = props => {
  const limit = 50
  const gstyle = 'upper ' + props.gender
  const { gender, age, faceattributes, files, imageSrc, faceRectangle } = props
  let ag = parseInt(age, 0)
  let finalacc = ''

  const img = new Image()

  if (files[0]) {
    img.src = files[0].preview
  }
  else{
    img.src = imageSrc
  }
//console.log('imageSrc: ',imageSrc);


  const newWidth = faceRectangle.width
  const newHeight = faceRectangle.height

  const startX = faceRectangle.left
  const startY = faceRectangle.top

  function loadCanvas () {
    var canvas = document.createElement('canvas')
    canvas.width = newWidth
    canvas.height = newHeight
    canvas.style.zIndex = 8
    canvas
      .getContext('2d')
      .drawImage(
        img,
        startX,
        startY,
        newWidth,
        newHeight,
        0,
        0,
        newWidth,
        newHeight
      )

    var canvasIamge = canvas.toDataURL('image/png')

    return canvasIamge
  }

  if (faceattributes.accessories.length > 0) {
    let val = []
    for (let i = 0; i < faceattributes.accessories.length; i++) {
      val.push(faceattributes.accessories[i].type)
    }
    finalacc = val.join(', ')
  }
  if (ag > limit) {
    ag = parseInt(ag - 15, 10)
  }

  return (
    <div className='meta'>

      <div className='metabeta'>

        <div>

          <img
            id='thumbnail'
            alt=''
            src={loadCanvas()}
            className='thumbnail'
          />

          <span
            className={getEmotionName(faceattributes.emotion).name + ' score'}
          >

            {getEmotionName(faceattributes.emotion).name}
          </span>
        </div>
        <div>Age: {ag}</div>
        <div>
          Score: <span className={getEmotionName(faceattributes.emotion).score}>
            {getEmotionName(faceattributes.emotion).score}%
          </span>
        </div>

        <div>Gender: <span className={gstyle}>{gender}</span></div>

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
