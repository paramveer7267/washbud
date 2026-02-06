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
        source={require("../assets/images/app.jpg")}
        resizeMode="cover"
        style={styles.background}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.9)", "rgba(0,0,0,0.6)", "transparent"]}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0.5, y: 0 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/images/famflix-logo-wobg.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
              All your favorite Movies & TV Shows. All in one place.
            </Text>

            {/* Free Trial Button */}
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>EXPLORE FREE TRIAL</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.replace("/(auth)/login")}
            >
              <Text style={styles.secondaryButtonText}>LOG IN</Text>
            </TouchableOpacity>

            {/* Create Account */}
            <View style={styles.footerRow}>
              <Text style={styles.orText}>or </Text>
              <TouchableOpacity
                onPress={() => router.replace("/(auth)/signup")}
              >
                <Text style={styles.createAccountText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    flex: 1,
    justifyContent: "flex-end",
  },

  gradient: {
    height: height * 0.6,
    paddingHorizontal: 22,
    paddingVertical: 30,
    width: "100%",
  },

  content: {
    flex: 1,
    justifyContent: "flex-end",
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },

  logo: {
    width: 192, // w-48
    height: 56, // h-14
  },

  subtitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },

  primaryButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  secondaryButton: {
    borderWidth: 2,
    borderColor: "#1D4ED8",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
  },

  secondaryButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3B82F6",
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  orText: {
    color: "#F97316",
  },

  createAccountText: {
    color: "#3B82F6",
    fontWeight: "600",
  },
});
