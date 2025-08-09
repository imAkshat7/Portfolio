import React from 'react';
import { FaLinkedinIn } from 'react-icons/fa';

const SocialMedia = () => (
  <div className="app__social">
    <div>
      <a 
        href="https://www.linkedin.com/in/akshat-sankla/" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <FaLinkedinIn />
      </a>
    </div>
  </div>
);

export default SocialMedia;