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
        <StatusBar style="dark" />

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
        <StatusBar style="dark" />

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
    backgroundColor: "#FFFFFF",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#888888",
    fontSize: 13,
    marginTop: 12,
  },

  hero: {
    height: 285,
    position: "relative",
  },

  heroImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#EEEEEE",
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
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    color: "#111111",
    fontSize: 32,
    lineHeight: 34,
  },

  saveButton: {
    position: "absolute",
    top: 55,
    right: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },

  saveText: {
    color: "#111111",
    fontSize: 23,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 23,
    paddingBottom: 50,
  },

  name: {
    color: "#111111",
    fontSize: 29,
    fontWeight: "800",
  },

  cuisine: {
    color: "#666666",
    fontSize: 14,
    marginTop: 6,
  },

  meta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 13,
  },

  rating: {
    color: "#168CC5",
    fontSize: 14,
    fontWeight: "800",
  },

  metaText: {
    color: "#777777",
    fontSize: 13,
  },

  locationRow: {
    backgroundColor: "#F7F7F7",
    borderRadius: 17,
    padding: 16,
    marginTop: 23,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  locationContent: {
    flex: 1,
    marginRight: 12,
  },

  locationLabel: {
    color: "#999999",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },

  location: {
    color: "#222222",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },

  directionsButton: {
    backgroundColor: "#EAF7FD",
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 11,
  },

  directionsText: {
    color: "#168CC5",
    fontSize: 12,
    fontWeight: "700",
  },

  description: {
    color: "#555555",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 22,
  },

  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 27,
  },

  sectionTitle: {
    color: "#111111",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 16,
    marginTop: 5,
  },

  menu: {
    gap: 14,
    marginBottom: 30,
  },

  dishCard: {
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 17,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  dishImage: {
    width: 82,
    height: 82,
    borderRadius: 13,
    backgroundColor: "#EEEEEE",
  },

  dishPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  dishPlaceholderText: {
    fontSize: 27,
  },

  addButton: {
    alignSelf: "flex-start",
    backgroundColor: "#168CC5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 10,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
quantityContainer: {
  alignSelf: "flex-start",
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#168CC5",
  borderRadius: 12,
  paddingHorizontal: 10,
  paddingVertical: 6,
  marginBottom: 10,
},

quantityButton: {
  color: "#FFFFFF",
  fontSize: 20,
  fontWeight: "700",
  width: 28,
  textAlign: "center",
},

quantityText: {
  color: "#FFFFFF",
  fontSize: 15,
  fontWeight: "700",
  minWidth: 24,
  textAlign: "center",
},
  dishContent: {
    flex: 1,
    marginLeft: 13,
  },

  dishName: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "700",
  },

  dishCategory: {
    color: "#888888",
    fontSize: 12,
    marginTop: 4,
  },

  dishMeta: {
    flexDirection: "row",
    gap: 13,
    marginTop: 8,
  },

  dishPrice: {
    color: "#333333",
    fontSize: 12,
    fontWeight: "700",
  },

  dishRating: {
    color: "#168CC5",
    fontSize: 12,
    fontWeight: "700",
  },

  arrow: {
    color: "#AAAAAA",
    fontSize: 27,
    marginHorizontal: 5,
  },

  emptyMenu: {
    color: "#888888",
    fontSize: 14,
    marginBottom: 30,
  },

  communityCard: {
    backgroundColor: "#F7F7F7",
    borderRadius: 18,
    padding: 18,
  },

  communityTitle: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "700",
  },

  communityText: {
    color: "#666666",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },

  notFound: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  notFoundTitle: {
    color: "#111111",
    fontSize: 22,
    fontWeight: "800",
  },

  notFoundDescription: {
    color: "#777777",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },

  goBackButton: {
    backgroundColor: "#29A9EA",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 13,
    marginTop: 18,
  },

  goBack: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  mealTray: {
  position: "absolute",
  left: 20,
  right: 20,
  bottom: 24,

  backgroundColor: "#111",

  borderRadius: 22,

  paddingHorizontal: 22,
  paddingVertical: 18,

  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",

  elevation: 10,
},

mealTitle: {
  color: "#FFF",
  fontSize: 17,
  fontWeight: "700",
},

mealSubtitle: {
  color: "#CCC",
  marginTop: 4,
},

reviewText: {
  color: "#29A9EA",
  fontSize: 16,
  fontWeight: "700",
},
});