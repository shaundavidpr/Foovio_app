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
    fontWeight: "900",
    color: colors.white,
  },

  title: {
    fontSize: typography.title,
    fontWeight: "900",
    color: colors.white,
  },

  heading: {
    fontSize: typography.heading,
    fontWeight: "800",
    color: colors.white,
  },

  body: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.text,
  },

  small: {
    fontSize: typography.small,
    fontWeight: "700",
    color: colors.muted,
  },

  caption: {
    fontSize: typography.caption,
    fontWeight: "800",
    color: colors.muted,
  },
});