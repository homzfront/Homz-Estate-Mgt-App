import React from 'react';
/**
 * Override layout for resident invitation pages.
 * These are public-facing onboarding pages — they should not inherit
 * the dashboard's min-w-[1200px] constraint from the parent resident layout.
 */
export default function InvitationsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full min-w-0">
            {children}
        </div>
    );
}