import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import ProfileHeader from './profileheader';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
 const route = useRoute();
  const { UserID } = route.params;

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:8080/api/users/${UserID}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  }, [UserID]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <ScrollView style={styles.container}>
       <ProfileHeader />
      {/* Personal Info Section */}
      <View style={{padding:20}}>
  <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personal Info</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>About Me:</Text>
          <Text style={styles.value}>{user?.aboutMe}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Birthday:</Text>
          <Text style={styles.value}>{new Date(user?.birthday).toLocaleDateString()}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone Number:</Text>
          <Text style={styles.value}>{user?.phno}</Text>
        </View>
      </View>

      {/* General Info Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>General Info</Text>
        <Text style={styles.label}>Hobbies:</Text>
        <Text style={styles.value}>{user?.hobbies}</Text>

        <Text style={styles.label}>Interests:</Text>
        <View style={styles.tagContainer}>
          {user?.interests?.map((interest, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{interest.activity}</Text>
            </View>
          ))}
        </View>
      </View>
      </View>
    
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: { backgroundColor: '#fff', padding: 20, marginBottom: 16, borderRadius: 8, elevation: 3 },
  sectionTitle: { fontSize: 14, fontWeight: 'semibold', marginBottom: 10 },
  infoRow: { marginBottom: 10 },
  label: { fontWeight: '600', color: '#555',fontSize:12 },
  value: { fontSize: 12, color: '#000', marginTop: 2 },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 },
  tag: { paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#e0f7fa', borderRadius: 5, marginRight: 5, marginBottom: 5 },
  tagText: { color: '#006064', fontSize: 12 }
});

export default Profile;