import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, ActivityIndicator,ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Icon } from '@iconify/react'; // Ensure you have react-native-iconify or use @expo/vector-icons
import axios from 'axios';
import LogoImg from './assets/logo.png';
import ProfileImg from './assets/profile.webp';
import { MaterialIcons, Ionicons, Octicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation,useRoute } from '@react-navigation/native';
const ProfileHeader = ({ userID, userId, isCurrentUser }) => {
//   const [user, setUser] = useState(null);
//   const [imageForm, setImageForm] = useState(false);
  
//   // Fetch logic remains similar but uses fetch/axios
//   const fetchUserDetails = useCallback(async () => {
//     try {
//       const response = await axios.get(`http://10.0.2.2:8080/api/users/${userID}`);
//       setUser(response.data);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   }, [userID]);

//   useEffect(() => {
//     fetchUserDetails();
//   }, [fetchUserDetails]);

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       // Handle your upload logic here
//       console.log(result.assets[0].uri);
//     }
//   };

//   if (!user) return <ActivityIndicator />;

const route = useRoute();

  const [sentrequest,setSentRequest] = useState()
  const [isRequested,setIsRequested] = useState()
  const [friends,setFriends] = useState()
  const [isFriends,setIsFriends] = useState()
    const [isFollowed,setIsFollowed] = useState(false);
  const [followers,setFollowers] = useState();
  const [following,setFollowing] = useState();
  const [isFollowing,setisFollowing] = useState()
    const [user, setUser] = useState(null);
  const handleOptions = ()=>{
    setOptions(!options)
  }

          const handleFollowStatus = (data) => {
          // Assuming data has a list of followers
          setIsFollowed(data.users.some((follower) => follower.id === userId));
        };
        

        const fetchFollowers = async () => {
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              console.error('No token found in localStorage');
              return;
            }
            const response = await fetch(`http://localhost:8080/follows/api/followers/${userID}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
    
            if (response.ok) {
              const data = await response.json();
              setFollowers(data);
              // Check if the user is followed
              handleFollowStatus(data); 
            } else {
              console.error('Failed to fetch user data:', response.status);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };

        
        const followUser = async ()=>{
          const token = localStorage.getItem('token')
          try{
            const response = await fetch(`http://localhost:8080/follows/follow/${userId}/${userID}`,{
              method:'POST',
              headers:{
                'Authorization':`Bearer ${token}`
              }
            })
            if(response.ok){
              console.log('')
              fetchFollowers()
              fetchFollowing()
            }
            else{
              console.log('error in posting data')
            }
          }
          catch(error){
            console.error(error)
          }
        }

            const menu = [
        {id:1,
        name:'About',
        path:`/user/${userID}`},
        {id:2,
        name:'Timeline',
        path:`/timeline/${userID}`},
        {id:3,
        name:'Friends',
        path:`/Friends/${userID}`},
        {id:4,
        name:'Photos',
        path:`/photos/${userID}`},
        {id:5,
        name:'Videos',
        path:`/videos/${userID}`},
        ]

  const fetchRequest = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }
    const response = await fetch(`http://localhost:8080/friend-requests/${userId}/sent-requests`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  
    if (response.ok) {
      const data = await response.json();
      setSentRequest(data);
      // Check if the user is followed
      setIsRequested(data.sentRequests.find((follower) => follower.recipientId === parseInt(userID)));
    } else {
      console.error('Failed to fetch user data:', response.status);
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
  };

          const sendRequest = async ()=>{
          const token = localStorage.getItem('token')
          const payload={
            senderId:userId,
            recipientId:userID
          }
          try{
            const response = await fetch(`http://localhost:8080/friend-requests/send?senderId=${userId}&recipientId=${userID}`,{
              method:'POST',
              headers:{
                'Authorization':`bearer${token}`
              },
              body:JSON.stringify(payload)
            })
            if(response.ok){
              console.log('')
              fetchRequest()
            }
            else{
              console.log('error in posting data')
            }
          }
          catch(error){
            console.error(error)
          }
        }

        const cancelRequest = async ()=>{
          const token = localStorage.getItem('token')
          const payload={
            senderId:userId,
            recipientId:userID
          }
          try{
            const response = await fetch(`http://localhost:8080/friend-requests/decline?senderId=${userId}&recipientId=${userID}`,{
              method:'POST',
              headers:{
                'Authorization':`bearer${token}`
              },
              body:JSON.stringify(payload)
            })
            if(response.ok){
              console.log('')
              fetchRequest()
            }
            else{
              console.log('error in posting data')
            }
          }
          catch(error){
            console.error(error)
          }
        }

  return (
    <View style={styles.container}>
      {/* Cover Photo */}
      <ImageBackground 
        source={LogoImg} 
        style={styles.banner}
      >
        {isCurrentUser && (
          <TouchableOpacity style={styles.editBannerBtn} onPress={() => {/* Logic */}}>
            <Text style={styles.btnText}>Change Cover</Text>
          </TouchableOpacity>
        )}
      </ImageBackground>

      {/* Profile Pic */}
      <View style={styles.profileSection}>
        <Image 
          source={ProfileImg} 
          style={styles.avatar} 
        />
        {isCurrentUser && (
          <TouchableOpacity style={styles.cameraBtn} onPress={() => setImageForm(true)}>
            <Text>📷</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4,paddingBottom:10}}>
        <Text style={{fontWeight:600,marginTop:8,fontSize:16}}>Profile Name</Text>
        <Text style={{fontSize:14,color:'gray'}}>Profession</Text>
      </View>

      {/* Buttons: Follow/Friend */}
      {!isCurrentUser && (
        <View style={styles.actionRow}>
          {isFriends ? (
  <TouchableOpacity onPress={handleOptions} style={styles.actionButton}>
    <Icon name="fa-solid:user-friends" size={16} />
    <Text style={styles.btnText}>Friends</Text>
  </TouchableOpacity>
) : isRequested ? (
  <TouchableOpacity onPress={cancelRequest} style={styles.ctaButton}>
    <Icon name="material-symbols:person-cancel-rounded" size={16} />
    <Text style={styles.btnText}>Cancel</Text>
  </TouchableOpacity>
) : (
  <TouchableOpacity onPress={sendRequest} style={styles.ctaButton}>
    <Icon name="mingcute:user-add-fill" size={12} />
    <Text style={styles.btnText}>Add Friend</Text>
  </TouchableOpacity>
)}
         {isFollowed ? (
  <TouchableOpacity 
    onPress={unfollowUser} 
    key={user?.id} 
    style={styles.ctaButton}
  >
    <Icon name="charm:tick" size={16} style={styles.iconStyle} />
    <Text style={styles.btnText}>Following</Text>
  </TouchableOpacity>
) : (
  <TouchableOpacity 
    onPress={followUser} 
    key={user?.id} 
    style={styles.ctaButton}
  >
    <Icon name="ic:sharp-add" size={16} style={styles.iconStyle} />
    <Text style={styles.btnText}>Follow</Text>
  </TouchableOpacity>
)}
<TouchableOpacity style={{padding:5,borderWidth:0,borderRadius:100,backgroundColor:'#5CBE8F'}}>
           <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" />
</TouchableOpacity>
        </View>
      )}
    
      <View style={{flexDirection:'row',justifyContent:'space-between',width:'80%',paddingTop:10}}>
        <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3}}>
        <Text style={{color:'gray'}}>
        Following
        </Text>
         <Text>
            0
        </Text>
        </View>
               <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3}}>
        <Text style={{color:'gray'}}>
        Followers
        </Text>
         <Text>
            0
        </Text>
        </View>
                       <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3}}>
        <Text style={{color:'gray'}}>
        Media
        </Text>
         <Text>
            0
        </Text>
        </View>
      </View>
      <View style={{flexDirection:'row',justifyContent:'justify-between',width:'90%',paddingTop:20,borderBottomWidth:1,borderBottomColor:'#EBEBEB'

      }}>
          {menu.map((item) =>{
            const isActive = route.name === item.name;
            return(
                <TouchableOpacity 
    key={item.id} 
    style={styles.menuItem} 
    onPress={() => navigation.navigate(item.name, { userID: item.id })}// Update to your route name
  >
    <Text style={[
      styles.menuText, 
      route.name === item.name && styles.activeText // Active state logic
    ]}>
      {item.name}
    </Text>
    {isActive && <View style={styles.activeUnderline} />}
  </TouchableOpacity>
            )
          } )}
      </View>

    </View>


  );
};

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center',justifyContent:'center' },
  banner: { width: '100%', height: 176, justifyContent: 'flex-end' },
  editBannerBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.5)', padding: 5, borderRadius: 5 },
  profileSection: { marginTop: -60, alignSelf: 'flex-center' },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#fff' },
  cameraBtn: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#fff', padding: 5, borderRadius: 20 },
  actionRow: { flexDirection: 'row', gap: 10, padding: 10,alignItems:'center' },
  ctaButton: { borderColor: '#5CBE8F', paddingVertical: 8, width: 120, borderRadius: 20,flexDirection:'row',alignItems:'center',justifyContent:'center',borderWidth:1  ,color:'#5CBE8F' },
  btnText: { color: '#5CBE8F', fontWeight: 'semibold',fontSize:12 },
  activeUnderline: {
    height: 3,           // Thickness of the underline
    width: '75%',       // Width of the underline
    backgroundColor: '#5CBE8F', // Underline color
    position: 'absolute',
    bottom: 0,
    borderRadius: 2,     // Slightly rounded edges
  },menuItem: {
    paddingVertical: 8,  // py-2
    paddingHorizontal: 16, // px-4
    flexDirection:'row',
    justifyContent:'center',
    textAlign:'center'
  },
  menuText: {
    fontSize: 14, // text-md
    fontWeight: '600', // font-semibold
    color: 'gray', // Default color
  },
  activeText: {
    color: '#5CBE8F', // Replace with your 'cta' hex code
  }
});

export default ProfileHeader;