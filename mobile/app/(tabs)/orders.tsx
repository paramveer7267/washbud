import React, { useMemo, useState } from "react";
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
import { useAuthUserStore } from "@/store/authUser";
import { useGetUserOrders } from "@/hooks/useGetUserOrders";

/* ---------- Order Type ---------- */
type Order = {
  _id: string;
  orderId: string;
  customerName: string;
  service: string;
  weightCategory: string;
  pickup: string;
  dropoff: string;
  paymentMethod: string;
  orderStatus?: string;
  specialItems?: string;
  orderItem?: string[];
};

/* ---------- Status Config ---------- */
const STATUS = {
  pending: { label: "Pickup Pending", color: "#F59E0B" },
  processing: { label: "Washing", color: "#3B82F6" },
  ready: { label: "Ready for Delivery", color: "#10B981" },
  delivered: { label: "Delivered", color: "#22C55E" },
  cancelled: { label: "Cancelled", color: "#EF4444" },
};

type StatusKey = keyof typeof STATUS | "all";

/* ---------- Card ---------- */
const OrderCard = ({ order }: { order: Order }) => {
  const status =
    STATUS[order.orderStatus as keyof typeof STATUS] ?? STATUS.pending;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() => router.push(`/order/${order._id}`)}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{order.customerName}</Text>

          <View style={styles.orderIdRow}>
            <Text style={styles.orderIdTag}>Order ID:</Text>
            <Text style={styles.orderId}>{order.orderId}</Text>
          </View>

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

      {order.orderItem?.length ? (
        <View style={styles.items}>
          <Text style={styles.itemsTitle}>Garments</Text>
          <Text style={styles.itemsText}>{order.orderItem.join(", ")}</Text>
        </View>
      ) : null}

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
  const { user } = useAuthUserStore();
  const { data, isLoading } = useGetUserOrders(user?._id);
  const [selectedStatus, setSelectedStatus] = useState<StatusKey>("all");

  const filteredOrders = useMemo<Order[]>(() => {
    const orders = data ?? [];

    if (selectedStatus === "all") return orders;

    return orders.filter(
      (order: Order) => order.orderStatus === selectedStatus,
    );
  }, [data, selectedStatus]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Laundry Orders</Text>

      {/* ---------- FILTER TABS ---------- */}
      <View style={styles.filterRow}>
        {(
          [
            "all",
            "pending",
            "processing",
            "ready",
            "delivered",
            "cancelled",
          ] as StatusKey[]
        ).map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterChip,
              selectedStatus === status && styles.filterChipActive,
            ]}
            onPress={() => setSelectedStatus(status)}
          >
            <Text
              style={[
                styles.filterText,
                selectedStatus === status && styles.filterTextActive,
              ]}
            >
              {status === "all" ? "All" : STATUS[status].label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.createBtn}
        onPress={() => router.push("../order/create")}
      >
        <Text style={styles.createBtnText}>Create New Laundry Order</Text>
      </TouchableOpacity>

      {!isLoading && filteredOrders.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Text style={{ color: "#6B7280", fontSize: 14 }}>
            No orders found
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <OrderCard order={item} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

/* ---------- Styles (ONLY ADDITIONS) ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    marginBottom: 90,
    marginTop: 50,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    marginVertical: 12,
    color: "#000",
  },

  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },

  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },

  filterChipActive: {
    backgroundColor: COLORS.primary,
  },

  filterText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
  },

  filterTextActive: {
    color: "#fff",
  },

  createBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 80,
    marginBottom: 16,
  },

  createBtnText: {
    color: "white",
    fontWeight: "600",
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

  orderIdRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },

  orderIdTag: {
    fontSize: 12,
    color: COLORS.grey,
    marginRight: 4,
    fontWeight: "500",
  },

  orderId: {
    fontSize: 12,
    color: COLORS.primaryDark,
    fontWeight: "600",
  },
});
