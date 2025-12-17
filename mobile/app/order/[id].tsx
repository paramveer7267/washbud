import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "@/constants/theme";

/* ---------- Dummy Order ---------- */
const order = {
  id: "1",
  weightCategory: "5-10kg",
  customerName: "Priya Verma",
  service: "Standard Delivery",
  pickup: "Indiranagar, Bengaluru",
  dropoff: "Whitefield, Bengaluru",
  paymentMethod: "card",
  orderStatus: "processing",
  specialItems: "Handle with care",
  orderItem: ["Laptop", "Charger"],
};

/* ---------- Status Colors ---------- */
const STATUS_COLORS = {
  pending: "#F59E0B",
  processing: "#3B82F6",
  ready: "#10B981",
  delivered: "#22C55E",
  cancelled: "#EF4444",
};

export default function Order() {
  const statusColor = STATUS_COLORS[order.orderStatus];

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primaryDark} />
          </Pressable>

          <Text style={styles.title}>Order Details</Text>
        </View>

        <View
          style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}
        >
          <Text style={[styles.statusText, { color: statusColor }]}>
            {order.orderStatus.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Info label="Customer" value={order.customerName} />
        <Info label="Service" value={order.service} />
        <Info label="Weight Category" value={order.weightCategory} />
        <Info
          label="Payment Method"
          value={order.paymentMethod.toUpperCase()}
        />

        <Divider />

        <Info label="Pickup Location" value={order.pickup} />
        <Info label="Drop-off Location" value={order.dropoff} />

        {order.orderItem?.length > 0 && (
          <>
            <Divider />
            <Text style={styles.sectionTitle}>Items</Text>
            {order.orderItem.map((item, index) => (
              <Text key={index} style={styles.listItem}>
                • {item}
              </Text>
            ))}
          </>
        )}

        {order.specialItems && (
          <>
            <Divider />
            <View style={styles.note}>
              <Text style={styles.noteText}>
                <Text style={{ fontWeight: "600" }}>Note: </Text>
                {order.specialItems}
              </Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

/* ---------- Small Components ---------- */

const Info = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const Divider = () => <View style={styles.divider} />;

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    marginTop: 50,
  },

  header: {
    marginVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.primaryDark,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    color: "#6B7280",
  },

  value: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    maxWidth: "60%",
    textAlign: "right",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  listItem: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 4,
  },

  note: {
    backgroundColor: "#FFF7ED",
    padding: 12,
    borderRadius: 8,
  },

  noteText: {
    fontSize: 14,
    color: "#9A3412",
  },
});
