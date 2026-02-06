import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Search = () => {
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} color="#111827" />
          </TouchableOpacity>
        </View>
        <Text style={styles.header}>Find Your Delivery</Text>

        {/* Input */}
        <TextInput
          placeholder="Enter Tracking/Order ID"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Search;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
    marginTop: 60,
  },

  header: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 20,
    color: "#111827",
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#111827",
  },

  button: {
    height: 50,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    width: "70%",
    alignSelf: "center",
    marginBottom: 10,
  },

  buttonText: {
    color: "#9CA3AF",
    fontSize: 16,
    fontWeight: "500",
  },
});
