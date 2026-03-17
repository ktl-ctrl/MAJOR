// Import React
import React from "react";

// Import basic UI components
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

/*
  LoginScreen receives 'navigation' from React Navigation.
  We will use it to move to the main app after login.
*/
export default function LoginScreen({ navigation }) {

  /*
    This function simulates login.
    Later, this is where Google authentication logic will go.
  */
  const handleLogin = () => {

    /*
      navigation.replace("MainApp")
      - Replaces Login screen with MainApp
      - Prevents going back to login using back button
    */
    navigation.replace("MainApp");
  };

  return (
    <View style={styles.container}>

      {/* App Title */}
      <Text style={styles.title}>DayRift</Text>

      {/* Fake Google Sign-In Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>

    </View>
  );
}

// Styling section
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});