// Import React
import React from "react";

// Bottom tab navigator creator
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Import screens
import DashboardScreen from "../screens/DashboardScreen";
import TasksScreen from "../screens/TasksScreen";
import FocusScreen from "../screens/FocusScreen";
import InsightsScreen from "../screens/InsightsScreen";
// Create Tab object
const Tab = createBottomTabNavigator();

/*
  BottomTabs receives global state from App.js:
  - tasks
  - setTasks
  - focusSessions
  - setFocusSessions
*/
export default function BottomTabs({
  tasks,
  setTasks,
  focusSessions,
  setFocusSessions,
}) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,          // Hide default header
        tabBarShowIcon: false,       // Remove default icons
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#ffffff",
        },
      }}
    >

      {/* Dashboard Tab */}
      <Tab.Screen name="Dashboard">
        {(props) => (
          <DashboardScreen
            {...props}
            tasks={tasks}
            focusSessions={focusSessions}
          />
        )}
      </Tab.Screen>

      {/* Tasks Tab */}
      <Tab.Screen name="Tasks">
        {() => (
          <TasksScreen
            tasks={tasks}
            setTasks={setTasks}
          />
        )}
      </Tab.Screen>

      {/* Focus Tab */}
      <Tab.Screen name="Focus">
        {() => (
          <FocusScreen
            tasks={tasks}
            focusSessions={focusSessions}
            setFocusSessions={setFocusSessions}
          />
        )}
      </Tab.Screen>

      {/* Analytics Tab */}
      <Tab.Screen name="Insights">
        {(props) => (
          <InsightsScreen
            {...props}
            tasks={tasks}
            focusSessions={focusSessions}
          />
        )}
      </Tab.Screen>

    </Tab.Navigator>
  );
}