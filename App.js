// Import React
import React, { useState, useEffect, useRef } from "react";

// Navigation container
import { NavigationContainer } from "@react-navigation/native";

// Stack
import { createStackNavigator } from "@react-navigation/stack";

// Import screens
import LoginScreen from "./src/screens/LoginScreen";
import BottomTabs from "./src/navigation/BottomTabs";
import { init as trackingInit, setUser as trackingSetUser, track, flush } from "./src/utils/trackingAgent";

const Stack = createStackNavigator();

export default function App() {

  // Global tasks state
  const [tasks, setTasks] = useState([]);

  // Global focus sessions state
  const [focusSessions, setFocusSessions] = useState([]);
  const [user, setUser] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    trackingInit(user?.email || null);
    trackingSetUser(user?.email || null);
  }, [user]);

  return (
    <NavigationContainer
      ref={navRef}
      onStateChange={() => {
        const route = navRef.current?.getCurrentRoute();
        if (route?.name) {
          track("screen_view", { name: route.name });
          flush();
        }
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login">
          {() => <LoginScreen setUser={setUser} />}
        </Stack.Screen>

        {/* Pass tasks to MainApp */}
        <Stack.Screen name="MainApp">
          {() => (
            <BottomTabs
              tasks={tasks}
              setTasks={setTasks}
              focusSessions={focusSessions}
              setFocusSessions={setFocusSessions}
              user={user}
            />
          )}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
}
