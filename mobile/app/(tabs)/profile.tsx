import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthUserStore } from "@/store/authUser";

export default function Profile() {
  const { user } = useAuthUserStore();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => router.push("/settings/settings")}>
          <Ionicons name="settings-outline" size={24} />
        </TouchableOpacity>
      </View>
      {/* Profile */}
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>PS</Text>
        </View>

        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.username}>{user?.username}</Text>

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
          value={user?.email || "Not set"}
        />

        <SettingsItem
          icon="call-outline"
          label="Contact Number"
          value={user?.contactNumber || "Not set"}
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

        <SettingsItem
          icon="layers-outline"
          label="Orders"
          showArrow
          onPress={() => router.push("/(tabs)/orders")}
        />
        <SettingsItem
          icon="location-outline"
          label="Saved Addresses"
          onPress={() => router.push("/home/saved-addresses")}
          showArrow
        />
        {/* 

        <SettingsItem icon="apps-outline" label="Apps & connectors" showArrow />

        <SettingsItem
          icon="people-outline"
          label="Parental controls"
          showArrow
        />

        <SettingsItem
          icon="log-out-outline"
          label="Logout"
          onPress={handleLogout}
        /> */}
      </View>
      <View>
        <Text
          style={{
            textAlign: "center",
            color: "#888",
            marginBottom: 30,
          }}
        >
          App Version 1.0.0
        </Text>
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
  onPress,
}: {
  icon: any;
  label: string;
  value?: string;
  showArrow?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Ionicons
        name={icon}
        size={22}
        style={styles.icon}
        color={onPress ? "#2F4858" : "#777"}
      />

      <Text style={styles.itemLabel}>{label}</Text>

      {value && <Text style={styles.itemValue}>{value}</Text>}

      {showArrow && <Ionicons name="chevron-forward" size={20} color="#999" />}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 90,
    marginTop: 50,
  },

  /* ---------- Header ---------- */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0A0A0A",
    letterSpacing: 0.2,
  },

  /* ---------- Profile ---------- */
  profile: {
    alignItems: "center",
    marginVertical: 20,
  },

  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#2F4858",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  avatarText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: 1,
  },

  name: {
    fontSize: 21,
    fontWeight: "700",
    marginTop: 14,
    color: "#111",
  },

  username: {
    color: "#7A7A7A",
    marginTop: 6,
    fontSize: 14,
  },

  editBtn: {
    marginTop: 14,
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  editText: {
    fontSize: 14,
    fontWeight: "600",
  },

  /* ---------- Section ---------- */
  sectionTitle: {
    marginTop: 28,
    marginBottom: 10,
    color: "#8A8A8A",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.4,
  },

  sectionContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  /* ---------- Item ---------- */
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  icon: {
    width: 28,
    marginRight: 14,
    color: "#444",
  },

  itemLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
  },

  itemValue: {
    color: "#8A8A8A",
    marginRight: 8,
    fontSize: 14,
  },
});
