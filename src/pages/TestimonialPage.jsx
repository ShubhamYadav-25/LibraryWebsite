import { Star, Users } from "lucide-react";
import { 
  SectionHeader, 
  SectionBadge,
} from "../components/UIcomponents";


const TestimonialCard = ({ name, role, avatar, rating, comment, color }) => (
  <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
    <div className="flex items-center mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
      ))}
    </div>
    <p className="text-gray-600 italic mb-6 leading-relaxed">
      "{comment}"
    </p>
    <div className="flex items-center">
      <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center mr-4`}>
        <span className="text-white font-bold">{avatar}</span>
      </div>
      <div>
        <h4 className="font-bold text-gray-900">{name}</h4>
        <p className="text-gray-600 text-sm">{role}</p>
      </div>
    </div>
  </div>
);

// Testimonials Section Component
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Head Librarian',
      avatar: 'SJ',
      rating: 5,
      comment: 'This system has completely revolutionized how we manage our library. The interface is incredibly intuitive and the features are exactly what we needed to streamline our operations.',
      color: 'bg-teal-500'
    },
    {
      name: 'Mike Chen',
      role: 'Computer Science Student',
      avatar: 'MC',
      rating: 5,
      comment: 'As a student, I absolutely love how easy it is to find and borrow books. The search function is lightning-fast and the mobile app is fantastic for managing my reading list.',
      color: 'bg-blue-500'
    },
    {
      name: 'Emily Davis',
      role: 'Library Administrator',
      avatar: 'ED',
      rating: 5,
      comment: 'The analytics and reporting features have provided us with invaluable insights into our library usage patterns. The data visualization is impressive and actionable.',
      color: 'bg-purple-500'
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={
            <SectionBadge 
              icon={Users} 
              text="User Testimonials"
              bgColor="bg-green-50"
              textColor="text-green-700"
            />
          }
          title="What Our Users Say"
          description="Trusted by thousands of students, librarians, and administrators worldwide"
        />

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;