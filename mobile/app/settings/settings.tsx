import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  // Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthUserStore } from "@/store/authUser";
import * as WebBrowser from "expo-web-browser";

// const TERMS_URL = "https://washbud.com.au/terms";
// const PRIVACY_URL = "https://washbud.com.au/privacy";
// const ABOUT_URL = "https://washbud.com.au/about";

const Settings = () => {
  const openInAppBrowser = async (url: string) => {
    await WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      controlsColor: "#2563EB", // match your app theme
      dismissButtonStyle: "close",
    });
  };
  const { logout } = useAuthUserStore();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Settings</Text>

      {/* ---------- Account ---------- */}
      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.card}>
        <SettingsItem
          icon="person-outline"
          label="Edit Profile"
          onPress={() => router.push("/(modals)/profile/edit-profile")}
        />

        <SettingsItem
          icon="lock-closed-outline"
          label="Change Password"
          onPress={() => router.push("/(modals)/account/change-password")}
        />

        <SettingsItem
          icon="trash-outline"
          label="Delete Account"
          danger
          onPress={() => router.push("/(modals)/account/delete-account")}
        />
      </View>

      {/* ---------- Laundry Preferences ---------- */}
      <Text style={styles.sectionTitle}>Laundry Preferences</Text>
      <View style={styles.card}>
        <SettingsItem
          icon="location-outline"
          label="Default Pickup Address"
          onPress={() => router.push("/home/saved-addresses")}
        />

        <SettingsItem
          icon="shirt-outline"
          label="Laundry Instructions"
          subtitle="Wash, fold, detergent preferences"
          onPress={() => router.push("/settings/laundry-instructions")}
        />

        <SettingsItem
          icon="time-outline"
          label="Pickup Preferences"
          subtitle="Preferred pickup time"
          onPress={() => router.push("/settings/pickup-preference")}
        />
      </View>

      {/* ---------- Payments & Orders ---------- */}
      <Text style={styles.sectionTitle}>Payments & Orders</Text>
      <View style={styles.card}>
        <SettingsItem icon="card-outline" label="Payment Methods" onPress={() => router.push("/settings/payment-methods")}/>

        <SettingsItem icon="receipt-outline" label="Order History" onPress={() => router.push("/settings/order-history")}/>
      </View>

      {/* ---------- Preferences ---------- */}
      <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.card}>
        <SettingsItem icon="notifications-outline" label="Notifications" onPress={() => router.push("/settings/notifications")}/>

        <SettingsItem icon="language-outline" label="Language" />

        <SettingsItem
          icon="moon-outline"
          label="Dark Mode"
          subtitle="System default"
        />
      </View>

      {/* ---------- Support ---------- */}
      <Text style={styles.sectionTitle}>Support</Text>
      <View style={styles.card}>
        <SettingsItem icon="help-circle-outline" label="Help Center" />

        <SettingsItem icon="chatbubble-outline" label="Contact Support" />
      </View>

      {/* ---------- About ---------- */}
      <Text style={styles.sectionTitle}>About</Text>
      <View style={styles.card}>
        <SettingsItem
          icon="document-text-outline"
          label="Terms of Use"
          onPress={() => openInAppBrowser("https://washbud.com.au/terms")}
        />

        <SettingsItem
          icon="shield-checkmark-outline"
          label="Privacy Policy"
          onPress={() => openInAppBrowser("https://washbud.com.au/privacy")}
        />

        <SettingsItem
          icon="information-circle-outline"
          label="About Washbud"
          onPress={() => openInAppBrowser("https://washbud.com.au/about")}
        />
      </View>

      {/* ---------- Logout ---------- */}
      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Ionicons name="log-out-outline" size={20} color="#DC2626" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Settings;

/* ---------- Reusable Item ---------- */
const SettingsItem = ({
  icon,
  label,
  subtitle,
  onPress,
  danger,
}: {
  icon: any;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  danger?: boolean;
}) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Ionicons
      name={icon}
      size={22}
      color={danger ? "#DC2626" : "#374151"}
      style={styles.icon}
    />

    <View style={{ flex: 1 }}>
      <Text style={[styles.itemText, danger && { color: "#DC2626" }]}>
        {label}
      </Text>

      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>

    {!danger && <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />}
  </TouchableOpacity>
);

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    marginTop: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#111827",
  },

  sectionTitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 24,
    marginBottom: 8,
    fontWeight: "600",
    letterSpacing: 0.4,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 14,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },

  icon: {
    width: 30,
    marginRight: 12,
  },

  itemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },

  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  logout: {
    marginTop: 20,
    marginBottom: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  logoutText: {
    color: "#DC2626",
    fontSize: 18,
    fontWeight: "700",
  },
});
