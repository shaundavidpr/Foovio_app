import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";  
import { supabase } from "../../../lib/supabase";

export default function PostScreen() {
  const { id } = useLocalSearchParams();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, []);

  async function loadPost() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    setPost(data);
    setLoading(false);
  }

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
  <SafeAreaView style={styles.container}>
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: post.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.card}>
        {post.caption && (
          <Text style={styles.caption}>
            {post.caption}
          </Text>
        )}

        <View style={styles.ratingCard}>
          <Text style={styles.rating}>
            ★
          </Text>

          <View>
            <Text style={styles.ratingValue}>
              {post.rating}/5
            </Text>

            <Text style={styles.ratingLabel}>
              Community rating
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
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

  content: {
    paddingBottom: 40,
  },

  imageContainer: {
    width: "100%",
    height: 350,
    backgroundColor: "#0B111A",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  card: {
    marginHorizontal: 16,
    marginTop: -20,
    padding: 21,
    backgroundColor: "#0B111A",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.055)",
  },

  caption: {
    color: "#F7FAFF",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 23,
  },

  ratingCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.055)",
  },

  rating: {
    color: "#FFD166",
    fontSize: 28,
    marginRight: 12,
  },

  ratingValue: {
    color: "#F7FAFF",
    fontSize: 15,
    fontWeight: "900",
  },

  ratingLabel: {
    color: "#7F8C9D",
    fontSize: 9,
    marginTop: 3,
  },
});
