import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Contact = () => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Text style={styles.title}>Contact Us</Text>
      <Text style={styles.subtitle}>
        We’re here to help you with your laundry needs
      </Text>

      {/* ---------- CONTACT CARD ---------- */}
      <View style={styles.card}>
        <ContactRow
          icon="call-outline"
          label="Phone"
          value="+61 98765 43210"
          onPress={() => Linking.openURL("tel:+619876543210")}
        />

        <Divider />

        <ContactRow
          icon="mail-outline"
          label="Email"
          value="contact@washbud.com.au"
          onPress={() => Linking.openURL("mailto:contact@washbud.com.au")}
        />

        <Divider />

        <ContactRow
          icon="location-outline"
          label="Address"
          value="Perth, Western Australia"
        />
      </View>

      {/* ---------- SUPPORT HOURS ---------- */}
      <View style={styles.infoBox}>
        <Ionicons name="time-outline" size={18} color="#6366F1" />
        <Text style={styles.infoText}>
          Support available: Mon – Sat, 9 AM – 7 PM
        </Text>
      </View>

      {/* ---------- ACTION BUTTON ---------- */}
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Chat with Support</Text>
      </Pressable>
    </ScrollView>
  );
};

export default Contact;

/* ---------- SMALL COMPONENTS ---------- */

const ContactRow = ({
  icon,
  label,
  value,
  onPress,
}: {
  icon: any;
  label: string;
  value: string;
  onPress?: () => void;
}) => (
  <Pressable style={styles.row} onPress={onPress} disabled={!onPress}>
    <Ionicons name={icon} size={22} color="#6366F1" />
    <View style={{ flex: 1 }}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
    {onPress && <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
  </Pressable>
);

const Divider = () => <View style={styles.divider} />;

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 30,
    flexGrow: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginTop: 20,
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },

  rowLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  rowValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#EEF2FF",
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
  },

  infoText: {
    fontSize: 13,
    color: "#3730A3",
  },

  button: {
    backgroundColor: "#6366F1",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 24,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
