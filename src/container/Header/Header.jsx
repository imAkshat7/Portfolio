import React from 'react';
import { motion } from 'framer-motion';

import { AppWrap } from '../../wrapper';
import { images } from '../../constants';
import './Header.scss';

const scaleVariants = {
  whileInView: {
    scale: [0, 1],
    opacity: [0, 1],
    transition: {
      duration: 1,
      ease: 'easeInOut',
    },
  },
};

const Header = () => (
  <div className="app__header app__flex">
    <motion.div
      whileInView={{ x: [-100, 0], opacity: [0, 1] }}
      transition={{ duration: 0.5 }}
      className="app__header-info"
    >
      <div className="app__header-badge">
        <div className="badge-cmp app__flex">
          <span>👋</span>
          <div style={{ marginLeft: 20 }}>
            <p className="p-text">Hello, I am</p>
            <h1 className="">Akshat Sankla</h1>
          </div>
        </div>

        <div className="tag-cmp app__flex">
          <p className="p-text">Web Developer</p>
          <p className="p-text">Software Engineer</p>
          <p className="p-text">Penetration Tester</p>
        </div>
      </div>
    </motion.div>

    <motion.div
      whileInView={{ y: [-50, 0], opacity: [0, 1] }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="app__header-content"
    >
      <div className="hero-text-container">
        <motion.div
          whileInView={{ opacity: [0, 1], y: [30, 0] }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mobile-greeting"
        >
          <motion.div 
            whileInView={{ opacity: [0, 1], x: [-20, 0] }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="greeting-line"
          >
            Hello <span className="wave">👋</span>
          </motion.div>
          <motion.div 
            whileInView={{ opacity: [0, 1], x: [20, 0] }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="greeting-line"
          >
            I am
          </motion.div>
          <motion.div 
            whileInView={{ opacity: [0, 1], y: [20, 0] }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="name-line"
          >
            Akshat Sankla
          </motion.div>
        </motion.div>
        <motion.h2 
          whileInView={{ opacity: [0, 1], y: [20, 0] }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hero-subtitle"
        >
          Crafting Digital Experiences
        </motion.h2>
        <motion.p 
          whileInView={{ opacity: [0, 1], y: [20, 0] }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="hero-description"
        >
          Dedicated to securing digital landscapes through ethical hacking and vulnerability assessment. 
          Protecting systems while building innovative web solutions for a safer digital world.
        </motion.p>
        <motion.div
          whileInView={{ opacity: [0, 1], y: [20, 0] }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="hero-cta"
        >
          <button 
            className="cta-button primary"
            onClick={() => {
              const projectSection = document.getElementById('projects');
              if (projectSection) {
                projectSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            View My Work
          </button>
          <button 
            className="cta-button secondary"
            onClick={() => {
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Get In Touch
          </button>
        </motion.div>
      </div>
    </motion.div>

    <motion.div
      variants={scaleVariants}
      whileInView={scaleVariants.whileInView}
      className="app__header-circles"
    >
      {[images.flutter, images.redux, images.sass].map((circle, index) => (
        <div className="circle-cmp app__flex" key={`circle-${index}`}>
          <img src={circle} alt="tech_stack" />
        </div>
      ))}
    </motion.div>
  </div>
);

export default AppWrap(Header,'home');