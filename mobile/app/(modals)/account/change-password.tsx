import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";

const ChangePassword = () => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!current || !next || !confirm) {
      Alert.alert("Missing fields", "Please fill all fields.");
      return;
    }

    if (next.length < 8) {
      Alert.alert("Weak password", "Password must be at least 8 characters.");
      return;
    }

    if (next !== confirm) {
      Alert.alert("Mismatch", "New passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      // await api.post("/account/change-password", { current, next });

      Alert.alert("Success", "Password changed successfully.");
      router.back();
    } catch (e: any) {
      Alert.alert("Error", "Failed to change password.", e.message || e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F2F4F7" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Change Password</Text>

          <TouchableOpacity onPress={handleSave} disabled={loading}>
            <Text style={[styles.save, loading && { opacity: 0.5 }]}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Current Password */}
        <View style={styles.field}>
          <Text style={styles.label}>Current Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={current}
            onChangeText={setCurrent}
            placeholder="••••••••"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* New Password */}
        <View style={styles.field}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={next}
            onChangeText={setNext}
            placeholder="At least 8 characters"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Confirm Password */}
        <View style={styles.field}>
          <Text style={styles.label}>Confirm New Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Repeat new password"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChangePassword;

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  cancel: {
    fontSize: 16,
    color: "#6B7280",
  },

  save: {
    fontSize: 16,
    color: "#2563EB",
    fontWeight: "700",
  },

  field: {
    marginBottom: 22,
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
    fontWeight: "500",
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111827",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
});
