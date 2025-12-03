import React from 'react';
import FAQItem from './FAQItem';

// Import SVG icons from assets
import downloadIcon from '@/assets/download.svg';
import profileIcon from '@/assets/profile.svg';
import musicIcon from '@/assets/music-icon.svg';
import findMusicIcon from '@/assets/find-music.svg';

const faqData = [
  {
    icon: downloadIcon,
    title: 'Is Music Download Free?',
    description: 'We offer both free and premium downloads. Some tracks can be downloaded for free, while others require a subscription for access'
  },
  {
    icon: profileIcon,
    title: 'How Do I Sign Up?',
    description: 'You can sign up by clicking the "Sign Up" button on the homepage. Simply fill in your details or use a social media account to register quickly.'
  },
  {
    icon: musicIcon,
    title: 'Can I Listen Offline?',
    description: 'Yes, you can download tracks with your premium subscription and enjoy them offline whenever you want.'
  },
  {
    icon: findMusicIcon,
    title: 'What Genres Are Available?',
    description: 'VioTune features a wide range of genres, including pop, rock, jazz, classical, and electronic. Explore the library to discover your favorites.'
  },
  {
    icon: musicIcon,
    title: 'Can I Listen Offline?',
    description: 'Yes, you can download tracks with your premium subscription and enjoy them offline whenever you want.'
  },
  {
    icon: downloadIcon,
    title: 'Is Music Download Free?',
    description: 'We offer both free and premium downloads. Some tracks can be downloaded for free, while others require a subscription for access'
  }
];

const FAQSection: React.FC = () => {
  return (
    <section className="faq-section">
      <div className="faq-section__header">
        <h2 className="faq-section__title">Ask Us Anything</h2>
        <p className="faq-section__subtitle">
          Need Something Cleared Up? Here Are Our Most<br />
          Frequently Asked Questions.
        </p>
      </div>
      <div className="faq-section__grid">
        {faqData.map((item, index) => (
          <FAQItem
            key={index}
            icon={<img src={item.icon} alt={item.title} />}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
