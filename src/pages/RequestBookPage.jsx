import api from "../api/axiosInstance";
import { useBookForm } from "../hooks/useBookForm";
import { calculateDueDate } from "../utils/Date";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  
  BookOpen, 
  Calendar,
  Info,
  CheckCircle,
} from 'lucide-react';
import { Button, FormInput } from "../components/UIcomponents";


const RequestBookPage = () => {
  const studentId = localStorage.getItem("ID");
  const today = new Date().toISOString().split("T")[0];
  const CLOUD_NAME = "dirsttw39";


  const defaultData = {
    book_id: "",
    isbn: "",
    bookName: "",
    author: "",
    publishedYear: "",
    studentId: studentId,
    issueDate: today,
    dueDate: calculateDueDate(today),
    genre: "",
  };

  const { formData, handleInputChange, setFormData } = useBookForm(defaultData);

  const handleDueDate = (e) => {
    const newIssueDate = e.target.value;
    const newDueDate = calculateDueDate(newIssueDate);
    handleInputChange("issueDate", newIssueDate);
    handleInputChange("dueDate", newDueDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData.book_id);
      const res = await api.post(
        `/books/${formData.book_id}/requests`,
        { formData },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success(res.data.message || "✅ Book request submitted successfully!");
        // Reset the form
        setFormData(defaultData);
      }
    } catch (error) {
      console.error("Error requesting book:", error);
      toast.error("❌ Unable to request this book!");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Book</h1>
          <p className="text-slate-600 text-lg">Request a book by filling out the form below</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Book Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center space-x-3 mb-8">
              <BookOpen className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-900">Book Details</h2>
            </div>

            <div className="text-center">
              {formData.bookName ? (
                <>
                  <div className="relative mx-auto w-48 h-64 transform transition-transform duration-300 hover:scale-105 rounded-lg mb-8">
                    {formData.image ? (
                     <img
                       src={formData.image ? `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${formData.image}` : "/book.png"}
                       alt={formData.bookName}
                       className="w-full h-full object-cover rounded-lg shadow-xl"
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
                       <div className="text-lg leading-tight mb-2">{formData.bookName}</div>
                       <div className="text-sm opacity-90">{formData.author}</div>
                     </div>
                   )}
                  </div>            
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">{formData.bookName}</h3>
                    <p className="text-gray-600">by {formData.author}</p>
                    <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      ● Available
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pt-8 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-gray-600 text-sm">Genre</p>
                      <p className="font-semibold text-gray-900">{formData.genre}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 text-sm">Published Year</p>
                      <p className="font-semibold text-gray-900">{formData.publishedYear}</p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-400 italic">No book selected. Fill form manually or go back to select a book.</p>
              )}
            </div>
          </div>

          {/* Issue Book Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center space-x-3 mb-8">
              <Calendar className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-900">Request Book Form</h2>
            </div>

            <div className="space-y-6">
              <FormInput
                label="ISBN Number"
                value={formData.isbn}
                onChange={(e) => handleInputChange('isbn', e.target.value)}
                disabled={formData.disabled || false}
              />

              <FormInput
                label="Book Name"
                value={formData.bookName}
                onChange={(e) => handleInputChange('bookName', e.target.value)}
                disabled={formData.disabled || false}
              />

              <FormInput
                label="Student ID"
                value={formData.studentId}
                onChange={(e) => handleInputChange('studentId', e.target.value)}
                placeholder="Enter student ID"
                required={true}
                disabled={true}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Issue Date"
                  value={formData.issueDate}
                   onChange={handleDueDate}
                  type="date"
                  disabled={false}
                />

                <FormInput
                  label="Due Date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  type="date"
                  required={true}
                  disabled={true}
                />
              </div>

              <div className="flex space-x-4 pt-8">
                <Button onClick={handleSubmit}
                variant="primary" className="flex-1 w-full">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Request Book
                </Button>
                <Button onClick={() => setFormData(defaultData)}
                 variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Info className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold text-blue-900">Important Notes</h3>
          </div>
          <div className="space-y-2 text-blue-800">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Default loan period is 14 days</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Students can renew books once if no reservations exist</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Late returns incur a fine of $0.50 per day</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestBookPage;
