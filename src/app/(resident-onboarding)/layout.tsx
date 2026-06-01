/**
 * Minimal layout for resident invitation/onboarding pages.
 * No dashboard sidebar, no estate picker, no auth guards.
 */
export default function ResidentOnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}