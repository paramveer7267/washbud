import React, { useRef, useEffect } from "react";
import { Animated, Pressable, Text, Platform } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useIsFocused } from "@react-navigation/native";

const CustomTabButton = ({ onPress, name, label, size = 24 }) => {
  const isFocused = useIsFocused();
  const scale = useRef(new Animated.Value(isFocused ? 1.08 : 1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: isFocused ? 1.08 : 1,
      useNativeDriver: true,
      friction: 5,
      tension: 90,
    }).start();
  }, [isFocused]);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 1.12,
      useNativeDriver: true,
      friction: 6,
      tension: 100,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: isFocused ? 1.08 : 1,
      useNativeDriver: true,
      friction: 6,
      tension: 100,
    }).start();
  };

  const color = isFocused ? COLORS.primaryDark : COLORS.grey;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      android_ripple={{ color: "#ffffff15", borderless: true }}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: Platform.OS === "android" ? 6 : 8,
      }}
    >
      <Animated.View
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: [{ scale }],
        }}
      >
        <Ionicons name={name} size={size} color={color} />
        <Text
          style={{
            color,
            fontSize: 11,
            marginTop: 2,
            fontWeight: isFocused ? "600" : "400",
          }}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0,
          position: "absolute",
          elevation: 0,
          height: 100,
          paddingBottom: 40,
        },
      }}
    >
    
      <Tabs.Screen
        name="home"
        options={{
          tabBarButton: (props) => (
            <CustomTabButton
              {...props}
              name="home-outline"
              label="Home"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          tabBarButton: (props) => (
            <CustomTabButton {...props} name="layers-outline" label="Orders" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarButton: (props) => (
            <CustomTabButton {...props} name="person-outline" label="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
