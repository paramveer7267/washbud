import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Subscriptions = () => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Text style={styles.title}>Choose Your Plan</Text>
      <Text style={styles.subtitle}>
        Save more with our laundry subscriptions
      </Text>

      {/* ---------- BASIC PLAN ---------- */}
      <View style={styles.card}>
        <Text style={styles.planTitle}>Basic Plan</Text>
        <Text style={styles.price}>₹499 / month</Text>

        <View style={styles.benefits}>
          <Benefit text="Up to 10 kg laundry" />
          <Benefit text="Free pickup & delivery" />
          <Benefit text="Standard washing" />
          <Benefit text="Email & app support" />
        </View>

        {/* <Pressable style={styles.buttonOutline}>
          <Text style={styles.buttonOutlineText}>Choose Basic</Text>
        </Pressable> */}
      </View>

      {/* ---------- PREMIUM PLAN ---------- */}
      <View style={[styles.card, styles.premiumCard]}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>BEST VALUE</Text>
        </View>

        <Text style={styles.planTitle}>Premium Plan</Text>
        <Text style={styles.price}>₹899 / month</Text>

        <View style={styles.benefits}>
          <Benefit text="Up to 25 kg laundry" />
          <Benefit text="Free pickup & delivery" />
          <Benefit text="Premium washing & ironing" />
          <Benefit text="Priority support" />
          <Benefit text="Same-day service" />
        </View>

        {/* <Pressable style={styles.buttonFilled}>
          <Text style={styles.buttonFilledText}>Choose Premium</Text>
        </Pressable> */}
      </View>
      <View>
        <Text style={{ textAlign: "center", color: "#6B7280", fontSize: 12 }}>
          * Prices are indicative. Final pricing may vary based on location and
          usage.
        </Text>
      </View>
    </ScrollView>
  );
};

export default Subscriptions;

/* ---------- SMALL COMPONENT ---------- */

const Benefit = ({ text }: { text: string }) => (
  <View style={styles.benefitRow}>
    <Ionicons name="checkmark-circle" size={18} color="#10B981" />
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    padding: 20,
    // backgroundColor: "#F5F5F5",
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
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  premiumCard: {
    borderWidth: 1,
    borderColor: "#6366F1",
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#6366F1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 8,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },

  planTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },

  price: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },

  benefits: {
    marginBottom: 20,
  },

  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },

  benefitText: {
    fontSize: 14,
    color: "#374151",
  },

  buttonOutline: {
    borderWidth: 1,
    borderColor: "#6366F1",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonOutlineText: {
    color: "#6366F1",
    fontWeight: "600",
    fontSize: 14,
  },

  buttonFilled: {
    backgroundColor: "#6366F1",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonFilledText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});
