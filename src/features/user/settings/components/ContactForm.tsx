import React, { useState } from 'react';
import emailIcon from '@/assets/email.svg';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
  agreePolicy: boolean;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: '',
    agreePolicy: false,
  });

  const handleChange = (field: keyof ContactFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
  };

  return (
    <section className="contact-form-section">
      <div className="contact-form-header">
        <h2 className="contact-form-title">Contact Us</h2>
        <p className="contact-form-subtitle">
          We'd Love To Hear From You. Please Fill Out This Form.
        </p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-form-row">
          <div className="contact-form-field">
            <label htmlFor="firstName">Name</label>
            <input
              id="firstName"
              type="text"
              placeholder="Name"
              value={formData.firstName}
              onChange={handleChange('firstName')}
              className="contact-input"
            />
          </div>
          <div className="contact-form-field">
            <label htmlFor="lastName">Name</label>
            <input
              id="lastName"
              type="text"
              placeholder="Name"
              value={formData.lastName}
              onChange={handleChange('lastName')}
              className="contact-input"
            />
          </div>
        </div>

        <div className="contact-form-field contact-form-field--full">
          <label htmlFor="email">Name</label>
          <div className="contact-input-with-icon">
            <img src={emailIcon} alt="" className="contact-input-icon" />
            <input
              id="email"
              type="email"
              placeholder="Olivia@Untitledui.Com"
              value={formData.email}
              onChange={handleChange('email')}
              className="contact-input contact-input--with-icon"
            />
          </div>
        </div>

        <div className="contact-form-field contact-form-field--full">
          <label htmlFor="phoneNumber">Phone number</label>
          <input
            id="phoneNumber"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={formData.phoneNumber}
            onChange={handleChange('phoneNumber')}
            className="contact-input"
          />
        </div>

        <div className="contact-form-field contact-form-field--full">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            placeholder="Detailes Detailes Detailes Detailes Detailes Detailes Detailes Detailes Detailes Detailes Detailes Detailes Detailes Detailes Detailes"
            value={formData.message}
            onChange={handleChange('message')}
            className="contact-textarea"
            rows={4}
          />
        </div>

        <div className="contact-form-checkbox">
          <input
            id="agreePolicy"
            type="checkbox"
            checked={formData.agreePolicy}
            onChange={handleChange('agreePolicy')}
          />
          <label htmlFor="agreePolicy">You agree to our friendly privacy policy.</label>
        </div>

        <button type="submit" className="contact-submit-btn">
          Ok
        </button>
      </form>
    </section>
  );
};

export default ContactForm;
