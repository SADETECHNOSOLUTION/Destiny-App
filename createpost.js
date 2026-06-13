import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { selectPost, removeSelected } from './slices/postslice'


const Createpost = () => {
  const Navigate = useNavigation()
  const dispatch = useDispatch();
  const { selected } = useSelector((state) => state.post);
  const [file, setFile] = useState(null);
  const [postType, setPostType] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [user,setUser] = useState()
  const [description,setDescription] = useState('')
  const userId = useSelector((state) => state.auth.userId);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);
  }, []);



const renderMedia = () => {
  if (!selected) return null;

  // Render Image
  if (selected.type?.startsWith('image')) {
    return (
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: selected.url }} />
        <TouchableOpacity style={styles.closeIcon} onPress={() => dispatch(removeSelected())}>
          <Icon name="ic:round-close" size={20} color="black" />
        </TouchableOpacity>
      </View>
    );
  } 
  
  // Render Video
  else if (selected.type?.startsWith('video')) {
    return (
      <Video
        style={styles.video}
        source={{ uri: selected.url }}
        useNativeControls
        resizeMode="contain"
      />
    );
  }
  
  return null;
};


  const handleSubmit = async (event) => {
    if (!file && !description) {
        alert("Please provide either a text description or a photo/video.");
        return; // Exit early if neither is present
      }
    event.preventDefault();
    const finalPostType = file ? postType : 'TEXT';
    // Create a FormData object for the file uploads and form data
    const formDataObj = new FormData();

    // Append userId and postType to FormData
    formDataObj.append('userId', userId);
    formDataObj.append('postType', finalPostType);

    // Append the selected file with the correct key
    if (file) {
      if (postType === 'IMAGE') {
        formDataObj.append('imageFile', file); // Append image file
      } else if (postType === 'VIDEO') {
        formDataObj.append('videoFile', file); // Append video file
      }
      // Add other conditions if needed
    }
    if (description) {
      formDataObj.append('description', description); // Append description to FormData
    }
    // Append location if selected
    if (selectedLocation) {
      formDataObj.append('location', JSON.stringify(selectedLocation)); // Convert location object to JSON string
    }

    // Log the FormData object for debugging
    for (let [key, value] of formDataObj.entries()) {
      console.log(`${key}:`, value);
    }
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('http://localhost:8080/posts', {
        method: 'POST',
        body: formDataObj,
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if (response.ok) {
        setFile(null);
        setPostType('');
        setDescription('');
        setSelectedLocation(null);
        dispatch(selectPost(null));
        const data = await response.json();
        console.log('API Response Data:', data); // Log the response for debugging
      } else {
        // Log detailed error message
        const errorText = await response.text();
        console.error('Error:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUserDetails = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${userId}`, {
        method: 'GET',
        headers: {
        'Authorization':`Bearer ${token}`
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const handlePost = ()=>{
    Navigate('/postinfo')
  }

  return (
<View style={styles.container}>
      <View style={styles.inputRow}>
        {user?.profileImagePath && (
          <Image 
            style={styles.avatar} 
            source={{ uri: `http://10.0.2.2:8080${user.profileImagePath}` }} 
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Write something..."
          value={description}
          onChangeText={setDescription}
          onFocus={handlePost}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', borderRadius: 8, elevation: 3 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  input: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 }
});

export default Createpost;
