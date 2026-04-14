import {
    SectionHeader, 
    SectionBadge,
 } from "../components/UIcomponents";
import {CheckCircle} from 'lucide-react';

const ProcessStep = ({ step, title, description, color }) => (
  <div className="text-center space-y-6">
    <div className={`w-20 h-20 ${color} rounded-2xl flex items-center justify-center mx-auto`}>
      <span className="text-2xl font-bold text-white">{step}</span>
    </div>
    <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

// How It Works Section Component
const HowItWorksSection = () => {
  const steps = [
    {
      step: '1',
      title: 'Search & Discover',
      description: 'Find the perfect book using our intelligent search engine with filters and recommendations',
      color: 'bg-teal-500'
    },
    {
      step: '2',
      title: 'Quick Borrow',
      description: 'Issue books instantly with QR code scanning or simple one-click digital checkout',
      color: 'bg-gray-700'
    },
    {
      step: '3',
      title: 'Easy Return',
      description: 'Return books seamlessly with automated system updates and instant availability notifications',
      color: 'bg-blue-500'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={
            <SectionBadge 
              icon={CheckCircle} 
              text="Simple Process"
              bgColor="bg-teal-50"
              textColor="text-teal-700"
            />
          }
          title="How It Works"
          description="Get started with our intuitive 3-step process"
        />

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((item, index) => (
            <ProcessStep key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;