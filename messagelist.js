import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const MessageList = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState([]);
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    fetchUsers();
    fetchMessages();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8080/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) { console.error("Error fetching users:", error); }
  };

  const fetchMessages = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8080/web-socket/getAll', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setChat(data);
    } catch (error) { console.error("Error fetching messages:", error); }
  };

  const renderItem = ({ item }) => {
    // Determine the last message for this specific user conversation
    const conversation = Array.isArray(chat) ? chat.find(c => 
      (c.participantOneId === userId || c.participantOneId === item.id) &&
      (c.participantTwoId === userId || c.participantTwoId === item.id)
    ) : null;

    const lastMsg = conversation?.messages?.slice(-1)[0]?.content || "No messages";

    return (
      <TouchableOpacity 
        style={styles.chatItem} 
        onPress={() => navigation.navigate('ChatDetail', { userId: item.id })}
      >
        <Image 
          source={{ uri: `http://localhost:8080${item.profileImagePath}` }} 
          style={styles.avatar} 
        />
        <View style={styles.chatInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>{lastMsg}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={{backgroundColor:'#5CBE8F',borderBottomLeftRadius:20,borderBottomRightRadius:20}}>
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>      
      </View>

      <View style={{paddingHorizontal:20,paddingBottom:20}}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput 
          placeholder="Search Friend" 
          style={styles.input} 
          placeholderTextColor="#A0A0A0"
        />
      </View>
      </View>

      </View>

      <FlatList
        data={users.filter(u => u.id !== userId)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
      <Ionicons style={{position:'absolute',bottom:20,right:20,backgroundColor:'#5CBE8F',padding:12,color:'#fff',borderRadius:16}} name="add" size={24} color="#333" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: 10,position:'relative' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,paddingTop:20,paddingHorizontal:20,color:'#fff' },
  title: { fontSize: 18, fontWeight: '600', color: '#fff' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 10, height: 50, marginBottom: 10 },
  searchIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16,outlineStyle:'none',fontSize: 14, },
  chatItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F9F9F9' },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  chatInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#333' },
  lastMessage: { fontSize: 13, color: '#A0A0A0', marginTop: 4 }
});

export default MessageList;