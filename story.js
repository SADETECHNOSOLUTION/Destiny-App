import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { selectStory } from './slices/storyslice';

const Story = () => {
  const [story, setStory] = useState([]);
  const [users, setUsers] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userId = useSelector((state) => state.auth.userId);

  const fetchUsers = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get('http://10.0.2.2:8080/api/auth/users/descending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) { console.error(error); }
  };

  const FetchStories = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch('http://10.0.2.2:8080/statuses/user/status', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setStory(data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    fetchUsers();
    FetchStories();
  }, []);

  const handleClick = (storyItem) => {
    dispatch(selectStory(storyItem));
    navigation.navigate('StoryPage');
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storyList}>
        {/* Add Story Button */}
        <TouchableOpacity onPress={() => navigation.navigate('UploadStory')} style={styles.storyItem}>
          <View style={styles.imageContainer}>
            <Image style={styles.avatar} source={{ uri: `http://10.0.2.2:8080${profileUser?.profileImagePath}` }} />
            <View style={styles.addIcon}><MaterialIcons name="add" size={12} color="white" /></View>
          </View>
          <Text style={{fontSize:10}}>Your Story</Text>
        </TouchableOpacity>

        {/* Stories */}
        {story?.map((item) => {
          const user = users.find(u => u.id === item.userId);
          return (
            <TouchableOpacity key={item.id} style={styles.storyItem} onPress={() => handleClick(item)}>
              <Image style={styles.storyAvatar} source={{ uri: `http://10.0.2.2:8080${item.profileImagePath}` }} />
              <Text style={styles.userName} numberOfLines={1}>{user?.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 0, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, elevation: 3,height:70,paddingTop:10 },
  storyList: { flexDirection: 'row', gap: 15,width:'100%',paddingHorizontal:20 },
  storyItem: { alignItems: 'center', width: 70,flexDirection:'column',gap:8 },
  avatar: { width: 50, height: 50, borderRadius: 30,backgroundColor:'gray' },
  storyAvatar: { width: 50, height: 50, borderRadius: 30, borderWidth: 3, borderColor: '#5CBE8F' },
  imageContainer: { position: 'relative' },
  addIcon: { position: 'absolute', bottom: -6, right: 14, backgroundColor: '#5CBE8F', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  userName: { fontSize: 12, marginTop: 5 }
});

export default Story;