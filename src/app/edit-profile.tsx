import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";       

type Profile = {
  id: string;
  name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
};

export default function EditProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [userId, setUserId] = useState("");

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

 useEffect(() => {
  loadProfile();
}, []);

useEffect(() => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(() => {
    loadProfile();
  });

  return () => {
    subscription.unsubscribe();
  };
}, []);

  async function loadProfile() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.back();
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setName(data?.name ?? "");
      setUsername(data?.username ?? "");
      setBio(data?.bio ?? "");
      setAvatarUrl(data?.avatar_url ?? "");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    if (!name.trim()) {
      Alert.alert("Name required");
      return;
    }

    if (!username.trim()) {
      Alert.alert("Username required");
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          name,
          username,
          bio,
        })
        .eq("id", userId);

      if (error) throw error;

      Alert.alert("Success", "Profile updated");

      router.replace("/(tabs)/profile");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setSaving(false);
    }
  }
 async function pickAvatar() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    Alert.alert("Permission required");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled) return;

  try {
    const image = result.assets[0];

    const response = await fetch(image.uri);
    const blob = await response.blob();

    const fileName = `${userId}-${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, blob, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: publicUrl,
      })
      .eq("id", userId);

    if (updateError) throw updateError;

    setAvatarUrl(publicUrl);

    Alert.alert("Success", "Avatar updated");
  } catch (e: any) {
    Alert.alert("Upload failed", e.message);
  }
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>

        <Text style={styles.title}>Edit Profile</Text>

        <Pressable onPress={saveProfile} disabled={saving}>
          <Text style={styles.save}>
            {saving ? "Saving..." : "Save"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.form}>
        <Pressable
  onPress={pickAvatar}
  style={{
    alignSelf: "center",
    marginBottom: 25,
    alignItems: "center",
  }}
>
  {avatarUrl ? (
    <Image
      source={{ uri: avatarUrl }}
      style={{
        width: 100,
        height: 100,
        borderRadius: 50,
      }}
    />
  ) : (
    <View
      style={{
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#EEE",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Photo</Text>
    </View>
  )}

  <Text
    style={{
      marginTop: 10,
      color: "#29A9EA",
      fontWeight: "700",
    }}
  >
    Change Photo
  </Text>
</Pressable>
        <Text style={styles.label}>Name</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          style={styles.input}
        />

        <Text style={styles.label}>Username</Text>

        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          autoCapitalize="none"
          style={styles.input}
        />

        <Text style={styles.label}>Bio</Text>

        <TextInput
          value={bio}
          onChangeText={setBio}
          placeholder="Tell people about yourself"
          multiline
          style={[styles.input, styles.bio]}
        />

        <Pressable
          style={styles.button}
          onPress={saveProfile}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {saving ? "Saving..." : "Save Changes"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  cancel: {
    color: "#666",
    fontSize: 16,
  },

  save: {
    color: "#29A9EA",
    fontSize: 16,
    fontWeight: "700",
  },

  form: {
    padding: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 18,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },

  bio: {
    height: 120,
    textAlignVertical: "top",
  },

  button: {
    marginTop: 30,
    backgroundColor: "#29A9EA",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});