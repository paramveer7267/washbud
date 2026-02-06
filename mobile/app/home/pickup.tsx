import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Pickup = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Search Box */}
      {/* <View style={styles.searchBox}>
        <Feather name="search" size={18} color="#EF4444" />
        <TextInput
          placeholder="Enter location name"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />
      </View> */}

      {/* Use Current Location only apple*/}
      {Platform.OS === "ios" && (
        <TouchableOpacity
          style={styles.currentLocation}
          onPress={() => router.push("/home/confirm-location")}
        >
          <MaterialIcons name="my-location" size={20} color="#EF4444" />
          <Text style={styles.currentText}>Use current location</Text>
        </TouchableOpacity>
      )}

      {/* Saved Addresses */}
      <TouchableOpacity
        style={styles.savedCard}
        onPress={() => router.push("/home/saved-addresses")}
      >
        <View style={styles.row}>
          <Feather name="heart" size={20} color="#EF4444" />
          <Text style={styles.savedText}>Saved Addresses</Text>
        </View>

        <Feather name="chevron-right" size={20} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );
};

export default Pickup;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    marginTop: 55,
  },

  header: {
    paddingTop: 16,
    paddingBottom: 12,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  input: {
    marginLeft: 8,
    fontSize: 16,
    flex: 1,
    color: "#111827",
  },

  currentLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    gap: 8,
  },

  currentText: {
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "500",
  },

  savedCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    marginTop: 24,
    padding: 16,
    borderRadius: 14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  savedText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
});
