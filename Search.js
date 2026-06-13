import React, { useState } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Navbar from './navbar';

const Search = () => {
  const [query, setQuery] = useState('');
 const searchTopics = [{
    id:1,
    name:'Account'
 }]
  return (
    <View style={styles.container}>
        <View style={{backgroundColor:'gray',height:30}}>
    
        </View>
      {/* Modern Search Bar */}
      <View style={{paddingHorizontal:30,paddingVertical:20}}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search..."
          value={query}
          onChangeText={setQuery}
          placeholderTextColor="#A0A0A0"
        />
        {query.length > 0 && (
          <Ionicons name="close-circle" size={20} color="gray" onPress={() => setQuery('')} />
        )}
      </View>
      </View>

      
      <View style={styles.resultsArea}>

      </View>
            <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA',position:'relative' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333',outlineStyle:'none' },
  resultsArea: { marginTop: 30, alignItems: 'center' },
  hintText: { color: '#AAA' },
});

export default Search;