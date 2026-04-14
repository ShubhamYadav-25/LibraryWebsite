import { 
  SectionHeader, 
  SectionBadge,
} from "../components/UIcomponents";

import {CheckCircle} from "lucide-react"

const PricingCard = ({ title, price, period, description, features, buttonText, buttonStyle, isPopular }) => (
  <div className={`rounded-2xl p-8 relative transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${isPopular ? 'bg-gray-900' : 'bg-gray-50 border border-gray-200 '}`}>
    {isPopular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <span className="bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-medium">
          Most Popular
        </span>
      </div>
    )}
    
    <h3 className={`text-2xl font-bold mb-2 ${isPopular ? 'text-white' : 'text-gray-900'}`}>
      {title}
    </h3>
    <div className="mb-6">
      <span className={`text-4xl font-bold ${isPopular ? 'text-white' : 'text-gray-900'}`}>
        {price}
      </span>
      {period && (
        <span className={`${isPopular ? 'text-gray-300' : 'text-gray-600'}`}>
          {period}
        </span>
      )}
    </div>
    <p className={`mb-6 ${isPopular ? 'text-gray-300' : 'text-gray-600'}`}>
      {description}
    </p>
    
    <ul className="space-y-4 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <CheckCircle className={`w-5 h-5 mr-3 ${isPopular ? 'text-teal-400' : 'text-teal-500'}`} />
          <span className={`${isPopular ? 'text-gray-300' : 'text-gray-700'}`}>
            {feature}
          </span>
        </li>
      ))}
    </ul>
    
    <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${buttonStyle}`}>
      {buttonText}
    </button>
  </div>
);

// Pricing Section Component
const PricingSection = () => {
  const pricingPlans = [
    {
      title: 'Free Starter',
      price: '$0',
      period: '/month',
      description: 'Perfect for small libraries getting started',
      features: [
        'Up to 100 books',
        'Basic search functionality',
        'Student management',
        'Email support'
      ],
      buttonText: 'Get Started Free',
      buttonStyle: 'border border-gray-300 hover:border-gray-400 text-gray-700',
      isPopular: false
    },
    {
      title: 'Premium Pro',
      price: '$29',
      period: '/month',
      description: 'Ideal for growing educational institutions',
      features: [
        'Unlimited books & students',
        'Advanced analytics & reports',
        'Custom report templates',
        'Priority support & training',
        'Mobile app access'
      ],
      buttonText: 'Start Premium Trial',
      buttonStyle: 'bg-teal-500 hover:bg-teal-600 text-white',
      isPopular: true
    },
    {
      title: 'Enterprise',
      price: 'Custom',
      period: null,
      description: 'Tailored solutions for large institutions',
      features: [
        'Everything in Premium',
        'Multi-library network support',
        'API access & integrations',
        'Dedicated account manager',
        'Custom development'
      ],
      buttonText: 'Contact Sales',
      buttonStyle: 'border border-gray-300 hover:border-gray-400 text-gray-700',
      isPopular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={
            <SectionBadge 
              icon={CheckCircle} 
              text="Pricing Plans"
              bgColor="bg-purple-50"
              textColor="text-purple-700"
            />
          }
          title="Choose Your Perfect Plan"
          description="Flexible pricing options designed for every type of library and educational institution"
        />

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto ">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;