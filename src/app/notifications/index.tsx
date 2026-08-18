import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";

type Notification = {
  id: string;
  type: "like" | "comment" | "follow";
  created_at: string;
  is_read: boolean;
  post_id: string | null;

  profiles: {
    id: string;
    name: string | null;
  } | null;
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("notifications")
        .select(`
          *,
          profiles:actor_id (
            id,
            name
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      setNotifications((data as any) ?? []);
    } catch (error) {
      console.error(
        "Notifications loading error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  const formatTime = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();

    const difference =
      now.getTime() - created.getTime();

    const minutes = Math.floor(
      difference / (1000 * 60)
    );

    if (minutes < 1) return "now";

    if (minutes < 60) {
      return `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `${days}d`;
    }

    return created.toLocaleDateString();
  };

  const getInitial = (name?: string | null) => {
    if (!name) return "F";

    return (
      name.trim().charAt(0).toUpperCase() || "F"
    );
  };

  const getNotificationText = (
    type: Notification["type"]
  ) => {
    switch (type) {
      case "like":
        return "liked your post";

      case "comment":
        return "commented on your post";

      case "follow":
        return "started following you";

      default:
        return "interacted with you";
    }
  };

  const getNotificationIcon = (
    type: Notification["type"]
  ) => {
    switch (type) {
      case "like":
        return "♡";

      case "comment":
        return "◌";

      case "follow":
        return "+";

      default:
        return "•";
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color="#73C7FF"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.title}>
            Notifications
          </Text>

          <Text style={styles.subtitle}>
            Stay up to date
          </Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      {notifications.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Text style={styles.emptyIconText}>
              ♡
            </Text>
          </View>

          <Text style={styles.emptyTitle}>
            You're all caught up
          </Text>

          <Text style={styles.emptyText}>
            New likes, comments and followers
            will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.card,
                !item.is_read &&
                  styles.unreadCard,
              ]}
              onPress={() => {
                if (item.post_id) {
                  router.push(
                    `/social/post/${item.post_id}`
                  );
                }
              }}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {getInitial(
                    item.profiles?.name
                  )}
                </Text>

                <View
                  style={[
                    styles.typeBadge,
                    item.type === "like" &&
                      styles.likeBadge,
                    item.type === "comment" &&
                      styles.commentBadge,
                    item.type === "follow" &&
                      styles.followBadge,
                  ]}
                >
                  <Text
                    style={styles.typeBadgeText}
                  >
                    {getNotificationIcon(
                      item.type
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.body}>
                <Text style={styles.message}>
                  <Text style={styles.name}>
                    {item.profiles?.name ??
                      "Foovio user"}
                  </Text>{" "}
                  {getNotificationText(
                    item.type
                  )}
                </Text>

                <Text style={styles.time}>
                  {formatTime(item.created_at)}
                </Text>
              </View>

              {!item.is_read && (
                <View style={styles.unreadDot} />
              )}
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05080D",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#05080D",
  },

  /* Header */

  header: {
    height: 78,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor:
      "rgba(255,255,255,0.055)",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#0B111A",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.055)",
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    color: "#F7FAFF",
    fontSize: 32,
    lineHeight: 34,
    marginTop: -3,
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
  },

  title: {
    color: "#F7FAFF",
    fontSize: 18,
    fontWeight: "900",
  },

  subtitle: {
    color: "#7F8C9D",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 3,
  },

  headerSpacer: {
    width: 42,
  },

  /* List */

  list: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },

  card: {
    minHeight: 76,
    marginBottom: 9,
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0B111A",
    borderRadius: 19,
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.055)",
  },

  unreadCard: {
    borderColor:
      "rgba(46,155,255,0.18)",
    backgroundColor: "#0D151F",
  },

  /* Avatar */

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor:
      "rgba(46,155,255,0.13)",
    borderWidth: 1,
    borderColor:
      "rgba(113,199,255,0.13)",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#73C7FF",
    fontSize: 16,
    fontWeight: "900",
  },

  typeBadge: {
    position: "absolute",
    right: -4,
    bottom: -2,
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#0B111A",
    justifyContent: "center",
    alignItems: "center",
  },

  likeBadge: {
    backgroundColor: "#EF4444",
  },

  commentBadge: {
    backgroundColor: "#2E9BFF",
  },

  followBadge: {
    backgroundColor: "#4ADE80",
  },

  typeBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },

  /* Body */

  body: {
    flex: 1,
    marginLeft: 13,
    paddingRight: 8,
  },

  message: {
    color: "#AAB4C2",
    fontSize: 12,
    lineHeight: 18,
  },

  name: {
    color: "#F7FAFF",
    fontWeight: "900",
  },

  time: {
    color: "#6F7B8B",
    fontSize: 9,
    marginTop: 5,
  },

  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#3B9CFF",
  },

  /* Empty */

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 35,
    paddingBottom: 80,
  },

  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor:
      "rgba(46,155,255,0.12)",
    borderWidth: 1,
    borderColor:
      "rgba(113,199,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyIconText: {
    color: "#73C7FF",
    fontSize: 30,
    fontWeight: "300",
  },

  emptyTitle: {
    color: "#F7FAFF",
    fontSize: 19,
    fontWeight: "900",
    marginTop: 18,
  },

  emptyText: {
    color: "#7F8C9D",
    fontSize: 11,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 7,
    maxWidth: 270,
  },
});