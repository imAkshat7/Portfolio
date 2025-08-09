import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

import { images } from '../../constants';
import { AppWrap, MotionWrap } from '../../wrapper';
import { client } from '../../client';
import './Footer.scss';

const ContactInterface = () => {
  const [formInputs, setFormInputs] = useState({ 
    fullName: '', 
    emailAddress: '', 
    messageContent: '' 
  });
  const [submissionState, setSubmissionState] = useState({
    isSubmitted: false,
    isProcessing: false,
    hasErrors: false
  });
  const [validationErrors, setValidationErrors] = useState({});

  const { fullName, emailAddress, messageContent } = formInputs;

  // Enhanced input change handler
  const handleInputModification = useCallback((event) => {
    const { name, value } = event.target;
    setFormInputs(prevInputs => ({ 
      ...prevInputs, 
      [name]: value 
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prevErrors => ({ 
        ...prevErrors, 
        [name]: null 
      }));
    }
  }, [validationErrors]);

  // Advanced form validation
  const validateFormInputs = useCallback(() => {
    const errors = {};
    
    // Name validation
    if (!fullName.trim()) {
      errors.fullName = 'Your name is required';
    } else if (fullName.trim().length < 2) {
      errors.fullName = 'Name must be at least 2 characters';
    }
    
    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailAddress.trim()) {
      errors.emailAddress = 'Email address is required';
    } else if (!emailPattern.test(emailAddress)) {
      errors.emailAddress = 'Please provide a valid email address';
    }
    
    // Message validation
    if (!messageContent.trim()) {
      errors.messageContent = 'Message content is required';
    } else if (messageContent.trim().length < 15) {
      errors.messageContent = 'Message should be at least 15 characters long';
    }
    
    return errors;
  }, [fullName, emailAddress, messageContent]);

  // Enhanced form submission
  const processFormSubmission = useCallback(async () => {
    const errors = validateFormInputs();
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setSubmissionState(prev => ({ ...prev, isProcessing: true }));
    setValidationErrors({});
    
    try {
      const contactRecord = {
        _type: 'contact',
        name: fullName.trim(),
        email: emailAddress.trim(),
        message: messageContent.trim(),
        submittedAt: new Date().toISOString(),
        status: 'new'
      };

      await client.create(contactRecord);
      
      setSubmissionState({
        isSubmitted: true,
        isProcessing: false,
        hasErrors: false
      });
      
      console.log('Contact form processed successfully!');
    } catch (submissionError) {
      console.error('Form submission failed:', submissionError);
      setSubmissionState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        hasErrors: true 
      }));
      setValidationErrors({ 
        submission: 'Unable to send your message. Please try again shortly.' 
      });
    }
  }, [fullName, emailAddress, messageContent, validateFormInputs]);

  // Reset form state
  const resetContactForm = useCallback(() => {
    setFormInputs({ fullName: '', emailAddress: '', messageContent: '' });
    setSubmissionState({ isSubmitted: false, isProcessing: false, hasErrors: false });
    setValidationErrors({});
  }, []);

  // Contact information data
  const contactMethods = [
    {
      id: 'email-contact',
      icon: images.email,
      label: 'Email Address',
      value: 'Akshatsankla70@gmail.com',
      link: 'mailto:Akshatsankla70@gmail.com'
    }
  ];

  return (
    <section className="contact-interface-section">
      <motion.h2 
        className="head-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Let's Connect & Collaborate
      </motion.h2>

      {/* Contact Methods */}
      <motion.div 
        className="contact-methods-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {contactMethods.map((method) => (
          <motion.div 
            key={method.id}
            className="contact-method-card"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img src={method.icon} alt={method.label} />
            <a href={method.link} className="contact-link">
              {method.value}
            </a>
          </motion.div>
        ))}
      </motion.div>

      {/* Contact Form or Success Message */}
      <motion.div
        className="form-interaction-area"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {!submissionState.isSubmitted ? (
          <div className="contact-form-wrapper">
            <div className="form-field-group">
              <motion.input
                className={`form-input ${validationErrors.fullName ? 'input-error' : ''}`}
                type="text"
                placeholder="Your Full Name"
                name="fullName"
                value={fullName}
                onChange={handleInputModification}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              {validationErrors.fullName && (
                <motion.span 
                  className="error-feedback"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {validationErrors.fullName}
                </motion.span>
              )}
            </div>
            
            <div className="form-field-group">
              <motion.input
                className={`form-input ${validationErrors.emailAddress ? 'input-error' : ''}`}
                type="email"
                placeholder="Your Email Address"
                name="emailAddress"
                value={emailAddress}
                onChange={handleInputModification}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              {validationErrors.emailAddress && (
                <motion.span 
                  className="error-feedback"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {validationErrors.emailAddress}
                </motion.span>
              )}
            </div>
            
            <div className="form-field-group">
              <motion.textarea
                className={`form-textarea ${validationErrors.messageContent ? 'input-error' : ''}`}
                placeholder="Share your thoughts, ideas, or project details..."
                name="messageContent"
                value={messageContent}
                onChange={handleInputModification}
                rows={5}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              {validationErrors.messageContent && (
                <motion.span 
                  className="error-feedback"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {validationErrors.messageContent}
                </motion.span>
              )}
            </div>
            
            {validationErrors.submission && (
              <motion.div 
                className="submission-error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {validationErrors.submission}
              </motion.div>
            )}
            
            <motion.button
              type="button"
              className="submit-button"
              onClick={processFormSubmission}
              disabled={submissionState.isProcessing}
              whileHover={{ scale: submissionState.isProcessing ? 1 : 1.05 }}
              whileTap={{ scale: submissionState.isProcessing ? 1 : 0.95 }}
            >
              {submissionState.isProcessing ? 'Sending Message...' : 'Send Message'}
            </motion.button>
          </div>
        ) : (
          <motion.div 
            className="success-feedback-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="success-title">Message Sent Successfully!</h3>
            <p className="success-message">
              Thank you for reaching out! I'll review your message and get back to you within 24-48 hours.
            </p>
            <motion.button
              className="reset-form-button"
              onClick={resetContactForm}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send Another Message
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Copyright Notice - Only on Contact Page */}
      <motion.div 
        className="copyright-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <p className="copyright-text">© 2025 Akshat. All rights reserved.</p>
      </motion.div>
    </section>
  );
};
export default AppWrap(
  MotionWrap(ContactInterface, 'app__footer'),
  'contact',
  'app__whitebg',
);
