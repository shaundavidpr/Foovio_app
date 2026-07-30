import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { supabase } from "../../lib/supabase";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Basic validation
    if (!cleanName || !cleanEmail || !password) {
      Alert.alert(
        "Missing information",
        "Enter your name, email and password."
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Password too short",
        "Use at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: cleanName,
          },
        },
      });

      if (error) {
        Alert.alert(
          "Couldn't create account",
          error.message
        );
        return;
      }
      if (data.user) {
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: data.user.id,
      name: cleanName,
      onboarding_completed: false,
    });

  if (profileError) {
    console.error("Profile creation error:", profileError);

    Alert.alert(
      "Account created",
      "Your account was created, but we couldn't set up your profile."
    );

    return;
  }
}

      /*
       * If Supabase email confirmation is enabled,
       * the account may be created without an active session.
       */
      if (!data.session) {
        Alert.alert(
          "Check your email",
          "Your account was created. Verify your email to finish signing in.",
          [
            {
              text: "Go to login",
              onPress: () =>
                router.replace("/auth/login"),
            },
          ]
        );

        return;
      }

      // New account + active session:
      // continue with Foovio onboarding.
      router.replace("/onboarding/preferences");
    } catch (error) {
      console.error("Signup error:", error);

      Alert.alert(
        "Something went wrong",
        "Please try creating your account again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.brand}>foovio</Text>

        <Text style={styles.title}>
          Create your{"\n"}account
        </Text>

        <Text style={styles.subtitle}>
          Discover food through people you trust.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>NAME</Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#AAAAAA"
            autoCapitalize="words"
            autoComplete="name"
            style={styles.input}
          />

          <Text style={styles.label}>EMAIL</Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#AAAAAA"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            style={styles.input}
          />

          <Text style={styles.label}>PASSWORD</Text>

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            placeholderTextColor="#AAAAAA"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="new-password"
            style={styles.input}
          />

          <Pressable
            disabled={loading}
            onPress={handleSignUp}
            style={({ pressed }) => [
              styles.button,
              loading && styles.buttonDisabled,
              pressed && !loading && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>
              {loading
                ? "Creating account..."
                : "Create account"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.loginRow}>
          <Text style={styles.loginQuestion}>
            Already have an account?
          </Text>

          <Pressable
            disabled={loading}
            onPress={() => router.push("/auth/login")}
          >
            <Text style={styles.loginText}>
              Log in
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 75,
    paddingBottom: 40,
  },

  brand: {
    color: "#29A9EA",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 35,
  },

  title: {
    color: "#111111",
    fontSize: 40,
    lineHeight: 45,
    fontWeight: "800",
    letterSpacing: -1,
  },

  subtitle: {
    color: "#777777",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 14,
  },

  form: {
    marginTop: 40,
  },

  label: {
    color: "#888888",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.3,
    marginBottom: 9,
    marginTop: 18,
  },

  input: {
    backgroundColor: "#F7F7F7",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: "#111111",
    fontSize: 15,
  },

  button: {
    backgroundColor: "#29A9EA",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 30,
  },

  buttonPressed: {
    opacity: 0.85,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 25,
  },

  loginQuestion: {
    color: "#777777",
    fontSize: 13,
  },

  loginText: {
    color: "#29A9EA",
    fontSize: 13,
    fontWeight: "800",
  },
});