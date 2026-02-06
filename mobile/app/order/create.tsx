import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "@/constants/theme";
import { useAuthUserStore } from "@/store/authUser";
import { useCreateOrder } from "@/hooks/useCreateOrder";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
/* ---------- Constants ---------- */
const PAYMENT_METHODS = ["cash", "card", "upi", "online", "cod"];
const WEIGHT_CATEGORIES = ["0-5kg", "5-10kg", "10-20kg", "20kg+"];

/* ---------- Screen ---------- */
export default function CreateOrder() {
  const { user } = useAuthUserStore();

  const [form, setForm] = useState({
    weightCategory: "",
    customerName: user?.name || "",
    service: "",
    paymentMethod: "",
    specialItems: "",
    orderItem: "",
  });

  const [pickupAddress, setPickupAddress] = useState(user?.currentAddress);
  const [dropoffAddress, setDropoffAddress] = useState(user?.currentAddress);
  const [addressTarget, setAddressTarget] = useState<
    "pickup" | "dropoff" | null
  >(null);

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const { mutate: createOrder, isPending } = useCreateOrder();

  /* ---------- SUBMIT ---------- */
  const handleSubmit = () => {
    if (
      !user?._id ||
      !form.customerName ||
      !form.service ||
      !form.weightCategory ||
      !form.paymentMethod ||
      !pickupAddress ||
      !dropoffAddress
    ) {
      Toast.show({
        type: "error",
        text1: "Please fill all required fields",
      });
      return;
    }

    createOrder({
      user: user._id,
      customerName: form.customerName,
      weightCategory: form.weightCategory,
      service: form.service,
      pickup: pickupAddress,
      dropoff: dropoffAddress,
      paymentMethod: form.paymentMethod,
      specialItems: form.specialItems || undefined,

      orderItem: form.orderItem
        ? form.orderItem
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean) // 🔥 removes empty strings
        : [],
    });
    router.back();
  };

  /* ---------- JSX ---------- */
  return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={COLORS.primaryDark}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Create Order</Text>
          </View>

          {/* Form */}
          <View style={styles.card}>
            <Input
              label="Customer Name"
              value={form.customerName}
              onChange={(v: string) => update("customerName", v)}
              placeholder="Enter customer name"
            />

            <Input
              label="Service *"
              value={form.service}
              onChange={(v: string) => update("service", v)}
              placeholder="Wash / Iron / Dry Clean"
            />

            <TouchableOpacity
              onPress={() => router.push("/home/saved-addresses")}
            >
              <Text
                style={{
                  color: COLORS.primary,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                Add New Address
              </Text>
            </TouchableOpacity>

            {/* PICKUP */}
            <Input label="Pickup Location" value={pickupAddress} />
            <ChangeBtn onPress={() => setAddressTarget("pickup")} />

            {/* DROPOFF */}
            <Input label="Drop-off Location" value={dropoffAddress} />
            <ChangeBtn onPress={() => setAddressTarget("dropoff")} />

            <Select
              label="Weight Category"
              options={WEIGHT_CATEGORIES}
              value={form.weightCategory}
              onSelect={(v: string) => update("weightCategory", v)}
            />

            <Select
              label="Payment Method"
              options={PAYMENT_METHODS}
              value={form.paymentMethod}
              onSelect={(v: string) => update("paymentMethod", v)}
            />

            <Input
              label="Order Items (comma separated)"
              value={form.orderItem}
              onChange={(v: string) => update("orderItem", v)}
              placeholder="Shirt, Jeans, Bedsheet"
            />

            <Input
              label="Special Instructions"
              value={form.specialItems}
              onChange={(v: string) => update("specialItems", v)}
              placeholder="No starch, gentle wash"
            />
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={isPending}
          >
            <Text style={styles.submitText}>
              {isPending ? "Placing Order..." : "Create Order"}
            </Text>
          </TouchableOpacity>

          {/* ADDRESS MODAL */}
          <Modal transparent visible={!!addressTarget} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>Select Address</Text>

                {user?.address?.map((addr) => (
                  <TouchableOpacity
                    key={addr}
                    style={styles.addressItem}
                    onPress={() => {
                      if (addressTarget === "pickup") setPickupAddress(addr);
                      if (addressTarget === "dropoff") setDropoffAddress(addr);
                      setAddressTarget(null);
                    }}
                  >
                    <Text>{addr}</Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity onPress={() => setAddressTarget(null)}>
                  <Text style={styles.cancel}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
  );
}

/* ---------- Reusable Components ---------- */

const Input = ({ label, value, onChange, placeholder, multiline }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      multiline={multiline}
      editable={!!onChange}
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

const ChangeBtn = ({ onPress }: any) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={styles.changeAddress}>Change Address</Text>
  </TouchableOpacity>
);

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 50,
    paddingBottom: 80,
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
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 6 },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  selectRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { backgroundColor: "#F3F4F6", padding: 10, borderRadius: 999 },
  chipActive: { backgroundColor: "#2563EB20" },
  chipText: { fontSize: 12 },
  chipTextActive: { color: "#2563EB", fontWeight: "600" },
  changeAddress: { color: COLORS.primary, fontWeight: "600", marginBottom: 16 },
  submitBtn: {
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    width: "50%",
    alignSelf: "center",
    alignItems: "center",
  },
  submitText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 16,
    width: "85%",
  },
  modalTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  addressItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  cancel: {
    marginTop: 12,
    color: "red",
    fontWeight: "600",
    textAlign: "center",
  },
});
