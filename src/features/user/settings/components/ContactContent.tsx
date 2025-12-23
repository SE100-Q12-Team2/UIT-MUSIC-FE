import React from 'react';
import ContactForm from './ContactForm';
import TeamSection from './TeamSection';

const ContactContent: React.FC = () => {
  return (
    <div className="settings-content contact-content">
      <ContactForm />
      <TeamSection />
    </div>
  );
};

export default ContactContent;
