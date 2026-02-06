import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useGetUserOrders } from "@/hooks/useGetUserOrders";
import { useAuthUserStore } from "@/store/authUser";
const STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: "Pickup Pending", color: "#F59E0B" },
  processing: { label: "Washing", color: "#3B82F6" },
  ready: { label: "Ready for Delivery", color: "#10B981" },
  delivered: { label: "Delivered", color: "#22C55E" },
  cancelled: { label: "Cancelled", color: "#EF4444" },
};

const OrderHistory = () => {
  const { user } = useAuthUserStore();
  const { data: orders = [] } = useGetUserOrders(user?._id);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>
        <Text style={styles.title}>Order History</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Orders */}
      {orders.map((order: any) => {
        const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        const items = `${order.weightCategory} • ${formatService(
          order.service,
        )}`;

        return (
          <TouchableOpacity
            key={order._id}
            style={styles.card}
            onPress={() => router.push(`/order/${order._id}`)}
          >
            <View style={styles.row}>
              <Text style={styles.orderId}>{order.orderId}</Text>
              <StatusBadge status={order.orderStatus} />
            </View>

            <Text style={styles.date}>{date}</Text>

            <View style={styles.detailsRow}>
              <Text style={styles.items}>{items}</Text>
              <Text style={styles.amount}>
                {order.paymentMethod?.toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Empty State */}
      {orders.length === 0 && (
        <View style={styles.empty}>
          <Ionicons name="receipt-outline" size={48} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyText}>
            Your laundry orders will appear here.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default OrderHistory;

/* ---------- Helpers ---------- */
const formatService = (service?: string) => {
  if (!service) return "Laundry";
  if (service === "dry") return "Dry Clean";
  if (service === "wash") return "Wash Only";
  if (service === "iron") return "Wash & Iron";
  return service;
};

/* ---------- Status Badge ---------- */
const StatusBadge = ({ status }: { status: string }) => {
  const key = status?.toLowerCase();
  const config = STATUS[key] || {
    label: status,
    color: "#6B7280",
  };

  return (
    <View style={[styles.badge, { backgroundColor: `${config.color}22` }]}>
      <Text style={[styles.badgeText, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
};

/* ---------- Styles (UNCHANGED) ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F4F7",
    paddingHorizontal: 20,
    paddingTop: 50,
    marginTop: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  orderId: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  date: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 10,
  },

  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  items: {
    fontSize: 14,
    color: "#374151",
  },

  amount: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },

  empty: {
    marginTop: 80,
    alignItems: "center",
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  emptyText: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});
