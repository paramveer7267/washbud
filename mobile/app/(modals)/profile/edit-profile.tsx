import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useAuthUserStore } from "@/store/authUser";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";

const EditProfile = () => {
  const { user } = useAuthUserStore();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [contactNumber, setContactNumber] = useState(user?.contactNumber || "");

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!user?._id) return;

    setUsernameError(null);
    setContactError(null);

    try {
      await updateProfile({
        id: user._id,
        name,
        username,
        contactNumber,
      });

      router.back();
    } catch (error: any) {
      const message: string =
        error?.response?.data?.message || "Something went wrong";

      const lower = message.toLowerCase();

      if (lower.includes("username")) {
        setUsernameError(message);
        return;
      }

      if (
        lower.includes("contact") ||
        lower.includes("phone") ||
        lower.includes("number")
      ) {
        setContactError(message);
        return;
      }

      Toast.show({
        type: "error",
        text1: "Update failed",
        text2: message,
        position: "top",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F2F4F7" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Edit Profile</Text>

          <TouchableOpacity onPress={handleSave} disabled={isPending}>
            <Text style={[styles.save, isPending && { opacity: 0.5 }]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        {/* Name */}
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Username */}
        <View style={styles.field}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setUsernameError(null);
            }}
            style={[styles.input, usernameError && styles.inputError]}
            placeholder="Username"
            autoCapitalize="none"
            placeholderTextColor="#9CA3AF"
          />
          {usernameError && (
            <Text style={styles.errorText}>{usernameError}</Text>
          )}
        </View>

        {/* Contact Number */}
        <View style={styles.field}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            value={contactNumber}
            onChangeText={(text) => {
              setContactNumber(text);
              setContactError(null);
            }}
            style={[styles.input, contactError && styles.inputError]}
            placeholder="Phone number"
            keyboardType="phone-pad"
            placeholderTextColor="#9CA3AF"
          />
          {contactError && <Text style={styles.errorText}>{contactError}</Text>}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
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
    marginBottom: 20,
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

  inputError: {
    borderWidth: 1,
    borderColor: "#EF4444",
  },

  errorText: {
    marginTop: 6,
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "500",
  },
});
