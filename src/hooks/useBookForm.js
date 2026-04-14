import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useBookForm = (defaultData) => {
  const location = useLocation();
  const bookData = location.state?.book; // get book data from navigation
  const [formData, setFormData] = useState(defaultData);

  useEffect(() => {
    
    if (bookData) {
      setFormData((prev) => ({
      ...prev,   // ✅ keep existing fields
      book_id: bookData.book_id || "",
      image: bookData.image || "",
      isbn: bookData.ISBN || "",
      bookName: bookData.title || "",
      author: bookData.author || "",
      genre: bookData.genre || "",
      publishedYear: bookData.date ? new Date(bookData.date).getFullYear() : "N/A",
      disabled: true,
      issueDate: new Date().toISOString().split("T")[0],
    }));
    } else {
      setFormData(defaultData);
    }
  }, [bookData]);


  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return { formData, handleInputChange, setFormData };
};

