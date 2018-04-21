import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import $ from 'jquery'
import FaceMetaData from './FaceMetaData'
import { makeblob } from '../Util'
import { RingLoader } from 'react-spinners'
import { Container, Row, Col } from 'react-grid-system'
import Chart from './Chart'
import SBPieChart from './SBPieChart'
import { getEmotionChartSummary,getPieData } from '../Util'
import Footer from './footer'
import {resource} from "./resource";
import Webcam from 'react-webcam';
import Heading from "@starbucks/pattern-library/lib/components/heading";
import Logo from "@starbucks/pattern-library/lib/components/logo";
import Button from "@starbucks/pattern-library/lib/components/button";
import Rule from "@starbucks/pattern-library/lib/components/rule";
import Hero from './Hero';
import api from '../api';
import { Legend } from 'react-easy-chart'

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
      showhistory:false,
      reject: false,
      caption:'',
      heroes: [],
      creatingHero: false,
      selectedHeroName:'',
      showCamera:true,
   }
  }

  handleSelect=(hero)=> {
    this.setState({ selectedHero: hero });
  }

  handleDelete=(event, hero) =>{
    event.stopPropagation();
    api.destroy(hero).then(() => {
      let heroes = this.state.heroes;
      heroes = heroes.filter(h => h !== hero);
      this.setState({ heroes: heroes });
      if (this.selectedHero === hero) {
        this.setState({ selectedHero: null });
      }
    });
  }

  handleEnableAddMode=()=> {
    this.setState({
      addingHero: true,
      selectedHero: { id: '', name: '', saying: '',emotion:null }
    });
  }

  handleCancel=()=> {
    this.setState({ addingHero: false, selectedHero: null });
  }

  handleSave = () => {
    let heroes = this.state.heroes;
    
    if (!this.state.addingHero) {
      api
        .create(this.state.selectedHero)
        .then(result => {
          heroes.push(this.state.selectedHero);
          this.setState({
            heroes: heroes,
            selectedHero: null,
            addingHero: false,
            showhistory: true
          });
          console.log('Successfully created!' );
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      api
        .update(this.state.selectedHero)
        .then(() => {
          this.setState({ selectedHero: null });
        })
        .catch(err => {});
    }
  }

  handleOnChange=(event) => {
     let selectedHero = this.state.selectedHero;
    selectedHero[event.target.name] = event.target.value;
    this.setState({ selectedHero: selectedHero });
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
      imageSrc:'',
      showCamera: true,
      reject:false
    })
  }

  resetWebcam = ()=>{
    this.setState({
      showCamera: true,
      imageSrc:''
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
      showCamera:false,
      imageSrc:''
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

  getFaceDetection = (preview) => {
      const uriBase = resource.URI_BASE+'face/v1.0/detect';
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
        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", resource.FACE_KEY)
      },
      type: 'POST',
   
      data: makeblob(preview)
    })
      .done(data => {
        this.setState({ metadata: data,loading: false })
       
        if (this.state.metadata.length === 0) {
          this.setState({ reject: true })
        }
        // console.clear()
        console.log('JSON data: ', JSON.stringify(this.state.metadata, null, 2))
      })
      .fail(function (jqXHR, textStatus, errorThrown) {})
  }

  
  getBackgroundStyle (value) {
    return { backgroundImage: 'url(' + value.url + ')' }
  }

  getMales=(metadata)=>{
    let males=[];

    for (let i = 0; i < metadata.length; i++) {
      if(metadata[i].faceAttributes.gender==='male'){
        males.push({val: metadata[i].faceAttributes.gender })
      }
    }
    return males;
  }

  applyMimeTypes (event) {
    this.setState({
      accept: event.target.value
    })
  }

  setRef = (webcam) => {
    this.webcam = webcam;
  }
 
  capture = () => {
    const imageSrc = this.webcam.getScreenshot();

    this.getFaceDetection (imageSrc)
    this.setState({
      loading: true,
      metadata: [],
      showintro: false,
      reject: false,
      imageSrc:imageSrc,
      showCamera:false
    })
  };

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

    let males = this.getMales(metadata).length;
    let females =  metadata.length - males ;
    const scatterStyle = {
      '.legend': {
        backgroundColor: '#f9f9f9',
        border: '1px solid #e5e5e5',
        borderRadius: '12px',
        fontSize: '0.8em',
        padding: '12px',
        marginBottom:'10px',
        marginTop:'10px'
      }
    };
    return (
      <div>

 <Container className='main-container' fluid>
          <Row>
            <Col xs={9} className='container'>
            <Heading tagName='h1' size='xl'>
          <Logo className="logo" tagName="span" name="" onClick={this.goHome} /> Cloud Learning Journey
          
        </Heading>
        <Heading tagName='div' size='xxs' className='subtitle'>
          <b>FaceDetector</b> - digital survey emotion analysis
              </Heading>

            </Col>

            <Col xs={3} className='container'>
            <span className="gender">
        	{males ? (
              <span className="piechart male">Male {males}
                <SBPieChart
                  size={100}
                  data={getEmotionChartSummary(metadata,'male')}
                  />
              </span>
               ):null}
              {females ? (
                <span className="piechart female">Female {females}
                <SBPieChart
                  size={100}
                  data={getEmotionChartSummary(metadata,'female')}
                  />
              </span>
              ):null}
              
              </span>

            </Col>


            </Row>
            </Container>


   
        <div className='header-bar' />
        
        <div className='infobar'>
          {metadata.length
            ? <div>
              <span className='sectitle'>
                  Total faces analyzed: {metadata.length} 
                 </span>
              
            </div>
            : null}
        </div>
        <Container
          className='main-container'
          fluid
          style={{ lineHeight: '32px' }}
        >
          <Row>

            <Col xs={5} className='container'>
              <div className='dropzone'>

              {showCamera ?  <Button className="mr3" onClick={this.capture}>Take a picture</Button>:
              <Button className="mr3" onClick={this.resetWebcam}>Go back</Button> }
                          
                <Dropzone
                className="photo"
                  accept={accept}
                  onDrop={this.onDrop.bind(this)}
                  onDragEnter={this.onDragEnter.bind(this)}
                  onDragLeave={this.onDragLeave.bind(this)}
                >

                  {dropzoneActive && <div style={overlayStyle} />}
                  <div className="photo">

                    {showCamera
                      ? <div>
                      
                        <Webcam
                          audio={false}
                          height={350}
                          ref={this.setRef}
                          screenshotFormat="image/jpeg"
                          width={400}
                        />  
                    </div>
                      : null}

                      {dropzoneActive ? (
                            <img
                            alt=""
                            id="preview"
                            className='preview'
                            src={imageSrc}
                           /> 
                      ):null}
      
                    {files.map(f => (
                      <img
                        id="preview"
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

                  <Heading tagName='div' size='xxs' className='subtitle'>Drag and drop photos to analyze</Heading>
                  <Rule className='pt3' />
                  {/* <p className='text-xl mb3'>
                      Detect a range of emotions including anger, contempt, disgust, fear, happiness, neutral,
                      sadness, and surprise.
                    </p> */}
    
                </span>
                : null}

            </Col>
            <Col xs={7}>

              {reject
                ? <div className='error'>
                    Sorry, unable to analyze this photo.
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
                  

                    <span >
                      <img alt="Vision" className="apimap" src={require('../images/vision2.png')} />
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
                    <div className='summary-chart chart'>
                        Summary - combined emotions
                      </div>
                    <div>
                      <Chart
                        size={500}
                        data={getEmotionChartSummary(metadata)}
                        />
                    </div>
                    
                  </div>
                  : null}

          <div>
              
              </div>
              </div>

            </Col>
          </Row>

          <Row>
            <Col>

              {showhistory ? (
                <div>
                <ul className="heroes">

                {this.state.heroes.map(hero => {
                  return (
                    <Hero
                      key={hero.id}
                      hero={hero}
                      onSelect={this.handleSelect}
                      onDelete={this.handleDelete}
                      selectedHero={this.state.selectedHero}
                    />
                  );
                })}
              </ul>
              </div>
              )
              :null}
             </Col>
          </Row>
            {metadata.length   ? (
        
           <Row>
            <Col>
            <Row>
              <Legend styles={scatterStyle} horizontal data={getPieData(getEmotionChartSummary(metadata))} dataId={'key'}  />
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
          
        ):null}
      
   </Container>

   <Footer />
       
 </div>
    )
  }
}

export default Face
