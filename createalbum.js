import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const CreateAlbum = ({ close }) => {
  const [selectedImages, setSelectedImages] = useState([]);

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImages(result.assets);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Album</Text>
          <TouchableOpacity onPress={close} style={styles.closeBtn}>
            <Ionicons name="close" size={20} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.dropZone} onPress={pickImages}>
          <Text style={styles.browseText}>Browse Files</Text>
        </TouchableOpacity>

        <FlatList 
          data={selectedImages}
          horizontal
          renderItem={({ item }) => <Image source={{ uri: item.uri }} style={styles.thumb} />}
          keyExtractor={(item) => item.uri}
        />

        <TouchableOpacity style={styles.createBtn}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Create Album</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modal: { width: '90%', backgroundColor: 'white', padding: 20, borderRadius: 10, gap: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '600' },
  dropZone: { height: 150, borderStyle: 'dashed', borderWidth: 2, borderColor: '#3b82f6', justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  browseText: { color: '#3b82f6', fontWeight: '600' },
  thumb: { width: 80, height: 80, margin: 5, borderRadius: 5 },
  createBtn: { backgroundColor: '#3b82f6', padding: 12, alignItems: 'center', borderRadius: 8 },
  closeBtn: { padding: 5, backgroundColor: '#f3f4f6', borderRadius: 20 }
});

export default CreateAlbum;