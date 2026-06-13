import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
// Redux Actions
import { selectPost } from './slices/postslice';

// Custom Native Components (Replacements for your web modals)
import Postphoto from './uploadphoto';
import Uploadfolder from './uploadfolder';
import Createalbum from './createalbum';
import ProfileHeader from './profileheader';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 40) / 3; // Dynamically grids 3 items per row

const Photos = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();

  // Route Params (Fallback handled safely)
  const { userID } = route.params || {};

  // Redux state
  const userId = useSelector((state) => state.auth.userId);

  // States
  const [uploadPhotoVisible, setUploadPhotoVisible] = useState(false);
  const [postPhotoVisible, setPostPhotoVisible] = useState(false);
  const [folderVisible, setFolderVisible] = useState(false);
  const [createAlbumVisible, setCreateAlbumVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [likeCount, setLikeCount] = useState({});
  const [like, setLike] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkTheme = async () => {
      const savedMode = await AsyncStorage.getItem('darkMode');
      setIsDarkMode(savedMode === 'true');
    };
    checkTheme();
  }, []);

  const closePopups = () => {
    setFolderVisible(false);
    setPostPhotoVisible(false);
    setUploadPhotoVisible(false);
    setCreateAlbumVisible(false);
  };

  const openPostPhoto = () => {
    setPostPhotoVisible(true);
    setUploadPhotoVisible(false);
  };

  const openUploadFolder = () => {
    setFolderVisible(true);
    setUploadPhotoVisible(false);
  };

  const openCreateAlbum = () => {
    setCreateAlbumVisible(true);
    setUploadPhotoVisible(false);
  };

  // API Call: Fetch Likes Status
  const fetchLikes = useCallback(async (postId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`http://localhost:8080/likes/post/${postId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const userHasLiked = data.some((item) => item.userId === userId);
        setLike((prev) => ({ ...prev, [postId]: userHasLiked }));
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  }, [userId]);

  // API Call: Fetch Likes Counter
  const likesCount = useCallback(async (postId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/likes/post/${postId}/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setLikeCount((prevCounts) => ({ ...prevCounts, [postId]: data }));
      }
    } catch (error) {
      console.error('Error fetching like count:', error);
    }
  }, []);

  // API Call: Fetch Images List
  const fetchImage = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`http://localhost:8080/posts/user/${userID}/images`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching user Image:', error);
    }
  }, [userID]);

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  useEffect(() => {
    if (images?.length > 0) {
      images.forEach((post) => {
        if (post.postId) {
          fetchLikes(post.postId);
          likesCount(post.postId);
        }
      });
    }
  }, [images, fetchLikes, likesCount]);

  // Native File Picker Handler
const handleImageChange = async () => {
  try {
    // 1. Launch the library using async/await
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true, // Set to true if you need the data URI
    });

    // 2. Check if the user cancelled
    if (result.canceled) return;

    // 3. Process the selected image
    const selectedFile = result.assets[0];

    const selectedData = {
      url: `data:${selectedFile.mimeType || 'image/jpeg'};base64,${selectedFile.base64}`,
      type: 'IMAGE',
    };

    // 4. Update your Redux and Local State
    dispatch(selectPost(selectedData));
    setFile({
      uri: selectedFile.uri,
      name: selectedFile.fileName || 'profile_image.jpg',
      type: selectedFile.mimeType || 'image/jpeg',
    });

    openPostPhoto();
  } catch (error) {
    console.error("Error picking image:", error);
  }
};

  const themeContainer = isDarkMode ? styles.bgDark : styles.bgLight;
  const themeText = isDarkMode ? styles.textDark : styles.textLight;

  return (
    <SafeAreaView style={[styles.container, themeContainer]}>
      {/* HEADER SECTION */}
      <ProfileHeader />
      <View style={styles.header}>
        <Text style={[styles.headerText, themeText]}>Photos ({images?.length || 0})</Text>
      </View>

      {/* PHOTO GRID & UPLOAD BUTTON */}
      <ScrollView contentContainerStyle={styles.gridContainer}>
        {parseInt(userID) === userId && (
          <TouchableOpacity
            onPress={() => setUploadPhotoVisible(true)}
            style={[styles.uploadBox, isDarkMode ? styles.uploadBoxDark : styles.uploadBoxLight]}
          >
            <Ionicons name="add-circle" size={32} color="#10B981" />
            <Text style={styles.uploadText}>Upload</Text>
          </TouchableOpacity>
        )}

        {images?.map((photo) => (
          <TouchableOpacity
            key={photo.postId}
            onPress={() => navigation.navigate('PostDetail', { userID, postId: photo.postId })}
            style={styles.imageWrapper}
          >
            <Image
              source={{ uri: `http://localhost:8080${photo.imageUrl}` }}
              style={styles.gridImage}
            />
            {/* Native Layer overlay for showing continuous like counts */}
            <View style={styles.likeOverlay}>
              <Ionicons name="heart" size={16} color="#10B981" />
              <Text style={styles.likeCountText}>{likeCount[photo.postId] || 0}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* MODAL 1: CHOOSE UPLOAD TYPE */}
      <Modal visible={uploadPhotoVisible} transparent animationType="fade" onRequestClose={closePopups}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload</Text>
              <TouchableOpacity onPress={() => setUploadPhotoVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#000" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleImageChange} style={styles.actionButton}>
              <MaterialIcons name="image" size={20} color="#10B981" />
              <Text style={styles.actionBtnText}>Upload Image</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={openUploadFolder} style={styles.actionButton}>
              <MaterialIcons name="folder" size={20} color="#10B981" />
              <Text style={styles.actionBtnText}>Upload Folder</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={openCreateAlbum} style={styles.actionButton}>
              <MaterialIcons name="create-new-folder" size={20} color="#10B981" />
              <Text style={styles.actionBtnText}>Create Album</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: POST PHOTO COMPONENT */}
      <Modal visible={postPhotoVisible} transparent animationType="slide" onRequestClose={closePopups}>
        <SafeAreaView style={styles.fullScreenModal}>
          <Postphoto file={file} close={closePopups} />
        </SafeAreaView>
      </Modal>

      {/* MODAL 3: UPLOAD FOLDER */}
      <Modal visible={folderVisible} transparent animationType="slide" onRequestClose={closePopups}>
        <SafeAreaView style={styles.fullScreenModal}>
          <Uploadfolder close={closePopups} />
        </SafeAreaView>
      </Modal>

      {/* MODAL 4: CREATE ALBUM */}
      <Modal visible={createAlbumVisible} transparent animationType="slide" onRequestClose={closePopups}>
        <SafeAreaView style={styles.fullScreenModal}>
          <Createalbum close={closePopups} />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default Photos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgLight: { backgroundColor: '#FFFFFF' },
  bgDark: { backgroundColor: '#1F2937' },
  textLight: { color: 'gray' },
  textDark: { color: '#FFFFFF' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop:14
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color:'gray'
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  uploadBox: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    margin: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBoxLight: { backgroundColor: '#F3F4F6' },
  uploadBoxDark: { backgroundColor: '#374151' },
  uploadText: {
    marginTop: 4,
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  imageWrapper: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    margin: 4,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  likeOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCountText: {
    color: '#FFF',
    fontSize: 11,
    marginLeft: 3,
    fontWeight: '600',
  },
  /* Modal Architecture Styles */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  closeBtn: {
    backgroundColor: '#E5E7EB',
    padding: 6,
    borderRadius: 20,
  },
  actionButton: {
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionBtnText: {
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 8,
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});