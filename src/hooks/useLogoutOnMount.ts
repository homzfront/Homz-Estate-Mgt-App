import { useEffect, useRef } from 'react';
import { useAuthSlice } from '@/store/authStore';

/**
 * Silently clears any existing auth session when an invitation page mounts.
 * Does NOT redirect to /login — invitation pages handle their own flow.
 */
export function useLogoutOnMount() {
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const silentLogout = async () => {
            try {
                await fetch('/api/logout', { method: 'POST', credentials: 'include' });
                // Clear auth store directly — avoids the window.location.href = "/login" in logOutUser()
                useAuthSlice.setState({
                    userData: null,
                    communityProfile: null,
                    residentProfile: null,
                    estatesData: null,
                });
                localStorage.removeItem('auth');
            } catch {
                // Silent
            }
        };

        silentLogout();
    }, []);
}