import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { useMealTray } from "@/context/MealTrayContext";
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
import SearchBar from "@/components/ordering/SearchBar";
import CategoryPills from "@/components/ordering/CategoryPills";
import DishCard from "@/components/ordering/DishCard";
import MealTray from "@/components/ordering/MealTray";
import MealTraySheet from "@/components/ordering/MealTraySheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
type Restaurant = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
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
};

export default function RestaurantDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
  addDish,
  increaseQuantity,
  decreaseQuantity,
  getDishQuantity,
  totalItems,
  totalPrice,
} = useMealTray();

  const [restaurant, setRestaurant] =
    useState<Restaurant | null>(null);

  const [menu, setMenu] = useState<Dish[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
  useState("All");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const mealTraySheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (!id) {
      setLoadError("Restaurant not found.");
      setLoading(false);
      return;
    }

    loadRestaurant();
  }, [id]);

  const loadRestaurant = async () => {
    try {
      setLoading(true);
      setLoadError(null);
  

      // Fetch restaurant
      const {
        data: restaurantData,
        error: restaurantError,
      } = await supabase
        .from("restaurants")
        .select(`
          id,
          name,
          description,
          image_url,
          location,
          latitude,
          longitude,
          rating
        `)
        .eq("id", id)
        .maybeSingle();

      if (restaurantError) {
        console.error(
          "Restaurant loading error:",
          restaurantError
        );

        setLoadError("We couldn't load this restaurant.");
        return;
      }

      if (!restaurantData) {
        setLoadError("Restaurant not found.");
        return;
      }

      setRestaurant(restaurantData as Restaurant);

      // Fetch dishes belonging to restaurant
      const {
        data: dishData,
        error: dishError,
      } = await supabase
        .from("dishes")
        .select(`
          id,
          restaurant_id,
          name,
          description,
          image_url,
          price,
          category,
          rating
        `)
        .eq("restaurant_id", id)
        .order("created_at", { ascending: false });

      if (dishError) {
        console.error(
          "Restaurant menu loading error:",
          dishError
        );

        setMenu([]);
        return;
      }

      setMenu((dishData ?? []) as Dish[]);
    } catch (error) {
      console.error(
        "Restaurant details error:",
        error
      );

      setLoadError("We couldn't load this restaurant.");
    } finally {
      setLoading(false);
    }
  };
  const categories = [
  "All",
  ...new Set(
    menu
      .map((dish) => dish.category)
      .filter(Boolean)
  ),
];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />

        <ActivityIndicator
          size="large"
          color="#29A9EA"
        />

        <Text style={styles.loadingText}>
          Loading restaurant...
        </Text>
      </View>
    );
  }

  if (!restaurant || loadError) {
    return (
      <View style={styles.notFound}>
        <StatusBar style="light" />

        <Text style={styles.notFoundTitle}>
          Restaurant not found
        </Text>

        <Text style={styles.notFoundDescription}>
          {loadError ??
            "We couldn't find this restaurant."}
        </Text>

        <Pressable
          style={styles.goBackButton}
          onPress={() => router.back()}
        >
          <Text style={styles.goBack}>
            Go back
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          {restaurant.image_url ? (
            <Image
              source={{ uri: restaurant.image_url }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.heroImage,
                styles.heroPlaceholder,
              ]}
            >
              <Text style={styles.heroPlaceholderText}>
                🍽️
              </Text>
            </View>
          )}

          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Pressable style={styles.saveButton}>
            <Text style={styles.saveText}>♡</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          {/* Restaurant info */}

          <Text style={styles.name}>
            {restaurant.name}
          </Text>

          {restaurant.location && (
            <Text style={styles.cuisine}>
              {restaurant.location}
            </Text>
          )}

          <View style={styles.meta}>
            {restaurant.rating !== null ? (
              <Text style={styles.rating}>
                ★ {restaurant.rating}
              </Text>
            ) : (
              <Text style={styles.metaText}>
                No rating yet
              </Text>
            )}
          </View>

          {/* Location */}

          {restaurant.location && (
            <View style={styles.locationRow}>
              <View style={styles.locationContent}>
                <Text style={styles.locationLabel}>
                  LOCATION
                </Text>

                <Text style={styles.location}>
                  {restaurant.location}
                </Text>
              </View>

              {restaurant.latitude !== null &&
                restaurant.longitude !== null && (
                  <Pressable
                    style={styles.directionsButton}
                  >
                    <Text style={styles.directionsText}>
                      Directions
                    </Text>
                  </Pressable>
                )}
            </View>
          )}

          {/* Description */}

          <Text style={styles.description}>
            {restaurant.description ??
              `Discover dishes from ${restaurant.name} on Foovio.`}
          </Text>

          <View style={styles.divider} />

          {/* Menu */}

          <Text style={styles.sectionTitle}>
            Menu
            </Text>

            <SearchBar
              value={search}
              onChange={setSearch}
           />
           <CategoryPills
  categories={categories as string[]}
  selected={selectedCategory}
  onSelect={setSelectedCategory}
/>

          {menu.length > 0 ? (
            <View style={styles.menu}>
              {menu
  .filter((dish) => {
    const matchesSearch =
      dish.name
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      dish.category === selectedCategory;

    return (
      matchesSearch &&
      matchesCategory
    );
  })
  .map((dish) => (
  <DishCard
    key={dish.id}
    dish={dish}
    onPress={() =>
      router.push(`/dish/${dish.id}`)
    }
  />
))}
            </View>
          ) : (
            <Text style={styles.emptyMenu}>
              Menu coming soon.
            </Text>
          )}

          {/* Community */}

          <Text style={styles.sectionTitle}>
            Foovio community
          </Text>

          <View style={styles.communityCard}>
            <Text style={styles.communityTitle}>
              People are loving this place
            </Text>

            <Text style={styles.communityText}>
              Community posts, photos, ratings and
              recommendations for {restaurant.name} will
              appear here.
            </Text>
          </View>
        </View>
      </ScrollView>

<MealTray
  onPress={() => {
    mealTraySheetRef.current?.present();
  }}
/>
<MealTraySheet
  ref={mealTraySheetRef}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05080D",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#05080D",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#7F8C9D",
    fontSize: 11,
    marginTop: 12,
  },

  hero: {
    height: 285,
    position: "relative",
  },

  heroImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#0B111A",
  },

  heroPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  heroPlaceholderText: {
    fontSize: 55,
  },

  backButton: {
    position: "absolute",
    top: 55,
    left: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(5,8,13,0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    color: "#F7FAFF",
    fontSize: 30,
    lineHeight: 34,
  },

  saveButton: {
    position: "absolute",
    top: 55,
    right: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(5,8,13,0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },

  saveText: {
    color: "#F7FAFF",
    fontSize: 21,
  },

  info: {
    marginTop: -25,
    marginHorizontal: 16,
    padding: 21,
    borderRadius: 25,
    backgroundColor: "#0B111A",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.055)",
  },

  restaurantName: {
    color: "#F7FAFF",
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
  },

  rating: {
    color: "#FFD166",
    fontSize: 12,
    fontWeight: "900",
  },

  ratingCount: {
    color: "#7F8C9D",
    fontSize: 10,
    marginLeft: 6,
  },

  location: {
    color: "#AAB4C2",
    fontSize: 10,
    marginTop: 9,
  },

  directionsButton: {
    alignSelf: "flex-start",
    marginTop: 12,
    backgroundColor: "rgba(46,155,255,0.11)",
    borderWidth: 1,
    borderColor: "rgba(113,199,255,0.12)",
    borderRadius: 17,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  directionsText: {
    color: "#73C7FF",
    fontSize: 10,
    fontWeight: "900",
  },

  description: {
    color: "#AAB4C2",
    fontSize: 12,
    lineHeight: 20,
    marginHorizontal: 21,
    marginTop: 19,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.055)",
    marginHorizontal: 21,
    marginTop: 25,
  },

  sectionTitle: {
    color: "#F7FAFF",
    fontSize: 21,
    fontWeight: "900",
    marginHorizontal: 21,
    marginTop: 25,
  },

  menu: {
    marginHorizontal: 16,
    marginTop: 14,
  },

  emptyMenu: {
    color: "#7F8C9D",
    fontSize: 11,
    marginHorizontal: 21,
    marginTop: 14,
  },

  communityCard: {
    marginHorizontal: 16,
    marginTop: 14,
    padding: 20,
    borderRadius: 22,
    backgroundColor: "#0B111A",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.055)",
  },

  communityTitle: {
    color: "#F7FAFF",
    fontSize: 15,
    fontWeight: "900",
  },

  communityText: {
    color: "#7F8C9D",
    fontSize: 10,
    lineHeight: 18,
    marginTop: 7,
  },

  notFound: {
    flex: 1,
    backgroundColor: "#05080D",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  notFoundTitle: {
    color: "#F7FAFF",
    fontSize: 22,
    fontWeight: "900",
  },

  notFoundDescription: {
    color: "#7F8C9D",
    fontSize: 11,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
  },

  retryButton: {
    marginTop: 20,
    backgroundColor: "#2E9BFF",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 20,
  },

  retryText: {
    color: "#F7FAFF",
    fontSize: 11,
    fontWeight: "900",
  },
});