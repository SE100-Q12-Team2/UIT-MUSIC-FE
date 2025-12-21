import React from 'react';
import { FAQSection, ContactSection } from './index';

const FAQContent: React.FC = () => {
  return (
    <div className="settings-content faq-content">
      <FAQSection />
      <ContactSection />
    </div>
  );
};

export default FAQContent;
