import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from "react-native";

export default function TasksScreen({ tasks, setTasks }) {

  // State to store input value
  const [taskInput, setTaskInput] = useState("");

  // Function to add new task
  const addTask = () => {
    if (taskInput.trim() === "") return;

    const newTask = {
      id: Date.now().toString(),
      title: taskInput,

      // Default values for now
      category: "General",
      priority: "Medium",

      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTaskInput(""); // clear input
  };

  // Toggle task completion
  const toggleTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    );

    setTasks(updatedTasks);
  };

  // Delete task
  const deleteTask = (id) => {
    const filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks);
  };

  return (
    <View style={styles.container}>

      {/* Title */}
      <Text style={styles.title}>Tasks</Text>

      {/* Input Row */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter a task..."
          value={taskInput}
          onChangeText={setTaskInput}
        />

        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.taskCard}
            onPress={() => toggleTask(item.id)}
            onLongPress={() => deleteTask(item.id)}
          >

            {/* Task title */}
            <Text
              style={[
                styles.taskText,
                item.completed && styles.completedText,
              ]}
            >
              {item.title}
            </Text>

            {/* Task metadata */}
            <Text style={styles.taskMeta}>
              {item.category} • {item.priority}
            </Text>

          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet.</Text>
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  inputRow: {
    flexDirection: "row",
    marginBottom: 20,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },

  addButton: {
    marginLeft: 10,
    backgroundColor: "#2563EB",
    paddingHorizontal: 15,
    justifyContent: "center",
    borderRadius: 8,
  },

  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  taskCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  taskText: {
    fontSize: 16,
  },

  taskMeta: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },

  completedText: {
    textDecorationLine: "line-through",
    color: "#999",
  },

  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
});