import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import {
  calculateCompletionRate,
  calculateFocusTime,
  calculateSessionsToday,
  calculateFocusScore
} from "../utils/analyticsEngine";

export default function DashboardScreen({ tasks, focusSessions, navigation }) {

  const completionRate = calculateCompletionRate(tasks);
  const focusMinutes = calculateFocusTime(focusSessions);
  const sessionsToday = calculateSessionsToday(focusSessions);
  const focusScore = calculateFocusScore(tasks, focusSessions);

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(t => !t.completed);

  let nextActionText = "Create your first task";
  let nextActionSub = "";
  let onPressAction = () => navigation.navigate("Tasks");

  if (pendingTasks.length > 0) {
    nextActionText = "Start Focus Session";
    nextActionSub = pendingTasks[0].title;
    onPressAction = () => navigation.navigate("Focus");
  }

  const today = new Date().toDateString();

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Good Morning</Text>
      <Text style={styles.date}>{today}</Text>

      <TouchableOpacity style={styles.card} onPress={onPressAction}>
        <Text style={styles.cardTitle}>Next Action</Text>
        <Text style={styles.actionText}>{nextActionText}</Text>
        {nextActionSub !== "" && (
          <Text style={styles.subText}>{nextActionSub}</Text>
        )}
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tasks</Text>
        <Text style={styles.value}>
          {completedTasks} / {totalTasks}
        </Text>
        <Text style={styles.subText}>
          Completion Rate: {completionRate}%
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Focus</Text>
        <Text style={styles.value}>{focusMinutes} min</Text>
        <Text style={styles.subText}>
          Sessions Today: {sessionsToday}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Focus Score</Text>
        <Text style={styles.value}>{focusScore}</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
  },

  date: {
    color: "#888",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  cardTitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },

  actionText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2563EB",
  },

  subText: {
    color: "#666",
    marginTop: 5,
  },

  value: {
    fontSize: 30,
    fontWeight: "700",
    color: "#2563EB",
  },

});