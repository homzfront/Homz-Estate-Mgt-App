
// Convert calculatedDueDate to ISO 8601 format with end-of-day time for submission
export const formatDueDateForSubmission = (calculatedDueDate: string | null) => {
    if (!calculatedDueDate) return null;

    // Handle MM/DD/YYYY format
    const [month, day, year] = calculatedDueDate.split('/').map(Number);

    if (!year || !month || !day) return null; // Guard against invalid split

    const dueDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
    return dueDate.toISOString();
};