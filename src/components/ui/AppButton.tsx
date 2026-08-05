import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

import {
  colors,
  radius,
  spacing,
} from "@/theme";

type Props = {
  title: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
};

export default function AppButton({
  title,
  onPress,
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={styles.text}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  text: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
});