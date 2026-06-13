import React,{useState,useEffect,useCallback} from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation,useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ProfileHeader from './profileheader';

const Friendscomp = () => {
  const navigation = useNavigation();
  const { Friends } = useSelector((state) => state.friend);
    const userId = useSelector((state)=>state.auth.userId)
    const route = useRoute()
  const {userID} = route.params || {};
  const [friends,setFriends] = useState();
  const [isFriends,setIsFriends] = useState();
  const [myFriends,setMyFriends] = useState();
const isCurrentUser = parseInt(userID) === userId;
  const seeAllFriends = () => {
    navigation.navigate('Friendsview');
  };
  const fetchProfile = useCallback(async()=>{
    try{
      const response = await fetch(`https://localhost:8080/home/api/aggregate/${userID}`, {
        method: 'GET',
      });
      if(response.ok){
        const data = await response.json()
        setProfile(data)
      }
    }
    catch(error){
    console.error('Error fetching user data:', error);
    }
  },[userID])

    const fetchfriends = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
      const response = await fetch(`http://localhost:8080/friend-requests/${isCurrentUser ? userId:userID}/friends`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    
      if (response.ok) {
        const data = await response.json();
        setFriends(data);
        // Check if the user is followed
        setIsFriends(
          myFriends.friends.some(friend => friend.id === friends?.friends.some((follower)=>follower.id))
        );
        
      } else {
        console.error('Failed to fetch user data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    },[isCurrentUser,userID,userId,friends?.friends]);
  
        useEffect(()=>{
      fetchfriends()
    },[])

    useEffect(()=>{
      fetchProfile()
    },[])

  const renderFriendItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.img }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.mutual}>
          {item.mutual.length} {item.mutual.length <= 1 ? 'Mutual' : 'Mutuals'}
        </Text>
      </View>

    </View>
  );

  return (
    <View style={styles.container}>
        <ProfileHeader />
      <View style={styles.header}>
        <Text style={styles.title}>Friends ({Friends.length})</Text>
      </View>
<View style={{flexDirection:'column'}}>
      <FlatList
        data={[...Friends].reverse()}
        renderItem={renderFriendItem}
        keyExtractor={(item) => item.id.toString()}
        vertical
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
</View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', borderRadius: 8, elevation: 4 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10,marginTop:16 },
  title: { fontSize: 14, fontWeight: '600',color:'gray' },
  seeAll: { color: '#3b82f6', fontSize: 14 },
  listContent: { gap: 12 },
  card: { width: '100%', borderWidth: 0, borderColor: '#000', borderRadius: 8, alignItems: 'center',flexDirection:'row',height:70,gap:10 },
  image: { width: '25%', height:'100%', borderRadius: 8,borderWidth:1,borderColor:'gray' },
  infoContainer: { padding: 8, alignItems: '' },
  name: { fontWeight: '600' },
  mutual: { fontSize: 12, color: '#666' },
  addButton: { flexDirection: 'row', alignItems: 'center', borderColor: '#3b82f6', borderWidth: 1, padding: 6, borderRadius: 6 },
  addBtnText: { color: '#3b82f6', marginLeft: 4, fontSize: 12 }
});

export default Friendscomp;