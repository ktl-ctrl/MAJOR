// Import React
import React, { useState } from "react";

// Navigation container
import { NavigationContainer } from "@react-navigation/native";

// Stack
import { createStackNavigator } from "@react-navigation/stack";

// Import screens
import LoginScreen from "./src/screens/LoginScreen";
import BottomTabs from "./src/navigation/BottomTabs";

const Stack = createStackNavigator();

export default function App() {

  // Global tasks state
  const [tasks, setTasks] = useState([]);

  // Global focus sessions state
  const [focusSessions, setFocusSessions] = useState([]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Pass tasks to MainApp */}
        <Stack.Screen name="MainApp">
          {() => (
            <BottomTabs
              tasks={tasks}
              setTasks={setTasks}
              focusSessions={focusSessions}
              setFocusSessions={setFocusSessions}
            />
          )}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
}