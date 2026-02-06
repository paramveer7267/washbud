import React, { useState } from "react";
import { View, FlatList, StyleSheet, Dimensions, Image } from "react-native";

const { width } = Dimensions.get("window");

type CarouselItem = {
  id: string;
  image: any; // require(...) OR { uri }
};

type Props = {
  data: CarouselItem[];
  height?: number;
};

export default function ImageCarousel({ data, height = 160 }: Props) {
  const [index, setIndex] = useState(0);

  return (
    <View>
      <FlatList
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={(e) => {
          const slideIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(slideIndex);
        }}
        renderItem={({ item }) => (
          <View style={[styles.card, { height }]}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}
      />

      {/* DOTS */}
      <View style={styles.dots}>
        {data.map((_, i) => (
          <View key={i} style={[styles.dot, index === i && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    width,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },

  image: {
    width: "90%",
    height: "100%",
    borderRadius: 16,
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: "#111827",
  },
});
