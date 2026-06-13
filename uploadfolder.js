import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addPhoto } from './slices/photoslice';

const UploadFolder = ({ close }) => {
  const dispatch = useDispatch();

  const handleBrowseFolder = async () => {
    try {
      // 1. Launch Document Picker
      // Note: Mobile OS usually allows selecting multiple files, 
      // but not a "folder" in the web sense.
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        // 2. Dispatch the files to your slice
        dispatch(addPhoto(result.assets));
      }
    } catch (err) {
      console.log("Error picking files:", err);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>Upload Files</Text>
          <TouchableOpacity onPress={close}>
            <Ionicons name="close" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.dropZone}>
          <View style={styles.iconContainer}>
            <Ionicons name="folder-outline" size={32} color="#3b82f6" />
          </View>
          
          <TouchableOpacity style={styles.browseBtn} onPress={handleBrowseFolder}>
            <Text style={{ color: 'white' }}>Browse Files</Text>
          </TouchableOpacity>
          <Text style={styles.hint}>Max size: 100MB</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modal: { width: '80%', padding: 20, backgroundColor: 'white', borderRadius: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  title: { fontSize: 14, fontWeight: 'semibold',color:'gray' },
  dropZone: { borderStyle: 'dashed', borderWidth: 2, borderColor: '#3b82f6', padding: 40, alignItems: 'center', gap: 15 },
  iconContainer: { backgroundColor: '#e0f2fe', padding: 15, borderRadius: 50 },
  browseBtn: { backgroundColor: '#3b82f6', padding: 10, borderRadius: 8 },
  hint: { fontSize: 12, color: '#6b7280' }
});