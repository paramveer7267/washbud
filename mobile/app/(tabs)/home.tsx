import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  Pressable,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import ImageCarousel from "@/components/ImageCarousel";
import carouselData, { STORIES } from "@/constants/home";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthUserStore } from "@/store/authUser";

export default function Home() {
  const { user } = useAuthUserStore();
  const [activeStory, setActiveStory] = useState<any | null>(null);
  const [seenStories, setSeenStories] = useState<string[]>([]);
  const progress = useRef(new Animated.Value(0)).current;

  /* ---------- AUTO PROGRESS ---------- */
  useEffect(() => {
    if (activeStory) {
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }).start(() => closeStory());
    }
  }, [activeStory]);

  const openStory = (story: any) => {
    setActiveStory(story);
    setSeenStories((prev) =>
      prev.includes(story.id) ? prev : [...prev, story.id],
    );
  };

  const closeStory = () => {
    setActiveStory(null);
    progress.stopAnimation();
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => router.push("/home/pickup")}
          >
            <View style={styles.headerLeft}>
              <MaterialIcons name="navigation" size={20} color="#F04438" />
              <View style={{ marginLeft: 8, flex: 1 }}>
                <View style={styles.row}>
                  <Text style={styles.headerTitle}>Pickup From</Text>
                  <Feather name="chevron-down" size={16} color="#667085" />
                </View>
                <Text
                  style={styles.headerSubtitle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {user?.currentAddress || "Select a pickup location"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => router.push("/home/search")}>
              <Feather name="search" size={22} color="#101828" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.helpBtn}>
              <Feather name="message-circle" size={18} color="#101828" />
              <Text style={styles.helpText}>Help</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ImageCarousel data={carouselData} height={180} />

        {/* ================= SERVICE CARDS ================= */}
        <View style={styles.cardRow}>
          <ServiceCard
            title="Book Truck"
            subtitle="15 mins"
            icon="⚡"
            image={require("../../assets/images/laundry-truck.png")}
          />
          <ServiceCard
            title="No Hustle"
            subtitle="Too easy"
            icon="🎯"
            image={require("../../assets/images/laundry.png")}
          />
        </View>

        {/* ================= TRACK ORDER ================= */}
        <View style={styles.trackCard}>
          <View style={styles.row}>
            <MaterialIcons name="location-pin" size={22} color="#F04438" />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.trackTitle}>Track Your Orders</Text>
              <Text style={styles.trackSubtitle}>Get real-time status</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.trackBtn}
            onPress={() => router.push("/orders")}
          >
            <Text style={styles.trackBtnText}>Track →</Text>
          </TouchableOpacity>
        </View>
        {/* ================= STORIES ================= */}
        <Text style={styles.sectionTitle}>Our Stories</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {STORIES.map((story) => {
            const seen = seenStories.includes(story.id);

            return (
              <TouchableOpacity
                key={story.id}
                activeOpacity={0.8}
                onPress={() => openStory(story)}
              >
                <LinearGradient
                  colors={
                    seen
                      ? ["#8134AF", "#F58529"]
                      : ["#F58529", "#DD2A7B", "#8134AF", "#515BD4"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.storyRing}
                >
                  <View style={styles.storyInner}>
                    <Image source={story.image} style={styles.storyImage} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Image
          source={require("../../assets/images/homepic.png")}
          style={{
            width: "100%",
            height: 300,
            resizeMode: "cover",
            marginTop: 20,
          }}
        />
      </ScrollView>

      {/* ================= STORY VIEWER ================= */}
      <Modal visible={!!activeStory} transparent animationType="fade">
        <Pressable style={styles.storyModal} onPress={closeStory}>
          {/* Progress bar */}
          <View style={styles.progressWrap}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>

          {/* Image */}
          {activeStory && (
            <Image source={activeStory.image} style={styles.storyFullscreen} />
          )}
        </Pressable>
      </Modal>
    </>
  );
}

/* ================= COMPONENTS ================= */

function ServiceCard({
  title,
  subtitle,
  icon,
  image,
}: {
  title: string;
  subtitle: string;
  icon?: string;
  image?: any;
}) {
  return (
    <TouchableOpacity style={styles.serviceCard}>
      {image && <Image source={image} style={styles.imagePlaceholder} />}
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.badge}>
        {icon && <Text>{icon}</Text>}
        <Text style={styles.badgeText}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

/* ================= STYLES (ONLY ADDITIONS) ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 90,
    marginTop: 50,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 16,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#101828",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#667085",
    marginTop: 2,
    flexShrink: 1,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  helpBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    backgroundColor: "#FFFFFF",
  },

  helpText: {
    fontSize: 14,
    fontWeight: "500",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 16,
    marginVertical: 16,
  },

  storyRing: {
    width: 72,
    height: 72,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },

  storyInner: {
    width: 65,
    height: 65,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  storyImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  /* SERVICE CARDS */
  cardRow: {
    flexDirection: "row",
    gap: 16,
    padding: 16,
  },

  serviceCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  imagePlaceholder: {
    width: 120,
    height: 100,
    borderRadius: 12,
    resizeMode: "cover",
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  badge: {
    flexDirection: "row",
    gap: 6,
    backgroundColor: "#ECFDF3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  badgeText: {
    fontSize: 14,
    color: "#027A48",
    fontWeight: "500",
  },

  /* TRACK CARD */
  trackCard: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  trackTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  trackSubtitle: {
    fontSize: 13,
    color: "#667085",
  },

  trackBtn: {
    backgroundColor: "#000000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
  },

  trackBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  /* ---------- STORY VIEWER ---------- */
  storyModal: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 10,
  },

  storyFullscreen: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  progressWrap: {
    height: 3,
    backgroundColor: "#333",
    marginTop: 50,
  },

  progressBar: {
    height: 3,
    backgroundColor: "#fff",
  },
});
