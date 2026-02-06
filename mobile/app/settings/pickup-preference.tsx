import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "@/constants/theme";

type TimeSlot = {
  id: string;
  label: string;
};

const TIME_SLOTS: TimeSlot[] = [
  { id: "morning", label: "Morning (7 AM – 10 AM)" },
  { id: "late_morning", label: "Late Morning (10 AM – 1 PM)" },
  { id: "afternoon", label: "Afternoon (1 PM – 4 PM)" },
  { id: "evening", label: "Evening (4 PM – 7 PM)" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function PickupPreference() {
  const [selectedSlot, setSelectedSlot] = useState<string>("morning");
  const [flexible, setFlexible] = useState<boolean>(true);
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Mon",
    "Wed",
    "Fri",
  ]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleSave = () => {
    const payload = {
      preferredTime: selectedSlot,
      flexible,
      days: selectedDays,
    };

    console.log("Pickup Preference:", payload);

    // 🔌 Backend call later
    // await api.patch("/user/pickup-preference", payload);

    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>
        <Text style={styles.title}>Pickup Preference</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.save}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Time Slots */}
      <Text style={styles.sectionTitle}>Preferred Time</Text>
      <View style={styles.card}>
        {TIME_SLOTS.map((slot) => (
          <TouchableOpacity
            key={slot.id}
            style={[styles.slot, selectedSlot === slot.id && styles.slotActive]}
            onPress={() => setSelectedSlot(slot.id)}
          >
            <Text
              style={[
                styles.slotText,
                selectedSlot === slot.id && styles.slotTextActive,
              ]}
            >
              {slot.label}
            </Text>

            {selectedSlot === slot.id && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={COLORS.primary}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Days */}
      <Text style={styles.sectionTitle}>Preferred Days</Text>
      <View style={styles.daysRow}>
        {DAYS.map((day) => {
          const active = selectedDays.includes(day);
          return (
            <TouchableOpacity
              key={day}
              style={[styles.dayChip, active && styles.dayChipActive]}
              onPress={() => toggleDay(day)}
            >
              <Text style={[styles.dayText, active && styles.dayTextActive]}>
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Flexible Toggle */}
      <View style={styles.flexBox}>
        <View>
          <Text style={styles.flexTitle}>Flexible timing</Text>
          <Text style={styles.flexSub}>
            Allow pickup outside preferred time if needed
          </Text>
        </View>

        <Switch
          value={flexible}
          onValueChange={setFlexible}
          trackColor={{ false: "#E5E7EB", true: "#93C5FD" }}
          thumbColor={flexible ? COLORS.primary : "#9CA3AF"}
        />
      </View>
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
    marginBottom: 24,
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
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  slot: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },

  slotActive: {
    backgroundColor: "#F0F7FF",
    borderRadius: 12,
  },

  slotText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },

  slotTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  daysRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },

  dayChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },

  dayChipActive: {
    backgroundColor: COLORS.primary,
  },

  dayText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },

  dayTextActive: {
    color: "#fff",
  },

  flexBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  flexTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  flexSub: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
});
