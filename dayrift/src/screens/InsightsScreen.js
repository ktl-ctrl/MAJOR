import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

import {
  calculateCompletionRate,
  calculateFocusTime,
  calculateFocusScore,
  calculateFocusDistribution
} from "../utils/analyticsEngine";

export default function InsightsScreen({ tasks, focusSessions }) {

  const completionRate = calculateCompletionRate(tasks);
  const focusScore = calculateFocusScore(tasks, focusSessions);
  const distribution = calculateFocusDistribution(tasks, focusSessions);

  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  const distributionArray = Object.entries(distribution);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Insights</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Focus Score</Text>
        <Text style={styles.value}>{focusScore}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tasks</Text>
        <Text style={styles.subText}>Completed: {completedTasks}</Text>
        <Text style={styles.subText}>Pending: {pendingTasks}</Text>
        <Text style={styles.subText}>Completion Rate: {completionRate}%</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Focus Distribution</Text>

        {distributionArray.length === 0 ? (
          <Text style={styles.subText}>No data yet</Text>
        ) : (
          distributionArray.map(([category, time]) => (
            <Text key={category} style={styles.subText}>
              {category} → {Math.floor(time / 60)} min
            </Text>
          ))
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Sessions</Text>

        {focusSessions.length === 0 ? (
          <Text style={styles.subText}>No sessions yet</Text>
        ) : (
          <FlatList
            data={[...focusSessions].reverse()}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const task = tasks.find(t => t.id === item.taskId);

              return (
                <Text style={styles.subText}>
                  {task ? task.title : "Task"} – {Math.floor(item.duration / 60)}m – {item.focusRating}
                </Text>
              );
            }}
          />
        )}
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

  value: {
    fontSize: 30,
    fontWeight: "700",
    color: "#2563EB",
  },

  subText: {
    color: "#666",
    marginBottom: 5,
  },

});