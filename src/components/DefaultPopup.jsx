export const DefaultPopup = ({ title, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-80">
        <h2 className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-gray-100">
          {title}
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          This feature is coming soon! Stay tuned for updates.
        </p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};