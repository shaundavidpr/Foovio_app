import React from "react";
import {
  SafeAreaView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";

import {
  colors,
  spacing,
} from "@/theme";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function AppContainer({
  children,
  style,
}: Props) {
  return (
    <SafeAreaView
      style={[styles.container, style]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },
});