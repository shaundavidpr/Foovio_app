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

export default function DishDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const dish = dishes.find((item) => item.id === id);

  // Handle an invalid or missing dish ID
  if (!dish) {
    return (
      <View style={styles.notFoundContainer}>
        <StatusBar style="dark" />

        <Text style={styles.notFoundTitle}>Dish not found</Text>

        <Text style={styles.notFoundText}>
          We couldn't find this dish.
        </Text>

        <Pressable
          style={styles.goBackButton}
          onPress={() => router.back()}
        >
          <Text style={styles.goBackText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Dish Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: dish.image }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Back */}
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          {/* Save */}
          <Pressable style={styles.saveButton}>
            <Text style={styles.saveText}>♡</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          {/* Dish heading */}
          <View style={styles.titleRow}>
            <View style={styles.titleArea}>
              <Text style={styles.title}>{dish.name}</Text>

              <Text style={styles.restaurant}>
                {dish.restaurant}
              </Text>
            </View>

            <View style={styles.rating}>
              <Text style={styles.ratingText}>
                ★ {dish.rating}
              </Text>
            </View>
          </View>

          {/* Dish metadata */}
          <View style={styles.meta}>
            <Text style={styles.price}>{dish.price}</Text>

            <Text style={styles.dot}>•</Text>

            <Text style={styles.metaText}>
              {dish.distance}
            </Text>

            <Text style={styles.dot}>•</Text>

            <Text style={styles.metaText}>
              {dish.category}
            </Text>
          </View>

          {/* Description */}
          <Text style={styles.description}>
            {dish.description}
          </Text>

          <View style={styles.divider} />

          {/* Community rating */}
          <Text style={styles.sectionTitle}>
            What people think
          </Text>

          <View style={styles.scoreCard}>
            <View>
              <Text style={styles.score}>
                {dish.rating}
              </Text>

              <Text style={styles.reviewCount}>
                Community rating
              </Text>
            </View>

            <View style={styles.scoreInfo}>
              <Text style={styles.scoreLabel}>
                Highly recommended
              </Text>

              <Text style={styles.scoreSubtext}>
                Based on Foovio community feedback
              </Text>
            </View>
          </View>

          {/* Tags */}
          <Text style={styles.sectionTitle}>
            People mention
          </Text>

          <View style={styles.tags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>
                🔥 Great flavour
              </Text>
            </View>

            <View style={styles.tag}>
              <Text style={styles.tagText}>
                🍽️ Good portion
              </Text>
            </View>

            <View style={styles.tag}>
              <Text style={styles.tagText}>
                💰 Worth the price
              </Text>
            </View>

            <View style={styles.tag}>
              <Text style={styles.tagText}>
                ✨ Recommended
              </Text>
            </View>
          </View>

          {/* Community */}
          <Text style={styles.sectionTitle}>
            From the community
          </Text>

          <View style={styles.review}>
            <View style={styles.reviewHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>F</Text>
              </View>

              <View>
                <Text style={styles.username}>
                  Foovio community
                </Text>

                <Text style={styles.reviewRating}>
                  ★★★★★
                </Text>
              </View>
            </View>

            <Text style={styles.reviewText}>
              Community reviews and food experiences for{" "}
              {dish.name} will appear here.
            </Text>
          </View>

          {/* Restaurant */}
                        <Pressable
                style={styles.restaurantButton}
                onPress={() => router.push(`/restaurant/${dish.restaurantId}`)}
                >
                <View style={styles.restaurantButtonContent}>
                    <Text style={styles.restaurantButtonLabel}>
                    RESTAURANT
                    </Text>

                    <Text style={styles.restaurantButtonName}>
                    {dish.restaurant}
                    </Text>

                    <Text style={styles.restaurantButtonDistance}>
                    {dish.distance} away
                    </Text>
                </View>

  <Text style={styles.arrow}>›</Text>
</Pressable>             
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

  scrollContent: {
    paddingBottom: 30,
  },

  imageContainer: {
    height: 330,
    position: "relative",
  },

  image: {
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

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  titleArea: {
    flex: 1,
    marginRight: 15,
  },

  title: {
    color: "#111111",
    fontSize: 28,
    fontWeight: "800",
  },

  restaurant: {
    color: "#666666",
    fontSize: 15,
    marginTop: 5,
  },

  rating: {
    backgroundColor: "#EAF7FD",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  ratingText: {
    color: "#168CC5",
    fontSize: 14,
    fontWeight: "800",
  },

  meta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 17,
  },

  price: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "800",
  },

  dot: {
    color: "#BBBBBB",
    marginHorizontal: 9,
  },

  metaText: {
    color: "#777777",
    fontSize: 13,
  },

  description: {
    color: "#555555",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 20,
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
    marginBottom: 15,
    marginTop: 8,
  },

  scoreCard: {
    backgroundColor: "#F7F7F7",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 27,
  },

  score: {
    color: "#111111",
    fontSize: 34,
    fontWeight: "800",
  },

  reviewCount: {
    color: "#888888",
    fontSize: 11,
    marginTop: 2,
  },

  scoreInfo: {
    marginLeft: 25,
    flex: 1,
  },

  scoreLabel: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "700",
  },

  scoreSubtext: {
    color: "#777777",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },

  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    marginBottom: 27,
  },

  tag: {
    backgroundColor: "#F4F4F4",
    borderRadius: 100,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },

  tagText: {
    color: "#444444",
    fontSize: 12,
    fontWeight: "600",
  },

  review: {
    backgroundColor: "#F7F7F7",
    borderRadius: 18,
    padding: 17,
    marginBottom: 28,
  },

  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EAF7FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  avatarText: {
    color: "#29A9EA",
    fontWeight: "800",
  },

  username: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "700",
  },

  reviewRating: {
    color: "#111111",
    fontSize: 11,
    marginTop: 2,
  },

  reviewText: {
    color: "#444444",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 14,
  },

  restaurantButton: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 18,
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  restaurantButtonContent: {
    flex: 1,
  },

  restaurantButtonLabel: {
    color: "#999999",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  restaurantButtonName: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
  },

  restaurantButtonDistance: {
    color: "#888888",
    fontSize: 12,
    marginTop: 3,
  },

  arrow: {
    color: "#AAAAAA",
    fontSize: 28,
    marginLeft: 10,
  },

  notFoundContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  notFoundTitle: {
    color: "#111111",
    fontSize: 24,
    fontWeight: "800",
  },

  notFoundText: {
    color: "#777777",
    fontSize: 14,
    marginTop: 8,
  },

  goBackButton: {
    backgroundColor: "#29A9EA",
    borderRadius: 14,
    paddingHorizontal: 22,
    paddingVertical: 13,
    marginTop: 22,
  },

  goBackText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});