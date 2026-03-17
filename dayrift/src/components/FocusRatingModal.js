import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";

export default function FocusRatingModal({ visible, onSelect }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>

          <Text style={styles.title}>Session Completed</Text>
          <Text style={styles.subtitle}>How focused were you?</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => onSelect("low")}
          >
            <Text style={styles.buttonText}>Low</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => onSelect("medium")}
          >
            <Text style={styles.buttonText}>Medium</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => onSelect("deep")}
          >
            <Text style={styles.buttonText}>Deep</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});