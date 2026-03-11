import { renderHook, act } from '@testing-library/react';
import { useProperNouns } from '@/hooks/useProperNouns';
import { useSettingsStore } from '@/stores/settingsStore';
import { PROPER_NOUNS } from '@/lib/proper-nouns';

beforeEach(() => {
  useSettingsStore.setState({
    highlightProperNouns: true,
    highlightStyle: 'italic',
  });
});

describe('useProperNouns', () => {
  it('returns highlight settings from store', () => {
    const { result } = renderHook(() => useProperNouns());
    expect(result.current.highlightEnabled).toBe(true);
    expect(result.current.highlightStyle).toBe('italic');
  });

  it('setHighlightEnabled updates the setting', () => {
    const { result } = renderHook(() => useProperNouns());
    act(() => {
      result.current.setHighlightEnabled(false);
    });
    expect(result.current.highlightEnabled).toBe(false);
  });

  it('setHighlightStyle updates the setting', () => {
    const { result } = renderHook(() => useProperNouns());
    act(() => {
      result.current.setHighlightStyle('bold');
    });
    expect(result.current.highlightStyle).toBe('bold');
  });

  it('findInText returns matches when highlight is enabled', () => {
    const { result } = renderHook(() => useProperNouns());
    const matches = result.current.findInText('아브라함이 이삭을 낳고', 'ko');
    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(matches.some((m) => m.noun.korean === '아브라함')).toBe(true);
  });

  it('findInText returns empty when highlight is disabled', () => {
    useSettingsStore.setState({ highlightProperNouns: false });
    const { result } = renderHook(() => useProperNouns());
    const matches = result.current.findInText('아브라함이 이삭을 낳고', 'ko');
    expect(matches).toEqual([]);
  });

  it('search finds proper nouns by query', () => {
    const { result } = renderHook(() => useProperNouns());
    const results = result.current.search('Abraham');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((n) => n.english === 'Abraham')).toBe(true);
  });

  it('search with Korean query', () => {
    const { result } = renderHook(() => useProperNouns());
    const results = result.current.search('아브라함');
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('getByType returns nouns of specific type', () => {
    const { result } = renderHook(() => useProperNouns());
    const people = result.current.getByType('person');
    expect(people.length).toBeGreaterThan(0);
    expect(people.every((n) => n.type === 'person')).toBe(true);
  });

  it('getById returns a specific noun', () => {
    const { result } = renderHook(() => useProperNouns());
    const noun = result.current.getById('adam');
    expect(noun).toBeDefined();
    expect(noun?.english).toBe('Adam');
  });

  it('getById returns undefined for non-existent id', () => {
    const { result } = renderHook(() => useProperNouns());
    const noun = result.current.getById('nonexistent');
    expect(noun).toBeUndefined();
  });

  it('allNouns returns the full list', () => {
    const { result } = renderHook(() => useProperNouns());
    expect(result.current.allNouns).toBe(PROPER_NOUNS);
  });
});
