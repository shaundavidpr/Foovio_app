import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

const categories = [
  "All",
  "Biryani",
  "Burgers",
  "Pizza",
  "Cafe",
  "Desserts",
];

const dishes = [
  {
    id: 1,
    name: "Chicken Biryani",
    category: "Biryani",
    restaurant: "Rahmaniya Kitchen",
    distance: "1.2 km",
    rating: "4.7",
    price: "₹180",
    image:
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800",
  },
  {
    id: 2,
    name: "Loaded Beef Burger",
    category: "Burgers",
    restaurant: "Burger Junction",
    distance: "2.4 km",
    rating: "4.5",
    price: "₹220",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
  },
  {
    id: 3,
    name: "Margherita Pizza",
    category: "Pizza",
    restaurant: "Napoli",
    distance: "3.1 km",
    rating: "4.8",
    price: "₹290",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",
  },
  {
    id: 4,
    name: "Chocolate Cheesecake",
    category: "Desserts",
    restaurant: "Sugar House",
    distance: "1.8 km",
    rating: "4.6",
    price: "₹160",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
  },
];

export default function Explore() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const results = dishes.filter((dish) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      dish.name.toLowerCase().includes(query) ||
      dish.restaurant.toLowerCase().includes(query) ||
      dish.category.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === "All" ||
      dish.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Explore</Text>

        <Text style={styles.subtitle}>
          Find your next favourite dish.
        </Text>

        <View style={styles.search}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Dish, restaurant or craving"
            placeholderTextColor="#999999"
            style={styles.searchInput}
          />

          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Text style={styles.clear}>×</Text>
            </Pressable>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {categories.map((category) => {
            const active = category === selectedCategory;

            return (
              <Pressable
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.category,
                  active && styles.categoryActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    active && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {search ? "Search results" : "Discover near you"}
          </Text>

          <Text style={styles.resultCount}>
            {results.length} {results.length === 1 ? "result" : "results"}
          </Text>
        </View>

        <View style={styles.results}>
          {results.map((dish) => (
            <Pressable key={dish.id} 
              style={styles.card}
              onPress={() => router.push(`/dish/${dish.id}`)}
            >
              <Image
                source={{ uri: dish.image }}
                style={styles.image}
              />

              <View style={styles.cardTop}>
                <Text style={styles.dishName}>
                  {dish.name}
                </Text>

                <Text style={styles.rating}>
                  ★ {dish.rating}
                </Text>
              </View>

              <Text style={styles.restaurant}>
                {dish.restaurant}
              </Text>

              <View style={styles.meta}>
                <Text style={styles.metaText}>
                  {dish.distance}
                </Text>

                <Text style={styles.dot}>•</Text>

                <Text style={styles.price}>
                  {dish.price}
                </Text>
              </View>
            </Pressable>
          ))}

          {results.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🍽️</Text>

              <Text style={styles.emptyTitle}>
                Nothing found
              </Text>

              <Text style={styles.emptyText}>
                Try another dish, restaurant or category.
              </Text>

              <Pressable
                style={styles.resetButton}
                onPress={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
              >
                <Text style={styles.resetText}>
                  Reset search
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    paddingTop: 55,
    paddingBottom: 40,
  },

  title: {
    paddingHorizontal: 22,
    color: "#111111",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -1,
  },

  subtitle: {
    paddingHorizontal: 22,
    color: "#777777",
    fontSize: 15,
    marginTop: 5,
  },

  search: {
    marginHorizontal: 22,
    marginTop: 24,
    height: 56,
    borderRadius: 17,
    backgroundColor: "#F5F5F5",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  searchIcon: {
    color: "#555555",
    fontSize: 22,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    color: "#111111",
    fontSize: 15,
  },

  clear: {
    color: "#777777",
    fontSize: 24,
    paddingHorizontal: 5,
  },

  categories: {
    paddingHorizontal: 22,
    gap: 9,
    marginTop: 20,
  },

  category: {
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
  },

  categoryActive: {
    backgroundColor: "#29A9EA",
    borderColor: "#29A9EA",
  },

  categoryText: {
    color: "#555555",
    fontSize: 13,
    fontWeight: "600",
  },

  categoryTextActive: {
    color: "#FFFFFF",
  },

  sectionHeader: {
    paddingHorizontal: 22,
    marginTop: 32,
    marginBottom: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    color: "#111111",
    fontSize: 20,
    fontWeight: "800",
  },

  resultCount: {
    color: "#999999",
    fontSize: 12,
  },

  results: {
    paddingHorizontal: 22,
    gap: 27,
  },

  card: {
    width: "100%",
  },

  image: {
    width: "100%",
    height: 190,
    borderRadius: 20,
    backgroundColor: "#EEEEEE",
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 11,
  },

  dishName: {
    flex: 1,
    color: "#111111",
    fontSize: 17,
    fontWeight: "700",
  },

  rating: {
    color: "#222222",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 10,
  },

  restaurant: {
    color: "#666666",
    fontSize: 13,
    marginTop: 4,
  },

  meta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  metaText: {
    color: "#999999",
    fontSize: 12,
  },

  dot: {
    color: "#BBBBBB",
    marginHorizontal: 8,
  },

  price: {
    color: "#555555",
    fontSize: 12,
    fontWeight: "700",
  },

  empty: {
    alignItems: "center",
    paddingTop: 60,
  },

  emptyIcon: {
    fontSize: 38,
  },

  emptyTitle: {
    color: "#111111",
    fontSize: 19,
    fontWeight: "700",
    marginTop: 13,
  },

  emptyText: {
    color: "#888888",
    fontSize: 14,
    textAlign: "center",
    marginTop: 7,
  },

  resetButton: {
    backgroundColor: "#29A9EA",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },

  resetText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});