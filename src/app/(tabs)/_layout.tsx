import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowRight,
  Heart,
  MapPin,
  Search,
  Star,
  Utensils,
} from "lucide-react-native";
import { router } from "expo-router";

const BLUE = "#3B9CFF";
const BLUE_BRIGHT = "#63C5FF";
const BG = "#060A10";
const SURFACE = "#0C121B";
const SURFACE_2 = "#111925";
const WHITE = "#F5F8FC";
const MUTED = "#7F8B9B";
const BORDER = "rgba(255,255,255,0.08)";

const dishes = [
  {
    id: "1",
    name: "Chicken Biryani",
    restaurant: "Rahmaniya Kitchen",
    price: "₹220",
    rating: "4.8",
    category: "Biryani",
    image:
      "https://www.licious.in/blog/wp-content/uploads/2022/06/chicken-hyderabadi-biryani-01.jpg",
  },
  {
    id: "2",
    name: "Butter Chicken",
    restaurant: "Punjab House",
    price: "₹280",
    rating: "4.7",
    category: "North Indian",
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "3",
    name: "Truffle Pasta",
    restaurant: "The Table",
    price: "₹390",
    rating: "4.9",
    category: "Italian",
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "4",
    name: "Smash Burger",
    restaurant: "Burger Lab",
    price: "₹240",
    rating: "4.6",
    category: "Burgers",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
  },
];

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 650,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 650,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
      }}
    >
      {children}
    </Animated.View>
  );
}

function ScaleButton({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() =>
        Animated.spring(scale, {
          toValue: 0.96,
          useNativeDriver: true,
        }).start()
      }
      onPressOut={() =>
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start()
      }
    >
      <Animated.View
        style={[
          style,
          {
            transform: [{ scale }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

export default function Home() {
  const heroScale = useRef(new Animated.Value(1.08)).current;

  useEffect(() => {
    Animated.timing(heroScale, {
      toValue: 1,
      duration: 1100,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Ambient lighting */}
        <View style={styles.blueGlow} />
        <View style={styles.blueGlowSmall} />

        {/* HEADER */}
        <Reveal>
          <View style={styles.header}>
            <View>
              <View style={styles.logoRow}>
                <View style={styles.logoMark}>
                  <View style={styles.logoMarkInner} />
                </View>

                <Text style={styles.logo}>foovio</Text>
              </View>

              <View style={styles.locationRow}>
                <MapPin size={11} color={BLUE} />
                <Text style={styles.location}>Kottayam</Text>
                <Text style={styles.change}>Change</Text>
              </View>
            </View>

            <ScaleButton
              style={styles.avatar}
              onPress={() => router.push("/profile")}
            >
              <Text style={styles.avatarText}>S</Text>
            </ScaleButton>
          </View>
        </Reveal>

        {/* HERO INTRO */}
        <Reveal delay={100}>
          <View style={styles.intro}>
            <Text style={styles.kicker}>FOOD, WITHOUT THE NOISE</Text>

            <Text style={styles.headline}>
              Eat something{"\n"}
              <Text style={styles.blueText}>you'll remember.</Text>
            </Text>

            <Text style={styles.subtitle}>
              Discover places and dishes worth leaving
              the house for.
            </Text>
          </View>
        </Reveal>

        {/* SEARCH */}
        <Reveal delay={180}>
          <ScaleButton
            style={styles.search}
            onPress={() => router.push("/explore")}
          >
            <View style={styles.searchIcon}>
              <Search size={19} color={BLUE_BRIGHT} />
            </View>

            <View style={styles.searchContent}>
              <Text style={styles.searchTitle}>
                Search anything
              </Text>

              <Text style={styles.searchHint}>
                Dish, restaurant or craving
              </Text>
            </View>

            <ArrowRight size={17} color={MUTED} />
          </ScaleButton>
        </Reveal>

        {/* FEATURED */}
        <Reveal delay={260}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionNumber}>01 / FEATURED</Text>
              <Text style={styles.sectionTitle}>
                Worth trying
              </Text>
            </View>

            <Pressable onPress={() => router.push("/explore")}>
              <Text style={styles.link}>See all</Text>
            </Pressable>
          </View>

          <ScaleButton
            style={styles.heroCard}
            onPress={() => router.push("/explore")}
          >
            <Animated.Image
              source={{ uri: dishes[0].image }}
              style={[
                styles.heroImage,
                {
                  transform: [{ scale: heroScale }],
                },
              ]}
            />

            <LinearGradient
              colors={[
                "transparent",
                "rgba(0,0,0,0.15)",
                "rgba(0,0,0,0.92)",
              ]}
              locations={[0, 0.42, 1]}
              style={styles.heroOverlay}
            />

            <View style={styles.heroTop}>
              <View style={styles.featureBadge}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeText}>
                  FOOVIO PICK
                </Text>
              </View>

              <View style={styles.heartButton}>
                <Heart
                  size={18}
                  color={WHITE}
                  strokeWidth={1.7}
                />
              </View>
            </View>

            <View style={styles.heroBottom}>
              <Text style={styles.heroName}>
                {dishes[0].name}
              </Text>

              <Text style={styles.heroRestaurant}>
                {dishes[0].restaurant}
              </Text>

              <View style={styles.heroDetails}>
                <Text style={styles.heroPrice}>
                  {dishes[0].price}
                </Text>

                <View style={styles.rating}>
                  <Star
                    size={11}
                    color="#FFD166"
                    fill="#FFD166"
                  />
                  <Text style={styles.ratingText}>
                    {dishes[0].rating}
                  </Text>
                </View>

                <View style={styles.circleArrow}>
                  <ArrowRight size={15} color={BG} />
                </View>
              </View>
            </View>
          </ScaleButton>
        </Reveal>

        {/* DISCOVER */}
        <Reveal delay={380}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionNumber}>
                02 / DISCOVER
              </Text>
              <Text style={styles.sectionTitle}>
                More to explore
              </Text>
            </View>

            <Pressable onPress={() => router.push("/explore")}>
              <Text style={styles.link}>Explore</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontal}
          >
            {dishes.slice(1).map((dish, index) => (
              <ScaleButton
                key={dish.id}
                style={styles.dishCard}
                onPress={() => router.push("/explore")}
              >
                <View style={styles.dishImageWrap}>
                  <Image
                    source={{ uri: dish.image }}
                    style={styles.dishImage}
                  />

                  <LinearGradient
                    colors={[
                      "transparent",
                      "rgba(0,0,0,0.55)",
                    ]}
                    style={styles.dishOverlay}
                  />

                  <Text style={styles.cardNumber}>
                    0{index + 2}
                  </Text>

                  <View style={styles.cardRating}>
                    <Star
                      size={9}
                      color="#FFD166"
                      fill="#FFD166"
                    />
                    <Text style={styles.cardRatingText}>
                      {dish.rating}
                    </Text>
                  </View>
                </View>

                <Text
                  style={styles.dishName}
                  numberOfLines={1}
                >
                  {dish.name}
                </Text>

                <Text
                  style={styles.dishRestaurant}
                  numberOfLines={1}
                >
                  {dish.restaurant}
                </Text>

                <View style={styles.dishMeta}>
                  <Text style={styles.dishPrice}>
                    {dish.price}
                  </Text>

                  <Text style={styles.category}>
                    {dish.category}
                  </Text>
                </View>
              </ScaleButton>
            ))}
          </ScrollView>
        </Reveal>

        {/* NEAR YOU */}
        <Reveal delay={500}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionNumber}>
                03 / AROUND YOU
              </Text>
              <Text style={styles.sectionTitle}>
                Near you
              </Text>
            </View>

            <Pressable onPress={() => router.push("/explore")}>
              <Text style={styles.link}>Map</Text>
            </Pressable>
          </View>

          <ScaleButton
            style={styles.nearCard}
            onPress={() => router.push("/explore")}
          >
            <LinearGradient
              colors={["#0D1B2C", "#091019"]}
              style={StyleSheet.absoluteFillObject}
            />

            <View style={styles.mapGlow} />

            <View style={styles.nearIcon}>
              <MapPin size={22} color={BLUE_BRIGHT} />
            </View>

            <View style={styles.nearText}>
              <Text style={styles.nearTitle}>
                Something good is close.
              </Text>

              <Text style={styles.nearSubtitle}>
                Explore restaurants and dishes around
                your current area.
              </Text>
            </View>

            <View style={styles.nearArrow}>
              <ArrowRight size={16} color={WHITE} />
            </View>
          </ScaleButton>
        </Reveal>

        {/* SOCIAL */}
        <Reveal delay={600}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionNumber}>
                04 / COMMUNITY
              </Text>
              <Text style={styles.sectionTitle}>
                People are eating
              </Text>
            </View>

            <Pressable onPress={() => router.push("/social")}>
              <Text style={styles.link}>See more</Text>
            </Pressable>
          </View>

          <ScaleButton
            style={styles.socialCard}
            onPress={() => router.push("/social")}
          >
            <View style={styles.socialHeader}>
              <View style={styles.socialAvatar}>
                <Text style={styles.socialAvatarText}>
                  A
                </Text>
              </View>

              <View style={styles.socialUserWrap}>
                <Text style={styles.socialUser}>
                  @arjun
                </Text>

                <Text style={styles.socialTime}>
                  2h ago · Kottayam
                </Text>
              </View>

              <ArrowRight size={15} color={MUTED} />
            </View>

            <Text style={styles.socialQuote}>
              “Found one of the best biryanis I've
              had in a while. Definitely coming back
              for this.”
            </Text>

            <View style={styles.socialRestaurant}>
              <MapPin size={11} color={BLUE} />

              <Text style={styles.socialRestaurantText}>
                Rahmaniya Kitchen
              </Text>
            </View>

            <View style={styles.socialFooter}>
              <Text style={styles.socialStat}>
                ♡ 124
              </Text>

              <Text style={styles.socialStat}>
                ◌ 18
              </Text>

              <Text style={styles.viewPost}>
                View post →
              </Text>
            </View>
          </ScaleButton>
        </Reveal>

        {/* FOOTER */}
        <View style={styles.footer}>
          <View style={styles.footerLogoRow}>
            <View style={styles.logoMark}>
              <View style={styles.logoMarkInner} />
            </View>

            <Text style={styles.footerLogo}>foovio</Text>
          </View>

          <Text style={styles.footerText}>
            Discover food worth remembering.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  scroll: {
    paddingTop: 58,
    paddingBottom: 70,
  },

  blueGlow: {
    position: "absolute",
    top: -180,
    right: -130,
    width: 350,
    height: 350,
    borderRadius: 350,
    backgroundColor: "#006EFF",
    opacity: 0.12,
  },

  blueGlowSmall: {
    position: "absolute",
    top: 470,
    left: -160,
    width: 300,
    height: 300,
    borderRadius: 300,
    backgroundColor: "#0088FF",
    opacity: 0.055,
  },

  header: {
    paddingHorizontal: 21,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoMark: {
    width: 21,
    height: 21,
    borderRadius: 7,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  logoMarkInner: {
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: WHITE,
  },

  logo: {
    color: WHITE,
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: -1.4,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
  },

  location: {
    color: "#C7D0DC",
    fontSize: 9,
    fontWeight: "700",
  },

  change: {
    color: MUTED,
    fontSize: 8,
    marginLeft: 3,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: SURFACE_2,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: "900",
  },

  intro: {
    paddingHorizontal: 21,
    marginTop: 51,
  },

  kicker: {
    color: BLUE_BRIGHT,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.7,
  },

  headline: {
    color: WHITE,
    fontSize: 39,
    lineHeight: 42,
    fontWeight: "900",
    letterSpacing: -2,
    marginTop: 10,
  },

  blueText: {
    color: BLUE,
  },

  subtitle: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 13,
    maxWidth: 280,
  },

  search: {
    marginHorizontal: 21,
    marginTop: 28,
    minHeight: 70,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
  },

  searchIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "rgba(59,156,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  searchContent: {
    flex: 1,
    marginLeft: 12,
  },

  searchTitle: {
    color: WHITE,
    fontSize: 11,
    fontWeight: "800",
  },

  searchHint: {
    color: MUTED,
    fontSize: 8,
    marginTop: 4,
  },

  sectionHeader: {
    marginTop: 43,
    marginBottom: 16,
    paddingHorizontal: 21,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  sectionNumber: {
    color: BLUE,
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1.4,
    marginBottom: 5,
  },

  sectionTitle: {
    color: WHITE,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.8,
  },

  link: {
    color: BLUE_BRIGHT,
    fontSize: 9,
    fontWeight: "800",
  },

  heroCard: {
    height: 430,
    marginHorizontal: 16,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: SURFACE,
  },

  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  heroTop: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  featureBadge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "rgba(8,14,22,0.7)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: BLUE_BRIGHT,
  },

  badgeText: {
    color: WHITE,
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1,
  },

  heartButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(8,14,22,0.65)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },

  heroBottom: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 19,
  },

  heroName: {
    color: WHITE,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: "900",
    letterSpacing: -1.2,
  },

  heroRestaurant: {
    color: "#CBD5E0",
    fontSize: 10,
    marginTop: 5,
  },

  heroDetails: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  heroPrice: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "900",
  },

  rating: {
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.11)",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  ratingText: {
    color: WHITE,
    fontSize: 9,
    fontWeight: "800",
  },

  circleArrow: {
    marginLeft: "auto",
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
  },

  horizontal: {
    paddingHorizontal: 16,
    gap: 14,
  },

  dishCard: {
    width: 164,
  },

  dishImageWrap: {
    width: 164,
    height: 188,
    borderRadius: 19,
    overflow: "hidden",
    backgroundColor: SURFACE,
  },

  dishImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  dishOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  cardNumber: {
    position: "absolute",
    top: 11,
    left: 11,
    color: WHITE,
    fontSize: 8,
    fontWeight: "900",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 7,
  },

  cardRating: {
    position: "absolute",
    right: 9,
    bottom: 9,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  cardRatingText: {
    color: WHITE,
    fontSize: 8,
    fontWeight: "800",
  },

  dishName: {
    color: WHITE,
    fontSize: 12,
    fontWeight: "900",
    marginTop: 10,
  },

  dishRestaurant: {
    color: MUTED,
    fontSize: 9,
    marginTop: 4,
  },

  dishMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 7,
  },

  dishPrice: {
    color: BLUE_BRIGHT,
    fontSize: 11,
    fontWeight: "900",
  },

  category: {
    color: "#657182",
    fontSize: 8,
  },

  nearCard: {
    marginHorizontal: 16,
    minHeight: 154,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
    padding: 19,
    flexDirection: "row",
    alignItems: "center",
  },

  mapGlow: {
    position: "absolute",
    left: -80,
    width: 210,
    height: 210,
    borderRadius: 210,
    backgroundColor: BLUE,
    opacity: 0.07,
  },

  nearIcon: {
    width: 51,
    height: 51,
    borderRadius: 17,
    backgroundColor: "rgba(59,156,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(59,156,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  nearText: {
    flex: 1,
    marginLeft: 14,
  },

  nearTitle: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "900",
  },

  nearSubtitle: {
    color: MUTED,
    fontSize: 9,
    lineHeight: 15,
    marginTop: 6,
    maxWidth: 205,
  },

  nearArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  socialCard: {
    marginHorizontal: 16,
    padding: 19,
    borderRadius: 22,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
  },

  socialHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  socialAvatar: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: "#163657",
    alignItems: "center",
    justifyContent: "center",
  },

  socialAvatarText: {
    color: BLUE_BRIGHT,
    fontSize: 11,
    fontWeight: "900",
  },

  socialUserWrap: {
    flex: 1,
    marginLeft: 10,
  },

  socialUser: {
    color: WHITE,
    fontSize: 11,
    fontWeight: "900",
  },

  socialTime: {
    color: MUTED,
    fontSize: 8,
    marginTop: 3,
  },

  socialQuote: {
    color: "#DDE5EE",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    marginTop: 19,
    letterSpacing: -0.2,
  },

  socialRestaurant: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 16,
  },

  socialRestaurantText: {
    color: BLUE_BRIGHT,
    fontSize: 9,
    fontWeight: "800",
  },

  socialFooter: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
    marginTop: 17,
    paddingTop: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  socialStat: {
    color: MUTED,
    fontSize: 9,
    fontWeight: "700",
    marginRight: 17,
  },

  viewPost: {
    marginLeft: "auto",
    color: BLUE_BRIGHT,
    fontSize: 9,
    fontWeight: "800",
  },

  footer: {
    marginTop: 70,
    paddingHorizontal: 21,
    paddingTop: 22,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },

  footerLogoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  footerLogo: {
    color: WHITE,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -1.2,
  },

  footerText: {
    color: MUTED,
    fontSize: 9,
    marginTop: 7,
  },
});