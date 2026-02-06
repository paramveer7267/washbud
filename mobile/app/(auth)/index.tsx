import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    image: require("../../assets/images/laundry-banner-1.png"),
  },
  {
    id: "2",
    image: require("../../assets/images/laundry-banner-2.png"),
  },
  {
    id: "3",
    image: require("../../assets/images/laundry-banner-3.png"),
  },
];

export default function AuthScreen() {
  const [index, setIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (index + 1) % SLIDES.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [index]);

  return (
    <View style={styles.container}>
      {/* ---------- Carousel ---------- */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(i);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item.image} style={styles.image} />
          </View>
        )}
      />

      {/* ---------- Pagination ---------- */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, index === i && styles.dotActive]} />
        ))}
      </View>

      {/* ---------- Content ---------- */}
      <View style={styles.content}>
        <Text style={styles.title}>Laundry, handled properly.</Text>

        <Text style={styles.subtitle}>
          Doorstep pickup, professional care, and fast delivery — so you never
          worry about laundry again.
        </Text>

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryText}>Start using Washbud</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text style={styles.secondaryText}>I already have an account</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>New here?</Text>
          <TouchableOpacity onPress={() => router.replace("/(auth)/signup")}>
            <Text style={styles.signupText}>Create an account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  slide: {
    width,
    height: width * 0.9,
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: width * 0.8,
    height: width * 0.5,
    resizeMode: "contain",
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 4,
  },

  dotActive: {
    width: 18,
    backgroundColor: "#111827",
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 28,
    marginBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },

  primaryButton: {
    backgroundColor: "#111827",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    marginBottom: 20,
  },

  secondaryText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginBottom: 30,
  },

  footerText: {
    color: "#6B7280",
    fontSize: 14,
  },

  signupText: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 14,
  },
});
