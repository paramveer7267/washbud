import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import { useAuthUserStore } from "@/store/authUser";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";

/* ---------- CITY → STATE ---------- */
const CITY_STATE_MAP: Record<string, string> = {
  Perth: "Western Australia",
  Melbourne: "Victoria",
};

export default function ConfirmLocation() {
  const router = useRouter();

  const { user } = useAuthUserStore();
  const { mutateAsync: updateProfile } = useUpdateProfile();

  const [coords, setCoords] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [addressDetails, setAddressDetails] = useState({
    line1: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        alert("Enable location services");
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission required");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setCoords(location.coords);

      const place = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (place.length > 0) {
        const p = place[0];
        const city = p.city || p.subregion || "";

        if (!CITY_STATE_MAP[city]) {
          Toast.show({
            type: "error",
            text1: "Service available only in Perth & Melbourne",
            position: "top",
            topOffset: 60,
          });
          setLoading(false);
          return;
        }

        const line1 = `${p.name || ""} ${p.street || ""}`.trim();

        setAddressDetails({
          line1,
          city,
          state: CITY_STATE_MAP[city],
          pincode: p.postalCode || "",
          landmark: "",
        });
      }
    } catch (err) {
      console.log(err);
      alert("Unable to fetch location");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmLocation = async () => {
    if (!user?._id) return;

    const { line1, city, state, pincode, landmark } = addressDetails;

    if (!line1 || !city || !state || !pincode) {
      Toast.show({
        type: "error",
        text1: "Incomplete address. Please try again.",
          position: "top",
        topOffset: 60,
      });
      return;
    }

    const formattedAddress = `
${line1}
${city}, ${state} - ${pincode}
${landmark ? "Landmark: " + landmark : ""}
`.trim();

    const existingAddresses = user.address || [];

    const updatedAddresses = existingAddresses.includes(formattedAddress)
      ? existingAddresses
      : [...existingAddresses, formattedAddress];

    try {
      await updateProfile({
        id: user._id,
        address: updatedAddresses,
        currentAddress: formattedAddress,
      });

      useAuthUserStore.setState((state) => ({
        user: state.user
          ? {
              ...state.user,
              address: updatedAddresses,
              currentAddress: formattedAddress,
            }
          : null,
      }));

      Toast.show({
        type: "success",
        text1: "Address saved successfully",
        position: "top",
        topOffset: 60,
      });

      router.back();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1:
          error?.response?.data?.message ||
          "Failed to save address. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>Fetching location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* MAP */}
      <MapView
        provider="google"
        style={styles.map}
        showsUserLocation
        followsUserLocation
        initialRegion={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker coordinate={coords} />
      </MapView>

      {/* BACK BUTTON */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Feather name="arrow-left" size={22} />
      </TouchableOpacity>

      {/* BOTTOM SHEET */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.sheet}>
          <View style={styles.locationRow}>
            <Text style={styles.title}>Current Location</Text>
            <TouchableOpacity onPress={getLocation}>
              <Text style={styles.change}>Change</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.address}>
            {addressDetails.line1}
            {"\n"}
            {addressDetails.city}, {addressDetails.state}
          </Text>

          {/* LANDMARK ONLY */}
          <TextInput
            placeholder="Landmark (Optional)"
            value={addressDetails.landmark}
            onChangeText={(v) =>
              setAddressDetails((p) => ({ ...p, landmark: v }))
            }
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={handleConfirmLocation}
          >
            <Text style={styles.confirmText}>Confirm Location</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 16,
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    paddingBottom: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  locationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  change: {
    color: "#EF4444",
    fontWeight: "500",
  },
  address: {
    color: "#374151",
    marginVertical: 10,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },
  confirmBtn: {
    backgroundColor: "#000000",
    paddingVertical: 16,
    borderRadius: 16,
    width: "50%",
    marginTop: 20,
    alignItems: "center",
    alignSelf: "center",
  },
  confirmText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
