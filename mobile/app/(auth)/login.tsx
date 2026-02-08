import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "@/constants/theme";
import { useAuthUserStore } from "@/store/authUser";
import Toast from "react-native-toast-message";

/* ---------- Screen ---------- */
export default function Login() {
  const login = useAuthUserStore((state) => state.login);
  const isLoggingIn = useAuthUserStore((state) => state.isLoggingIn);

  const [emailorusername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    const value = emailorusername.trim();
    try {
      if (!value || !password) {
        Toast.show({
          type: "error",
          text1: "Please fill all fields",
          position: "top",
          topOffset: 60,
        });
        return;
      }
      await login({ emailorusername: value, password });
    } catch (err) {
      console.error("Login Error:", err);
      Toast.show({
        type: "error",
        text1: "Login failed",
        position: "top",
        topOffset: 60,
      });
    } finally {
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#F9FAFB" }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          {/* {AuthScreen} */}
          <Ionicons
            name="arrow-back"
            size={24}
            color={COLORS.primaryDark}
            onPress={() => router.replace("/(auth)")}
          />
          <Text style={styles.welcome}>Welcome Back 👋</Text>
          <Text style={styles.subtitle}>
            Login to manage your laundry orders
          </Text>
        </View>

        {/* Form */}
        <View style={styles.card}>
          {/* Email / Username */}
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color={COLORS.muted} />
            <TextInput
              placeholder="Email or Username"
              value={emailorusername}
              onChangeText={setEmailOrUsername}
              autoCapitalize="none"
              placeholderTextColor={COLORS.muted}
              style={styles.input}
            />
          </View>

          {/* Password */}
          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={COLORS.muted}
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor={COLORS.muted}
              style={styles.input}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={COLORS.muted}
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={isLoggingIn}
            activeOpacity={0.9}
          >
            {isLoggingIn ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginText}>LOGIN</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <TouchableOpacity
          style={styles.footer}
          onPress={() => router.replace("/(auth)/signup")}
        >
          <Text style={styles.footerText}>
            Don’t have an account? <Text style={styles.signup}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    marginTop: 50,
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },

  header: {
    marginBottom: 32,
  },

  welcome: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.primaryDark,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    color: COLORS.muted,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 14,
    gap: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },

  loginBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },

  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  footer: {
    marginTop: 28,
    alignItems: "center",
  },

  footerText: {
    fontSize: 14,
    color: COLORS.muted,
  },

  signup: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});
