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
      // 🔐 API CALL
      // await api.post("/account/change-password", { current, next });

      Alert.alert("Success", "Password changed successfully.");
      router.back();
    } catch (e) {
      Alert.alert("Error", "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
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
            <Text style={[styles.save, loading && { opacity: 0.5 }]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        {/* Current */}
        <View style={styles.field}>
          <Text style={styles.label}>Current Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={current}
            onChangeText={setCurrent}
            placeholder="••••••••"
          />
        </View>

        {/* New */}
        <View style={styles.field}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={next}
            onChangeText={setNext}
            placeholder="At least 8 characters"
          />
        </View>

        {/* Confirm */}
        <View style={styles.field}>
          <Text style={styles.label}>Confirm New Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Repeat new password"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChangePassword;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  title: {
    fontSize: 17,
    fontWeight: "600",
  },

  cancel: {
    fontSize: 16,
    color: "#6B7280",
  },

  save: {
    fontSize: 16,
    color: "#2563EB",
    fontWeight: "600",
  },

  field: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});
