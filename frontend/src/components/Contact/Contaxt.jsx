import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    // You could show a success message or handle the submission
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <h2 className="contact-title">Get In Touch</h2>
        <p className="contact-subtitle">
          Have questions about MentoraAI? We're here to help you on your educational journey. 
          Reach out to us and let's start a conversation about your future.
        </p>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-info-card">
              <div className="contact-info-item">
                <Mail />
                <div className="contact-info-content">
                  <h3>Email Us</h3>
                  <p>support@mentoraai.com</p>
                  <p>hello@mentoraai.com</p>
                </div>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-item">
                <Phone />
                <div className="contact-info-content">
                  <h3>Call Us</h3>
                  <p>+91 98765 43210</p>
                  <p>Mon - Fri: 9AM - 6PM IST</p>
                </div>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-item">
                <MapPin />
                <div className="contact-info-content">
                  <h3>Visit Us</h3>
                  <p>123 Education Hub</p>
                  <p>Pune, Maharashtra 411001</p>
                </div>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <h3>Send us a Message</h3>
            
            <div className="form-fields-container">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What's this about?"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us how we can help you..."
                  rows={5}
                />
              </div>
            </div>

            <button type="submit" className="contact-submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;