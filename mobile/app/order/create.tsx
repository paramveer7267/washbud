import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "@/constants/theme";

/* ---------- Constants ---------- */
const PAYMENT_METHODS = ["cash", "card", "upi", "online", "cod"];
const WEIGHT_CATEGORIES = ["0-5kg", "5-10kg", "10-20kg", "20kg+"];

/* ---------- Screen ---------- */
export default function CreateOrder() {
  const [form, setForm] = useState({
    weightCategory: "",
    customerName: "",
    service: "",
    pickup: "",
    dropoff: "",
    paymentMethod: "",
    specialItems: "",
    orderItem: "",
  });

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      orderItem: form.orderItem
        ? form.orderItem.split(",").map((i) => i.trim())
        : [],
    };

    console.log("CREATE ORDER PAYLOAD", payload);
    router.back();
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.title}>Create Order</Text>
      </View>

      {/* Form */}
      <View style={styles.card}>
        <Input
          label="Customer Name"
          value={form.customerName}
          onChange={(v) => update("customerName", v)}
          placeholder="Enter customer name"
        />

        <Input
          label="Service"
          value={form.service}
          onChange={(v: string) => update("service", v)}
          placeholder="Standard / Express"
        />

        <Input
          label="Pickup Location"
          value={form.pickup}
          onChange={(v: string) => update("pickup", v)}
          placeholder="Pickup address"
        />

        <Input
          label="Drop-off Location"
          value={form.dropoff}
          onChange={(v) => update("dropoff", v)}
          placeholder="Drop-off address"
        />

        <Select
          label="Weight Category"
          options={WEIGHT_CATEGORIES}
          value={form.weightCategory}
          onSelect={(v) => update("weightCategory", v)}
        />

        <Select
          label="Payment Method"
          options={PAYMENT_METHODS}
          value={form.paymentMethod}
          onSelect={(v) => update("paymentMethod", v)}
        />

        <Input
          label="Order Items (comma separated)"
          value={form.orderItem}
          onChange={(v) => update("orderItem", v)}
          placeholder="Laptop, Charger"
        />

        <Input
          label="Special Instructions (optional)"
          value={form.specialItems}
          onChange={(v) => update("specialItems", v)}
          placeholder="Handle with care"
          multiline
        />
      </View>

      {/* Submit */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Create Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------- Components ---------- */

const Input = ({ label, value, onChange, placeholder, multiline }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      multiline={multiline}
      style={[styles.input, multiline && { height: 90 }]}
    />
  </View>
);

const Select = ({ label, options, value, onSelect }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.selectRow}>
      {options.map((opt: string) => (
        <TouchableOpacity
          key={opt}
          onPress={() => onSelect(opt)}
          style={[styles.chip, value === opt && styles.chipActive]}
        >
          <Text
            style={[styles.chipText, value === opt && styles.chipTextActive]}
          >
            {opt.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    marginTop: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.primaryDark,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
  },

  inputGroup: {
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
  },

  selectRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },

  chipActive: {
    backgroundColor: "#2563EB20",
  },

  chipText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },

  chipTextActive: {
    color: "#2563EB",
    fontWeight: "600",
  },

  submitBtn: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
