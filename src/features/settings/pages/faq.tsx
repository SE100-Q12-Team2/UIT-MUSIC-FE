import { FAQSection, ContactSection } from '../components';
import '@/styles/faq.css';
import Footer from '@/shared/components/ui/footer';
import backgroundSubscription from '@/assets/background-subscription.jpg';

const FAQPage = () => {
  return (
    <div 
      className="faq-page"
      style={{ backgroundImage: `url(${backgroundSubscription})` }}
    >
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default FAQPage;
