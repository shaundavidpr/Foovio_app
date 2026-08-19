import { router } from "expo-router";
import { CheckCircle2, Clock3, PackageCheck, Truck } from "lucide-react-native";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

const statuses = [
  { label: "Placed", complete: true },
  { label: "Preparing", complete: true },
  { label: "Ready", complete: false },
];

export default function OrderSuccess() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <CheckCircle2 size={36} color="#ffffff" />
        </View>

        <Text style={styles.overline}>Order confirmed</Text>
        <Text style={styles.title}>#F-2048</Text>
        <Text style={styles.subtitle}>Estimated arrival in 20–25 minutes</Text>

        <View style={styles.timeline}>
          {statuses.map((status, index) => (
            <View key={status.label} style={styles.stepItem}>
              <View style={[styles.dot, status.complete && styles.dotComplete]} />
              <Text style={[styles.stepLabel, status.complete && styles.stepLabelComplete]}>
                {status.label}
              </Text>
              {index < statuses.length - 1 ? <View style={styles.connector} /> : null}
            </View>
          ))}
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Clock3 size={16} color="#111827" />
            <Text style={styles.detailText}>20–25 min</Text>
          </View>

          <View style={styles.detailItem}>
            <Truck size={16} color="#111827" />
            <Text style={styles.detailText}>On the way</Text>
          </View>

          <View style={styles.detailItem}>
            <PackageCheck size={16} color="#111827" />
            <Text style={styles.detailText}>Fresh</Text>
          </View>
        </View>

        <Pressable style={styles.button} onPress={() => router.replace("/(tabs)")}>
          <Text style={styles.buttonText}>Back to home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#f5f7fb",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 28,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  iconWrap: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  overline: {
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "#64748b",
    fontWeight: "700",
  },
  title: {
    color: "#111827",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 8,
  },
  subtitle: {
    textAlign: "center",
    color: "#475569",
    marginTop: 8,
    fontSize: 14,
  },
  timeline: {
    width: "100%",
    marginTop: 26,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepItem: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#dfe7f5",
    borderWidth: 2,
    borderColor: "#dfe7f5",
  },
  dotComplete: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  stepLabel: {
    marginTop: 10,
    fontSize: 11,
    color: "#64748b",
    fontWeight: "600",
  },
  stepLabelComplete: {
    color: "#111827",
  },
  connector: {
    position: "absolute",
    left: "55%",
    top: 5,
    width: "90%",
    height: 2,
    backgroundColor: "#dfe7f5",
  },
  detailRow: {
    width: "100%",
    marginTop: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  detailItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#f5f7fb",
    borderRadius: 12,
    paddingVertical: 11,
  },
  detailText: {
    color: "#111827",
    fontSize: 11,
    fontWeight: "700",
  },
  button: {
    marginTop: 30,
    width: "100%",
    backgroundColor: "#111827",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
});