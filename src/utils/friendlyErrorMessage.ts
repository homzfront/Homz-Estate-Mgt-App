/**
 * Utility function to extract and format user-friendly error messages
 * Handles various error response formats from the API
 */
export function getFriendlyErrorMessage(error: any): string {
    // Try to extract error message from various possible locations

    // Primary error message from backend errors array
    const primaryError = error?.response?.data?.errors?.[0]?.message;
    if (primaryError) return primaryError;

    // Backend main message
    const backendMessage = error?.response?.data?.message;
    if (backendMessage && typeof backendMessage === 'string') return backendMessage;

    // Backend message as array (first element)
    const backendMessageArray = error?.response?.data?.message?.[0];
    if (backendMessageArray) return backendMessageArray;

    // Error object message property
    const errorMessage = error?.message;
    if (errorMessage) return errorMessage;

    // HTTP status based generic messages
    const status = error?.response?.status;
    if (status === 400) return "Invalid request. Please check your input and try again.";
    if (status === 401) return "Session expired. Please log in again.";
    if (status === 403) return "You don't have permission to perform this action.";
    if (status === 404) return "Resource not found.";
    if (status === 409) return "This action conflicts with existing data. Please try again.";
    if (status === 422) return "Please check your input and try again.";
    if (status === 500) return "Server error. Please try again later.";
    if (status === 503) return "Service unavailable. Please try again later.";

    // Fallback
    return "An error occurred. Please try again.";
}
