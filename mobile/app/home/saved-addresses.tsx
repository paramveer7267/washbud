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

const SavedAddresses = () => {
  const router = useRouter();

  const { user, addAddress, setCurrentAddress } = useAuthUserStore();
  const addresses = user?.address || [];
  const currentAddress = user?.currentAddress;

  const [showDelete, setShowDelete] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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
  // ADD ADDRESS
  // --------------------
  const handleAddAddress = async () => {
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

    try {
      await updateProfile({
        id: user._id,
        address: [...addresses, formattedAddress],
        currentAddress: formattedAddress,
      });

      addAddress(formattedAddress);

      Toast.show({
        type: "success",
        text1: "Address added successfully",
        position: "top",
        topOffset: 60,
      });

      setAddressForm({
        line1: "",
        line2: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
      });

      setModalVisible(false);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1:
          error?.response?.data?.message ||
          "Failed to save address. Please try again.",
      });
    }
  };

  const updateField = (key: string, value: string) => {
    setAddressForm((prev) => ({ ...prev, [key]: value }));
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
      // ⏳ wait for backend confirmation
      await updateProfile({
        id: user._id,
        address: updatedAddresses,
        currentAddress: nextCurrent,
      });

      // ✅ update UI AFTER backend success
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

        <TouchableOpacity onPress={() => setModalVisible(true)}>
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
            onPress={() => setModalVisible(true)}
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
                  activeOpacity={0.8}
                  onPress={() => handleSelectAddress(item)}
                >
                  <Text style={styles.addressText}>{item}</Text>
                  {isCurrent && <Text style={styles.currentTag}>Current</Text>}
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

      {/* ADD ADDRESS MODAL */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add New Address</Text>

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

            <TextInput
              placeholder="City *"
              value={addressForm.city}
              onChangeText={(v) => updateField("city", v)}
              style={styles.input}
            />

            <TextInput
              placeholder="State *"
              value={addressForm.state}
              onChangeText={(v) => updateField("state", v)}
              style={styles.input}
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
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddAddress}
                disabled={
                  !addressForm.line1 ||
                  !addressForm.city ||
                  !addressForm.state ||
                  !addressForm.pincode
                }
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
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
          if (addressToDelete) {
            handleDeleteAddress(addressToDelete);
          }
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
    marginTop: 55,
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

  subText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
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

  addBtn: {
    marginTop: 16,
    backgroundColor: "#111827",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  addBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
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
    fontSize: 14,
  },

  saveText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
  },
});
