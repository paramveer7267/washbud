import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "@/constants/theme";

type PaymentMethod = {
  id: string;
  type: "card" | "upi";
  brand?: string;
  last4?: string;
  upiId?: string;
  isDefault?: boolean;
};

const initialMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "card",
    brand: "Visa",
    last4: "4242",
    isDefault: true,
  },
  {
    id: "2",
    type: "card",
    brand: "Mastercard",
    last4: "9821",
  },
  {
    id: "3",
    type: "upi",
    upiId: "paramveer@upi",
  },
];

export default function PaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods);

  const setDefault = (id: string) => {
    setMethods((prev) =>
      prev.map((m) => ({
        ...m,
        isDefault: m.id === id,
      })),
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>
        <Text style={styles.title}>Payment Methods</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Methods */}
      <FlatList
        data={methods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, item.isDefault && styles.defaultCard]}
            activeOpacity={0.9}
            onPress={() => setDefault(item.id)}
          >
            <View style={styles.cardRow}>
              <Ionicons
                name={item.type === "card" ? "card-outline" : "logo-usd"}
                size={22}
                color={COLORS.primary}
              />

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.methodTitle}>
                  {item.type === "card"
                    ? `${item.brand} •••• ${item.last4}`
                    : item.upiId}
                </Text>

                <Text style={styles.methodSub}>
                  {item.type === "card" ? "Debit / Credit Card" : "UPI Payment"}
                </Text>
              </View>

              {item.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Add new */}
      <TouchableOpacity
        style={styles.addBtn}
        // onPress={() => router.push("/add-payment")}
      >
        <Ionicons name="add-circle-outline" size={22} color="#fff" />
        <Text style={styles.addText}>Add Payment Method</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
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
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  defaultCard: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  methodTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  methodSub: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },

  defaultBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  defaultText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
  },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "70%",
    alignSelf: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
    marginBottom: 50,
  },

  addText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
