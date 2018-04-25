import React from "react";
import {resource} from "./resource";

const footer = () => (
  <div className="footer">
    <p>
      <a
        href="https://www.starbucks.com/about-us/company-information/online-policies/privacy-policy"
        target="_new"
      >
      {resource.PB_FORM_PRIVACY_POLICY}
       
      </a>
      |
      <a
        href="https://www.starbucks.com/about-us/company-information/online-policies/terms-of-use"
        target="_new"
      >
        {resource.PB_FORM_TERMS}
      </a>
    </p>

    <div> {resource.PB_FORM_COPYRIGHT}</div>
    <div> {resource.PB_TAGLINE}</div>
   
  </div>
);

export default footer;
