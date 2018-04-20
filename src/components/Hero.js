import React from 'react';

const Hero = props => {
  return (
    <li
      onClick={() => props.onSelect(props.hero)}
      className={props.hero === props.selectedHero ? 'selected' : ''}
    >
      <button
        className="delete-button"
        onClick={e => props.onDelete(e, props.hero)}
      >
        Delete
      </button>
      <div className="hero-element">
       {/*  <div className="badge">
          {props.hero.id}
        </div> */}
        <div className="saved-item">
          Name: {props.hero.name}
        </div>
        <div className="saved-item">
          {props.hero.saying}
        </div>
      
        
      </div>
    </li>
  );
};

export default Hero;
