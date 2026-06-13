import React, { useState, useEffect } from 'react';
import { StyleSheet,Image, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Createpost from './createpost';
// import Post from './post';
import { useNavigation, useRoute } from '@react-navigation/native';
import Story from './story';
import Navbar from './navbar';
// import Profession from '../components/profession';
import { Ionicons } from '@expo/vector-icons';

const Home = () => {
  const [activesection, setActiveSection] = useState('personal');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const loadDarkMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem("darkMode");
        setIsDarkMode(savedMode === "true");
      } catch (e) {
        console.error("Failed to load dark mode:", e);
      }
    };
    loadDarkMode();
  }, []);

  const handleActive = (section) => {
    setActiveSection(section);
  };

  return (
    <View style={{flex:1}}>
        <View style={{height:30}}>

        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:20,alignItems:'center',backgroundColor:'#fff',paddingVertical:20}}>
                 <Image 
           source={require('./assets/logoicon.png')} 
           style={{ 
             width: 150, 
             height:30, 
              // This tells React Native to paint the image white
           }} 
         />
         <View style={{flexDirection:'row',gap:30,alignItems:'center'}}>
         <Ionicons onPress={()=>{navigation.navigate('Search')}} name="search-outline" size={22} color="gray" />
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
<Ionicons 
  name={route.name==="Notification"?"notifications":"notifications-outline"} 
  size={22} 
  color={route.name === "Notification" ? "#5CBE8F" : "gray"} 
/>                 {notificationCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{notificationCount}</Text></View>}
        </TouchableOpacity>
         </View>
        </View>
    <ScrollView 
      style={[styles.container, isDarkMode ? styles.darkBg : styles.whiteBg]}
      contentContainerStyle={styles.content}
    >
       
      {/* Top Toggle Switch */}
      <View style={[styles.navContainer, isDarkMode ? styles.grayBg : styles.whiteBg]}>
        <TouchableOpacity 
          onPress={() => handleActive('personal')}
          style={[styles.navButton, activesection === 'personal' && styles.activeButton]}
        >
          <Text style={[styles.navText, activesection === 'personal' && styles.activeText]}>
            Personal
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => handleActive('profession')}
          style={[styles.navButton, activesection === 'profession' && styles.activeButton]}
        >
          <Text style={[styles.navText, activesection === 'profession' && styles.activeText]}>
            Professional
          </Text>
        </TouchableOpacity>
      </View>

      <Story />

    </ScrollView>
     <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1,backgroundColor:'#000',gap:0,flexDirection:'column' },
  content: {flexDirection:'column',gap:4 },
  navContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderRadius: 4,
    position:'relative', 
    
  },
  navButton: { 
    flex: 1, 
    paddingVertical: 8, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  activeButton: { backgroundColor: '#5CBE8F' }, // Update with your 'cta' color
  navText: { fontSize: 14, fontWeight: '600', color: '#000' },
  activeText: { color: '#fff' },
  whiteBg: { backgroundColor: '#FFFFFF' },
  darkBg: { backgroundColor: '#5CBE8F' },
  grayBg: { backgroundColor: '#5CBE8F' }
});

export default Home;
