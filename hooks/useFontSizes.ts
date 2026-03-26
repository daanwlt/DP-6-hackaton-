import { useRoosterSettings } from '../context/RoosterSettingsContext';

export function useDynamicFontSize(baseSize: number): number {
  const { groterLettertype } = useRoosterSettings();

  // Increase font size by x% when groter lettertype is enabled
  return groterLettertype ? Math.round(baseSize * 1.5) : baseSize;
}

// Predefined font sizes for common use cases
export function useFontSizes() {
  const { groterLettertype } = useRoosterSettings();
  const multiplier = groterLettertype ? 1.5 : 1;

  return {
    small: Math.round(12 * multiplier),
    medium: Math.round(16 * multiplier),
    large: Math.round(18 * multiplier),
    xlarge: Math.round(20 * multiplier),
    xxlarge: Math.round(24 * multiplier),
    xxxlarge: Math.round(28 * multiplier),
  };
}