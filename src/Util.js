const emotions = [
  'anger',
  'contempt',
  'disgust',
  'fear',
  'happiness',
  'neutral',
  'sadness',
  'surprise'
]

export const isBald = face => {
  let confidencelevel = face['bald']
  let val = ''
  if (confidencelevel > 0.4) {
    val = 'bald'
  }
  return val
}

export const hasMoustache = face => {
  let confidencelevel = face['moustache']
  let val = ''
  if (confidencelevel > 0.4) {
    val = 'moustache'
  }
  return val
}

export const getEmotionChart = emotion => {
  let chart = []
  for (let i = 0; i < emotions.length; i++) {
    chart.push({ x: emotions[i], y: parseInt(emotion[emotions[i]] * 100, 0) })
  }

  return chart
}

export const getPieData = data => {
  let pieData = []
  for (let i = 0; i < data.length; i++) {
    pieData.push({ key: data[i].x, value: parseInt(data[i].y * 100, 10) })
  }

  return pieData
}

export const getScatterPlotData = data => {
  let pieData = []
  for (let i = 0; i < data.length; i++) {
    pieData.push({
      type: data[i].faceAttributes.gender,
      y: parseInt(data[i].faceAttributes.age,0),
      x: parseInt(i, 0)
    })
  }
  
  return pieData
}

export const getEmotionChartSummary = (metadata, gender) => {
  let chart = []
  let mood = null

  for (let i = 0; i < emotions.length; i++) {
    mood = metadata.map(function (el) {
      if (gender) {
        if (el.faceAttributes.gender === gender) {
          return el.faceAttributes.emotion[emotions[i]]
        } else {
          return null
        }
      } else {
        return el.faceAttributes.emotion[emotions[i]]
      }
    })

    var sum = mood.reduce((a, b) => a + b, 0)
    chart.push({ x: emotions[i], y: sum * 4 })
  }
  return chart
}

export const getEmotionName = emotion => {
  let confidencelevel = 0
  let faceemotion = ''
  for (let i = 0; i < emotions.length; i++) {
    if (emotion[emotions[i]] > confidencelevel) {
      confidencelevel = emotion[emotions[i]]
      faceemotion = emotions[i]
    }
  }
  let mood = { name: faceemotion, score: parseInt(confidencelevel * 100, 10) }

  return mood
}

export const makeblob = function (dataURL) {
  var BASE64_MARKER = ';base64,'
  var parts, raw, contentType = null


  if (dataURL.indexOf(BASE64_MARKER) === -1) {
    parts = dataURL.split(',')
    contentType = parts[0].split(':')[1]
    raw = decodeURIComponent(parts[1])
    return new Blob([raw], { type: contentType })
  }
  parts = dataURL.split(BASE64_MARKER)
  contentType = parts[0].split(':')[1]
  raw = window.atob(parts[1])
  var rawLength = raw.length
  var uInt8Array = new Uint8Array(rawLength)

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }
  return new Blob([uInt8Array], { type: contentType })
}
