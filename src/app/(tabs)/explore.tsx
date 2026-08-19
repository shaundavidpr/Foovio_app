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
import { Search, UtensilsCrossed, X } from "lucide-react-native";

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

      setDishes((data ?? []) as unknown as Dish[]);
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
      <StatusBar style="light" />

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
          <Search size={18} color="#7F8C9D" />

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
              <X size={18} color="#7F8C9D" />
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
            <View style={styles.emptyIconWrap}>
              <UtensilsCrossed size={30} color="#111827" />
            </View>

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
                      <UtensilsCrossed
                        size={28}
                        color="#dce5f0"
                      />
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
                  <View style={styles.emptyIconWrap}>
                    <UtensilsCrossed size={26} color="#dce5f0" />
                  </View>

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
    backgroundColor: "#05080D",
  },

  content: {
    paddingTop: 55,
    paddingBottom: 40,
  },

  title: {
    paddingHorizontal: 21,
    color: "#F7FAFF",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1,
  },

  subtitle: {
    paddingHorizontal: 21,
    color: "#7F8C9D",
    fontSize: 11,
    marginTop: 6,
  },

  search: {
    marginHorizontal: 21,
    marginTop: 24,
    height: 56,
    borderRadius: 20,
    backgroundColor: "#0B111A",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.055)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  searchIcon: {
    color: "#73C7FF",
    fontSize: 22,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    color: "#F7FAFF",
    fontSize: 14,
  },

  clear: {
    color: "#7F8C9D",
    fontSize: 24,
    paddingHorizontal: 5,
  },

  categories: {
    paddingHorizontal: 21,
    gap: 9,
    marginTop: 20,
  },

  category: {
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.055)",
    backgroundColor: "#0B111A",
  },

  categoryActive: {
    backgroundColor: "#2E9BFF",
    borderColor: "#2E9BFF",
  },

  categoryText: {
    color: "#7F8C9D",
    fontSize: 11,
    fontWeight: "800",
  },

  categoryTextActive: {
    color: "#F7FAFF",
  },

  loadingContainer: {
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
  },

  loadingText: {
    color: "#7F8C9D",
    fontSize: 11,
    marginTop: 12,
  },

  errorContainer: {
    minHeight: 300,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
  },

  sectionHeader: {
    paddingHorizontal: 21,
    marginTop: 32,
    marginBottom: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    color: "#F7FAFF",
    fontSize: 20,
    fontWeight: "900",
  },

  resultCount: {
    color: "#7F8C9D",
    fontSize: 9,
    fontWeight: "700",
  },

  results: {
    paddingHorizontal: 21,
    gap: 27,
  },

  card: {
    width: "100%",
    backgroundColor: "#0B111A",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.055)",
    padding: 11,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 190,
    borderRadius: 17,
    backgroundColor: "#101925",
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
    marginTop: 13,
  },

  dishName: {
    flex: 1,
    color: "#F7FAFF",
    fontSize: 15,
    fontWeight: "900",
  },

  rating: {
    color: "#FFD166",
    fontSize: 10,
    fontWeight: "900",
    marginLeft: 10,
  },

  restaurant: {
    color: "#7F8C9D",
    fontSize: 10,
    marginTop: 5,
  },

  meta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  metaText: {
    color: "#73C7FF",
    fontSize: 9,
    fontWeight: "800",
  },

  dot: {
    color: "#4D5867",
    marginHorizontal: 8,
  },

  price: {
    color: "#DCE5F0",
    fontSize: 10,
    fontWeight: "900",
  },

  empty: {
    alignItems: "center",
    paddingTop: 60,
  },

  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#111B2B",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyIcon: {
    fontSize: 38,
  },

  emptyTitle: {
    color: "#F7FAFF",
    fontSize: 19,
    fontWeight: "900",
    marginTop: 13,
  },

  emptyText: {
    color: "#7F8C9D",
    fontSize: 10,
    textAlign: "center",
    marginTop: 7,
  },

  resetButton: {
    backgroundColor: "#2E9BFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 20,
  },

  resetText: {
    color: "#F7FAFF",
    fontSize: 10,
    fontWeight: "900",
  },
});