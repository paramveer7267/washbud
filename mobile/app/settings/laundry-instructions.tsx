import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "@/constants/theme";

export default function LaundryInstructions() {
  const [washType, setWashType] = useState<"normal" | "gentle" | "handwash">(
    "normal",
  );

  const [detergent, setDetergent] = useState<"regular" | "mild" | "user">(
    "regular",
  );

  const [separateWhites, setSeparateWhites] = useState(true);
  const [noBleach, setNoBleach] = useState(true);
  const [fabricSoftener, setFabricSoftener] = useState(false);
  const [specialNote, setSpecialNote] = useState("");

  const handleSave = () => {
    const payload = {
      washType,
      detergent,
      separateWhites,
      noBleach,
      fabricSoftener,
      specialNote,
    };

    console.log("Laundry Instructions:", payload);

    // 🔌 Backend later
    // await api.patch("/user/laundry-instructions", payload);

    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>

        <Text style={styles.title}>Laundry Instructions</Text>

        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.save}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ---------- Wash Type ---------- */}
        <Text style={styles.sectionTitle}>Wash Type</Text>
        <View style={styles.card}>
          <RadioItem
            label="Normal Wash"
            description="Standard wash for daily clothes"
            active={washType === "normal"}
            onPress={() => setWashType("normal")}
          />
          <RadioItem
            label="Gentle Wash"
            description="Delicate fabrics & soft wash"
            active={washType === "gentle"}
            onPress={() => setWashType("gentle")}
          />
          <RadioItem
            label="Hand Wash"
            description="Extra care for delicate items"
            active={washType === "handwash"}
            onPress={() => setWashType("handwash")}
          />
        </View>

        {/* ---------- Detergent ---------- */}
        <Text style={styles.sectionTitle}>Detergent Preference</Text>
        <View style={styles.card}>
          <RadioItem
            label="Regular Detergent"
            active={detergent === "regular"}
            onPress={() => setDetergent("regular")}
          />
          <RadioItem
            label="Mild / Baby Detergent"
            active={detergent === "mild"}
            onPress={() => setDetergent("mild")}
          />
          <RadioItem
            label="Use My Detergent"
            description="I will provide detergent"
            active={detergent === "user"}
            onPress={() => setDetergent("user")}
          />
        </View>

        {/* ---------- Preferences ---------- */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          <ToggleItem
            label="Separate whites and colors"
            value={separateWhites}
            onChange={setSeparateWhites}
          />
          <ToggleItem
            label="Do not use bleach"
            value={noBleach}
            onChange={setNoBleach}
          />
          <ToggleItem
            label="Use fabric softener"
            value={fabricSoftener}
            onChange={setFabricSoftener}
          />
        </View>

        {/* ---------- Special Instructions ---------- */}
        <Text style={styles.sectionTitle}>Special Instructions</Text>
        <View style={styles.textAreaBox}>
          <TextInput
            value={specialNote}
            onChangeText={setSpecialNote}
            placeholder="Eg. Don’t iron silk, wash wool separately..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------- Components ---------- */

const RadioItem = ({
  label,
  description,
  active,
  onPress,
}: {
  label: string;
  description?: string;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.radioItem} onPress={onPress}>
    <View>
      <Text style={styles.radioLabel}>{label}</Text>
      {description && <Text style={styles.radioDesc}>{description}</Text>}
    </View>
    <Ionicons
      name={active ? "radio-button-on" : "radio-button-off"}
      size={20}
      color={active ? COLORS.primary : "#9CA3AF"}
    />
  </TouchableOpacity>
);

const ToggleItem = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) => (
  <View style={styles.toggleItem}>
    <Text style={styles.toggleText}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: "#E5E7EB", true: "#93C5FD" }}
      thumbColor={value ? COLORS.primary : "#9CA3AF"}
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
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  save: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
    marginTop: 10,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  radioItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },

  radioLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  radioDesc: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },

  toggleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },

  toggleText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },

  textAreaBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 60,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  textArea: {
    fontSize: 14,
    color: "#111827",
    minHeight: 100,
    textAlignVertical: "top",
  },
});
