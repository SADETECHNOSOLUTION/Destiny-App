import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import LoginScreenr from './Login';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Signup from './Signup';
import Home from './home';
import { Provider } from 'react-redux';
import store from './store'
import Search from './Search';
import Notifications from './notification';
import Friendrequest from './friendrequest';
import Createpost from './createpost';
import MessageList from './messagelist';
import Profile from './Profile';
import ProfileHeader from './profileheader';
import Friendscomp from './friends';
import Photos from './photos';
import Videos from './videos';


export default function App() {

  const Stack = createStackNavigator();
  enableScreens();
  return (
     <Provider store={store}>
      <NavigationContainer>
       
      <Stack.Navigator 
        screenOptions={{ headerShown: false }} 
        initialRouteName="Photos"
      >
        <Stack.Screen name="Login" component={LoginScreenr} />
                <Stack.Screen name="Homescreen" component={Home} />
           <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Search" component={Search} />
             <Stack.Screen name="Notification" component={Notifications} />
             <Stack.Screen name="Friendrequests" component={Friendrequest} />
              <Stack.Screen name="Createpost" component={Createpost} />
                   <Stack.Screen name="Messagelist" component={MessageList} />
        <Stack.Screen name='About' component={Profile}/>
         <Stack.Screen name='Friends' component={Friendscomp}/>
         <Stack.Screen name='Photos' component={Photos}/>
                  <Stack.Screen name='Videos' component={Videos}/>

      </Stack.Navigator>
    </NavigationContainer>
     </Provider>
  );
}


const styles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: 'red',
  },
  contentContainer: {
       // Move this here
     // Move this here
  },
});