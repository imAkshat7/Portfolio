/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-has-content */

import React, { useState, useEffect } from 'react';

const NavigationDots = ({ active }) => {
  const [activeSection, setActiveSection] = useState(active || 'home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'skills', 'contact'];
      let currentSection = 'home';

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if section is in viewport (with some offset for better detection)
          if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
            currentSection = section;
          }
        }
      });

      setActiveSection(currentSection);
    };

    // Set initial active section
    setActiveSection(active || 'home');

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Call once to set initial state
    handleScroll();

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, [active]);

  return (
    <div className="app__navigation">
      {['home', 'about', 'projects', 'skills', 'contact'].map((item, index) => (
        <a
          href={`#${item}`}
          key={item + index}
          className={`app__navigation-dot ${activeSection === item ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            const element = document.getElementById(item);
            if (element) {
              element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
              setActiveSection(item);
            }
          }}
        />
      ))}
    </div>
  );
};

export default NavigationDots;