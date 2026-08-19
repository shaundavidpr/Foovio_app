import { Appearance } from "react-native";

const darkColors = {
  // Main surfaces — matches Home
  background: "#05080D",
  surface: "#0B111A",
  surfaceSecondary: "#101925",

  // Brand
  primary: "#F7FAFF",
  accent: "#2E9BFF",
  accentLight: "#73C7FF",

  // Text
  textPrimary: "#F7FAFF",
  textSecondary: "#DCE5F0",
  textMuted: "#7F8C9D",

  // Borders
  border: "rgba(255,255,255,0.055)",
  borderStrong: "rgba(255,255,255,0.10)",

  // States
  success: "#4ADE80",
  warning: "#FFD166",
  danger: "#EF4444",

  // Accent variants
  accentSoft: "rgba(46,155,255,0.10)",
  accentMedium: "rgba(46,155,255,0.20)",

  // Overlay
  overlay: "rgba(5,8,13,0.68)",

  // Home-specific
  gold: "#FFD166",

  // Compatibility aliases
  white: "#F7FAFF",
  text: "#DCE5F0",
  muted: "#7F8C9D",
  blue: "#2E9BFF",
  blueLight: "#73C7FF",
  surface2: "#101925",
};

const lightColors = {
  background: "#F4F7FB",
  surface: "#FFFFFF",
  surfaceSecondary: "#EEF3F9",

  primary: "#111827",
  accent: "#2E9BFF",
  accentLight: "#5DB5FF",

  textPrimary: "#111827",
  textSecondary: "#1F2937",
  textMuted: "#6B7280",

  border: "rgba(17,24,39,0.08)",
  borderStrong: "rgba(17,24,39,0.14)",

  success: "#16A34A",
  warning: "#D97706",
  danger: "#DC2626",

  accentSoft: "rgba(46,155,255,0.12)",
  accentMedium: "rgba(46,155,255,0.20)",

  overlay: "rgba(15,23,42,0.42)",
  gold: "#D97706",

  white: "#FFFFFF",
  text: "#1F2937",
  muted: "#6B7280",
  blue: "#2E9BFF",
  blueLight: "#5DB5FF",
  surface2: "#EEF3F9",
};

const systemScheme = Appearance.getColorScheme() ?? "dark";

export const colors =
  systemScheme === "light" ? lightColors : darkColors;

export const theme = {
  isDark: systemScheme === "dark",
  colors,
};
