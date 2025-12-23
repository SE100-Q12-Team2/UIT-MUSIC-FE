import React from 'react';

interface ContactItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  contactInfo: string;
}

const ContactItem: React.FC<ContactItemProps> = ({ icon, title, description, contactInfo }) => {
  return (
    <div className="contact-item">
      <div className="contact-item__icon">
        {icon}
      </div>
      <h3 className="contact-item__title">{title}</h3>
      <p className="contact-item__description">{description}</p>
      <p className="contact-item__info">{contactInfo}</p>
    </div>
  );
};

export default ContactItem;
