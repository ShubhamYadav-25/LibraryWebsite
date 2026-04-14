export const formatDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};


// Utility function to calculate due date = issue date + 12 days
export  const calculateDueDate = (issueDate) => {
  const date = new Date(issueDate);
  if (isNaN(date)) return ""; // guard for invalid input
  date.setDate(date.getDate() + 12);
  return date.toISOString().split("T")[0]; // return as yyyy-mm-dd for <input type="date">
};


export const DateinNumberic = (today = new Date, givenDate) =>{
  const diffMilliseconds = today - givenDate; 
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  const diffDays = diffMilliseconds / MS_PER_DAY;
  const finalDifference = Math.round(diffDays); 
  return finalDifference;
}