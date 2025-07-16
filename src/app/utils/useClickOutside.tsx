// utils/clickOutside.ts
import { RefObject, useEffect } from 'react';

type EventType = MouseEvent | TouchEvent;

const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: EventType) => void,
  excludeRefs?: RefObject<HTMLElement>[]
) => {
  useEffect(() => {
    const listener = (event: EventType) => {
      // Do nothing if clicking ref's element or descendent elements
      if (
        !ref.current ||
        ref.current.contains(event.target as Node) ||
        (excludeRefs && excludeRefs.some(r => r.current?.contains(event.target as Node)))
      ) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, excludeRefs]);
};

export default useClickOutside;