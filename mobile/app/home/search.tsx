import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS } from "@/constants/theme";
import { useGetOrderByOrderId } from "@/hooks/useGetOrderByOrderId";

const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B",
  processing: "#3B82F6",
  ready: "#10B981",
  delivered: "#22C55E",
  cancelled: "#EF4444",
};

const Search = () => {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [searchId, setSearchId] = useState<string | null>(null);

  const { data: order, isLoading, isError } = useGetOrderByOrderId(searchId);

  useEffect(() => {
    const value = query.trim().toUpperCase();
    if (value.length >= 3) setSearchId(value);
    else setSearchId(null);
  }, [query]);

  const statusColor = order?.orderStatus
    ? STATUS_COLORS[order.orderStatus] || "#6B7280"
    : "#6B7280";

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <TouchableOpacity onPress={() => router.back()}>
        <Feather name="arrow-left" size={22} color="#111827" />
      </TouchableOpacity>

      <Text style={styles.title}>Track your order</Text>
      <Text style={styles.subtitle}>Enter the last part of your order ID</Text>

      {/* INPUT */}
      <TextInput
        placeholder="Eg: 3RICBT"
        placeholderTextColor="#9CA3AF"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
        autoCapitalize="characters"
      />

      {/* RESULTS */}
      <View style={{ marginTop: 24 }}>
        {isLoading && <ActivityIndicator size="small" color={COLORS.primary} />}

        {isError && searchId && (
          <Text style={styles.errorText}>Order not found</Text>
        )}

        {order && (
          <Pressable
            style={styles.card}
            onPress={() => router.push(`/order/${order._id}`)}
          >
            {/* Top row */}
            <View style={styles.cardHeader}>
              <Text style={styles.orderId}>{order.orderId}</Text>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: `${statusColor}20` },
                ]}
              >
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {order.orderStatus.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Details */}
            <Text style={styles.detailText}>
              <Text style={styles.label}>Customer:</Text> {order.customerName}
            </Text>

            <Text style={styles.detailText}>
              <Text style={styles.label}>Service:</Text> {order.service}
            </Text>

            <Text style={styles.detailText}>
              <Text style={styles.label}>Payment:</Text>{" "}
              {order.paymentMethod.toUpperCase()}
            </Text>

            <Text style={styles.dateText}>
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </Text>

            {/* Footer */}
            <View style={styles.cardFooter}>
              <Text style={styles.viewText}>View details</Text>
              <Feather name="chevron-right" size={18} color="#6B7280" />
            </View>
          </Pressable>
        )}
      </View>

      <View style={{ flex: 1 }} />
    </View>
  );
};

export default Search;

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
    marginTop: 50,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
    color: "#111827",
  },

  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 20,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#111827",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  orderId: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
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

  detailText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },

  label: {
    color: "#6B7280",
  },

  dateText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 6,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },

  viewText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.primaryDark,
  },

  errorText: {
    color: "#EF4444",
    fontSize: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 8,
    marginTop: 10,
  },
});
