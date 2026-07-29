import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { dishes } from "../../data/dishes";
import { restaurants } from "../../data/restaurants";

export default function RestaurantDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const restaurant = restaurants.find((item) => item.id === id);

  if (!restaurant) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundTitle}>Restaurant not found</Text>

        <Pressable onPress={() => router.back()}>
          <Text style={styles.goBack}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const menu = dishes.filter(
    (dish) => dish.restaurantId === restaurant.id
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image
            source={{ uri: restaurant.image }}
            style={styles.heroImage}
          />

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
          <Text style={styles.name}>{restaurant.name}</Text>

          <Text style={styles.cuisine}>
            {restaurant.cuisine}
          </Text>

          <View style={styles.meta}>
            <Text style={styles.rating}>
              ★ {restaurant.rating}
            </Text>

            <Text style={styles.dot}>•</Text>

            <Text style={styles.metaText}>
              {restaurant.reviews} reviews
            </Text>

            <Text style={styles.dot}>•</Text>

            <Text style={styles.metaText}>
              {restaurant.priceLevel}
            </Text>
          </View>

          <View style={styles.locationRow}>
            <View>
              <Text style={styles.locationLabel}>LOCATION</Text>

              <Text style={styles.location}>
                {restaurant.location} · {restaurant.distance}
              </Text>
            </View>

            <Pressable style={styles.directionsButton}>
              <Text style={styles.directionsText}>
                Directions
              </Text>
            </Pressable>
          </View>

          <Text style={styles.description}>
            {restaurant.description}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>
            Popular here
          </Text>

          {menu.length > 0 ? (
            <View style={styles.menu}>
              {menu.map((dish) => (
                <Pressable
                  key={dish.id}
                  style={styles.dishCard}
                  onPress={() => router.push(`/dish/${dish.id}`)}
                >
                  <Image
                    source={{ uri: dish.image }}
                    style={styles.dishImage}
                  />

                  <View style={styles.dishContent}>
                    <Text style={styles.dishName}>
                      {dish.name}
                    </Text>

                    <Text style={styles.dishCategory}>
                      {dish.category}
                    </Text>

                    <View style={styles.dishMeta}>
                      <Text style={styles.dishPrice}>
                        {dish.price}
                      </Text>

                      <Text style={styles.dishRating}>
                        ★ {dish.rating}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.arrow}>›</Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyMenu}>
              Menu coming soon.
            </Text>
          )}

          <Text style={styles.sectionTitle}>
            Foovio community
          </Text>

          <View style={styles.communityCard}>
            <Text style={styles.communityTitle}>
              People are loving this place
            </Text>

            <Text style={styles.communityText}>
              Community posts, photos, ratings and recommendations
              for {restaurant.name} will appear here.
            </Text>
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

  hero: {
    height: 285,
    position: "relative",
  },

  heroImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#EEEEEE",
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

  dot: {
    color: "#BBBBBB",
    marginHorizontal: 8,
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
  },

  notFoundTitle: {
    color: "#111111",
    fontSize: 22,
    fontWeight: "800",
  },

  goBack: {
    color: "#29A9EA",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 18,
  },
});