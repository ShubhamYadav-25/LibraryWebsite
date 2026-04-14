import {
  BookOpen,
  Plus,
  UserPlus,
  RotateCcw,
  Star,
} from 'lucide-react';

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dirsttw39/image/upload';
const BOOK_IMAGE_SIZE = 'w_100,h_100,c_fill';

const getCloudinaryUrl = (image) =>
  image
    ? `${CLOUDINARY_BASE}/${BOOK_IMAGE_SIZE},f_auto,q_auto/${image}`
    : '/book.png';

const formatActivityStatus = (status) => status?.toLowerCase() || 'unknown';

const renderRatingStars = (rating) =>
  Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      className={`w-4 h-4 ${index < Math.floor(rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
    />
  ));

export const ActivityItem = ({ name, book_title, time, activity_status }) => (
  <div className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
      <img
        src={`https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`}
        alt={name}
        className="w-full h-full object-cover"
      />
    </div>

    <div className="flex-1">
      <p className="text-gray-900 font-medium">{`${name} ${formatActivityStatus(activity_status)} ${book_title}`}</p>
      <p className="text-sm text-gray-500">{`${time} hours ago`}</p>
    </div>

    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        activity_status === 'ISSUED'
          ? 'bg-green-100 text-green-700'
          : activity_status === 'RETURNED'
          ? 'bg-blue-100 text-blue-700'
          : 'bg-purple-100 text-purple-700'
      }`}
    >
      {formatActivityStatus(activity_status)}
    </span>
  </div>
);

export const PopularBookItem = ({ title, author, rating = 0, issues = 0, image }) => (
  <div className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
    <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
      <img
        src={getCloudinaryUrl(image)}
        alt={title}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/book.png';
        }}
      />
    </div>

    <div className="flex-1 min-w-0">
      <h4 className="font-semibold text-gray-900 truncate">{title}</h4>
      <p className="text-sm text-gray-600 truncate">{author}</p>

      <div className="flex items-center space-x-1 mt-1">
        {renderRatingStars(rating)}
        <span className="text-sm text-gray-600 ml-1">{rating ?? 0} rating</span>
      </div>
    </div>

    <div className="text-right min-w-[68px]">
      <p className="text-2xl font-bold text-gray-900">{issues}</p>
      <p className="text-xs text-gray-600">issues</p>
    </div>
  </div>
);

export const OverdueBookItem = ({ title, borrower, days_overdue }) => (
  <div className="p-3 bg-red-50 rounded-lg border border-red-100 mb-2">
    <h4 className="font-medium text-gray-900 truncate">{title}</h4>
    <p className="text-sm text-gray-600 truncate">{borrower} - {days_overdue} days overdue</p>
    <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
      Overdue
    </span>
  </div>
);

export const LibraryStats = ({ totalBooks = 0, issuedBooks = 0 }) => {
  const issuedPercent = totalBooks ? Math.round((issuedBooks / totalBooks) * 100) : 0;
  const availablePercent = 100 - issuedPercent;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-5">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Library Stats</h3>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 font-medium">Books Available</span>
            <span className="text-gray-900 font-bold">{totalBooks - issuedBooks}</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${availablePercent}%` }} />
          </div>

          <p className="text-xs text-green-600 mt-1 font-medium">{availablePercent}% available</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 font-medium">Books Issued</span>
            <span className="text-gray-900 font-bold">{issuedBooks}</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${issuedPercent}%` }} />
          </div>

          <p className="text-xs text-blue-600 mt-1 font-medium">{issuedPercent}% in circulation</p>
        </div>
      </div>
    </div>
  );
};

const actionButtons = [
  {
    label: 'Add New Book',
    icon: Plus,
    className: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white',
  },
  {
    label: 'Register Student',
    icon: UserPlus,
    className: 'bg-green-50 hover:bg-green-100 text-gray-900',
  },
  {
    label: 'Issue Book',
    icon: RotateCcw,
    className: 'bg-blue-50 hover:bg-blue-100 text-gray-900',
  },
];

export const QuickActions = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-5">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

    <div className="space-y-3">
      {actionButtons.map(({ label, icon: Icon, className }) => (
        <button
          key={label}
          className={`${className} w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2`}
          type="button"
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  </div>
);

export const StatCard = ({ title, value, change, icon: Icon, bgColor, iconBgColor }) => {
  const changeColor = change.includes('overdue')
    ? 'text-orange-600'
    : change.includes('new')
    ? 'text-teal-600'
    : 'text-green-600';

  return (
    <div className={`${bgColor} rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-700 text-sm font-medium mb-2">{title}</p>
          <h3 className="text-4xl font-bold text-gray-900 mb-2">{value}</h3>
          <p className={`text-sm font-medium ${changeColor}`}>{change}</p>
        </div>

        <div className={`${iconBgColor} w-14 h-14 rounded-2xl flex items-center justify-center`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );
};
