import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import $ from 'jquery'
import FaceMetaData from './FaceMetaData'
import { makeblob } from '../Util'
import { RingLoader } from 'react-spinners'
import { Container, Row, Col } from 'react-grid-system'
import Chart from './Chart'
import SBPieChart from './SBPieChart'
import SBScatterplotChart from './SBScatterplotChart'
import { getEmotionChartSummary, getPieData, getScatterPlotData } from '../Util'
import Footer from './footer'
import { resource } from './resource'
import Webcam from 'react-webcam'
import Hero from './Hero'
import api from '../api'
import { Legend } from 'react-easy-chart'
import FaBeer from 'react-icons/lib/fa/camera';


var _ = require('lodash')

class Face extends Component {
  constructor () {
    super()
    this.state = {
      files: [],
      metadata: [],
      preview: '',
      happiness: 0,
      loading: false,
      showintro: true,
      showhistory: false,
      reject: false,
      caption: '',
      heroes: [],
      creatingHero: false,
      selectedHeroName: '',
      showCamera: false,
      imageSrc:''
     
    }
  }

  handleSelect = hero => {
    this.setState({ selectedHero: hero })
  }

  handleDelete = (event, hero) => {
    event.stopPropagation()
    api.destroy(hero).then(() => {
      let heroes = this.state.heroes
      heroes = heroes.filter(h => h !== hero)
      this.setState({ heroes: heroes })
      if (this.selectedHero === hero) {
        this.setState({ selectedHero: null })
      }
    })
  }

  handleEnableAddMode = () => {
    this.setState({
      addingHero: true,
      selectedHero: { id: '', name: '', saying: '', emotion: null }
    })
  }

  handleCancel = () => {
    this.setState({ addingHero: false, selectedHero: null })
  }

  
  handleOnChange = event => {
    let selectedHero = this.state.selectedHero
    selectedHero[event.target.name] = event.target.value
    this.setState({ selectedHero: selectedHero })
  }

  getTotal = (data, name) => {
    _.find(data, function (obj) {
      return obj.anger === name
    })
  }

  goHome = () => {
    
    this.setState({
      showintro: true,
      files: [],
      metadata: [],
      loading: false,
      imageSrc: '',
      showCamera: false,
      reject: false
    })
  }

  resetWebcam = () => {
    this.setState({
      showCamera: true,
      imageSrc: '',
      files:[]
    })
  }

  onDragEnter () {
    this.setState({
      dropzoneActive: true
    })
  }

  onDragLeave () {
    this.setState({
      dropzoneActive: false
    })
  }

  onDrop (files) {
    this.setState({
      files,
      dropzoneActive: false,
      loading: true,
      metadata: [],
      showintro: false,
      reject: false,
      showCamera: false,
      imageSrc: ''
    })

    const promise = new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.readAsDataURL(files[0])
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result)
        } else {
          reject(Error('Failed converting to base64'))
        }
      }
    })
    promise.then(
      result => {
        this.getFaceDetection(result)
      },
      err => {
        console.log(err)
      }
    )
  }
 

  getFaceDetection = preview => {

    this.setState({metadata: [],imageSrc:''});

console.log('preview',preview);

    const uriBase = resource.URI_BASE + 'face/v1.0/detect'
    const params = {
      returnFaceId: 'true',
      returnFaceLandmarks: 'false',
      returnFaceAttributes: resource.FACE_ATTRIBUTES
    }
    let contentType = 'application/octet-stream'

    $.ajax({
      url: uriBase + '?' + $.param(params),
      processData: false,
      beforeSend: function (xhrObj) {
        xhrObj.setRequestHeader('Content-Type', contentType)
        xhrObj.setRequestHeader('Ocp-Apim-Subscription-Key', resource.FACE_KEY)
      },
      type: 'POST',
      data: makeblob(preview)
    })
      .done(data => {
        this.setState({ metadata: data, loading: false })
       
        if (this.state.metadata.length === 0) {
          this.setState({ reject: true })
        }
        // console.clear()
        // console.log('JSON data: ', JSON.stringify(this.state.metadata, null, 2))
      })
      .fail(function (jqXHR, textStatus, errorThrown) {})
  }

  getBackgroundStyle (value) {
    return { backgroundImage: 'url(' + value.url + ')' }
  }

  getMales = metadata => {
    let males = []

    for (let i = 0; i < metadata.length; i++) {
      if (metadata[i].faceAttributes.gender === 'male') {
        males.push({ val: metadata[i].faceAttributes.gender })
      }
    }
    return males
  }

  applyMimeTypes (event) {
    this.setState({
      accept: event.target.value
    })
  }

  setRef = webcam => {
    this.webcam = webcam
  }

  capture = () => {
    const imageSrc = this.webcam.getScreenshot()

    this.getFaceDetection(imageSrc)
    this.setState({
      loading: true,
      metadata: [],
      showintro: false,
      reject: false,
      imageSrc: imageSrc,
      showCamera: false,
      files:[]
      
    })
  }

  render () {
    const {
      accept,
      showhistory,
      dropzoneActive,
      metadata,
      showintro,
      reject,
      loading,
      files,
      imageSrc,
      showCamera
    } = this.state

    const overlayStyle = {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      padding: '2.5em 0',
      background: 'rgba(0,0,0,0.2)',
      textAlign: 'center',
      color: '#fff'
    }

    let males = this.getMales(metadata).length
    let females = metadata.length - males
    const scatterStyle = {
      '.legend': {
        backgroundColor: '#f9f9f9',
        border: '1px solid #e5e5e5',
        borderRadius: '12px',
        fontSize: '0.8em',
        padding: '12px',
        marginBottom: '10px',
        marginTop: '10px'
      }
    }

    const reactIconOn  = {
      color: 'tomato',
      fontSize: '1.5em'
      }
    
    
      const reactIconOff  = {
        color: '#097142',
        fontSize: '1.5em'
        
        }
        
      return (
      <div>

        <Container className='main-container' fluid>
          <Row>
          <Col xs={2} className='container'>
          <img alt="siren" onClick={this.goHome} className="siren" src={require('../images/siren.png')} />
          </Col>

            <Col xs={10} className='container'>
              <h1 className="title" >
                
                Cloud Learning Journey

              </h1>
              <h3 className='subtitle'>
                <b>FRED</b> - the ultimate media analytics tool
              </h3>

            </Col>

         

          </Row>
        </Container>

        <div className='header-bar' />

        <Container
          className='main-container'
          fluid
          style={{ lineHeight: '32px' }}
        >
          <Row>

            <Col xs={5} className='container'>
              <div className='dropzone'>
              
                {showCamera
                  ? 
                  <FaBeer style={reactIconOn} onClick={this.capture} />
                  
                  : 
                  <FaBeer style={reactIconOff} onClick={this.resetWebcam} />
                  }

                <Dropzone
                  className='photo'
                  accept={accept}
                  onDrop={this.onDrop.bind(this)}
                  onDragEnter={this.onDragEnter.bind(this)}
                  onDragLeave={this.onDragLeave.bind(this)}
                >

                  {dropzoneActive && <div style={overlayStyle} />}
                  <div className='photo'>
                

                    {showCamera
                      ? <div>

                        <Webcam
                          height={350}
                          ref={this.setRef}
                          screenshotFormat='image/jpeg'
                          width={400}
                          />
                      </div>
                      : showintro
                          ? <img
                            alt=''
                            id='preview1'
                            className='preview'
                            src={require('../images/faceintro2.png')}
                            />
                          : null}

                    {!showCamera
                      ? <img
                        alt=''
                        id='preview2'
                        className='preview'
                        src={imageSrc}
                        />
                      : null}

                    {files.map(f => (
                      <img
                        id='preview3'
                        alt={f.name}
                        className='preview'
                        src={imageSrc || f.preview}
                        key={f.name}
                      />
                    ))}

                  </div>

                </Dropzone>

              </div>

              {showintro
                ? <span>

                  <h3 className='subtitle'>
                      Drag and drop photos to analyze
                    </h3>
                 
                </span>
                : null}

            </Col>
            <Col xs={7}>

              {reject
                ? <div className='error'>
                    Unable to process: low image resolution quality or no faces found.
                  </div>
                : null}

              {showintro
                ? <span>
                  
                  
                  <div>
                      The Microsoft Cognitive Services APIs allow developers to embed AI
                      
                      in their applications to enable those apps to see, speak, understand,
                     
                      and interpret the needs of users.
                    </div>

                  <div className='blurb'>

                    <span>
                      <img
                        alt='Vision'
                        className='apimap'
                        src={require('../images/vision.png')}
                        />
                    </span>
                  </div>

                  <p>
                      The Face API takes an image as an input,
                      and returns JSON data with confidence scores across a set of facial
                      
                      attributes for each face in the image.
                    </p>

                  <p>
                      These attributes and emotions are understood to be cross-culturally
                      and universally communicated with particular facial expressions as well as gender and approximate age.
                    </p>

                </span>
                : null}

              <div className='meta-data'>

                <RingLoader
                  className='ring-loader'
                  color={'#123abc'}
                  loading={loading}
                />

                {!loading && !showintro && !reject
                  ? <div>

                    <span className='meta right'>
                        Summary: total {metadata.length}
                    </span>
                    <div>
                      <Chart
                        size={500}
                        data={getEmotionChartSummary(metadata)}
                        />
                    </div>

                  </div>
                  : null}

                <div />
              </div>

            </Col>
          </Row>

          <Row>
            <Col>

              {showhistory
                ? <div>
                  <ul className='heroes'>

                    {this.state.heroes.map(hero => {
                      return (
                        <Hero
                          key={hero.id}
                          hero={hero}
                          onSelect={this.handleSelect}
                          onDelete={this.handleDelete}
                          selectedHero={this.state.selectedHero}
                          />
                      )
                    })}
                  </ul>
                </div>
                : null}

              <div>

                {metadata.length > 1
                  ? <span>
                    <Row>
                      
                  
                      <div className='label'>Profile Analysys</div>
                    </Row>
                    <SBScatterplotChart
                      width={150}
                      height={200}
                      data={getScatterPlotData(metadata)}
                      />
                  </span>
                  : null}

                <span className='gender'>
                  {males
                    ? <span className='piechart male meta'>
                        Male {males}
                      <SBPieChart
                        size={150}
                        data={getEmotionChartSummary(metadata, 'male')}
                        />
                    </span>
                    : null}
                  {females
                    ? <span className='piechart female meta'>
                        Female {females}
                      <SBPieChart
                        size={150}
                        data={getEmotionChartSummary(metadata, 'female')}
                        />
                    </span>
                    : null}

                </span>

              </div>

            </Col>

          </Row>
          {metadata.length
            ? <Row>
              <Col>
                <Row>
                  <Legend
                    styles={scatterStyle}
                    horizontal
                    data={getPieData(getEmotionChartSummary(metadata))}
                    dataId={'key'}
                    />

                </Row>
                <Row>
                  <div className='label'>Facial Profile(s)</div>
                </Row>
                <Row>

                  {metadata.map((f, i) => (
                    <FaceMetaData
                      key={f.faceId}
                      gender={f.faceAttributes.gender}
                      age={f.faceAttributes.age}
                      faceattributes={f.faceAttributes}
                      count={metadata.length}
                      metadata={this.state.metadata}
                      />
                    ))}

                </Row>

              </Col>
            </Row>
            : null}

        </Container>

        <Footer />

      </div>
    )
  }
}

export default Face
