import { Icon,Search, ArrowRight, BarChart3, Users, FileText, Bell, Star } from "lucide-react";
import { 
  SectionHeader,
  SectionBadge, 
} from "../components/UIcomponents"

const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
    <div className={`w-16 h-16 ${color} rounded-xl flex items-center justify-center mb-6`}>
      <Icon className="w-8 h-8 text-white" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

// Features Section Component
const FeaturesSection = () => {
  const features = [
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Advanced AI-powered search functionality to find books instantly by title, author, ISBN, or category with intelligent suggestions',
      color: 'bg-teal-500'
    },
    {
      icon: ArrowRight,
      title: 'Issue & Return',
      description: 'Streamlined book issuing and returning process with QR code scanning and automated tracking system',
      color: 'bg-gray-700'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive reports and real-time analytics to track library usage patterns and trends with visual insights',
      color: 'bg-blue-500'
    },
    {
      icon: Users,
      title: 'Student Profiles',
      description: 'Manage student information, borrowing history, and preferences with comprehensive user management tools',
      color: 'bg-teal-500'
    },
    {
      icon: FileText,
      title: 'Smart Reports',
      description: 'Generate detailed reports on library operations, usage statistics, and performance metrics automatically',
      color: 'bg-gray-700'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Automated notification system for due dates, renewals, and library updates via email and mobile alerts',
      color: 'bg-blue-500'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={
            <SectionBadge 
              icon={Star} 
              text="Powerful Features"
              bgColor="bg-gray-100"
              textColor="text-gray-700"
            />
          }
          title="Everything you need to manage your library"
          description="Streamline operations with our comprehensive suite of library management tools"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;