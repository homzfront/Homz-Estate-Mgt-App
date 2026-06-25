const FloatingGetAppButton = () => {
    return (
        <a
            href="#get-the-app"
            aria-label="Get the Homz App"
            className="fixed bottom-24 right-5 z-50 flex items-center gap-2 bg-BlueHomz text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-500 transition-all active:scale-95 md:bottom-5"
            style={{ animation: 'float 3.5s ease-in-out infinite' }}
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <line x1="12" y1="18" x2="12" y2="18.01" />
            </svg>
            <span className="text-[13px] font-semibold hidden sm:inline">Get the App</span>
        </a>
    )
}

export default FloatingGetAppButton