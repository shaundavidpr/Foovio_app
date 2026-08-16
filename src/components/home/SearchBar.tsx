import { Pressable, StyleSheet, Text, View } from "react-native";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { router } from "expo-router";

const BLUE = "#29A9EA";

export default function SearchBar() {
  return (
    <View style={styles.wrapper}>
      <Pressable
        style={({ pressed }) => [
          styles.container,
          pressed && styles.pressed,
        ]}
        onPress={() => router.push("/explore")}
      >
        <View style={styles.searchIcon}>
          <Search
            size={18}
            color="#1B2024"
            strokeWidth={2.3}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Find something delicious
          </Text>

          <Text style={styles.subtitle}>
            Dishes, restaurants & more
          </Text>
        </View>

        <View style={styles.filterButton}>
          <SlidersHorizontal
            size={17}
            color={BLUE}
            strokeWidth={2.2}
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 22,
  },

  container: {
    height: 64,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7EDF1",
    paddingLeft: 10,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#10212B",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 3,
  },

  searchIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#F1F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  textContainer: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    color: "#181C20",
    fontSize: 13,
    fontWeight: "800",
  },

  subtitle: {
    color: "#9AA1A8",
    fontSize: 10,
    marginTop: 3,
    fontWeight: "500",
  },

  filterButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#EAF7FD",
    justifyContent: "center",
    alignItems: "center",
  },

  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.95,
  },
});