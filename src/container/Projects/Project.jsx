import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AiFillEye, AiFillGithub } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';

import { AppWrap, MotionWrap } from '../../wrapper';
import { urlFor, client } from '../../client';
import './project.scss';

const ProjectShowcase = () => {
  // State management with unique naming
  const [projectsRepository, setProjectsRepository] = useState([]);
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cardAnimationState, setCardAnimationState] = useState({ y: 0, opacity: 1 });
  const [dataIsLoading, setDataIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Custom data fetching with unique implementation
  const loadProjectsData = useCallback(async () => {
    try {
      setDataIsLoading(true);
      const projectsQuery = `*[_type == "project"] | order(_createdAt desc) {
        _id,
        title,
        description,
        projectLink,
        codeLink,
        imgUrl,
        tags
      }`;
      
      const projectsData = await client.fetch(projectsQuery);
      
      // Debug: Log the fetched data to see if tags are coming through
      console.log('Fetched projects with tags:', projectsData);
      
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setProjectsRepository(projectsData);
      setDisplayedProjects(projectsData);
      setDataIsLoading(false);
    } catch (error) {
      console.error('Projects data loading failed:', error);
      setFetchError('Unable to retrieve projects. Please refresh and try again.');
      setDataIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjectsData();
  }, [loadProjectsData]);

  // Memoized filter categories generation
  const filterCategories = useMemo(() => {
    if (!projectsRepository.length) return ['All'];
    
    const categoriesSet = new Set(['All']);
    
    projectsRepository.forEach(project => {
      if (project.tags && Array.isArray(project.tags)) {
        project.tags.forEach(tag => categoriesSet.add(tag));
      }
    });
    
    return Array.from(categoriesSet);
  }, [projectsRepository]);

  // Enhanced filter handler with animation
  const handleCategorySelection = useCallback((category) => {
    if (category === selectedCategory) return;
    
    setSelectedCategory(category);
    setCardAnimationState({ y: 50, opacity: 0 });

    const animationTimer = setTimeout(() => {
      const filteredProjects = category === 'All' 
        ? projectsRepository 
        : projectsRepository.filter(project => 
            project.tags && project.tags.includes(category)
          );
      
      setDisplayedProjects(filteredProjects);
      setCardAnimationState({ y: 0, opacity: 1 });
    }, 350);

    return () => clearTimeout(animationTimer);
  }, [selectedCategory, projectsRepository]);

  // Custom animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const projectCardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15
      }
    }
  };

  // Render project image with enhanced fallback
  const renderProjectImage = (project) => {
    if (project.imgUrl) {
      return (
        <img 
          src={urlFor(project.imgUrl)} 
          alt={`${project.title} preview`}
          loading="lazy"
        />
      );
    }
    
    return (
      <div className="project-image-placeholder">
        <span className="placeholder-text">Preview Unavailable</span>
      </div>
    );
  };

  // Enhanced loading state
  if (dataIsLoading) {
    return (
      <div className="projects-loading-wrapper app__flex">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="loading-content"
        >
          <h2 className="head-text">Curating Projects...</h2>
          <div className="loading-animation">
            {[1, 2, 3, 4].map((item) => (
              <motion.div
                key={item}
                className="loading-bar"
                animate={{ scaleX: [0, 1, 0] }}
                transition={{ 
                  duration: 1.2, 
                  repeat: Infinity, 
                  delay: item * 0.2 
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Enhanced error state
  if (fetchError) {
    return (
      <div className="projects-error-wrapper app__flex">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="head-text">Project <span>Showcase</span></h2>
          <p className="error-message">{fetchError}</p>
          <motion.button
            className="reload-button"
            onClick={loadProjectsData}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reload Projects
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="projects-showcase-section">
      <motion.h2 
        className="head-text"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Project <span>Showcase</span>
      </motion.h2>

      {/* Enhanced Filter Navigation */}
      <motion.div 
        className="category-filter-nav"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {filterCategories.map((category, index) => (
          <motion.button
            key={`category-${index}`}
            onClick={() => handleCategorySelection(category)}
            className={`filter-button ${selectedCategory === category ? 'active-filter' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        animate={cardAnimationState}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="projects-grid-layout"
      >
        <AnimatePresence mode="wait">
          {displayedProjects.length > 0 ? (
            <motion.div
              key={selectedCategory}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="projects-container"
            >
              {displayedProjects.map((project, index) => (
                <motion.article
                  key={project._id || `project-${index}`}
                  className="project-showcase-card"
                  variants={projectCardVariants}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="project-media-wrapper">
                    {renderProjectImage(project)}

                    <motion.div
                      className="project-actions-overlay"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {project.projectLink && (
                        <motion.a
                          href={project.projectLink}
                          target="_blank"
                          rel="noreferrer"
                          className="action-button preview-button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <AiFillEye />
                        </motion.a>
                      )}
                      {project.codeLink && (
                        <motion.a
                          href={project.codeLink}
                          target="_blank"
                          rel="noreferrer"
                          className="action-button code-button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <AiFillGithub />
                        </motion.a>
                      )}
                    </motion.div>
                  </div>

                  <div className="project-details-section">
                    <h4 className="project-title">{project.title}</h4>
                    <p className="project-description">{project.description}</p>
                    
                    {project.tags && project.tags.length > 0 && (
                      <div className="project-tech-tags">
                        {project.tags.map((tech, techIndex) => (
                          <span 
                            key={`tech-${techIndex}`} 
                            className="tech-tag"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="empty-projects-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="empty-message">
                {selectedCategory === 'All' 
                  ? 'No projects available at the moment' 
                  : `No projects match "${selectedCategory}" category`
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
export default AppWrap(
  MotionWrap(ProjectShowcase, 'app__projects'),
  'projects',
  'app__primarybg',
);
