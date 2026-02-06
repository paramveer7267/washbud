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

export default function ConfirmLocation() {
  const router = useRouter();

  const [coords, setCoords] = useState<any>(null);
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(true);

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
        setAddress(`${p.name || ""}, ${p.street || ""}, ${p.city || ""}`);
      }
    } catch (err) {
      console.log(err);
      alert("Unable to fetch location");
    } finally {
      setLoading(false);
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
      {/* GOOGLE MAP */}
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
        <ScrollView
          contentContainerStyle={styles.sheet}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.locationRow}>
            <Text style={styles.title}>Current Location</Text>
            <TouchableOpacity onPress={getLocation}>
              <Text style={styles.change}>Change</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.address}>{address}</Text>

          <TextInput placeholder="Name" style={styles.input} />

          <TextInput
            placeholder="Phone Number"
            keyboardType="phone-pad"
            style={styles.input}
          />

          <TextInput
            placeholder="House no. or Apartment no. (Optional)"
            style={styles.input}
          />

          <TouchableOpacity style={styles.confirmBtn}>
            <Text style={styles.confirmText}>Confirm Location</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

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
    color: "#6B7280",
    marginVertical: 6,
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
