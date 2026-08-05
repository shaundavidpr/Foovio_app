import React from "react";
import {
  Text,
  TextProps,
  StyleSheet,
} from "react-native";

import {
  colors,
  typography,
} from "@/theme";

type Props = TextProps & {
  variant?:
    | "hero"
    | "title"
    | "heading"
    | "body"
    | "small"
    | "caption";
};

export default function AppText({
  variant = "body",
  style,
  ...props
}: Props) {
  return (
    <Text
      {...props}
      style={[
        styles[variant],
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  hero: {
    fontSize: typography.hero,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  title: {
    fontSize: typography.title,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  heading: {
    fontSize: typography.heading,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  body: {
    fontSize: typography.body,
    color: colors.textPrimary,
  },

  small: {
    fontSize: typography.small,
    color: colors.textSecondary,
  },

  caption: {
    fontSize: typography.caption,
    color: colors.textMuted,
  },
});