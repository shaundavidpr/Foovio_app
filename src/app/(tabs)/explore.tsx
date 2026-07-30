import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { supabase } from "../../lib/supabase";

type Restaurant = {
  id: string;
  name: string;
  location: string | null;
};

type Dish = {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number;
  category: string | null;
  rating: number | null;
  restaurants: Restaurant | null;
};

export default function Explore() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] =
    useState<string | null>(null);

  useEffect(() => {
    loadDishes();
  }, []);

  const loadDishes = async () => {
    try {
      setLoading(true);
      setLoadError(null);

      const { data, error } = await supabase
        .from("dishes")
        .select(`
          id,
          restaurant_id,
          name,
          description,
          image_url,
          price,
          category,
          rating,
          restaurants (
            id,
            name,
            location
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Explore loading error:", error);
        setLoadError("Couldn't load dishes.");
        return;
      }

      setDishes((data ?? []) as Dish[]);
    } catch (error) {
      console.error("Explore error:", error);
      setLoadError("Couldn't load dishes.");
    } finally {
      setLoading(false);
    }
  };

  // Build category buttons from the actual database.
  const categories = useMemo(() => {
    const databaseCategories = dishes
      .map((dish) => dish.category)
      .filter(
        (category): category is string =>
          typeof category === "string" &&
          category.trim().length > 0
      );

    return [
      "All",
      ...Array.from(new Set(databaseCategories)),
    ];
  }, [dishes]);

  const results = useMemo(() => {
    const query = search.trim().toLowerCase();

    return dishes.filter((dish) => {
      const restaurantName =
        dish.restaurants?.name ?? "";

      const category = dish.category ?? "";

      const matchesSearch =
        query.length === 0 ||
        dish.name.toLowerCase().includes(query) ||
        restaurantName.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query) ||
        (dish.description ?? "")
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        selectedCategory === "All" ||
        category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [dishes, search, selectedCategory]);

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

        {/* Search */}

        <View style={styles.search}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Dish, restaurant or craving"
            placeholderTextColor="#999999"
            style={styles.searchInput}
            autoCorrect={false}
          />

          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Text style={styles.clear}>×</Text>
            </Pressable>
          )}
        </View>

        {/* Categories */}

        {!loading && dishes.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categories}
          >
            {categories.map((category) => {
              const active =
                category === selectedCategory;

              return (
                <Pressable
                  key={category}
                  onPress={() =>
                    setSelectedCategory(category)
                  }
                  style={[
                    styles.category,
                    active && styles.categoryActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      active &&
                        styles.categoryTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {/* Loading */}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#29A9EA"
            />

            <Text style={styles.loadingText}>
              Finding food...
            </Text>
          </View>
        ) : loadError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.emptyIcon}>🍽️</Text>

            <Text style={styles.emptyTitle}>
              Couldn't load dishes
            </Text>

            <Text style={styles.emptyText}>
              Check your connection and try again.
            </Text>

            <Pressable
              style={styles.resetButton}
              onPress={loadDishes}
            >
              <Text style={styles.resetText}>
                Try again
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Results heading */}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {search
                  ? "Search results"
                  : selectedCategory !== "All"
                  ? selectedCategory
                  : "Discover near you"}
              </Text>

              <Text style={styles.resultCount}>
                {results.length}{" "}
                {results.length === 1
                  ? "result"
                  : "results"}
              </Text>
            </View>

            {/* Results */}

            <View style={styles.results}>
              {results.map((dish) => (
                <Pressable
                  key={dish.id}
                  style={styles.card}
                  onPress={() =>
                    router.push(`/dish/${dish.id}`)
                  }
                >
                  {dish.image_url ? (
                    <Image
                      source={{ uri: dish.image_url }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={[
                        styles.image,
                        styles.imagePlaceholder,
                      ]}
                    >
                      <Text
                        style={
                          styles.imagePlaceholderText
                        }
                      >
                        🍽️
                      </Text>
                    </View>
                  )}

                  <View style={styles.cardTop}>
                    <Text
                      style={styles.dishName}
                      numberOfLines={1}
                    >
                      {dish.name}
                    </Text>

                    {dish.rating !== null && (
                      <Text style={styles.rating}>
                        ★ {dish.rating}
                      </Text>
                    )}
                  </View>

                  <Text
                    style={styles.restaurant}
                    numberOfLines={1}
                  >
                    {dish.restaurants?.name ??
                      "Restaurant"}
                  </Text>

                  <View style={styles.meta}>
                    {dish.category && (
                      <>
                        <Text style={styles.metaText}>
                          {dish.category}
                        </Text>

                        <Text style={styles.dot}>
                          •
                        </Text>
                      </>
                    )}

                    <Text style={styles.price}>
                      ₹{Number(dish.price).toFixed(0)}
                    </Text>
                  </View>
                </Pressable>
              ))}

              {results.length === 0 && (
                <View style={styles.empty}>
                  <Text style={styles.emptyIcon}>
                    🍽️
                  </Text>

                  <Text style={styles.emptyTitle}>
                    Nothing found
                  </Text>

                  <Text style={styles.emptyText}>
                    Try another dish, restaurant or
                    category.
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
          </>
        )}
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

  loadingContainer: {
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
  },

  loadingText: {
    color: "#888888",
    fontSize: 13,
    marginTop: 12,
  },

  errorContainer: {
    minHeight: 300,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
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

  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  imagePlaceholderText: {
    fontSize: 42,
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