import { useState, useEffect } from "react";
import HeroSection from "./HeroPage.jsx";
import FeaturesSection from "./FeaturesPage.jsx"
import HowItWorksSection from "./HowitWorksPage.jsx"
import TestimonialsSection from "./TestimonialPage.jsx";
import PricingSection from "./PricingPage.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";


const HomePage = () => {
  const [activeSection, setActiveSection] = useState('home');

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'features', 'how-it-works', 'dashboard', 'testimonials', 'pricing'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header activeSection={activeSection} scrollToSection={scrollToSection} />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default HomePage;