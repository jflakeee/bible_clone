'use client';

import { useState, useRef, type ReactNode } from 'react';

interface TooltipProps {
  /** 툴팁에 표시할 텍스트 */
  content: string;
  /** 툴팁 위치 */
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactNode;
}

const positionClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
} as const;

const arrowClasses = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-800 dark:border-t-gray-200 border-x-transparent border-b-transparent border-4',
  bottom:
    'bottom-full left-1/2 -translate-x-1/2 border-b-gray-800 dark:border-b-gray-200 border-x-transparent border-t-transparent border-4',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-800 dark:border-l-gray-200 border-y-transparent border-r-transparent border-4',
  right:
    'right-full top-1/2 -translate-y-1/2 border-r-gray-800 dark:border-r-gray-200 border-y-transparent border-l-transparent border-4',
} as const;

export default function Tooltip({
  content,
  position = 'top',
  children,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(true);
  };

  const hide = () => {
    timeoutRef.current = setTimeout(() => setVisible(false), 100);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <div
          className={`absolute z-50 whitespace-nowrap ${positionClasses[position]}`}
          role="tooltip"
        >
          <div className="rounded-md bg-gray-800 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-gray-200 dark:text-gray-800">
            {content}
          </div>
          <div className={`absolute ${arrowClasses[position]}`} />
        </div>
      )}
    </div>
  );
}
