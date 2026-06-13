import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Navbar from './navbar';

const Notifications = () => {
  const userId = useSelector((state) => state.auth.userId);
  const [notifications, setNotifications] = useState([]);

  // Fetch all notification streams in parallel for optimized performance
  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const endpoints = [
        `http://localhost:8080/follows/notifications/${userId}`,
        `http://localhost:8080/friend-requests/notifications/${userId}`,
        `http://localhost:8080/likes/notification/${userId}`,
        `http://localhost:8080/comments/notification-comment/post-reply/${userId}`
      ];

      const responses = await Promise.all(
        endpoints.map(url => fetch(url, { headers: { 'Authorization': `Bearer ${token}` } }))
      );
      
      const data = await Promise.all(responses.map(res => res.json()));
      
      const combined = data.flatMap(d => (Array.isArray(d.notification) ? d.notification : []))
                           .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setNotifications(combined);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [userId]);

  const deleteNotifications = async (id, type) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/notification/${id}/${type}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) fetchNotifications();
    } catch (error) {
      console.error('Could not delete', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const renderNotification = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: `http://localhost:8080${item.profileImagePath}` }} style={styles.avatar} />
      <View style={styles.content}>
        <Text style={styles.message}>
          <Text style={styles.bold}>{item.name}</Text> {item.message}
        </Text>
        <Text style={styles.time}>{moment(item.createdAt).fromNow()}</Text>
      </View>
      <TouchableOpacity 
        onPress={() => deleteNotifications(item.id, item.type)} 
        style={styles.deleteBtn}
      >
        <Ionicons name="close-outline" size={20} color="gray" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
        <View style={{height:30}}>

        </View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Notifications</Text>
      </View>
      <FlatList 
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
      />
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 0 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 15,padding:20 },
  headerTitle: { fontSize: 18, fontWeight: '600', marginLeft: 10, color: '#333' },
  itemContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F9F9F9' },
  avatar: { width: 42, height: 42, borderRadius: 21, marginRight: 15 },
  content: { flex: 1 },
  message: { fontSize: 14, color: '#333', lineHeight: 20 },
  bold: { fontWeight: '700' },
  time: { fontSize: 12, color: '#A0A0A0', marginTop: 4 },
  deleteBtn: { padding: 5 }
});

export default Notifications;