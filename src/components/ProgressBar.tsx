import { View, StyleSheet } from "react-native"

const ProgressBar = ({ progress }) => {
  // Ensure progress is between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1)

  return (
    <View style={styles.container}>
      <View
        style={[styles.progress, { width: `${clampedProgress * 100}%` }, clampedProgress === 1 && styles.completed]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
  completed: {
    backgroundColor: "#4CAF50",
  },
})

export default ProgressBar

