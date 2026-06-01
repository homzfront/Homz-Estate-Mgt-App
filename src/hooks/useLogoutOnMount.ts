import { useEffect, useRef } from 'react';
import { useAuthSlice } from '@/store/authStore';

/**
 * Silently logs out any existing session when an invitation page mounts.
 *
 * Use case: a user opens an invitation link while already logged in as a
 * different account. Without this, their existing token fires API calls that
 * return 401, triggering the "Session Expired" overlay before they see anything.
 *
 * This hook clears the token and Zustand store on mount so the invitation page
 * always starts from a clean unauthenticated state.
 */
export function useLogoutOnMount() {
    const { logOutUser } = useAuthSlice();
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const silentLogout = async () => {
            try {
                // Clear the httpOnly cookie via the API route
                await fetch('/api/logout', { method: 'POST', credentials: 'include' });
                // Clear Zustand store state
                logOutUser();
            } catch {
                // Silent — if logout fails the page will still work,
                // the invitation pages handle their own auth state
            }
        };

        silentLogout();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}