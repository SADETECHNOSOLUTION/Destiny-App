import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { selectPost } from './slices/postslice';

const Postphoto = ({ close, file, setFile }) => {
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    
    const token = await SecureStore.getItemAsync('token');

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('postType', 'IMAGE');
    formData.append('description', caption);
    formData.append('imageFile', {
      uri: file.uri,
      name: file.fileName || 'photo.jpg',
      type: file.mimeType || 'image/jpeg',
    });

    try {
      const response = await fetch('http://10.0.2.2:8080/posts', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        setCaption('');
        setFile(null);
        dispatch(selectPost(null));
        close();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Post Photo</Text>
          <TouchableOpacity onPress={close}>
            <Ionicons name="close" size={24} />
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Write Something..."
          value={caption}
          onChangeText={setCaption}
          multiline
        />

        {file ? (
          <View style={styles.imageWrapper}>
            <TouchableOpacity onPress={() => setFile(null)} style={styles.removeBtn}>
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
            <Image source={{ uri: file.uri }} style={styles.image} />
          </View>
        ) : (
          <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
            <Ionicons name="image-outline" size={24} color="#3b82f6" />
            <Text style={styles.uploadText}>Upload Image</Text>
          </TouchableOpacity>
        )}

        <View style={styles.actionRow}>
          <TouchableOpacity onPress={close} style={styles.cancelBtn}>
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit} style={styles.postBtn}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white' }}>Post</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '90%', backgroundColor: 'white', padding: 20, borderRadius: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  title: { fontWeight: 'bold', fontSize: 18 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, marginBottom: 15, height: 80 },
  imageWrapper: { position: 'relative', height: 300, marginBottom: 15 },
  image: { width: '100%', height: '100%', borderRadius: 8 },
  removeBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 15, padding: 5, zIndex: 1 },
  uploadBtn: { height: 200, borderWidth: 1, borderStyle: 'dashed', borderColor: '#3b82f6', justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  uploadText: { color: '#3b82f6', marginTop: 10 },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  postBtn: { backgroundColor: '#3b82f6', padding: 10, borderRadius: 8, width: 80, alignItems: 'center' },
  cancelBtn: { padding: 10 }
});

export default Postphoto;