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
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";

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
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required");
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
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

      const { error: uploadError } =
        await supabase.storage
          .from("avatars")
          .upload(fileName, blob, {
            contentType: "image/jpeg",
            upsert: true,
          });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const { error: updateError } =
        await supabase
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.headerButton}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Text style={styles.title}>
            Edit Profile
          </Text>

          <Pressable
            onPress={saveProfile}
            disabled={saving}
            style={styles.saveButton}
          >
            <Text
              style={[
                styles.saveText,
                saving && styles.disabledText,
              ]}
            >
              {saving ? "Saving..." : "Save"}
            </Text>
          </Pressable>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Pressable
            onPress={pickAvatar}
            style={styles.avatarSection}
          >
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {name
                    ? name
                        .charAt(0)
                        .toUpperCase()
                    : "F"}
                </Text>
              </View>
            )}

            <View style={styles.cameraBadge}>
              <Text style={styles.cameraText}>
                +
              </Text>
            </View>

            <Text style={styles.changePhoto}>
              Change Photo
            </Text>
          </Pressable>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>
            Personal Information
          </Text>

          {/* Name */}
          <View style={styles.field}>
            <Text style={styles.label}>
              NAME
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#566273"
              style={styles.input}
              selectionColor="#73C7FF"
            />
          </View>

          {/* Username */}
          <View style={styles.field}>
            <Text style={styles.label}>
              USERNAME
            </Text>

            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              placeholderTextColor="#566273"
              autoCapitalize="none"
              style={styles.input}
              selectionColor="#73C7FF"
            />
          </View>

          {/* Bio */}
          <View style={styles.field}>
            <Text style={styles.label}>
              BIO
            </Text>

            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Tell people about yourself"
              placeholderTextColor="#566273"
              multiline
              style={[
                styles.input,
                styles.bioInput,
              ]}
              textAlignVertical="top"
              selectionColor="#73C7FF"
            />
          </View>

          {/* Save */}
          <Pressable
            style={({ pressed }) => [
              styles.mainButton,
              saving && styles.mainButtonDisabled,
              pressed &&
                !saving &&
                styles.mainButtonPressed,
            ]}
            onPress={saveProfile}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator
                color="#FFFFFF"
              />
            ) : (
              <Text style={styles.mainButtonText}>
                Save Changes
              </Text>
            )}
          </Pressable>
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
    paddingBottom: 45,
  },

  /* Header */

  header: {
    height: 64,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor:
      "rgba(255,255,255,0.055)",
  },

  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0B111A",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.055)",
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    color: "#F7FAFF",
    fontSize: 31,
    lineHeight: 34,
    marginTop: -3,
  },

  title: {
    color: "#F7FAFF",
    fontSize: 17,
    fontWeight: "900",
  },

  saveButton: {
    paddingHorizontal: 5,
    paddingVertical: 10,
  },

  saveText: {
    color: "#73C7FF",
    fontSize: 13,
    fontWeight: "900",
  },

  disabledText: {
    opacity: 0.45,
  },

  /* Profile */

  profileCard: {
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 25,
    backgroundColor: "#0B111A",
    borderRadius: 23,
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.055)",
    alignItems: "center",
  },

  avatarSection: {
    alignItems: "center",
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor:
      "rgba(46,155,255,0.13)",
    borderWidth: 2,
    borderColor:
      "rgba(113,199,255,0.16)",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#73C7FF",
    fontSize: 40,
    fontWeight: "900",
  },

  cameraBadge: {
    position: "absolute",
    right: 0,
    bottom: 28,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#2E9BFF",
    borderWidth: 3,
    borderColor: "#0B111A",
    justifyContent: "center",
    alignItems: "center",
  },

  cameraText: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "700",
    lineHeight: 22,
  },

  changePhoto: {
    color: "#73C7FF",
    fontSize: 11,
    fontWeight: "900",
    marginTop: 12,
  },

  /* Form */

  form: {
    paddingHorizontal: 16,
    marginTop: 28,
  },

  sectionTitle: {
    color: "#F7FAFF",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 5,
  },

  field: {
    marginTop: 19,
  },

  label: {
    color: "#7F8C9D",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.7,
    marginBottom: 8,
  },

  input: {
    minHeight: 52,
    backgroundColor: "#0B111A",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.055)",
    borderRadius: 17,
    paddingHorizontal: 16,
    paddingVertical: 13,
    color: "#F7FAFF",
    fontSize: 14,
  },

  bioInput: {
    height: 125,
    paddingTop: 15,
  },

  /* Main Button */

  mainButton: {
    height: 55,
    marginTop: 30,
    borderRadius: 18,
    backgroundColor: "#2E9BFF",
    justifyContent: "center",
    alignItems: "center",
  },

  mainButtonPressed: {
    opacity: 0.82,
  },

  mainButtonDisabled: {
    opacity: 0.55,
  },

  mainButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
});