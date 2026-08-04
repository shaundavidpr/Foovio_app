import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView>

        <Image
          source={{ uri: post.image_url }}
          style={{
            width: "100%",
            height: 350,
          }}
        />

        <View
          style={{
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
            }}
          >
            {post.caption}
          </Text>

          <Text
            style={{
              marginTop: 15,
            }}
          >
            ⭐ {post.rating}/5
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}