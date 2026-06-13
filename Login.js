import React, { useState } from 'react';
import { View, Text,SafeAreaView,StyleSheet,Image, TextInput, TouchableOpacity, Modal, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
// 1. Replace the router import:
import { useNavigation } from '@react-navigation/native'; 
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
  const [user, setUser] = useState({ email: '', password: '', loginmail: '' });
  const [signinOtp, showOtp] = useState(false);
  const [otpPage, showOtpPage] = useState(false);
  const [error, setError] = useState('');
      const [otp, setOtp] = useState(Array(6).fill(''));
    const [languages,setLanguages] = useState(false);
    const [language,setLanguage] = useState(null)
        const [active,setActive] = useState(false);
    const [seconds, setSeconds] = useState(300)
        const [userId,setuserId] = useState(null)
  // 2. Initialize navigation:
  const navigation = useNavigation();

  const handleChange = (name, value) => {
    setError('');
    setUser({ ...user, [name]: value });
  };

     const handleCloseOTP = ()=>{
        showOtp(false);
      }
      const handleotpPage = ()=>{
        showOtpPage(true);
        showOtp(false);
      }
      const handlecloseotpPage = ()=>{
        showOtpPage(false);
      }

    const handleShowLanguages = ()=>{
        setLanguages(!languages);
    }
    const handleActive = ()=>{
        setActive(!active);
    }

    const encryptData = (password) => {
      const key = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_SECRET_KEY); // Use a secure key
      const iv = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_AES_IV); // Use a secure IV (Initialization Vector)
      const encrypted = CryptoJS.AES.encrypt(password, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      return encrypted.toString();
    };

    const info = [
    {
        id:1,
        heading:"Destiny ©2021"
    },
    {
        id:2,
        heading:"Sign up",
        path:"/signup"
    },
    {
        id:3,
        heading:"Sign in"
    },
    {
        id:4,
        heading:"Create ad"
    },
    {
        id:5,
        heading:"Create page"
    },
    {
        id:6,
        heading:"User Agreement"
    },
    {
        id:7,
        heading:"Privacy policy"
    },
    {
        id:8,
        heading:"Community Guidelines"
    },
    {
        id:9,
        heading:"Cookie policy"
    },
    {
        id:10,
        heading:"Copyright policy"
    },]

     const fetchUserdata = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:8080/api/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
    
        if (response.ok) {
          const data = await response.json();
          return data;
        }
         else {
          console.error('Failed to fetch user profile:', response.status);
          return null;
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
    };
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.some(field => field === '')) {
      toast.error('Please enter the complete OTP.');
      return;
    } 
    const payload = {
        email: user.loginmail,
        otp: otp.join('')  // Assuming OTP is an array of strings
      };
    try {
      console.log('Sending data:', JSON.stringify(payload));
      const response = await fetch('http://localhost:8080/api/auth/login-with-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('token', token);
        console.log('Form data submitted successfully');
        handleCloseOTP()
        handlecloseotpPage()
        setError('');
        const userProfile = await fetchUserProfile(token);
        if (userProfile) {
          toast.success(`Welcome ${userProfile.name}`);
          dispatch(setAuth({ userId: userProfile.userId, }));
          setTimeout(() => navigate('/profiledetails'), 5000);
        }
        else {
          toast.error('Failed to fetch user profile');
          setError('Incorrect Username/Password');
        }
      } 
      else {
        toast.error(`OTP is invalid`);
        console.error('Failed to submit data:', await response.text());
      }
    } catch (error){
      console.error('Error submitting data:', error);
    }
  };

    const fetchuser = async () => {
      const token = localStorage.getItem('token');
      const userProfile = await fetchUserProfile();
      try {
        const response = await fetch(`http://localhost:8080/api/users/getBy-email?email=${userProfile.email}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
    
        if (response.ok) {
          const data = await response.json();
          setuserId(data.userid)
          console.log(data.userid)
          return data;
        }
         else {
          console.error('Failed to fetch user profile:', response.status);
          return null;
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
    };
    const handleSendOtp = async (e) => {
        e.preventDefault();
        
        // Construct the payload
        const payload = {
          email: user.loginmail
        };

        try {
          console.log('Sending payload:', JSON.stringify(payload));
          // Send the OTP request

          const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          console.log('Response status:', response.status);
          console.log('Response headers:', response.headers);
      
          if (response.ok) {
            handleotpPage();
            toast.success('OTP sent successfully! Please check your email.');
            console.log(1);
            // Handle success based on your backend response
            // Example: If the response contains a success message
            if (!response.ok) {
            toast.error('Incorrect Username/Password');
            console.log(2);
            } else {
              setError('Incorrect Username/Password');
              console.log(3);
            }
          } else {
            // Handle response errors
            const errorText = await response.text();
            toast.error(`Error: ${errorText}`);
            console.log(4);
          }
        } catch (error) {
          console.error('Error sending OTP:', error);
          toast.error('An error occurred while sending OTP.');
          console.log(5);
        }
      };

      function stringToAsciiInt(inputString) {
        // Convert each character to its ASCII value
        const asciiValues = Array.from(inputString).map(char => char.charCodeAt(0));
    
        // If you want to convert ASCII values to a single integer, you can join them
        // Note: This can lead to very large numbers, so consider using BigInt for large strings.
        const asciiAsString = asciiValues.join('');
        const asciiAsInt = Number(asciiAsString); // Convert to a number (or use BigInt(asciiAsString))
    
        return { asciiValues, asciiAsInt };
    }

      const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // const payload={
        //   email: user.email,
        //   password: encryptData(user.password)
        // }
        // Validate user input
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
        if (user.password.length < 8) {
          toast.error('Password must be at least 8 characters long.');
          return;
        }
        if (!user.email) {
          toast.error('Email cannot be empty.');
          return;
        } else if (!emailPattern.test(user.email)) {
          toast.error('Invalid email format.');
          return;
        }
        console.log(JSON.stringify(CryptoJS.enc.Utf8.parse(process.env.REACT_APP_SECRET_KEY)))
        console.log(JSON.stringify(CryptoJS.enc.Utf8.parse(process.env.REACT_APP_AES_IV)))
        console.log(encryptData(user.password))


        try {
          // const token = process.env.REACT_APP_GITHUB_TOKEN;
          const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body:JSON.stringify(user),
          });

          console.log('Response status:', response.status);
          console.log('Response headers:', response.headers);
          if (response.ok) {
            const data = await response.json();
            if (data.token) {
              localStorage.setItem('token', data.token);
              setUser({ email: '', password: '' });
              console.log('Form data submitted successfully');
              const userProfile = await fetchUserProfile(data.token);
              const userdetails = await fetchUserdata();
              const fetchedUser = await fetchuser(); // Await fetchuser

              // const userIdAsciiInt = stringToAsciiInt(userProfile.id).asciiAsInt
              if (userdetails.some(user => user.email === userProfile.email)) {
                dispatch(setAuth({ userId: fetchedUser.id, token: data.token }));
                setTimeout(() => navigate('/newsfeed'), 5000);
                toast.success(`Welcome ${userProfile.name}`);
                console.log(userProfile.id);
                setError('');
              } else if (userProfile) {
                // dispatch(setAuth({ userId: user.id, token: data.token }));
                console.log('Navigating to /profiledetails');
                toast.success(`Welcome ${userProfile.name}`);
                setTimeout(() => navigate('/profiledetails'), 5000);
                console.log(userProfile.id);
                setError('');
              }
            } else {
                setError('Invalid credentials. Please try again.');
            }
          } else {
            toast.error(`Invalid Email/Password`);
            setError('Incorrect Username/Password');
          }
        } catch (error) {
          console.error('Error submitting form:', error);
          toast.error('An error occurred while fetching data');
        }
      };

  return (
<SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

    
        {/* Logo Container */}
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

        {/* Login Card Form Container */}
        <View style={styles.formContainer}>
          
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Email <Text style={styles.textRed}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={user.email}
              onChangeText={(text) => handleChange('email', text)}
              placeholder="Enter your email"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Password <Text style={styles.textRed}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={user.password}
              onChangeText={(text) => handleChange('password', text)}
              placeholder="Enter your password"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

           <View style={{width:'100%'}}>
    <TouchableOpacity  onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
          </TouchableOpacity>
           </View>
      

          {error ? <Text style={styles.textRed}>{error}</Text> : null}

          {/* Actions Container */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Log In</Text>
            </TouchableOpacity>
<View style={{flexDirection:'column',alignItems:'center'}}>
    <Text style={styles.signupPrompt}>
              I am a new member{' '}
       
            </Text>
                   <Text 
                style={styles.signupLink} 
                onPress={() => navigation.navigate('Signup')}
              >
                Sign Up
              </Text>
</View>
        
          </View>

        </View>

      </ScrollView>

      {/* ================= MODAL 1: SEND OTP ================= */}
      <Modal
        visible={signinOtp}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseOTP}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sendOtpModalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Email</Text>
              <TouchableOpacity onPress={handleCloseOTP}>
                <Text style={styles.modalCloseIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <View style={styles.modalBody}>
              <View style={styles.iconCircle}>
<Ionicons name="person" size={24} color="black" />              </View>
              
              <TextInput
                style={styles.modalInput}
                value={user.loginmail}
                onChangeText={(text) => handleChange('loginmail', text)}
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TouchableOpacity style={styles.modalSubmitButton} onPress={handleSendOtp}>
                <Text style={styles.modalSubmitButtonText}>Send OTP</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL 2: VERIFY OTP ================= */}
      <Modal
        visible={otpPage}
        transparent={true}
        animationType="fade"
        onRequestClose={handlecloseotpPage}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.verifyOtpModalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Enter your OTP</Text>
              <TouchableOpacity onPress={handlecloseotpPage}>
                <Text style={styles.modalCloseIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <View style={[styles.modalBody, { paddingTop: 60 }]}>
              <View style={styles.iconCircle}>
<Ionicons name="person" size={24} color="black" />              </View>

              <View style={styles.otpTargetEmailWrapper}>
                <TextInput
                  style={styles.readOnlyInput}
                  value={user.loginmail}
                  editable={false}
                />
                <Text style={styles.otpSubtext}>OTP has been sent to {user.loginmail}</Text>
              </View>

              {/* OTP Boxes Grid */}
              <View style={styles.otpGrid}>
                {otp.map((value, index) => (
                  <TextInput
                    key={index}
                    style={styles.otpInputBox}
                    maxLength={1}
                    keyboardType="number-pad"
                    onChangeText={(text) => handleOTPChange(text, index)}
                    onKeyPress={(e) => handleKeyDown(e, index)}
                    value={value}
                    placeholder="0"
                    placeholderTextColor="#d1d5db"
                    textAlign="center"
                  />
                ))}
              </View>

              {/* Modal Bottom Actions */}
              <View style={styles.modalBottomActionsRow}>
                <TouchableOpacity style={styles.resendButton}>
                  <Text style={styles.resendButtonText}>Resend OTP</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.modalSubmitButtonInline} onPress={handleVerifyOtp}>
                  <Text style={styles.modalSubmitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.timerText}>
                {seconds > 0 
                  ? `Time left: ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}` 
                  : "Time's up!"}
              </Text>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>

  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,

    backgroundColor: '#5CBE8F', // Fallback single solid color for gradient template
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    
  },
  logoContainer: {
    width:'100%',
    height:'20%',
    alignItems: 'center',
    justifyContent:'center'
  },
  logo: {
    width: 256,
    height: 64,
  },
  formContainer: {
    width:'100%',
    backgroundColor: '#ffffff',
    borderTopRightRadius: 30,
    borderTopLeftRadius:30,
    paddingHorizontal: 30,
    paddingTop: 60,
    height:'80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 8,
  },
  textRed: {
    color: '#dc2626',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#9ca3af',
    paddingHorizontal: 8,
    outlineStyle: 'none',
    paddingVertical: 8,
    fontSize: 14,
    color: '#000000',
  },
  forgotPasswordText: {
    fontSize: 12,
    color: '#767d88',
    textAlign:'left',
    textDecorationLine: 'underline',
    marginBottom: 12,
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#5CBE8F', // Custom fallback for button color
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  signupPrompt: {
    fontSize: 14,
    color: '#767d88',
    textAlign: 'center',
  },
  signupLink: {
    color: '#5CBE8F',
    fontWeight: '600',
  },

  // Modal Structural Layouts
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendOtpModalContent: {
    width: '85%',
    height: 224, // 56 * 4 equivalent 
    backgroundColor: '#ffffff',
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  verifyOtpModalContent: {
    width: '85%',
    height: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  modalHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 48,
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    zIndex: 10,
  },
  modalHeaderTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  modalCloseIcon: {
    color: '#ffffff',
    fontSize: 18,
  },
  modalBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalInput: {
    width: 288, // w-72 mapping
    height: 40,
    borderWidth: 1,
    borderColor: '#9ca3af',
    paddingHorizontal: 8,
    color: '#000000',
  },
  modalSubmitButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  modalSubmitButtonInline: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  modalSubmitButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  otpTargetEmailWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  readOnlyInput: {
    width: 320, // w-80 mapping
    height: 40,
    borderWidth: 1,
    borderColor: '#9ca3af',
    paddingHorizontal: 8,
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
  },
  otpSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  otpGrid: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
  otpInputBox: {
    width: 48, // w-12 mapping
    height: 40,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    fontSize: 14,
    color: '#000000',
  },
  modalBottomActionsRow: {
    flexDirection: 'row',
    width: 320, // w-80
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resendButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  resendButtonText: {
    color: '#000000',
  },
  timerText: {
    fontSize: 14,
    color: '#374151',
  },
});