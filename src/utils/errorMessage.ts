/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Maps raw backend/technical error messages to user-friendly versions.
 */
export function getErrorMessage(error: any, fallback = 'Something went wrong. Please try again.'): string {
    const raw =
        error?.response?.data?.errors?.[0]?.message ||
        error?.response?.data?.message ||
        (Array.isArray(error?.response?.data?.message) ? error.response.data.message[0] : null) ||
        error?.message ||
        '';

    if (!raw) return fallback;

    const msg = raw.toLowerCase();

    // Duplicate key errors
    if (msg.includes('duplicate key') || msg.includes('e11000')) {
        if (msg.includes('phonenumber') || msg.includes('phone')) return 'This phone number is already in use. Please use a different one.';
        if (msg.includes('email')) return 'This email address is already registered.';
        if (msg.includes('apartment')) return 'This apartment is already assigned to another resident.';
        return 'A record with this information already exists.';
    }

    // Validation errors
    if (msg.includes('array must contain at least 1')) return 'Please complete all required fields before submitting.';
    if (msg.includes('missing community profile')) return 'Your session has expired. Please log in again.';
    if (msg.includes('residences')) return 'Please fill in the residence details.';
    if (msg.includes('residencytype')) return 'Please select a residency type.';
    if (msg.includes('streetname') && msg.includes('required')) return 'Street name is required.';
    if (msg.includes('building') && msg.includes('required')) return 'Building is required.';
    if (msg.includes('apartment') && msg.includes('required')) return 'Apartment is required.';

    // HTTP status codes
    if (msg.includes('status code 429') || error?.response?.status === 429) return 'Too many requests. Please wait a moment and try again.';
    if (msg.includes('status code 401') || error?.response?.status === 401) return 'Your session has expired. Please log in again.';
    if (msg.includes('status code 403') || error?.response?.status === 403) return 'You do not have permission to perform this action.';
    if (msg.includes('status code 404') || error?.response?.status === 404) return 'The requested item could not be found.';
    if (msg.includes('status code 400') || error?.response?.status === 400) return 'Invalid request. Please check the information you entered.';
    if (msg.includes('status code 500') || error?.response?.status === 500) return 'A server error occurred. Please try again later.';

    // Network
    if (msg.includes('network error') || msg.includes('failed to fetch')) return 'Unable to connect. Please check your internet connection.';

    // If message looks too technical, use fallback
    if (msg.match(/objectid|mongoclient|mongosql|cast to|mongoose|prisma|zod|unexpected token/i)) return fallback;

    // Return the original message if it seems user-readable
    return raw;
}