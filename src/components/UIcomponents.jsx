import { useState, useRef } from 'react';
import { Link } from "react-router-dom";
import { formatDate } from "../utils/Date";
import { useNavigate } from "react-router-dom";
import { 
  ChevronRight,
  Heart,
  ArrowRight,
} from "lucide-react";


export const SectionBadge = ({ icon: Icon, text, bgColor = "bg-gray-100", textColor = "text-gray-700" }) => (
  <div className={`inline-flex items-center px-4 py-2 ${bgColor} ${textColor} rounded-full text-sm font-medium`}>
    <Icon className="w-4 h-4 mr-2" />
    {text}
  </div>
);

// Section Header Component
export const SectionHeader = ({ badge, title, description, className = "" }) => (
  <div className={`text-center space-y-4 mb-16 ${className}`}>
    {badge}
    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
      {title}
    </h2>
    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
      {description}
    </p>
  </div>
);

export const CTAButtons = () => (
  <div className="flex flex-col sm:flex-row gap-4">
    <Link to="/auth?mode=register">
      <button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex-shrink-0 justify-center">
        Get Started Free
      </button>
    </Link>
    <Link to="/auth?mode=login">
      <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex-shrink-0 justify-center">
        Try Demo
      </button>
    </Link>
  </div>
);

export const FormInput = ({ label, value, onChange, placeholder, required, type = "text", disabled = false }) => (
  <div className="space-y-2">
    <label className="text-left block text-sm font-medium text-gray-700 pl-2 mt-4">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
        disabled ? 'bg-gray-50 text-gray-500' : 'bg-white hover:border-gray-400'
      }`}
    />
  </div>
);

export const StatCard = ({ icon: Icon, title, value, bgColor }) => (
  <div
    className={`${bgColor} rounded-xl p-6 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer`}
  >
    <div className="flex items-center justify-between">
      {/* Left: Value + Title */}
      <div>
        <p className="text-4xl font-bold leading-none">{value}</p>
        <p className="text-sm opacity-90 mt-1">{title}</p>
      </div>

      {/* Right: Icon */}
      <Icon className="w-10 h-10 opacity-90" />
    </div>
  </div>
);



export const FormSelect = ({ label, value, onChange, options, required }) => (
  <div className="space-y-2">
    <label className="text-left block text-sm font-medium text-gray-700 pl-2 mt-4">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// Enhanced Button Component
export const Button = ({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
  disabled = false,
}) => {
  const baseClasses =
    "flex items-center justify-center gap-2 text-xl flex-1 py-3 px-6 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-semibold transition-all duration-200";

  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:scale-105",

    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md hover:scale-105",

    outline:
      "border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md hover:scale-105",

    third:
      "border-2 border-indigo-200 text-indigo-700 bg-white/50 backdrop-blur-sm hover:bg-indigo-50 hover:scale-105",
  };

  const disabledStyles = {
    primary:
      "bg-gradient-to-r from-gray-400 to-gray-500 text-white opacity-70 cursor-not-allowed",

    secondary:
      "bg-gray-200 text-gray-500 opacity-70 cursor-not-allowed",

    outline:
      "border border-gray-200 text-gray-400 bg-gray-50 opacity-70 cursor-not-allowed",

    third:
      "border-2 border-gray-200 text-gray-400 bg-gray-100 opacity-70 cursor-not-allowed",
  };

  return (
    <button
      type={type}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${disabled ? disabledStyles[variant] : variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export const tailwindColors = [
    'red-400', 'red-500', 'red-600',
    'blue-400', 'blue-500', 'blue-600',
    'green-400', 'green-500', 'green-600',
    'purple-400', 'purple-500', 'purple-600',
    'pink-400', 'pink-500', 'pink-600',
    'yellow-400', 'yellow-500', 'yellow-600',
    'teal-400', 'teal-500', 'teal-600',
    'indigo-400', 'indigo-500', 'indigo-600',
    'orange-400', 'orange-500', 'orange-600',
    'fuchsia-400', 'fuchsia-500', 'fuchsia-600'
];

export const gradientDirections = [
    'to-t', 'to-tr', 'to-r', 'to-br',
    'to-b', 'to-bl', 'to-l', 'to-tl'
];

export function getRandomGradientClass() {
    // Helper function to pick a random item from an array.
    const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const direction = getRandomItem(gradientDirections);
    const fromColor = getRandomItem(tailwindColors);
    let viaColor = getRandomItem(tailwindColors);
    let toColor = getRandomItem(tailwindColors);

    while (viaColor === fromColor) {
        viaColor = getRandomItem(tailwindColors);
    }
    while (toColor === fromColor || toColor === viaColor) {
        toColor = getRandomItem(tailwindColors);
    }

    return `bg-gradient-${direction} from-${fromColor} via-${viaColor} to-${toColor}`;
}

// console.log(getRandomGradientClass());

export const BookCard = ({ book, showActions = true }) => {
  const [isLiked, setIsLiked] = useState(book.isLiked || false);
  const [gradientClass] = useState(getRandomGradientClass());
  const navigate = useNavigate();
  const CLOUD_NAME = "dirsttw39";

  // ✅ When "Request Book" is clicked, navigate with this book’s data
  const handleRequestClick = (e) => {
    e.stopPropagation();
    navigate("/requestbook", { state: { book } });
  };

  const handleDetailsClick = async (e) => {
    e.stopPropagation();
    navigate("/bookdetail", { state: { bookId: book.book_id } });
  };

  const handleLikeClick = async (e) =>{
    e.stopPropagation();
    setIsLiked(!isLiked);
    try {
      await api.post(`/books/${book.book_id}/like`,
        { params, withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer w-[270px] flex-shrink-0">
      <div className="relative mb-4">
        <div className="aspect-[3/4] rounded-lg overflow-hidden flex items-center justify-center">
          {book.image ? (
            <img
              src={book.image ? `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${book.image}` : "/book.png"}
              alt={book.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null; // prevent infinite loop
                e.target.src = "/book.png"; // fallback placeholder
              }}
            />
          ) : (
            
            <div
              className={`w-full h-full flex flex-col items-center justify-center text-white font-bold p-4 text-center ${
                gradientClass
              }`}
            >
              <div className="text-lg leading-tight mb-2">{book.title}</div>
              <div className="text-sm opacity-90">{book.author}</div>
            </div>
          )}
        </div>

        {/* Heart button only when actions are enabled */}
        {showActions && (
          <button
            onClick={handleLikeClick}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors duration-200"
          >
            <Heart
              className={`w-5 h-5 ${
                book.is_liked || isLiked ? "text-red-500 fill-current" : "text-gray-400"
              }`}
            />
          </button>
        )}
      </div>

      <div
        className={`space-y-3 flex flex-col ${
          !showActions ? "items-center text-center" : ""
        }`}
      >
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-base leading-tight mb-1">
            {book.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-1">{book.author}</p>
        </div>

        <div className="space-y-3 w-full">
          <div
            className={`flex ${
              !showActions ? "justify-center" : "items-center"
            }`}
          >
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                book.status === 'Available'
                  ? "bg-green-100 text-green-800"
                  :  "bg-red-100 text-red-800"
              }`}
            >
              {book.status}
            </span>
          </div>

          {/* Buttons only if actions are shown */}
          {showActions && (
            <div className="flex space-x-2">
              {book.status === 'Available' ? (
                <>
                  <button
                    onClick={handleRequestClick}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Request Book
                  </button>

                  <button
                    onClick={handleDetailsClick}
                    className="px-4 py-2 border border-gray-300 hover:border-gray-400 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Details
                  </button>
                </>
              ) : (
                <button
                  onClick={handleDetailsClick}
                  className="w-full px-4 py-2 border border-gray-300 hover:border-gray-400 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Details
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export const HorizontalScrollSection = ({ title, badge, books }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {badge && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.className}`}>
              {badge.icon && <badge.icon className="w-4 h-4 inline mr-1" />}
              {badge.text}
            </span>
          )}
        </div>
        
        <button className="flex items-center text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200">
          View All
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      
      <div className="relative">
        {books && books.length > 0 ? (
        <div 
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {books.map((book, index) => (
            <BookCard key={index} book={book} />
          ))}
        </div>):(
          <div className="text-center py-8">
            <p className="text-gray-500">No books available in this section.</p>
          </div>
        )} 
        
        {/* Scroll Buttons */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 z-10"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
        </button>
        
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 z-10"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export const IssuedBookCard = ({ book, isSelected, onSelect }) => {
  let isOverdue = false;
  let isDueSoon = false;
  let status = null; 
  const dueDate = book.dueDate ? new Date(book.dueDate) : null;
  const today = new Date();
  const CLOUD_NAME = "dirsttw39";

  today.setHours(0, 0, 0, 0);

  const normalizedDueDate = new Date(dueDate);
  normalizedDueDate.setHours(0, 0, 0, 0);
  
  const timeDifference = normalizedDueDate.getTime() - today.getTime();
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  
  if (normalizedDueDate < today) {
    isOverdue = true;
    status = 'Overdue';
  } else if (daysDifference <= 3) { // Check if 3 or fewer days are left
    isDueSoon = true;
    status = 'Due Soon';
  } else {
    status = 'On Time';
  } 

  const [gradientClass] = useState(getRandomGradientClass());

  return (
    <div
    onClick={() => onSelect(book)}
    className={`bg-white rounded-xl p-4 border-2 transition-all duration-300 cursor-pointer hover:shadow-lg flex items-center gap-4 ${
      isSelected 
        ? 'border-purple-500 bg-purple-50' 
        : isOverdue 
        ? 'border-red-200 bg-red-50' 
        : 'border-gray-200 hover:border-purple-300'
    }`}
>
    <div className="w-20 h-26 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
            {book.image ? (
            <img
              src={book.image ? `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${book.image}` : "/book.png"}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) :
          <div className={`w-full h-full flex items-center justify-center text-white text-xs font-bold ${gradientClass}`}>
            {book.title}
          </div>
        }
    </div>
    
  <div className="flex-grow flex flex-col min-w-0">
    <h3 className="font-semibold text-gray-900 mb-1 truncate">{book.title}</h3>
    <p className="text-sm text-gray-600 mb-2">{book.author}</p>
        
    <div className="grid text-xs">
      <div>
        <span className="text-gray-500">Issue Date:</span>
        <span className="ml-2 text-gray-900 font-medium">{`${formatDate(book.issueDate)}`}</span>
      </div>
      <div>
        <span className="text-gray-500">Due Date:</span>
        <span className="ml-2 text-gray-900 font-medium">{`${formatDate(book.dueDate)}`}</span>
      </div>
    </div>
        
        <div className="mt-2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              isOverdue 
                ? 'bg-red-100 text-red-800' 
                : isDueSoon 
                ? 'bg-orange-100 text-orange-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {status}
            </span>
          </div>
    </div>
</div>
  );
};
