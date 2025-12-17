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

const EditProfile = () => {
  const [name, setName] = useState("Paramveer");
  const [username, setUsername] = useState("paramveer8256");
  const [address, setAddress] = useState("");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Edit Profile</Text>

          <TouchableOpacity>
            <Text style={styles.save}>Save</Text>
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
          />
        </View>

        {/* Username */}
        <View style={styles.field}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholder="Username"
            autoCapitalize="none"
          />
        </View>

        {/* Address */}
        <View style={styles.field}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            style={[styles.input, styles.textArea]}
            placeholder="Add your address"
            multiline
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;
const styles = StyleSheet.create({
  container: {
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
    marginBottom: 20,
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

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
});
