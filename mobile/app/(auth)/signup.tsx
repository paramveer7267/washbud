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
export default function Signup() {
  const signup = useAuthUserStore((state) => state.signup);
  const isSigningUp = useAuthUserStore((state) => state.isSigningUp);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = () => {
    if (!name || !username || !email || !password) {
      Toast.show({
        type: "error",
        text1: "All fields are required",
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords do not match",
      });
      return;
    }

    signup({
      name,
      username,
      email,
      password,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
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
          <Text style={styles.title}>Create Account ✨</Text>
          <Text style={styles.subtitle}>
            Sign up to start your laundry journey
          </Text>
        </View>

        {/* Form */}
        <View style={styles.card}>
          {/* Full Name */}
          <Input
            icon="person-outline"
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />

          {/* Username */}
          <Input
            icon="at-outline"
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          {/* Email */}
          <Input
            icon="mail-outline"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {/* Password */}
          <PasswordInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            show={showPassword}
            toggle={() => setShowPassword(!showPassword)}
          />

          {/* Confirm Password */}
          <PasswordInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            show={showConfirmPassword}
            toggle={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          {/* Sign Up Button */}
          <TouchableOpacity
            style={styles.signupBtn}
            onPress={handleSignup}
            disabled={isSigningUp}
            activeOpacity={0.9}
          >
            {isSigningUp ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signupText}>SIGN UP</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <TouchableOpacity
          style={styles.footer}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.login}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ---------- Reusable Inputs ---------- */

const Input = ({ icon, ...props }: any) => (
  <View style={styles.inputWrapper}>
    <Ionicons name={icon} size={20} color={COLORS.muted} />
    <TextInput
      style={styles.input}
      placeholderTextColor={COLORS.muted}
      {...props}
    />
  </View>
);

const PasswordInput = ({
  placeholder,
  value,
  onChangeText,
  show,
  toggle,
}: any) => (
  <View style={styles.inputWrapper}>
    <Ionicons name="lock-closed-outline" size={20} color={COLORS.muted} />
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={!show}
      placeholderTextColor={COLORS.muted}
      style={styles.input}
    />
    <TouchableOpacity onPress={toggle}>
      <Ionicons
        name={show ? "eye-off-outline" : "eye-outline"}
        size={20}
        color={COLORS.muted}
      />
    </TouchableOpacity>
  </View>
);

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

  title: {
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

  signupBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },

  signupText: {
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

  login: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});
