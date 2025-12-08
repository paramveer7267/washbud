import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Image,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const { height } = Dimensions.get("window");

export default function AuthScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/laundry-bg.png")} // Add your background
        resizeMode="cover"
        style={styles.background}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.85)", "rgba(0,0,0,0.60)", "transparent"]}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/images/laundry-logo.png")} // Add your logo
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Heading */}
            <Text style={styles.title}>Fresh Clothes. Zero Effort.</Text>
            <Text style={styles.subtitle}>
              We pick up, wash, iron & deliver your laundry — right from your
              home.
            </Text>

            {/* Signup */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push("/(auth)/signup")}
            >
              <Text style={styles.primaryButtonText}>GET STARTED</Text>
            </TouchableOpacity>

            {/* Login */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push("/(auth)/login")}
            >
              <Text style={styles.secondaryButtonText}>LOG IN</Text>
            </TouchableOpacity>

            {/* Guest */}
            <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
              <Text style={styles.guestText}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  background: {
    flex: 1,
    justifyContent: "flex-end",
  },
  gradient: {
    height: height * 0.55,
    paddingHorizontal: 24,
    paddingVertical: 32,
    width: "100%",
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 160,
    height: 160,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    color: "#ddd",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: "#1E90FF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: "#1E90FF",
    fontSize: 16,
    fontWeight: "700",
  },
  guestText: {
    color: "#bbb",
    fontSize: 14,
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: 4,
  },
});
