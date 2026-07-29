import { StatusBar } from "expo-status-bar";
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
    user: "Arjun",
    username: "@arjun",
    avatar: "A",
    time: "2h",
    restaurant: "Rahmaniya Kitchen",
    dish: "Chicken Biryani",
    rating: "4.8",
    text: "The biryani here was insane. Great flavour, tender chicken and actually worth the price.",
    image:
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=1000",
    likes: 124,
    comments: 18,
  },
  {
    id: "2",
    user: "Meera",
    username: "@meera",
    avatar: "M",
    time: "5h",
    restaurant: "Burger Junction",
    dish: "Loaded Beef Burger",
    rating: "4.6",
    text: "Tried this after seeing it everywhere. Messy, loaded and definitely something I'd order again.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000",
    likes: 89,
    comments: 11,
  },
];

export default function Social() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Social</Text>
            <Text style={styles.subtitle}>
              See what people are eating.
            </Text>
          </View>

          <Pressable style={styles.notification}>
            <Text style={styles.notificationIcon}>♡</Text>
          </Pressable>
        </View>

        <View style={styles.feedSelector}>
          <Pressable style={styles.feedActive}>
            <Text style={styles.feedActiveText}>For you</Text>
          </Pressable>

          <Pressable style={styles.feedInactive}>
            <Text style={styles.feedInactiveText}>Following</Text>
          </Pressable>
        </View>

        {posts.map((post) => (
          <View key={post.id} style={styles.post}>
            <View style={styles.userRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{post.avatar}</Text>
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.username}>{post.username}</Text>

                <Text style={styles.time}>
                  {post.time} · {post.restaurant}
                </Text>
              </View>

              <Pressable>
                <Text style={styles.more}>•••</Text>
              </Pressable>
            </View>

            <Text style={styles.postText}>{post.text}</Text>

            <Image
              source={{ uri: post.image }}
              style={styles.postImage}
            />

            <View style={styles.dishRow}>
              <View style={styles.dishInfo}>
                <Text style={styles.dishLabel}>EATING</Text>
                <Text style={styles.dishName}>{post.dish}</Text>
              </View>

              <View style={styles.rating}>
                <Text style={styles.ratingText}>
                  ★ {post.rating}
                </Text>
              </View>
            </View>

            <View style={styles.actions}>
              <View style={styles.leftActions}>
                <Pressable style={styles.action}>
                  <Text style={styles.actionIcon}>♡</Text>
                  <Text style={styles.actionCount}>{post.likes}</Text>
                </Pressable>

                <Pressable style={styles.action}>
                  <Text style={styles.commentIcon}>◯</Text>
                  <Text style={styles.actionCount}>
                    {post.comments}
                  </Text>
                </Pressable>
              </View>

              <Pressable>
                <Text style={styles.save}>♧</Text>
              </Pressable>
            </View>
          </View>
        ))}
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

  header: {
    paddingHorizontal: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "#111111",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -1,
  },

  subtitle: {
    color: "#777777",
    fontSize: 14,
    marginTop: 4,
  },

  notification: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  notificationIcon: {
    fontSize: 20,
  },

  feedSelector: {
    marginHorizontal: 22,
    marginTop: 25,
    marginBottom: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    padding: 4,
    flexDirection: "row",
  },

  feedActive: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 11,
    paddingVertical: 11,
    alignItems: "center",
  },

  feedInactive: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
  },

  feedActiveText: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "700",
  },

  feedInactiveText: {
    color: "#888888",
    fontSize: 13,
    fontWeight: "600",
  },

  post: {
    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "#EAF7FD",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#29A9EA",
    fontSize: 15,
    fontWeight: "800",
  },

  userInfo: {
    flex: 1,
    marginLeft: 11,
  },

  username: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "700",
  },

  time: {
    color: "#999999",
    fontSize: 11,
    marginTop: 3,
  },

  more: {
    color: "#777777",
    fontSize: 14,
    letterSpacing: 1,
  },

  postText: {
    color: "#333333",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 15,
  },

  postImage: {
    width: "100%",
    height: 290,
    borderRadius: 20,
    backgroundColor: "#EEEEEE",
    marginTop: 15,
  },

  dishRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },

  dishInfo: {
    flex: 1,
  },

  dishLabel: {
    color: "#999999",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },

  dishName: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 3,
  },

  rating: {
    backgroundColor: "#EAF7FD",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  ratingText: {
    color: "#168CC5",
    fontSize: 12,
    fontWeight: "800",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 17,
  },

  leftActions: {
    flexDirection: "row",
    gap: 22,
  },

  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  actionIcon: {
    color: "#222222",
    fontSize: 22,
  },

  commentIcon: {
    color: "#222222",
    fontSize: 18,
  },

  actionCount: {
    color: "#555555",
    fontSize: 12,
    fontWeight: "600",
  },

  save: {
    color: "#222222",
    fontSize: 20,
  },
});