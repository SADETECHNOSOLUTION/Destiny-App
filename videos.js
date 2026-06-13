import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ProfileHeader from './profileheader';

const Videos = () => {
  const [modals, setModals] = useState({ upload: false, post: false, folder: false, album: false });
  const [videos, setVideos] = useState([]);
  const [file, setFile] = useState(null);
  
  const navigation = useNavigation();
  const route = useRoute();
  const { userID } = route.params || {}
  const userId = useSelector((state) => state.auth.userId);

  const fetchVideos = async () => {
    // Replace with your API call logic
    // fetch(`http://10.0.2.2:8080/posts/user/${userID}/videos`, ...)
  };

  const handleVideoPick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setFile(result.assets[0]);
      setModals({ ...modals, upload: false, post: true });
    }
  };

  return (
    <View style={styles.container}>
        <ProfileHeader />
      <Text style={styles.title}>Videos ({videos.length})</Text>

      <FlatList
        data={[...videos].reverse()}
        numColumns={3}
        keyExtractor={(item) => item.postId.toString()}
        ListHeaderComponent={parseInt(userID) === userId && (
          <TouchableOpacity style={styles.uploadBox} onPress={() => setModals({ ...modals, upload: true })}>
            <Ionicons name="add-circle" size={32} color="#3b82f6" />
            <Text style={styles.uploadText}>Upload</Text>
          </TouchableOpacity>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { postId: item.postId })}>
            <Video
              source={{ uri: item.videoUrl }}
              style={styles.video}
              isLooping
              shouldPlay={false} 
            />
          </TouchableOpacity>
        )}
      />

      {/* Modal logic: Use standard React Native <Modal> */}
      <Modal visible={modals.upload} animationType="slide">
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={handleVideoPick} style={styles.btn}><Text>Upload Video</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setModals({ ...modals, upload: false })}><Text>Close</Text></TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 14, fontWeight: 600, marginBottom: 10,color:'gray',marginTop:16 },
  uploadBox: { width: 100, height: 100, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  video: { width: 100, height: 100, margin: 5, borderRadius: 8 },
  modalContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btn: { padding: 15, backgroundColor: '#3b82f6', borderRadius: 8, margin: 10 }
});

export default Videos;