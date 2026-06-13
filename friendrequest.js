import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import Navbar from './navbar';

const Friendrequest = () => {
  const [requests, setRequests] = useState([]);
  const userId = useSelector((state) => state.auth.userId);

  const fetchRequests = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/friend-requests/${userId}/pending-requests`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setRequests(data.pendingRequests || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  }, [userId]);

  const handleAction = async (action, senderId) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:8080/friend-requests/${action}?senderId=${senderId}&recipientId=${userId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchRequests(); // Refresh list after action
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    }
  };

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const renderRequest = ({ item }) => (
    <View style={styles.requestItem}>
      <View style={styles.userInfo}>
        <Image source={{ uri: 'profile.jpg' }} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{item.senderName}</Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleAction('accept', item.senderId)} style={styles.iconBtn}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#5CBE8F" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleAction('decline', item.senderId)} style={styles.iconBtn}>
          <Ionicons name="close-circle-outline" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
        <View style={{height:30}}>

        </View>
      <Text style={styles.header}>Requests</Text>
      <FlatList
        data={requests}
        renderItem={renderRequest}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No Requests</Text>}
      />
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { fontSize: 18, fontWeight: '600', marginBottom: 15,padding:20,paddingHorizontal:30 },
  requestItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  name: { fontSize: 14, fontWeight: '500' },
  actions: { flexDirection: 'row', gap: 15 },
  iconBtn: { padding: 5 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#AAA' }
});

export default Friendrequest;