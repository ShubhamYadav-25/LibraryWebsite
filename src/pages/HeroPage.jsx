import { 
    CTAButtons,
    SectionBadge,
} from "../components/UIcomponents";

import { BookOpen } from "lucide-react";

// Hero Content Component
const HeroContent = () => (
  <div className="space-y-8">
    <SectionBadge 
      icon={BookOpen} 
      text="Smart Library Management"
      bgColor="bg-teal-50"
      textColor="text-teal-700"
    />
    
    <div className="space-y-6">
      <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
        Your Smart Digital{' '}
        <span className="text-teal-500">Library</span>
      </h1>
      <p className="text-xl text-gray-600 leading-relaxed">
        Manage books, students, and borrowing seamlessly with our 
        intuitive library management system designed for modern 
        educational institutions
      </p>
    </div>

    <CTAButtons />
  </div>
);

export const HeroImage = () => (
  <div className="relative">
    <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <img 
        src="https://res.cloudinary.com/dirsttw39/image/upload/v1780152617/libraryimage1_fyedjj.avif"
        alt="Modern Library"
        className="w-full h-full object-cover"
      />
    </div>
  </div>
);

const HeroSection = () => (
  <section id="home" className="pt-20 pb-16 bg-gradient-to-br from-gray-50 to-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <HeroContent />
        <HeroImage />
      </div>
    </div>
  </section>
);

export default HeroSection;