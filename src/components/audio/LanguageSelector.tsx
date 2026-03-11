'use client';

interface LanguageInfo {
  code: string;
  nameKo: string;
  nameNative: string;
  flag: string;
}

const LANGUAGES: LanguageInfo[] = [
  { code: 'ko-KR', nameKo: '한국어', nameNative: '한국어', flag: '🇰🇷' },
  { code: 'en-US', nameKo: '영어', nameNative: 'English', flag: '🇺🇸' },
  { code: 'ja-JP', nameKo: '일본어', nameNative: '日本語', flag: '🇯🇵' },
  { code: 'zh-CN', nameKo: '중국어', nameNative: '中文', flag: '🇨🇳' },
  { code: 'es-ES', nameKo: '스페인어', nameNative: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', nameKo: '프랑스어', nameNative: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', nameKo: '독일어', nameNative: 'Deutsch', flag: '🇩🇪' },
  { code: 'he-IL', nameKo: '히브리어', nameNative: 'עברית', flag: '🇮🇱' },
  { code: 'el-GR', nameKo: '그리스어', nameNative: 'Ελληνικά', flag: '🇬🇷' },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onSelect: (code: string) => void;
  compact?: boolean;
}

export default function LanguageSelector({
  selectedLanguage,
  onSelect,
  compact = false,
}: LanguageSelectorProps) {
  if (compact) {
    return (
      <select
        value={selectedLanguage}
        onChange={(e) => onSelect(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.nameKo} ({lang.nameNative})
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
        음성 언어 선택
      </h4>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
        {LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => onSelect(lang.code)}
              className={`flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-3 text-center transition-all
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-sm dark:border-blue-400 dark:bg-blue-950'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 dark:hover:bg-gray-800'
                }`}
              title={`${lang.nameKo} (${lang.nameNative})`}
            >
              <span className="text-2xl leading-none" role="img" aria-label={lang.nameKo}>
                {lang.flag}
              </span>
              <span
                className={`text-xs font-medium ${
                  isSelected
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {lang.nameKo}
              </span>
              <span
                className={`text-[10px] ${
                  isSelected
                    ? 'text-blue-500 dark:text-blue-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {lang.nameNative}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { LANGUAGES };
export type { LanguageInfo };
