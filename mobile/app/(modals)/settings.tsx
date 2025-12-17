import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";

const Settings = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>
      {/* Account */}
      <Text style={styles.sectionTitle}>Account</Text>

      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push("/(modals)/profile/edit-profile")}
      >
        <Text style={styles.itemText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push("/(modals)/account/change-password")}
      >
        <Text style={styles.itemText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push("/(modals)/account/delete-account")}
      >
        <Text style={styles.itemText}>Delete Account</Text>
      </TouchableOpacity>

      {/* Preferences */}
      <Text style={styles.sectionTitle}>Preferences</Text>

      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>Language</Text>
      </TouchableOpacity>

      {/* Support */}
      <Text style={styles.sectionTitle}>Support</Text>

      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>Help Center</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>About</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={[styles.item, styles.logout]}>
        <Text style={[styles.itemText, styles.logoutText]}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Settings;
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 24,
    marginBottom: 8,
    fontWeight: "600",
  },

  item: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  itemText: {
    fontSize: 16,
  },

  logout: {
    marginTop: 32,
    borderBottomWidth: 0,
  },

  logoutText: {
    color: "#DC2626",
    fontWeight: "600",
  },
});
