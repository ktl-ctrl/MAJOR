import React, { useState, useEffect } from "react";
import FocusRatingModal from "../components/FocusRatingModal";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from "react-native";

export default function FocusScreen({ tasks, focusSessions, setFocusSessions }) {

  const INITIAL_DURATION = 5;

  const [seconds, setSeconds] = useState(INITIAL_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {

    let interval = null;

    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    }

    // Timer finished
    if (seconds === 0 && isRunning) {
      setIsRunning(false);
      setShowRatingModal(true);
    }

    return () => clearInterval(interval);

  }, [isRunning, seconds]);

  const restartTimer = () => {
    setIsRunning(false);
    setSeconds(INITIAL_DURATION);
  };

  const handleRating = (rating) => {

    const newSession = {
      id: Date.now().toString(),
      taskId: selectedTaskId,
      duration: INITIAL_DURATION,
      focusRating: rating,
      completedAt: new Date(),
    };

    // ✅ safer state update
    setFocusSessions(prev => [...prev, newSession]);

    setShowRatingModal(false);
    setSeconds(INITIAL_DURATION);
  };

  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Focus</Text>

      {/* Task Selector */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Select Task</Text>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={tasks.filter(task => !task.completed)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.taskButton,
                selectedTaskId === item.id && styles.selectedTask
              ]}
              onPress={() => setSelectedTaskId(item.id)}
            >
              <Text style={[
                styles.taskButtonText,
                selectedTaskId === item.id && { color: "#fff" }
              ]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Timer */}
      <View style={styles.timerCard}>
        <Text style={styles.timer}>{formatTime()}</Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>

        <TouchableOpacity
          style={[styles.button, isRunning && styles.disabledButton]}
          onPress={() => {
            if (!selectedTaskId) {
              alert("Select a task first");
              return;
            }
            setIsRunning(true);
          }}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.stopButton}
          onPress={() => setIsRunning(false)}
        >
          <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.stopButton}
          onPress={restartTimer}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>

      </View>

      <FocusRatingModal
        visible={showRatingModal}
        onSelect={handleRating}
      />

    </View>
  );
}

/* ✅ FIXED: styles OUTSIDE component */
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
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },

  taskButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginRight: 10,
  },

  selectedTask: {
    backgroundColor: "#2563EB",
  },

  taskButtonText: {
    color: "#333",
    fontWeight: "500",
  },

  timerCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 40,
    alignItems: "center",
    marginBottom: 30,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  timer: {
    fontSize: 64,
    fontWeight: "700",
    color: "#2563EB",
  },

  controls: {
    alignItems: "center",
  },

  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 14,
    marginBottom: 15,
  },

  stopButton: {
    backgroundColor: "#aaa",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 14,
    marginBottom: 15,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },

  disabledButton: {
    opacity: 0.5,
  },

});