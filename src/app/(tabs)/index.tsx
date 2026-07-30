import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
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
  name: string;
  description: string | null;
  image_url: string | null;
  price: number;
  category: string | null;
  rating: number | null;
  restaurant_id: string;
  restaurants: Restaurant | null;
};

export default function Home() {
  const [foods, setFoods] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

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
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Dish loading error:", error);
        setLoadError("Couldn't load dishes.");
        return;
      }

      setFoods((data ?? []) as Dish[]);
    } catch (error) {
      console.error("Home loading error:", error);
      setLoadError("Couldn't load dishes.");
    } finally {
      setLoading(false);
    }
  };

  const openDish = (id: string) => {
    router.push(`/dish/${id}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.locationLabel}>YOUR LOCATION</Text>

            <Pressable>
              <Text style={styles.location}>Kottayam⌄</Text>
            </Pressable>
          </View>

          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>F</Text>
          </View>
        </View>

        {/* Hero */}
        <Text style={styles.greeting}>
          What are you{"\n"}craving today?
        </Text>

        {/* Search */}
        <Pressable
          style={styles.search}
          onPress={() => router.push("/explore")}
        >
          <Text style={styles.searchIcon}>⌕</Text>

          <Text style={styles.searchText}>
            Search dishes, places or cravings
          </Text>
        </Pressable>

        {/* For You */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>For you</Text>

          <Pressable onPress={() => router.push("/explore")}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loadingSection}>
            <ActivityIndicator size="small" color="#29A9EA" />
            <Text style={styles.loadingText}>Finding dishes...</Text>
          </View>
        ) : loadError ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{loadError}</Text>

            <Pressable onPress={loadDishes}>
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        ) : foods.length === 0 ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>
              No dishes available yet.
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.foodRow}
          >
            {foods.map((food) => (
              <Pressable
                key={food.id}
                style={styles.foodCard}
                onPress={() => openDish(food.id)}
              >
                {food.image_url ? (
                  <Image
                    source={{ uri: food.image_url }}
                    style={styles.foodImage}
                  />
                ) : (
                  <View style={[styles.foodImage, styles.imagePlaceholder]}>
                    <Text style={styles.imagePlaceholderText}>🍽️</Text>
                  </View>
                )}

                <View style={styles.foodTitleRow}>
                  <Text style={styles.foodName} numberOfLines={1}>
                    {food.name}
                  </Text>

                  {food.rating !== null && (
                    <Text style={styles.rating}>
                      ★ {food.rating}
                    </Text>
                  )}
                </View>

                <Text style={styles.restaurant} numberOfLines={1}>
                  {food.restaurants?.name ?? "Restaurant"}
                </Text>

                <View style={styles.foodMeta}>
                  <Text style={styles.price}>
                    ₹{Number(food.price).toFixed(0)}
                  </Text>

                  {food.category && (
                    <>
                      <Text style={styles.metaDot}>•</Text>
                      <Text style={styles.category}>
                        {food.category}
                      </Text>
                    </>
                  )}
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* Near You */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Near you</Text>

          <Pressable onPress={() => router.push("/explore")}>
            <Text style={styles.seeAll}>Explore</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.nearCard}
          onPress={() => router.push("/explore")}
        >
          <View style={styles.nearIcon}>
            <Text style={styles.nearIconText}>⌖</Text>
          </View>

          <View style={styles.nearContent}>
            <Text style={styles.nearTitle}>
              Find something nearby
            </Text>

            <Text style={styles.nearDescription}>
              Discover dishes people are loving around you.
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>

        {/* Social */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            People are loving
          </Text>

          <Pressable onPress={() => router.push("/social")}>
            <Text style={styles.seeAll}>See more</Text>
          </Pressable>
        </View>

        <View style={styles.socialCard}>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>

            <View>
              <Text style={styles.socialUser}>@arjun</Text>
              <Text style={styles.postTime}>2h ago</Text>
            </View>
          </View>

          <Text style={styles.socialText}>
            Found one of the best biryanis I've had in a while. Definitely
            coming back for this.
          </Text>

          <Text style={styles.socialPlace}>
            Rahmaniya Kitchen · Kottayam
          </Text>

          <View style={styles.socialActions}>
            <Text style={styles.action}>♡ 124</Text>
            <Text style={styles.action}>💬 18</Text>
          </View>
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
    paddingBottom: 35,
  },

  header: {
    paddingHorizontal: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  locationLabel: {
    color: "#999999",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
  },

  location: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 3,
  },

  logoPlaceholder: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#29A9EA",
    justifyContent: "center",
    alignItems: "center",
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  greeting: {
    paddingHorizontal: 22,
    marginTop: 32,
    fontSize: 34,
    lineHeight: 39,
    fontWeight: "800",
    color: "#111111",
    letterSpacing: -1,
  },

  search: {
    marginHorizontal: 22,
    marginTop: 22,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 17,
  },

  searchIcon: {
    fontSize: 22,
    marginRight: 11,
    color: "#555555",
  },

  searchText: {
    color: "#888888",
    fontSize: 14,
  },

  sectionHeader: {
    paddingHorizontal: 22,
    marginTop: 34,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    color: "#111111",
    fontSize: 21,
    fontWeight: "800",
  },

  seeAll: {
    color: "#29A9EA",
    fontSize: 13,
    fontWeight: "700",
  },

  loadingSection: {
    height: 145,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#888888",
    fontSize: 13,
    marginTop: 10,
  },

  messageBox: {
    marginHorizontal: 22,
    minHeight: 100,
    borderRadius: 18,
    backgroundColor: "#F7F7F7",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  messageText: {
    color: "#777777",
    fontSize: 14,
    textAlign: "center",
  },

  retryText: {
    color: "#29A9EA",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 10,
  },

  foodRow: {
    paddingLeft: 22,
    paddingRight: 10,
    gap: 14,
  },

  foodCard: {
    width: 210,
  },

  foodImage: {
    width: 210,
    height: 145,
    borderRadius: 18,
    backgroundColor: "#EEEEEE",
  },

  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  imagePlaceholderText: {
    fontSize: 34,
  },

  foodTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  foodName: {
    flex: 1,
    color: "#111111",
    fontSize: 16,
    fontWeight: "700",
  },

  rating: {
    color: "#222222",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 6,
  },

  restaurant: {
    color: "#666666",
    fontSize: 13,
    marginTop: 4,
  },

  foodMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  price: {
    color: "#777777",
    fontSize: 12,
    fontWeight: "600",
  },

  metaDot: {
    color: "#BBBBBB",
    fontSize: 12,
    marginHorizontal: 6,
  },

  category: {
    color: "#999999",
    fontSize: 12,
  },

  nearCard: {
    marginHorizontal: 22,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 18,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
  },

  nearIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#EAF7FD",
    alignItems: "center",
    justifyContent: "center",
  },

  nearIconText: {
    color: "#29A9EA",
    fontSize: 24,
  },

  nearContent: {
    flex: 1,
    marginLeft: 14,
  },

  nearTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111111",
  },

  nearDescription: {
    fontSize: 12,
    lineHeight: 17,
    color: "#777777",
    marginTop: 4,
  },

  arrow: {
    fontSize: 27,
    color: "#AAAAAA",
  },

  socialCard: {
    marginHorizontal: 22,
    backgroundColor: "#F7F7F7",
    borderRadius: 20,
    padding: 18,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#EAF7FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  avatarText: {
    color: "#29A9EA",
    fontSize: 15,
    fontWeight: "800",
  },

  socialUser: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111111",
  },

  postTime: {
    color: "#999999",
    fontSize: 11,
    marginTop: 2,
  },

  socialText: {
    color: "#333333",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 14,
  },

  socialPlace: {
    color: "#29A9EA",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 12,
  },

  socialActions: {
    flexDirection: "row",
    gap: 22,
    marginTop: 16,
  },

  action: {
    color: "#444444",
    fontSize: 13,
    fontWeight: "600",
  },
});