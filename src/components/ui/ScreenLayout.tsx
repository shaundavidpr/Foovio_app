import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import AppContainer from "./AppContainer";
import { colors, spacing } from "@/theme";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function ScreenLayout({ children, style }: Props) {
  return (
    <AppContainer style={[styles.container, style]}>
      {children}
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
});
