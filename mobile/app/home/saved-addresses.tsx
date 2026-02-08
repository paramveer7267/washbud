import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthUserStore } from "@/store/authUser";
import { COLORS } from "@/constants/theme";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import Toast from "react-native-toast-message";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

const CITY_STATE_MAP: Record<string, string> = {
  Perth: "Western Australia",
  Melbourne: "Victoria",
};

const SavedAddresses = () => {
  const router = useRouter();

  const { user, setCurrentAddress } = useAuthUserStore();
  const addresses = user?.address || [];
  const currentAddress = user?.currentAddress;

  const [showDelete, setShowDelete] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);

  const [addressForm, setAddressForm] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  // --------------------
  // HELPERS
  // --------------------
  const updateField = (key: string, value: string) => {
    setAddressForm((prev) => ({ ...prev, [key]: value }));
  };

  const parseAddressToForm = (address: string) => {
    const lines = address.split("\n").map((l) => l.trim());

    const line1 = lines[0] || "";
    const cityStatePin = lines.find((l) => l.includes("-")) || "";
    const landmarkLine = lines.find((l) => l.startsWith("Landmark:"));

    let city = "",
      state = "",
      pincode = "";

    if (cityStatePin) {
      const [cityState, pin] = cityStatePin.split("-");
      const parts = cityState.split(",");
      city = parts[0]?.trim() || "";
      state = parts[1]?.trim() || "";
      pincode = pin?.trim() || "";
    }

    return {
      line1,
      line2: lines[1] && !lines[1].includes(",") ? lines[1] : "",
      city,
      state,
      pincode,
      landmark: landmarkLine
        ? landmarkLine.replace("Landmark:", "").trim()
        : "",
    };
  };

  // --------------------
  // ADD / EDIT ADDRESS
  // --------------------
  const handleSaveAddress = async () => {
    const { line1, city, state, pincode } = addressForm;

    if (!line1 || !city || !state || !pincode || !user?._id) {
      Toast.show({
        type: "error",
        text1: "Please fill all required fields",
      });
      return;
    }

    const formattedAddress = `
${addressForm.line1}
${addressForm.line2 ? addressForm.line2 + "\n" : ""}${addressForm.city}, ${addressForm.state} - ${addressForm.pincode}
${addressForm.landmark ? "Landmark: " + addressForm.landmark : ""}
`.trim();

    const updatedAddresses = editingAddress
      ? addresses.map((a) => (a === editingAddress ? formattedAddress : a))
      : [...addresses, formattedAddress];

    const nextCurrent =
      editingAddress === currentAddress
        ? formattedAddress
        : currentAddress || formattedAddress;

    try {
      await updateProfile({
        id: user._id,
        address: updatedAddresses,
        currentAddress: nextCurrent,
      });

      useAuthUserStore.setState((state) => ({
        user: state.user
          ? {
              ...state.user,
              address: updatedAddresses,
              currentAddress: nextCurrent,
            }
          : null,
      }));

      Toast.show({
        type: "success",
        text1: editingAddress ? "Address updated" : "Address added",
        position: "top",
        topOffset: 60,
      });

      setModalVisible(false);
      setEditingAddress(null);
      setAddressForm({
        line1: "",
        line2: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1:
          error?.response?.data?.message ||
          "Failed to save address. Please try again.",
      });
    }
  };

  // --------------------
  // SELECT ADDRESS
  // --------------------
  const handleSelectAddress = async (address: string) => {
    if (!user?._id || address === currentAddress) return;

    try {
      await updateProfile({
        id: user._id,
        currentAddress: address,
      });

      setCurrentAddress(address);

      Toast.show({
        type: "success",
        text1: "Delivery address updated",
        position: "top",
        topOffset: 60,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1:
          error?.response?.data?.message ||
          "Failed to update address. Please try again.",
      });
    }
  };

  // --------------------
  // DELETE ADDRESS
  // --------------------
  const handleDeleteAddress = async (address: string) => {
    if (!user?._id || isPending) return;

    const updatedAddresses = addresses.filter((a) => a !== address);
    const nextCurrent =
      address === currentAddress ? updatedAddresses[0] : currentAddress;

    try {
      await updateProfile({
        id: user._id,
        address: updatedAddresses,
        currentAddress: nextCurrent,
      });

      useAuthUserStore.setState((state) => ({
        user: state.user
          ? {
              ...state.user,
              address: updatedAddresses,
              currentAddress: nextCurrent,
            }
          : null,
      }));

      Toast.show({
        type: "success",
        text1: "Address removed",
        position: "top",
        topOffset: 60,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1:
          error?.response?.data?.message ||
          "Failed to remove address. Please try again.",
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Saved Addresses</Text>

        <TouchableOpacity
          onPress={() => {
            setEditingAddress(null);
            setAddressForm({
              line1: "",
              line2: "",
              city: "",
              state: "",
              pincode: "",
              landmark: "",
            });
            setModalVisible(true);
          }}
        >
          <Feather name="plus" size={22} color="#111827" />
        </TouchableOpacity>
      </View>
      {/* EMPTY / LIST */}
      {addresses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.iconCircle}>
            <Feather name="map-pin" size={48} color="#D1D5DB" />
          </View>

          <Text style={styles.sorryText}>Sorry!</Text>
          <Text style={styles.subText}>No saved addresses were found.</Text>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              setEditingAddress(null);
              setAddressForm({
                line1: "",
                line2: "",
                city: "",
                state: "",
                pincode: "",
                landmark: "",
              });
              setModalVisible(true);
            }}
          >
            <Text style={styles.addBtnText}>Add New Address</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => {
            const isCurrent = item === currentAddress;

            return (
              <View
                style={[
                  styles.addressCard,
                  isCurrent && styles.currentAddressCard,
                  { flexDirection: "row", alignItems: "center" },
                ]}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => handleSelectAddress(item)}
                >
                  <Text style={styles.addressText}>{item}</Text>
                  {isCurrent && <Text style={styles.currentTag}>Current</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                  hitSlop={10}
                  onPress={() => {
                    setEditingAddress(item);
                    setAddressForm(parseAddressToForm(item));
                    setModalVisible(true);
                  }}
                  style={{ marginRight: 12 }}
                >
                  <Feather name="edit-2" size={18} color="#111827" />
                </TouchableOpacity>

                <TouchableOpacity
                  hitSlop={10}
                  onPress={() => {
                    setAddressToDelete(item);
                    setShowDelete(true);
                  }}
                >
                  <Feather name="trash-2" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      {/* ADD / EDIT MODAL */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editingAddress ? "Edit Address" : "Add New Address"}
            </Text>

            <TextInput
              placeholder="Address Line 1 *"
              value={addressForm.line1}
              onChangeText={(v) => updateField("line1", v)}
              style={styles.input}
            />

            <TextInput
              placeholder="Address Line 2"
              value={addressForm.line2}
              onChangeText={(v) => updateField("line2", v)}
              style={styles.input}
            />

            {/* CITY */}
            <TextInput
              placeholder="City *"
              value={addressForm.city}
              editable={false}
              style={styles.input}
            />
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 14 }}>
              {Object.keys(CITY_STATE_MAP).map((city) => (
                <TouchableOpacity
                  key={city}
                  onPress={() => {
                    updateField("city", city);
                    updateField("state", CITY_STATE_MAP[city]);
                  }}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor:
                      addressForm.city === city
                        ? COLORS.primaryDark
                        : "#E5E7EB",
                    backgroundColor:
                      addressForm.city === city ? "#F3F4F6" : "#FFFFFF",
                  }}
                >
                  <Text>{city}</Text>
                </TouchableOpacity>
              ))}
              <Text style={{ alignSelf: "center", color: "#9CA3AF" }}>More soon...</Text>
            </View>

            {/* STATE */}
            <TextInput
              placeholder="State *"
              value={addressForm.state}
              editable={false}
              style={[styles.input, { backgroundColor: "#F9FAFB" }]}
            />

            <TextInput
              placeholder="Pincode *"
              value={addressForm.pincode}
              onChangeText={(v) => updateField("pincode", v)}
              keyboardType="number-pad"
              style={styles.input}
            />

            <TextInput
              placeholder="Landmark"
              value={addressForm.landmark}
              onChangeText={(v) => updateField("landmark", v)}
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEditingAddress(null);
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSaveAddress}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* DELETE CONFIRMATION */}
      <DeleteConfirmationModal
        visible={showDelete}
        title="Delete address?"
        description="This address will be removed permanently."
        confirmText="Delete Address"
        onCancel={() => {
          setShowDelete(false);
          setAddressToDelete(null);
        }}
        onConfirm={() => {
          if (addressToDelete) handleDeleteAddress(addressToDelete);
          setShowDelete(false);
          setAddressToDelete(null);
        }}
      />
    </View>
  );
};

export default SavedAddresses;

/* ---------- Styles (UNCHANGED) ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    marginTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  addressCard: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  addressText: {
    fontSize: 14,
    color: "#111827",
  },
  currentAddressCard: {
    borderColor: COLORS.primaryDark,
  },
  currentTag: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.primaryDark,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    marginBottom: 14,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
  },
  cancelText: {
    color: "#9CA3AF",
    fontSize: 16,
  },
  saveText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },
  addBtn: {
    marginTop: 16,
    backgroundColor: "#111827",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "500" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  sorryText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9CA3AF",
    marginBottom: 6,
  },
  subText: { fontSize: 14, color: "#9CA3AF", textAlign: "center" },
});
