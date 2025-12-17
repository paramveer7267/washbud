import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "@/constants/theme";
/* ---------- Order Type ---------- */
type Order = {
  weightCategory: string;
  id: string;
  customerName: string;
  service: string;
  pickup: string;
  dropoff: string;
  paymentMethod: "cash" | "card" | "upi" | "online" | "cod";
  orderStatus?: "pending" | "processing" | "ready" | "delivered" | "cancelled";
  specialItems?: string;
  orderItem?: string[];
  reviews?: string[];
};
/* ---------- Dummy Orders ---------- */
const orders: Order[] = [
  {
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
    reviews: ["64f1a9c1a1b2c3d4e5f607a2", "64f1a9c1a1b2c3d4e5f607a3"],
  },
  {
    id: "2",
    weightCategory: "0-5kg",
    customerName: "Amit Sharma",
    service: "Express Delivery",
    pickup: "Sector 18, Noida",
    dropoff: "Connaught Place, Delhi",
    paymentMethod: "upi",
    orderStatus: "pending",
    orderItem: ["Documents"],
  },
];

/* ---------- Status Config ---------- */
const STATUS = {
  pending: { label: "Pending", color: "#F59E0B" },
  processing: { label: "Processing", color: "#3B82F6" },
  ready: { label: "Ready", color: "#10B981" },
  delivered: { label: "Delivered", color: "#22C55E" },
  cancelled: { label: "Cancelled", color: "#EF4444" },
};

/* ---------- Card ---------- */
const OrderCard = ({ order }: { order: Order }) => {
  const status = STATUS[order.orderStatus ?? "pending"];

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() => router.push(`/order/${order.id}`)}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{order.customerName}</Text>
          <Text style={styles.service}>{order.service}</Text>
        </View>

        <View
          style={[styles.statusBadge, { backgroundColor: `${status.color}20` }]}
        >
          <Text style={[styles.statusText, { color: status.color }]}>
            {status.label}
          </Text>
        </View>
      </View>

      {/* Route */}
      <View style={styles.route}>
        <Ionicons name="location-outline" size={18} color="#6B7280" />
        <Text style={styles.routeText}>
          {order.pickup} → {order.dropoff}
        </Text>
      </View>

      {/* Info */}
      <View style={styles.infoRow}>
        <InfoChip icon="cube-outline" label={order.weightCategory} />
        <InfoChip
          icon="card-outline"
          label={order.paymentMethod.toUpperCase()}
        />
      </View>

      {/* Items */}
      {order.orderItem?.length ? (
        <View style={styles.items}>
          <Text style={styles.itemsTitle}>Items</Text>
          <Text style={styles.itemsText}>{order.orderItem.join(", ")}</Text>
        </View>
      ) : null}

      {/* Special Note */}
      {order.specialItems ? (
        <View style={styles.note}>
          <Ionicons name="alert-circle-outline" size={16} color="#F97316" />
          <Text style={styles.noteText}>{order.specialItems}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

/* ---------- Chip ---------- */
const InfoChip = ({ icon, label }: { icon: any; label: string }) => (
  <View style={styles.chip}>
    <Ionicons name={icon} size={14} color="#6B7280" />
    <Text style={styles.chipText}>{label}</Text>
  </View>
);

/* ---------- Screen ---------- */
export default function Orders() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>
      <TouchableOpacity
        style={{
          backgroundColor: COLORS.primary,
          paddingVertical: 10,
          borderRadius: 8,
          alignItems: "center",
          marginHorizontal: 80,
          marginBottom: 16,
        }}
        onPress={() => router.push("/order/create")}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>
          Create New Order
        </Text>
      </TouchableOpacity>
      <FlatList
        data={orders}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => <OrderCard order={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    marginBottom: 90,
    marginTop: 40,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    marginVertical: 12,
    color: COLORS.primaryDark,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
  },

  service: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },

  route: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  routeText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#374151",
    flex: 1,
  },

  infoRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },

  chipText: {
    fontSize: 12,
    marginLeft: 4,
    color: "#374151",
    fontWeight: "500",
  },

  items: {
    marginTop: 12,
  },

  itemsTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },

  itemsText: {
    fontSize: 13,
    marginTop: 2,
  },

  note: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#FFF7ED",
    padding: 8,
    borderRadius: 8,
  },

  noteText: {
    marginLeft: 6,
    fontSize: 12,
    color: "#9A3412",
    flex: 1,
  },
});
