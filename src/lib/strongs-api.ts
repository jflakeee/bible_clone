import { StrongsEntry } from '@/types/bible';

// Strong's dictionaries are .js files with var assignments, not pure JSON.
// We fetch them, strip the var assignment, and parse the JSON object.
const STRONGS_HEBREW_URL =
  'https://raw.githubusercontent.com/openscriptures/strongs/master/hebrew/strongs-hebrew-dictionary.js';
const STRONGS_GREEK_URL =
  'https://raw.githubusercontent.com/openscriptures/strongs/master/greek/strongs-greek-dictionary.js';

let hebrewCache: Record<string, RawStrongsEntry> | null = null;
let greekCache: Record<string, RawStrongsEntry> | null = null;

interface RawStrongsEntry {
  lemma?: string;
  xlit?: string;      // Hebrew transliteration key
  translit?: string;   // Greek transliteration key
  pron?: string;       // Hebrew pronunciation (Greek entries lack this)
  derivation?: string;
  strongs_def?: string;
  kjv_def?: string;
}

/**
 * Parse the .js file content into a plain object.
 * The files look like: var strongsHebrewDictionary = { ... }
 * We strip everything before the first '{' and after the last '}'.
 */
function parseStrongsJs(text: string): Record<string, RawStrongsEntry> {
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error('Failed to parse Strong\'s dictionary JS file');
  }
  const jsonStr = text.slice(firstBrace, lastBrace + 1);
  return JSON.parse(jsonStr);
}

async function getHebrewDict(): Promise<Record<string, RawStrongsEntry>> {
  if (!hebrewCache) {
    const res = await fetch(STRONGS_HEBREW_URL);
    if (!res.ok) throw new Error(`Failed to fetch Hebrew dictionary: ${res.status}`);
    const text = await res.text();
    hebrewCache = parseStrongsJs(text);
  }
  return hebrewCache;
}

async function getGreekDict(): Promise<Record<string, RawStrongsEntry>> {
  if (!greekCache) {
    const res = await fetch(STRONGS_GREEK_URL);
    if (!res.ok) throw new Error(`Failed to fetch Greek dictionary: ${res.status}`);
    const text = await res.text();
    greekCache = parseStrongsJs(text);
  }
  return greekCache;
}

/**
 * Look up a single Strong's entry by number (e.g. "H1234" or "G5678").
 */
export async function getStrongsEntry(number: string): Promise<StrongsEntry | null> {
  const normalized = number.toUpperCase().trim();
  if (!/^[HG]\d+$/.test(normalized)) return null;

  const isHebrew = normalized.startsWith('H');
  const dict = isHebrew ? await getHebrewDict() : await getGreekDict();
  const entry = dict[normalized];
  if (!entry) return null;

  const definition = [entry.derivation, entry.strongs_def]
    .filter(Boolean)
    .join(' ')
    .trim();

  return {
    number: normalized,
    lemma: entry.lemma || '',
    transliteration: entry.xlit || entry.translit || '',
    pronunciation: entry.pron || '',
    definition,
    shortDefinition: entry.kjv_def || '',
    language: isHebrew ? 'hebrew' : 'greek',
  };
}

/**
 * Search Strong's entries by English keyword across both dictionaries.
 * Returns up to `limit` matching entries.
 */
export async function searchStrongs(
  query: string,
  limit: number = 50
): Promise<StrongsEntry[]> {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const [hebrewDict, greekDict] = await Promise.all([
    getHebrewDict(),
    getGreekDict(),
  ]);

  const results: StrongsEntry[] = [];

  for (const [dict, lang] of [
    [hebrewDict, 'hebrew'] as const,
    [greekDict, 'greek'] as const,
  ]) {
    for (const [key, entry] of Object.entries(dict)) {
      if (results.length >= limit) break;

      const kjv = (entry.kjv_def || '').toLowerCase();
      const def = (entry.strongs_def || '').toLowerCase();
      const lemma = (entry.lemma || '').toLowerCase();
      const translit = (entry.xlit || entry.translit || '').toLowerCase();

      if (
        kjv.includes(q) ||
        def.includes(q) ||
        lemma.includes(q) ||
        translit.includes(q) ||
        key.toLowerCase() === q
      ) {
        const definition = [entry.derivation, entry.strongs_def]
          .filter(Boolean)
          .join(' ')
          .trim();

        results.push({
          number: key,
          lemma: entry.lemma || '',
          transliteration: entry.xlit || entry.translit || '',
          pronunciation: entry.pron || '',
          definition,
          shortDefinition: entry.kjv_def || '',
          language: lang,
        });
      }
    }
  }

  return results;
}
