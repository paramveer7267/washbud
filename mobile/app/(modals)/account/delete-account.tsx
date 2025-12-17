import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";

const DeleteAccount = () => {
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      "Delete Account",
      "This action is permanent. All your data will be removed and cannot be recovered.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);

      // 🔥 API CALL GOES HERE
      // await api.delete("/account");

      // After success → log out & reset navigation
      router.replace("/(auth)/login");
    } catch (e) {
      Alert.alert("Error", "Failed to delete account. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Account</Text>

      <Text style={styles.warning}>
        Deleting your account will permanently remove all your data including
        profile information and activity.
      </Text>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        disabled={loading}
      >
        <Text style={styles.deleteText}>
          {loading ? "Deleting..." : "Delete Account"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.cancel}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DeleteAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },

  warning: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
  },

  deleteButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },

  deleteText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  cancel: {
    textAlign: "center",
    fontSize: 16,
    color: "#2563EB",
  },
});
