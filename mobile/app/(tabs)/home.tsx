import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

const Home = () => {
  const user = false;
  const isGuest = !user; // guest when no authenticated user exists

  return (
    <View style={styles.container}>
      {/* Greeting */}
      <Text style={styles.title}>
        {isGuest ? "Welcome, Guest 👋" : `Hello, ${user.username}!`}
      </Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Fresh laundry pickup & delivery at your doorstep.
      </Text>

      {/* Show buttons only for guests */}
      {isGuest && (
        <View style={styles.guestBox}>
          <Text style={styles.guestText}>
            You're browsing as a guest. Login or create an account to book your
            first laundry pickup.
          </Text>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={styles.loginText}>LOG IN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => router.push("/(auth)/signup")}
          >
            <Text style={styles.signupText}>CREATE ACCOUNT</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Authenticated Home Content */}
      {!isGuest && (
        <View>
          <Text style={styles.normalText}>Ready to schedule your pickup?</Text>

          <TouchableOpacity style={styles.orderButton}>
            <Text style={styles.orderText}>Book Laundry Pickup</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
    color: "#1E90FF",
  },
  subtitle: {
    color: "#666",
    marginBottom: 20,
    fontSize: 16,
  },
  guestBox: {
    marginTop: 10,
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#f3f3f3",
  },
  guestText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
  },
  loginButton: {
    paddingVertical: 12,
    backgroundColor: "#1E90FF",
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  signupButton: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#1E90FF",
    alignItems: "center",
  },
  signupText: {
    color: "#1E90FF",
    fontSize: 16,
    fontWeight: "700",
  },
  normalText: {
    fontSize: 16,
    color: "#444",
    marginBottom: 16,
  },
  orderButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  orderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
