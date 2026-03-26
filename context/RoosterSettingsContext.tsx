import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { HEADER_GREEN } from '../constants/colors';

export const DEFAULT_CLASS_CODE = 'WFHBOICT24.VB';

export const CLASS_OPTIONS = [
  'WFHBOICT24.VB',
  'WFHBOICT24.VC',
  'WFHBOICT24.VD',
] as const;

export type ClassOption = (typeof CLASS_OPTIONS)[number];

function buildDefaultAccents(): Record<string, string> {
  const o: Record<string, string> = {};
  for (const c of CLASS_OPTIONS) {
    o[c] = HEADER_GREEN;
  }
  return o;
}

type RoosterSettingsContextValue = {
  classCode: string;
  /** Accent voor de huidige `classCode` (afgeleid uit per-klas opslag). */
  accentColor: string;
  /** Per klas opgeslagen roosterkleur. */
  accentByClass: Record<string, string>;
  applyRoosterChoice: (classCode: string, accentColor: string) => void;
  /** Alleen klas wisselen; kleur volgt de opgeslagen kleur van die klas. */
  selectClass: (classCode: string) => void;
  /** Of groter lettertype is ingeschakeld */
  groterLettertype: boolean;
  /** Toggle groter lettertype */
  toggleGroterLettertype: () => void;
};

const RoosterSettingsContext = createContext<RoosterSettingsContextValue | null>(
  null,
);

export function RoosterSettingsProvider({ children }: { children: ReactNode }) {
  const [classCode, setClassCode] = useState(DEFAULT_CLASS_CODE);
  const [accentByClass, setAccentByClass] = useState<Record<string, string>>(
    buildDefaultAccents,
  );
  const [groterLettertype, setGroterLettertype] = useState(false);

  const accentColor = useMemo(
    () => accentByClass[classCode] ?? HEADER_GREEN,
    [accentByClass, classCode],
  );

  const applyRoosterChoice = useCallback((nextClass: string, nextColor: string) => {
    setClassCode(nextClass);
    setAccentByClass((prev) => ({ ...prev, [nextClass]: nextColor }));
  }, []);

  const selectClass = useCallback((nextClass: string) => {
    setClassCode(nextClass);
  }, []);

  const toggleGroterLettertype = useCallback(() => {
    setGroterLettertype((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      classCode,
      accentColor,
      accentByClass,
      applyRoosterChoice,
      selectClass,
      groterLettertype,
      toggleGroterLettertype,
    }),
    [
      classCode,
      accentColor,
      accentByClass,
      applyRoosterChoice,
      selectClass,
      groterLettertype,
      toggleGroterLettertype,
    ],
  );

  return (
    <RoosterSettingsContext.Provider value={value}>
      {children}
    </RoosterSettingsContext.Provider>
  );
}

export function useRoosterSettings() {
  const ctx = useContext(RoosterSettingsContext);
  if (!ctx) {
    throw new Error('useRoosterSettings must be used within RoosterSettingsProvider');
  }
  return ctx;
}
