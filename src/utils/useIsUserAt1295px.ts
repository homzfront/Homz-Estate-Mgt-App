import { useState, useEffect } from 'react';

function useIsUserAt1295px() {
  const [isAt1295px, setIsAt1295px] = useState(false); // Initial state for SSR.

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Update state based on initial window size.
      setIsAt1295px(window.innerWidth >= 1295);

      const handleResize = () => {
        setIsAt1295px(window.innerWidth >= 1295);
      };

      // Add event listener for window resize.
      window.addEventListener('resize', handleResize);

      // Cleanup event listener on unmount.
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return isAt1295px;
}

export default useIsUserAt1295px;
