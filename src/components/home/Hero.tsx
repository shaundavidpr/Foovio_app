import { Pressable, StyleSheet, Text, View } from "react-native";
import { ArrowRight } from "lucide-react-native";

const BLUE = "#29A9EA";

export default function Hero() {
  const hour = new Date().getHours();

  let greeting = "Good evening";

  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";

  return (
    <View style={styles.container}>
      <View style={styles.eyebrowRow}>
        <View style={styles.dot} />

        <Text style={styles.eyebrow}>
          {greeting}
        </Text>
      </View>

      <Text style={styles.title}>
        What are you{"\n"}
        craving <Text style={styles.accent}>today?</Text>
      </Text>

      <Text style={styles.subtitle}>
        Discover great food from restaurants around you,
        recommended by people you trust.
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.discoverButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>
          Discover something
        </Text>

        <View style={styles.arrowCircle}>
          <ArrowRight
            size={15}
            color={BLUE}
            strokeWidth={2.6}
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 24,
  },

  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#29A9EA",
  },

  eyebrow: {
    color: "#7C858D",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.1,
  },

  title: {
    marginTop: 12,
    color: "#111518",
    fontSize: 40,
    lineHeight: 43,
    fontWeight: "900",
    letterSpacing: -1.7,
  },

  accent: {
    color: BLUE,
  },

  subtitle: {
    marginTop: 14,
    color: "#7C858D",
    fontSize: 13,
    lineHeight: 20,
    maxWidth: "92%",
  },

  discoverButton: {
    alignSelf: "flex-start",
    marginTop: 20,
    height: 44,
    paddingLeft: 16,
    paddingRight: 5,
    borderRadius: 14,
    backgroundColor: "#111518",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  arrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
});