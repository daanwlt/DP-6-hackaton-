import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { SCREEN_BACKGROUND } from '../constants/colors';
import { AppHeader } from './AppHeader';

const DEFAULT_BG = SCREEN_BACKGROUND;

export type ScreenWithHeaderProps = {
  children?: ReactNode;
  onMenuPress?: () => void;
  onSettingsPress?: () => void;
  /** Achterkleur van het scherm onder de header (default: wireframe-geel) */
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  /** Extra op de inhoud-container (body) onder de header */
  contentContainerStyle?: StyleProp<ViewStyle>;
};

/** Zelfde header + body als op het startscherm; wrap hier je pagina-inhoud in. */
export function ScreenWithHeader({
  children,
  onMenuPress,
  onSettingsPress,
  backgroundColor = DEFAULT_BG,
  style,
  contentContainerStyle,
}: ScreenWithHeaderProps) {
  return (
    <View style={[styles.root, { backgroundColor }, style]}>
      <AppHeader onMenuPress={onMenuPress} onSettingsPress={onSettingsPress} />
      <View style={[styles.body, contentContainerStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
});
