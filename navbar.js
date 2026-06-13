import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { MaterialIcons, Ionicons, Octicons, FontAwesome5 } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { addFriend } from './slices/friendlistslice';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userId = useSelector((state) => state.auth.userId);

  // Fetching Logic
  const fetchUserDetails = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(`http://10.0.2.2:8080/api/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    if (userId) fetchUserDetails();
  }, [userId]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (

    <View style={styles.header}>

      <View style={styles.navIcons}>
        <TouchableOpacity onPress={() => navigation.navigate('Homescreen')}><MaterialCommunityIcons name={route.name==="Homescreen"?"home":"home-variant-outline"} size={28} color={route.name==="Homescreen"?"#5CBE8F":"gray"} /></TouchableOpacity>
        
        <TouchableOpacity  onPress={() => navigation.navigate('Friendrequests')}>
          <Ionicons name={route.name==="Friendrequests"?"people":"people-outline"} size={24} color={route.name==="Friendrequests"?"#5CBE8F":"gray"} />
          {requestCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{requestCount}</Text></View>}
        </TouchableOpacity>

        <TouchableOpacity  onPress={() => navigation.navigate('Createpost')} style={{padding:10,backgroundColor:'#5CBE8F',borderRadius:50}}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
<Ionicons 
  name={route.name==="Notification"?"notifications":"notifications-outline"} 
  size={24} 
  color={route.name === "Notification" ? "#5CBE8F" : "gray"} 
/>                 {notificationCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{notificationCount}</Text></View>}
        </TouchableOpacity>



        <TouchableOpacity onPress={() => navigation.navigate('About',{UserID:'4'})}>
          <Image source={{ uri: `http://10.0.2.2:8080${user?.profileImagePath}` }} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      {/* Widget Sidebar/Modal */}
      <Modal visible={isSidebarOpen} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={toggleSidebar}>
          <View style={styles.sidebar}>
            <TouchableOpacity onPress={() => { navigation.navigate('Birthdays'); toggleSidebar(); }}><Text>Birthdays</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('Weather'); toggleSidebar(); }}><Text>Weather</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('Reels'); toggleSidebar(); }}><Text>Reels</Text></TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { backgroundColor: '', paddingTop: 14, paddingBottom: 14,position:'absolute',bottom:0,width:'100%',borderTopWidth:2,borderTopColor:'#e4e4e4'},
  topNav: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  logo: { width: 100, height: 40, resizeMode: 'contain' },
  navIcons: { flexDirection: 'row', justifyContent: 'space-around',alignItems:'center'},
  avatar: { width: 30, height: 30, borderRadius: 17.5,borderWidth:10,borderColor:'gray',backgroundColor:'gray' },
  badge: { position: 'absolute', right: -5, top: -5, backgroundColor: 'red', borderRadius: 10, width: 16, height: 16, alignItems: 'center' },
  badgeText: { color: 'white', fontSize: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sidebar: { width: 250, backgroundColor: 'white', marginTop: 100, padding: 20, alignSelf: 'flex-end', borderRadius: 10 }
});

export default Navbar;