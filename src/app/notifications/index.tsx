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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

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
      .order("created_at", { ascending: false });

    setNotifications((data as any) ?? []);
    setLoading(false);
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable style={styles.card}>
          <Text style={styles.title}>
            {item.profiles?.name ?? "Someone"}{" "}
            {item.type === "like"
              ? "liked your post ❤️"
              : item.type === "comment"
              ? "commented on your post 💬"
              : "started following you 👤"}
          </Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    padding: 18,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
  },
});