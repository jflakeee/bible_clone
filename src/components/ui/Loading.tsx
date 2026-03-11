interface LoadingProps {
  /** 표시할 텍스트 */
  text?: string;
  /** 스피너 크기: sm, md, lg */
  size?: 'sm' | 'md' | 'lg';
  /** 추가 CSS 클래스 */
  className?: string;
}

const sizeMap = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
} as const;

const textSizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
} as const;

export default function Loading({
  text,
  size = 'md',
  className = '',
}: LoadingProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 ${className}`}
      role="status"
      aria-label={text || '로딩 중'}
    >
      <svg
        className={`animate-spin text-blue-500 ${sizeMap[size]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      {text && (
        <span
          className={`text-gray-500 dark:text-gray-400 ${textSizeMap[size]}`}
        >
          {text}
        </span>
      )}
    </div>
  );
}
