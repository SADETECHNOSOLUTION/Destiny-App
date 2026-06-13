import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

const Reels = () => {
  const [reels, setReels] = useState([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const userId = useSelector((state) => state.auth.userId);

  const fetchReels = useCallback(async () => {
    // API logic remains similar, ensure fetch URL uses 10.0.2.2 for Android
    try {
      const response = await fetch('http://10.0.2.2:8080/reels/getAll/reel');
      const data = await response.json();
      setReels(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchReels();
  }, [fetchReels]);

  // Handle auto-play on scroll
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveVideoIndex(viewableItems[0].index);
    }
  }).current;

  const renderItem = ({ item, index }) => (
    <View style={styles.reelContainer}>
      <Video
        source={{ uri: `http://10.0.2.2:8080${item.content}` }}
        style={styles.video}
        resizeMode="cover"
        isLooping
        shouldPlay={index === activeVideoIndex}
        isMuted={false}
      />
      <View style={styles.overlay}>
        <View style={styles.userInfo}>
          <Image source={{ uri: `http://10.0.2.2:8080${item.profileImagePath}` }} style={styles.avatar} />
          <Text style={styles.username}>{item.name}</Text>
        </View>
        <Text style={styles.caption}>{item.caption}</Text>
        <View style={styles.actions}>
          <Ionicons name="heart-outline" size={30} color="white" />
          <Ionicons name="chatbubble-outline" size={30} color="white" />
          <Ionicons name="share-outline" size={30} color="white" />
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={reels}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      snapToAlignment="start"
      snapToInterval={height}
      decelerationRate="fast"
    />
  );
};

const styles = StyleSheet.create({
  reelContainer: { height: height, width: '100%' },
  video: { flex: 1 },
  overlay: { position: 'absolute', bottom: 20, left: 20, gap: 10 },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  username: { color: 'white', fontWeight: 'bold' },
  caption: { color: 'white' },
  actions: { flexDirection: 'row', gap: 20, marginTop: 10 }
});

export default Reels;