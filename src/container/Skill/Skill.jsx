import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tooltip as ReactTooltip } from "react-tooltip";

import { AppWrap, MotionWrap } from '../../wrapper';
import { urlFor, client } from '../../client';
import './Skill.scss';

const TechnicalSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const skillsQuery = '*[_type == "skills"] | order(name asc)';

    client.fetch(skillsQuery).then((data) => {
      setSkills(data);
      setLoading(false);
    }).catch((err) => {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills');
      setLoading(false);
    });
  }, []);

  // Get unique categories
  const categories = ['All', ...new Set(skills.map(skill => skill.category).filter(Boolean))];

  // Filter skills based on selected category
  const filteredSkills = selectedCategory === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  const renderSkillIcon = (skill) => {
    if (skill.icon) {
      return (
        <div className="skill-icon-wrapper">
          <img src={urlFor(skill.icon)} alt={skill.name} />
        </div>
      );
    }
    return (
      <div className="skill-icon-fallback">
        <span>{skill.name?.[0] || '?'}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="app__flex">
        <h2 className="head-text">Loading Technical Skills...</h2>
      </div>
    );
  }

  return (
    <div className="app__skills-enhanced">
      <h2 className="head-text">
        <span className="highlight-text">Technical</span> Skills
      </h2>
      <p className="p-text skills-subtitle">
        Technologies and tools I work with
      </p>

      {/* Category Filter */}
      <div className="category-filter-nav">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="skills-grid-container">
        {error ? (
          <p className="p-text error-text">{error}</p>
        ) : filteredSkills.length > 0 ? (
          <motion.div 
            className="skills-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill._id || skill.name}
                className="skill-card-enhanced"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: "easeOut" 
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                data-tooltip-id={`skill-tooltip-${skill._id || index}`}
                data-tooltip-content={skill.category || 'Skill'}
              >
                <div className="skill-icon-container">
                  {renderSkillIcon(skill)}
                </div>
                <h4 className="skill-name">{skill.name}</h4>
                {skill.category && (
                  <span className="skill-category">{skill.category}</span>
                )}
                <ReactTooltip
                  id={`skill-tooltip-${skill._id || index}`}
                  place="top"
                  effect="solid"
                  className="custom-tooltip"
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="p-text">No skills found for the selected category.</p>
        )}
      </div>
    </div>
  );
};

export default AppWrap(
  MotionWrap(TechnicalSkills, 'app__skills'),
  'skills',
  'app__whitebg',
);

