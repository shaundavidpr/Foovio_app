import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const posts = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",
  },
  {
    id: "4",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
  },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Top */}
        <View style={styles.topBar}>
          <Text style={styles.pageTitle}>Profile</Text>

          <Pressable style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙</Text>
          </Pressable>
        </View>

        {/* Profile */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>S</Text>
          </View>

          <Text style={styles.name}>Shaun</Text>

          <Text style={styles.username}>@shaun</Text>

          <Text style={styles.bio}>
            Finding food worth talking about.
          </Text>

          <Pressable style={styles.editButton}>
            <Text style={styles.editButtonText}>
              Edit profile
            </Text>
          </Pressable>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <Pressable style={styles.stat}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </Pressable>

          <View style={styles.statDivider} />

          <Pressable style={styles.stat}>
            <Text style={styles.statNumber}>248</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </Pressable>

          <View style={styles.statDivider} />

          <Pressable style={styles.stat}>
            <Text style={styles.statNumber}>181</Text>
            <Text style={styles.statLabel}>Following</Text>
          </Pressable>
        </View>

        {/* Food activity */}
        <View style={styles.activityCard}>
          <View style={styles.activityItem}>
            <Text style={styles.activityNumber}>37</Text>
            <Text style={styles.activityLabel}>
              Dishes tried
            </Text>
          </View>

          <View style={styles.activityItem}>
            <Text style={styles.activityNumber}>21</Text>
            <Text style={styles.activityLabel}>
              Restaurants
            </Text>
          </View>

          <View style={styles.activityItem}>
            <Text style={styles.activityNumber}>4.4</Text>
            <Text style={styles.activityLabel}>
              Avg rating
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <Pressable
            style={[
              styles.tab,
              activeTab === "posts" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("posts")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "posts" && styles.activeTabText,
              ]}
            >
              Posts
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.tab,
              activeTab === "saved" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("saved")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "saved" && styles.activeTabText,
              ]}
            >
              Saved
            </Text>
          </Pressable>
        </View>

        {/* Posts */}
        {activeTab === "posts" ? (
          <View style={styles.grid}>
            {posts.map((post) => (
              <Pressable key={post.id} style={styles.gridItem}>
                <Image
                  source={{ uri: post.image }}
                  style={styles.gridImage}
                />
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>♡</Text>

            <Text style={styles.emptyTitle}>
              Nothing saved yet
            </Text>

            <Text style={styles.emptyText}>
              Save dishes and restaurants you want to try.
            </Text>
          </View>
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
    paddingBottom: 50,
  },

  topBar: {
    paddingHorizontal: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  pageTitle: {
    color: "#111111",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.8,
  },

  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  settingsIcon: {
    fontSize: 19,
  },

  profileSection: {
    alignItems: "center",
    paddingHorizontal: 22,
    marginTop: 25,
  },

  avatar: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: "#EAF7FD",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#29A9EA",
    fontSize: 34,
    fontWeight: "800",
  },

  name: {
    color: "#111111",
    fontSize: 23,
    fontWeight: "800",
    marginTop: 14,
  },

  username: {
    color: "#888888",
    fontSize: 13,
    marginTop: 3,
  },

  bio: {
    color: "#555555",
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },

  editButton: {
    borderWidth: 1,
    borderColor: "#E2E2E2",
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 10,
    marginTop: 17,
  },

  editButtonText: {
    color: "#222222",
    fontSize: 13,
    fontWeight: "700",
  },

  stats: {
    marginHorizontal: 22,
    marginTop: 28,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EEEEEE",
  },

  stat: {
    flex: 1,
    alignItems: "center",
  },

  statNumber: {
    color: "#111111",
    fontSize: 17,
    fontWeight: "800",
  },

  statLabel: {
    color: "#888888",
    fontSize: 11,
    marginTop: 4,
  },

  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#EEEEEE",
  },

  activityCard: {
    marginHorizontal: 22,
    marginTop: 22,
    backgroundColor: "#F7F7F7",
    borderRadius: 18,
    paddingVertical: 18,
    flexDirection: "row",
  },

  activityItem: {
    flex: 1,
    alignItems: "center",
  },

  activityNumber: {
    color: "#168CC5",
    fontSize: 17,
    fontWeight: "800",
  },

  activityLabel: {
    color: "#777777",
    fontSize: 10,
    marginTop: 4,
  },

  tabs: {
    flexDirection: "row",
    marginTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },

  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#29A9EA",
  },

  tabText: {
    color: "#999999",
    fontSize: 13,
    fontWeight: "700",
  },

  activeTabText: {
    color: "#111111",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 2,
  },

  gridItem: {
    width: "33.333%",
    aspectRatio: 1,
    padding: 1,
  },

  gridImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#EEEEEE",
  },

  empty: {
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 65,
  },

  emptyIcon: {
    color: "#BBBBBB",
    fontSize: 38,
  },

  emptyTitle: {
    color: "#111111",
    fontSize: 17,
    fontWeight: "800",
    marginTop: 13,
  },

  emptyText: {
    color: "#888888",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 7,
  },
});