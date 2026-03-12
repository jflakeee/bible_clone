import { VerseWord } from '@/types/bible';
import { BIBLE_BOOKS, OPEN_GNT_URL as OPEN_GNT_BASE } from '@/lib/constants';

/**
 * Original Text API - fetches Hebrew/Greek interlinear data.
 *
 * NT Greek: OpenGNT project on GitHub (word-level data with Strong's numbers)
 * OT Hebrew: Open Scriptures Hebrew Bible (morphhb) on GitHub
 *
 * For the MVP we use the STEP Bible taggedText endpoint which provides
 * word-level original language data with Strong's mappings.
 * As a fallback we generate simplified data from Strong's dictionary entries.
 */

// --- Greek NT via OpenGNT TSV ---

let greekDataCache: Map<string, VerseWord[][]> | null = null;

/**
 * Book ID mapping: our 1-based IDs (40=Matthew..66=Revelation) to
 * the two-digit book numbers used by OpenGNT (40..66 conveniently match).
 */
function ntBookNumber(bookId: number): number {
  return bookId; // OpenGNT uses the same numbering (40-66)
}

interface ParsedGreekRow {
  book: number;
  chapter: number;
  verse: number;
  word: string;
  transliteration: string;
  strongsNumber: string;
  morphology: string;
  gloss: string;
}

function parseOpenGntRow(line: string): ParsedGreekRow | null {
  // TSV columns (simplified):
  // 0: 〔Book｜Chapter｜Verse〕 e.g. 〔40｜1｜1〕
  // 1: OrderID
  // 2: OGNTsort
  // 3: 〔OGNT〕 word
  // 4: 〔lexeme｜Strong｜morph〕
  // 5: 〔transliteration〕
  // 6: 〔gloss〕
  // The actual format is more complex; we do a best-effort parse.
  const cols = line.split('\t');
  if (cols.length < 7) return null;

  // Parse reference from column 0
  const refMatch = cols[0].match(/(\d+)[｜|](\d+)[｜|](\d+)/);
  if (!refMatch) return null;

  const book = parseInt(refMatch[1], 10);
  const chapter = parseInt(refMatch[2], 10);
  const verse = parseInt(refMatch[3], 10);

  // Parse word from column 3 - strip markers
  const word = cols[3].replace(/[〔〕]/g, '').trim();

  // Parse lexeme/strong/morph from column 4
  const lexParts = cols[4].replace(/[〔〕]/g, '').split(/[｜|]/);
  const strongsNumber = (lexParts[1] || '').trim();
  const morphology = (lexParts[2] || '').trim();

  // Transliteration from column 5
  const transliteration = cols[5].replace(/[〔〕]/g, '').trim();

  // Gloss from column 6
  const gloss = cols[6].replace(/[〔〕]/g, '').trim();

  return { book, chapter, verse, word, transliteration, strongsNumber, morphology, gloss };
}

async function fetchGreekData(): Promise<Map<string, VerseWord[][]>> {
  if (greekDataCache) return greekDataCache;

  try {
    const res = await fetch(OPEN_GNT_BASE);
    if (!res.ok) throw new Error(`OpenGNT fetch failed: ${res.status}`);

    const text = await res.text();
    const lines = text.split('\n');

    const dataMap = new Map<string, Map<number, VerseWord[]>>();

    for (const line of lines) {
      if (!line.trim() || line.startsWith('#') || line.startsWith('〔Book')) continue;
      const parsed = parseOpenGntRow(line);
      if (!parsed) continue;

      const key = `${parsed.book}-${parsed.chapter}`;
      if (!dataMap.has(key)) {
        dataMap.set(key, new Map());
      }
      const chapterMap = dataMap.get(key)!;
      if (!chapterMap.has(parsed.verse)) {
        chapterMap.set(parsed.verse, []);
      }
      chapterMap.get(parsed.verse)!.push({
        word: parsed.word,
        strongsNumber: parsed.strongsNumber ? `G${parsed.strongsNumber.replace(/^G/i, '')}` : undefined,
        morphology: parsed.morphology || undefined,
        transliteration: parsed.transliteration || undefined,
        gloss: parsed.gloss || undefined,
      });
    }

    // Convert to VerseWord[][] (array indexed by verse number)
    const result = new Map<string, VerseWord[][]>();
    for (const [key, chapterMap] of dataMap) {
      const maxVerse = Math.max(...chapterMap.keys());
      const verses: VerseWord[][] = [];
      for (let v = 1; v <= maxVerse; v++) {
        verses.push(chapterMap.get(v) || []);
      }
      result.set(key, verses);
    }

    greekDataCache = result;
    return result;
  } catch {
    // Return empty map on failure
    return new Map();
  }
}

// --- Hebrew OT: simplified approach using sample data ---
// Full morphhb parsing is complex; for MVP we provide curated sample data
// for key passages and a fallback that indicates data is unavailable.

const HEBREW_SAMPLE_DATA: Record<string, VerseWord[][]> = {
  '1-1': [
    // Genesis 1:1
    [
      { word: 'בְּרֵאשִׁ֖ית', strongsNumber: 'H7225', transliteration: 'bere\'shit', gloss: 'In the beginning', morphology: 'Prep-b | N-fs' },
      { word: 'בָּרָ֣א', strongsNumber: 'H1254', transliteration: 'bara', gloss: 'created', morphology: 'V-Qal-Perf-3ms' },
      { word: 'אֱלֹהִ֑ים', strongsNumber: 'H430', transliteration: '\'elohim', gloss: 'God', morphology: 'N-mp' },
      { word: 'אֵ֥ת', strongsNumber: 'H853', transliteration: '\'et', gloss: '[obj]', morphology: 'DirObjM' },
      { word: 'הַשָּׁמַ֖יִם', strongsNumber: 'H8064', transliteration: 'hashamayim', gloss: 'the heavens', morphology: 'Art | N-mp' },
      { word: 'וְאֵ֥ת', strongsNumber: 'H853', transliteration: 've\'et', gloss: 'and [obj]', morphology: 'Conj-w | DirObjM' },
      { word: 'הָאָֽרֶץ׃', strongsNumber: 'H776', transliteration: 'ha\'arets', gloss: 'the earth', morphology: 'Art | N-fs' },
    ],
    // Genesis 1:2
    [
      { word: 'וְהָאָ֗רֶץ', strongsNumber: 'H776', transliteration: 'veha\'arets', gloss: 'And the earth', morphology: 'Conj-w | Art | N-fs' },
      { word: 'הָיְתָ֥ה', strongsNumber: 'H1961', transliteration: 'hayetah', gloss: 'was', morphology: 'V-Qal-Perf-3fs' },
      { word: 'תֹ֨הוּ֙', strongsNumber: 'H8414', transliteration: 'tohu', gloss: 'formless', morphology: 'N-ms' },
      { word: 'וָבֹ֔הוּ', strongsNumber: 'H922', transliteration: 'vavohu', gloss: 'and void', morphology: 'Conj-w | N-ms' },
      { word: 'וְחֹ֖שֶׁךְ', strongsNumber: 'H2822', transliteration: 'vechoshekh', gloss: 'and darkness', morphology: 'Conj-w | N-ms' },
      { word: 'עַל־', strongsNumber: 'H5921', transliteration: '\'al', gloss: 'over', morphology: 'Prep' },
      { word: 'פְּנֵ֣י', strongsNumber: 'H6440', transliteration: 'peney', gloss: 'the face of', morphology: 'N-cpc' },
      { word: 'תְה֑וֹם', strongsNumber: 'H8415', transliteration: 'tehom', gloss: 'the deep', morphology: 'N-cs' },
      { word: 'וְר֣וּחַ', strongsNumber: 'H7307', transliteration: 'veruach', gloss: 'And the Spirit of', morphology: 'Conj-w | N-fsc' },
      { word: 'אֱלֹהִ֔ים', strongsNumber: 'H430', transliteration: '\'elohim', gloss: 'God', morphology: 'N-mp' },
      { word: 'מְרַחֶ֖פֶת', strongsNumber: 'H7363', transliteration: 'merachefet', gloss: 'was hovering', morphology: 'V-Piel-Ptcpl-fs' },
      { word: 'עַל־', strongsNumber: 'H5921', transliteration: '\'al', gloss: 'over', morphology: 'Prep' },
      { word: 'פְּנֵ֥י', strongsNumber: 'H6440', transliteration: 'peney', gloss: 'the face of', morphology: 'N-cpc' },
      { word: 'הַמָּֽיִם׃', strongsNumber: 'H4325', transliteration: 'hamayim', gloss: 'the waters', morphology: 'Art | N-mp' },
    ],
    // Genesis 1:3
    [
      { word: 'וַיֹּ֥אמֶר', strongsNumber: 'H559', transliteration: 'vayomer', gloss: 'And said', morphology: 'Conj-w | V-Qal-ConsecImperf-3ms' },
      { word: 'אֱלֹהִ֖ים', strongsNumber: 'H430', transliteration: '\'elohim', gloss: 'God', morphology: 'N-mp' },
      { word: 'יְהִ֣י', strongsNumber: 'H1961', transliteration: 'yehi', gloss: 'Let there be', morphology: 'V-Qal-Jussive-3ms' },
      { word: 'א֑וֹר', strongsNumber: 'H216', transliteration: '\'or', gloss: 'light', morphology: 'N-ms' },
      { word: 'וַֽיְהִי־', strongsNumber: 'H1961', transliteration: 'vayehi', gloss: 'and there was', morphology: 'Conj-w | V-Qal-ConsecImperf-3ms' },
      { word: 'אֽוֹר׃', strongsNumber: 'H216', transliteration: '\'or', gloss: 'light', morphology: 'N-ms' },
    ],
  ],
  '19-23': [
    // Psalm 23:1
    [
      { word: 'מִזְמ֥וֹר', strongsNumber: 'H4210', transliteration: 'mizmor', gloss: 'A Psalm', morphology: 'N-ms' },
      { word: 'לְדָוִ֑ד', strongsNumber: 'H1732', transliteration: 'leDavid', gloss: 'of David', morphology: 'Prep-l | N-proper-ms' },
      { word: 'יְהוָ֥ה', strongsNumber: 'H3068', transliteration: 'Yahweh', gloss: 'The LORD', morphology: 'N-proper-ms' },
      { word: 'רֹ֝עִ֗י', strongsNumber: 'H7462', transliteration: 'ro\'i', gloss: 'is my shepherd', morphology: 'V-Qal-Ptcpl-msc | 1cs' },
      { word: 'לֹ֣א', strongsNumber: 'H3808', transliteration: 'lo', gloss: 'not', morphology: 'Adv-NegPrt' },
      { word: 'אֶחְסָֽר׃', strongsNumber: 'H2637', transliteration: '\'echsar', gloss: 'I shall want', morphology: 'V-Qal-Imperf-1cs' },
    ],
    // Psalm 23:2
    [
      { word: 'בִּנְא֣וֹת', strongsNumber: 'H4999', transliteration: 'bin\'ot', gloss: 'In pastures', morphology: 'Prep-b | N-fpc' },
      { word: 'דֶּ֭שֶׁא', strongsNumber: 'H1877', transliteration: 'deshe', gloss: 'green', morphology: 'N-ms' },
      { word: 'יַרְבִּיצֵ֑נִי', strongsNumber: 'H7257', transliteration: 'yarbitseni', gloss: 'He makes me lie down', morphology: 'V-Hifil-Imperf-3ms | 1cs' },
      { word: 'עַל־', strongsNumber: 'H5921', transliteration: '\'al', gloss: 'beside', morphology: 'Prep' },
      { word: 'מֵ֖י', strongsNumber: 'H4325', transliteration: 'mey', gloss: 'waters', morphology: 'N-mpc' },
      { word: 'מְנֻח֣וֹת', strongsNumber: 'H4496', transliteration: 'menuchot', gloss: 'of rest', morphology: 'N-fpc' },
      { word: 'יְנַהֲלֵֽנִי׃', strongsNumber: 'H5095', transliteration: 'yenahaleni', gloss: 'He leads me', morphology: 'V-Piel-Imperf-3ms | 1cs' },
    ],
    // Psalm 23:3
    [
      { word: 'נַפְשִׁ֥י', strongsNumber: 'H5315', transliteration: 'nafshi', gloss: 'my soul', morphology: 'N-fsc | 1cs' },
      { word: 'יְשׁוֹבֵ֑ב', strongsNumber: 'H7725', transliteration: 'yeshovev', gloss: 'He restores', morphology: 'V-Polel-Imperf-3ms' },
      { word: 'יַֽנְחֵ֥נִי', strongsNumber: 'H5148', transliteration: 'yancheni', gloss: 'He leads me', morphology: 'V-Hifil-Imperf-3ms | 1cs' },
      { word: 'בְמַעְגְּלֵי־', strongsNumber: 'H4570', transliteration: 'vema\'geley', gloss: 'in paths of', morphology: 'Prep-b | N-mpc' },
      { word: 'צֶ֝֗דֶק', strongsNumber: 'H6664', transliteration: 'tsedek', gloss: 'righteousness', morphology: 'N-ms' },
      { word: 'לְמַ֣עַן', strongsNumber: 'H4616', transliteration: 'lema\'an', gloss: 'for the sake of', morphology: 'Prep' },
      { word: 'שְׁמֽוֹ׃', strongsNumber: 'H8034', transliteration: 'shemo', gloss: 'His name', morphology: 'N-msc | 3ms' },
    ],
  ],
};

/**
 * Get original text (Hebrew or Greek) for a given book and chapter.
 * Returns an array of verses, each verse is an array of VerseWord objects.
 */
export async function getOriginalText(
  book: number,
  chapter: number
): Promise<VerseWord[][]> {
  const bookInfo = BIBLE_BOOKS.find((b) => b.id === book);
  if (!bookInfo) return [];

  if (bookInfo.testament === 'NT') {
    return getGreekText(book, chapter);
  } else {
    return getHebrewText(book, chapter);
  }
}

async function getGreekText(book: number, chapter: number): Promise<VerseWord[][]> {
  const bnNum = ntBookNumber(book);
  const key = `${bnNum}-${chapter}`;

  const data = await fetchGreekData();
  return data.get(key) || [];
}

async function getHebrewText(book: number, chapter: number): Promise<VerseWord[][]> {
  const key = `${book}-${chapter}`;
  return HEBREW_SAMPLE_DATA[key] || [];
}

/**
 * Check whether original text data is available for a given book/chapter.
 */
export function getOriginalLanguage(bookId: number): 'hebrew' | 'greek' {
  const bookInfo = BIBLE_BOOKS.find((b) => b.id === bookId);
  return bookInfo?.testament === 'NT' ? 'greek' : 'hebrew';
}
