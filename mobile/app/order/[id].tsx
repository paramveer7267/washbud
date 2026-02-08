import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { COLORS } from "@/constants/theme";
import { useGetOrderById } from "@/hooks/useGetOrderById";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import Toast from "react-native-toast-message";
import { useCancelOrder } from "@/hooks/useCancelOrder";
import { useDeleteOrder } from "@/hooks/useDeleteOrder";

/* ---------- Status Config ---------- */
const STATUS = {
  pending: { label: "Pickup Pending", color: "#F59E0B" },
  processing: { label: "Washing", color: "#3B82F6" },
  ready: { label: "Ready for Delivery", color: "#10B981" },
  delivered: { label: "Delivered", color: "#22C55E" },
  cancelled: { label: "Cancelled", color: "#EF4444" },
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B",
  processing: "#3B82F6",
  ready: "#10B981",
  delivered: "#22C55E",
  cancelled: "#EF4444",
};

export default function Order() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: order, isLoading } = useGetOrderById(id);

  const items = order?.orderItem ?? [];

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isCancelling, setIsCancelling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { mutate: cancelOrder } = useCancelOrder();
  const { mutate: deleteOrder } = useDeleteOrder();

  /* ---------- LOADING ---------- */
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  /* ---------- SAFETY ---------- */
  if (!order) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: "#6B7280" }}>Order not found</Text>
      </View>
    );
  }

  /* ---------- STATUS ---------- */
  const statusMeta =
    STATUS[order.orderStatus as keyof typeof STATUS] || STATUS.pending;

  const statusColor = STATUS_COLORS[order.orderStatus] || STATUS_COLORS.pending;

  /* ---------- PERMISSIONS ---------- */
  const canCancel = order.orderStatus === "pending";

  const canDelete =
    order.orderStatus === "cancelled" || order.orderStatus === "delivered";

  /* ---------- CANCEL ---------- */
  const handleCancelOrder = async () => {
    try {
      setIsCancelling(true);

      cancelOrder({
        _id: order._id,
        orderStatus: order.orderStatus,
      });

      setShowCancelModal(false);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error || "Failed to cancel order",

      });
    } finally {
      setIsCancelling(false);
    }
  };

  /* ---------- DELETE ---------- */
  const handleDeleteOrder = async () => {
    try {
      setIsDeleting(true);

      deleteOrder(
        { _id: order._id },
        {
          onSuccess: () => {
            Toast.show({
              type: "success",
              text1: "Order deleted successfully",
              position:"top",
              topOffset: 60,
            });
            router.replace("/orders");
          },
          onError: () => {
            Toast.show({
              type: "error",
              text1: "Failed to delete order",
            });
          },
        },
      );

      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* ---------- HEADER ---------- */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <Pressable onPress={() => router.back()} hitSlop={10}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={COLORS.primaryDark}
              />
            </Pressable>
            <Text style={styles.title}>Laundry Order</Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${statusColor}20` },
            ]}
          >
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusMeta.label}
            </Text>
          </View>
        </View>

        {/* ---------- CARD ---------- */}
        <View style={styles.card}>
          <Info label="Order ID" value={order.orderId} />
          <Info label="Customer Name" value={order.customerName} />
          <Info label="Laundry Service" value={order.service} />
          <Info label="Weight Category" value={order.weightCategory} />
          <Info
            label="Payment Method"
            value={order.paymentMethod.toUpperCase()}
          />

          <Divider />

          <Info label="Pickup Address" value={order.pickup} />
          <Info label="Delivery Address" value={order.dropoff} />

          {items.length > 0 && (
            <>
              <Divider />
              <Text style={styles.sectionTitle}>Included Garments</Text>
              {items.map((item, index) => (
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
                  <Text style={{ fontWeight: "600" }}>
                    Laundry Instructions:{" "}
                  </Text>
                  {order.specialItems}
                </Text>
              </View>
            </>
          )}

          {/* ---------- CANCEL ---------- */}
          {canCancel ? (
            <>
              <Divider />
              <Pressable
                style={styles.cancelButton}
                onPress={() => setShowCancelModal(true)}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={18}
                  color="#EF4444"
                />
                <Text style={styles.cancelText}>Cancel Order</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Divider />
              <Text style={styles.disabledNote}>
                Order can only be cancelled before pickup.
              </Text>
            </>
          )}

          {/* ---------- DELETE (ONLY CANCELLED / DELIVERED) ---------- */}
          {canDelete && (
            <>
              <Divider />
              <Pressable
                style={styles.cancelButton}
                onPress={() => setShowDeleteModal(true)}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                <Text style={styles.cancelText}>Delete Order</Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>

      {/* ---------- CANCEL MODAL ---------- */}
      <DeleteConfirmationModal
        visible={showCancelModal}
        title="Cancel Order?"
        description="Only pickup pending orders can be cancelled."
        confirmText="Cancel Order"
        isLoading={isCancelling}
        onCancel={() => setShowCancelModal(false)}
        onConfirm={handleCancelOrder}
      />

      {/* ---------- DELETE MODAL ---------- */}
      <DeleteConfirmationModal
        visible={showDeleteModal}
        title="Delete Order?"
        description="This action is permanent and cannot be undone."
        confirmText="Delete Order"
        isLoading={isDeleting}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteOrder}
      />
    </>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

const Info = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const Divider = () => <View style={styles.divider} />;

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    marginTop: 40,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
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
    marginBottom: 60,
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

  cancelButton: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EF4444",
  },

  cancelText: {
    color: "#EF4444",
    fontWeight: "600",
    fontSize: 14,
  },

  disabledNote: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },
});
