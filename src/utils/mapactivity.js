import { formatDate, DateinNumberic } from "./Date";
import {  
  BookOpen,  
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

export const mapActivities = (apiData) => {
  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);

  return apiData.flatMap((book, index) => {
    const activities = [];

    const issueDate = book.issue_date ? new Date(book.issue_date) : null;
    const dueDate = book.due_date ? new Date(book.due_date) : null;
    const returnDate = book.return_date ? new Date(book.return_date) : null;

    // ✅ 1. Books issued in the last 7 days
    if (issueDate && issueDate >= oneWeekAgo) {
      activities.push({
        id: `${index}-issue`,
        action: `You Borrowed "${book.title}"`,
        time: `Issued on ${formatDate(book.issue_date)}`,
        icon: BookOpen,
        iconColor: "bg-teal-500",
        divColor: "bg-green-100 border-green-300",
        action2: `Borrowed "${book.title}"`, 
        time2: `${DateinNumberic(today,issueDate)} days ago`, 
        type: 'borrow'
      });
    }

    // ✅ 2. Books with due date in next 3 days (but not yet returned)
    if (dueDate && !returnDate) {
      const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      if (diffDays > 0 && diffDays <= 3) {
        activities.push({
          id: `${index}-due-soon`,
          action: `Return due soon for "${book.title}"`,
          time: `Due: ${formatDate(book.due_date)} (${diffDays} day${diffDays > 1 ? "s" : ""} left)`,
          icon: AlertTriangle,
          iconColor: "bg-yellow-500",
          divColor: "bg-amber-100 border-amber-300",
        });
      }
    }

    // ✅ 3. Overdue books (due date passed and not returned)
    if (dueDate && !returnDate && dueDate < today) {
      const overdueDays = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
      activities.push({
        id: `${index}-overdue`,
        action: `"${book.title}" is overdue by ${overdueDays} day${overdueDays > 1 ? "s" : ""}`,
        time: `Was due: ${formatDate(book.due_date)}`,
        icon: AlertTriangle,
        iconColor: "bg-red-500",
        divColor: "bg-yellow-100 border-yellow-300",
        action2: `Borrowed "${book.title}"`, 
        time2: `${DateinNumberic(today,issueDate)} days ago`, 
        type: 'borrow'
      });
    }

    // ✅ 4. Optional: If book was just returned this week
    if (returnDate && returnDate >= oneWeekAgo) {
      activities.push({
        id: `${index}-return`,
        action: `You returned "${book.title}"`,
        time: `Returned on ${formatDate(book.return_date)}`,
        icon: CheckCircle,
        iconColor: "bg-green-500",
        divColor: "bg-teal-100 border-teal-300"
      });
    }
    // console.log(activities);
    return activities;
  });
};

export const recentActivities = (apiData) => {
  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);

  return apiData.flatMap((book, index) => {
    const activities = [];

    const issueDate = book.issue_date ? new Date(book.issue_date) : null;
    const returnDate = book.return_date ? new Date(book.return_date) : null;
    
    // ✅ 1. Books issued in the last 7 days
    if (issueDate && issueDate >= oneWeekAgo) {
      activities.push({
        id: `${index}-issue`,
        action: `Borrowed "${book.title}"`, 
        time: `${DateinNumberic(today,issueDate)} days ago`, 
        type: 'borrow'
      });
    }

    if (returnDate && returnDate >= oneWeekAgo) {
      activities.push({
        id: `${index}-return`,
        action: `Returned "${book.title}"`, 
        time: `${DateinNumberic(today,returnDate)} days ago`, 
        type: 'return'
      });
    }
    
    return activities;
  });
};

