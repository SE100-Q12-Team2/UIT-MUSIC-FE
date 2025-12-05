import React from 'react';
import ContactItem from './ContactItem';

// Import SVG icons from assets
import emailIcon from '@/assets/email.svg';
import phoneIcon from '@/assets/phone.svg';
import locationIcon from '@/assets/location.svg';

const contactData = [
  {
    icon: emailIcon,
    title: 'Email',
    description: 'Our friendly team is here to help.',
    contactInfo: 'Hi@Untitledui.Com'
  },
  {
    icon: phoneIcon,
    title: 'Phone',
    description: 'Our friendly team is here to help.',
    contactInfo: '+1 (555) 000-0000'
  },
  {
    icon: locationIcon,
    title: 'Office',
    description: 'Our friendly team is here to help.',
    contactInfo: '100 Smith Street'
  }
];

const ContactSection: React.FC = () => {
  return (
    <section className="contact-section">
      <div className="contact-section__header">
        <h2 className="contact-section__title">We'd Love To Hear From You</h2>
        <p className="contact-section__subtitle">Our Friendly Team Is Always Here To Chat.</p>
      </div>
      <div className="contact-section__grid">
        {contactData.map((item, index) => (
          <ContactItem
            key={index}
            icon={<img src={item.icon} alt={item.title} />}
            title={item.title}
            description={item.description}
            contactInfo={item.contactInfo}
          />
        ))}
      </div>
    </section>
  );
};

export default ContactSection;
