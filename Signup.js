import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  Modal, ScrollView, Alert, Image 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Signup = () => {
  const [user, setUser] = useState({ name: '', email: '', phoneNumber: '', password: '', confirmPassword: '' });
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [seconds, setSeconds] = useState(300);
  
  const navigation = useNavigation();
  const inputRefs = useRef([]);

  // Timer logic
  useEffect(() => {
    let intervalId;
    if (showOtpModal && seconds > 0) {
      intervalId = setInterval(() => setSeconds(s => s - 1), 1000);
    }
    return () => clearInterval(intervalId);
  }, [showOtpModal, seconds]);

  const handleOTPChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) inputRefs.current[index + 1].focus();
    }
  };

  const handleSubmit = () => {
    if (!user.name || !user.email || !user.password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    setShowOtpModal(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Image source={require('./assets/logo.png')} style={styles.logo} /> */}
 <View style={styles.logoContainer}>
          {/* Replace with your local asset require('../../assets/logo.png') */}
           
   
        <Image 
  source={require('./assets/logo.png')} 
  style={{ 
    width: '90%', 
    height:50, 
    tintColor: 'white' // This tells React Native to paint the image white
  }} 
/>
        </View>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Username </Text>
        <TextInput style={styles.input} onChangeText={(v) => setUser({...user, name: v})} />

        <Text style={styles.label}>Email </Text>
        <TextInput style={styles.input} keyboardType="email-address" onChangeText={(v) => setUser({...user, email: v})} />

        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} secureTextEntry onChangeText={(v) => setUser({...user, password: v})} />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput style={styles.input} secureTextEntry onChangeText={(v) => setUser({...user, confirmpassword: v})} />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={{flexDirection:'column',alignItems:'center'}}>
<Text style={styles.signupPrompt}>
                      Have an Account already?
                      
                    </Text>
                    <Text 
                        style={{color:'#5CBE8F',fontWeight:600}} 
                        onPress={() => navigation.navigate('Login')}
                      >
                        Login
                      </Text>
        </View>
             
      </View>

      <Modal visible={showOtpModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>Enter OTP sent to {user.email}</Text>
            <View style={styles.otpContainer}>
              {otp.map((val, idx) => (
                <TextInput
                  key={idx}
                  ref={ref => inputRefs.current[idx] = ref}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  onChangeText={(v) => handleOTPChange(v, idx)}
                  value={val}
                />
              ))}
            </View>
            <TouchableOpacity onPress={() => setShowOtpModal(false)} style={styles.button}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems:'flex-end',justifyContent:'flex-end',backgroundColor: '#5CBE8F',  },
  logo: { width: 200, height: 100, marginBottom: 20 },
  formContainer: { width: '100%', backgroundColor: '#fff', paddingTop: 60,paddingHorizontal:30, borderTopLeftRadius:30,borderTopRightRadius:30, height:'80%'},
  input: { borderBottomWidth: 1,outlineStyle: 'none', borderColor: '#ccc', padding: 5, marginBottom: 15,fontSize:14 },
  label: { marginBottom: 5, fontSize: 14},
  button: { backgroundColor: '#5CBE8F', padding: 10, borderRadius: 5, alignItems: 'center',marginTop:10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
    signupPrompt: {
        marginTop:12,
    fontSize: 14,
    color: '#767d88',
    textAlign: 'center',
  },
    logoContainer: {
    width:'100%',
    height:'20%',
    alignItems: 'center',
    justifyContent:'center'
  },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 10, alignItems: 'center' },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 },
  otpInput: { borderWidth: 1, borderColor: '#ccc', width: 40, height: 40, textAlign: 'center', borderRadius: 5 }
});

export default Signup;