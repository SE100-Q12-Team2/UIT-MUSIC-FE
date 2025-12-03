import React from 'react';

interface FAQItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ icon, title, description }) => {
  return (
    <div className="faq-item">
      <div className="faq-item__icon">
        {icon}
      </div>
      <h3 className="faq-item__title">{title}</h3>
      <p className="faq-item__description">{description}</p>
    </div>
  );
};

export default FAQItem;
