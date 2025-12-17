import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "@/constants/theme";
export default function Profile() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => router.push("/(modals)/settings")}>
          <Ionicons name="settings-outline" size={24} />
        </TouchableOpacity>
      </View>
      {/* Profile */}
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>PS</Text>
        </View>

        <Text style={styles.name}>ParamVeeR Singh</Text>
        <Text style={styles.username}>paramveer8256</Text>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push("/(modals)/profile/edit-profile")}
        >
          <Text>Edit profile</Text>
        </TouchableOpacity>
      </View>

      {/* Section */}

      <Text style={styles.sectionTitle}>Profile Info</Text>
      <View style={styles.sectionContainer}>
        <SettingsItem
          icon="mail-outline"
          label="Email"
          value="paramveer8256@gmail.com"
        />

        <SettingsItem
          icon="add-circle-outline"
          label="Subscription"
          value="Free"
        />

        <SettingsItem
          icon="arrow-up-circle-outline"
          label="Upgrade to Washbud Plus"
        />

        <SettingsItem icon="refresh-outline" label="Restore purchases" />

        <SettingsItem icon="time-outline" label="Personalization" showArrow />

        <SettingsItem
          icon="notifications-outline"
          label="Notifications"
          showArrow
        />

        <SettingsItem icon="apps-outline" label="Apps & connectors" showArrow />

        <SettingsItem
          icon="people-outline"
          label="Parental controls"
          showArrow
        />
      </View>
    </ScrollView>
  );
}

/* ---------- Reusable Item ---------- */
function SettingsItem({
  icon,
  label,
  value,
  showArrow,
}: {
  icon: any;
  label: string;
  value?: string;
  showArrow?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.item}>
      <Ionicons name={icon} size={22} style={styles.icon} />

      <Text style={styles.itemLabel}>{label}</Text>

      {value && <Text style={styles.itemValue}>{value}</Text>}

      {showArrow && <Ionicons name="chevron-forward" size={20} color="#999" />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    marginBottom: 90,
    marginTop: 40,
  },
  sectionContainer: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.primaryDark,
  },

  profile: {
    alignItems: "center",
    marginVertical: 16,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2F4858",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
  },

  name: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 12,
  },

  username: {
    color: "#666",
    marginTop: 4,
  },

  editBtn: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  editText: {
    fontSize: 14,
  },

  sectionTitle: {
    marginTop: 24,
    marginBottom: 8,
    color: "#888",
    fontSize: 16,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  icon: {
    width: 28,
    marginRight: 12,
  },

  itemLabel: {
    flex: 1,
    fontSize: 16,
  },

  itemValue: {
    color: "#999",
    marginRight: 8,
  },
});
