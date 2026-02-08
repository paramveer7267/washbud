import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useDeleteUser } from "@/hooks/useDeleteUser";

const CONFIRM_TEXT = "DELETE";

const DeleteAccount = () => {
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const { mutateAsync: deleteUser } = useDeleteUser();

  const handleDeletePress = () => {
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
      ],
    );
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);

      await deleteUser();

      Toast.show({
        type: "success",
        text1: "Account deleted successfully",
        position: "top",
        topOffset: 60,
      });

      router.replace("/(auth)/login");
    } catch (e: any) {
      Alert.alert(
        "Error",
        e?.response?.data?.message ||
          "Failed to delete account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isConfirmed = confirmText.trim().toUpperCase() === CONFIRM_TEXT;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F2F4F7" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Delete Account</Text>

        <Text style={styles.warning}>
          Deleting your account will permanently remove all your data including
          profile information, saved addresses, and order history.
        </Text>

        <View style={styles.confirmBox}>
          <Text style={styles.confirmLabel}>
            Type <Text style={styles.bold}>{CONFIRM_TEXT}</Text> to confirm
          </Text>

          <TextInput
            value={confirmText}
            onChangeText={setConfirmText}
            style={[
              styles.input,
              confirmText.length > 0 && !isConfirmed && styles.inputError,
            ]}
            placeholder={CONFIRM_TEXT}
            autoCapitalize="characters"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.deleteButton,
            (!isConfirmed || loading) && { opacity: 0.5 },
          ]}
          onPress={handleDeletePress}
          disabled={!isConfirmed || loading}
        >
          <Text style={styles.deleteText}>
            {loading ? "Deleting..." : "Delete Account"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default DeleteAccount;

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    justifyContent: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 14,
    textAlign: "center",
    color: "#111827",
  },

  warning: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 22,
  },

  confirmBox: {
    marginBottom: 28,
  },

  confirmLabel: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
    textAlign: "center",
  },

  bold: {
    fontWeight: "700",
    color: "#111827",
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    textAlign: "center",
    letterSpacing: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  inputError: {
    borderWidth: 1,
    borderColor: "#EF4444",
  },

  deleteButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 18,
  },

  deleteText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  cancel: {
    textAlign: "center",
    fontSize: 16,
    color: "#2563EB",
    fontWeight: "600",
  },
});
