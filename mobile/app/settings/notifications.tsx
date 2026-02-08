import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";

type NotificationSettings = {
  orderUpdates: boolean;
  pickupReminders: boolean;
  deliveryUpdates: boolean;
  promotions: boolean;
  payments: boolean;
};

export default function NotificationsScreen() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    orderUpdates: true,
    pickupReminders: true,
    deliveryUpdates: true,
    promotions: false,
    payments: true,
  });

  /* ---------- Check permission on load ---------- */
  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermissionGranted(status === "granted");
  };

  const requestPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === "granted") {
      setPermissionGranted(true);
    } else {
      Alert.alert(
        "Permission required",
        "Please enable notifications from system settings to receive updates.",
      );
    }
  };

  const toggle = (key: keyof NotificationSettings) => {
    if (!permissionGranted) {
      requestPermission();
      return;
    }

    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Permission Banner */}
      {!permissionGranted && (
        <View style={styles.permissionBox}>
          <Ionicons
            name="notifications-off-outline"
            size={22}
            color="#B45309"
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.permissionTitle}>Notifications Disabled</Text>
            <Text style={styles.permissionText}>
              Enable notifications to get order and delivery updates.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.enableBtn}
            onPress={requestPermission}
          >
            <Text style={styles.enableText}>Enable</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ----------- Order Notifications ----------- */}
      <Text style={styles.sectionTitle}>Order Updates</Text>
      <View style={styles.card}>
        <NotificationItem
          icon="receipt-outline"
          label="Order Status Updates"
          subtitle="Order placed, washing, ready & delivered"
          value={settings.orderUpdates}
          onToggle={() => toggle("orderUpdates")}
        />

        <NotificationItem
          icon="time-outline"
          label="Pickup Reminders"
          subtitle="Reminder before pickup time"
          value={settings.pickupReminders}
          onToggle={() => toggle("pickupReminders")}
        />

        <NotificationItem
          icon="bicycle-outline"
          label="Delivery Updates"
          subtitle="Out for delivery & delivered"
          value={settings.deliveryUpdates}
          onToggle={() => toggle("deliveryUpdates")}
        />
      </View>

      {/* ----------- Payments ----------- */}
      <Text style={styles.sectionTitle}>Payments</Text>
      <View style={styles.card}>
        <NotificationItem
          icon="card-outline"
          label="Payment Updates"
          subtitle="Payment success or failure"
          value={settings.payments}
          onToggle={() => toggle("payments")}
        />
      </View>

      {/* ----------- Promotions ----------- */}
      <Text style={styles.sectionTitle}>Offers & Promotions</Text>
      <View style={styles.card}>
        <NotificationItem
          icon="pricetag-outline"
          label="Promotions & Offers"
          subtitle="Discounts, coupons & announcements"
          value={settings.promotions}
          onToggle={() => toggle("promotions")}
        />
      </View>
    </View>
  );
}

/* ---------- Notification Item ---------- */
const NotificationItem = ({
  icon,
  label,
  subtitle,
  value,
  onToggle,
}: {
  icon: any;
  label: string;
  subtitle: string;
  value: boolean;
  onToggle: () => void;
}) => (
  <View style={styles.item}>
    <Ionicons name={icon} size={22} color="#374151" />
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.itemTitle}>{label}</Text>
      <Text style={styles.itemSubtitle}>{subtitle}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: "#E5E7EB", true: "#93C5FD" }}
      thumbColor={value ? "#2563EB" : "#9CA3AF"}
    />
  </View>
);

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    paddingHorizontal: 20,
    paddingTop: 50,
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

  permissionBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
    gap: 10,
  },

  permissionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#92400E",
  },

  permissionText: {
    fontSize: 12,
    color: "#92400E",
  },

  enableBtn: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  enableText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },

  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  itemSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
});
