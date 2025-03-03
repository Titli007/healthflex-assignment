import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { useTimers } from "../context/TimerContext"
import ProgressBar from "./ProgressBar"
import type { TimerItemProps } from "../../types"

const TimerItem: React.FC<TimerItemProps> = ({ timer }) => {
  const { startTimer, pauseTimer, resetTimer, deleteTimer } = useTimers()

  // Format time display (MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Running":
        return "#4CAF50"
      case "Paused":
        return "#FF9800"
      case "Completed":
        return "#9E9E9E"
      default:
        return "#333"
    }
  }

  // Calculate progress percentage
  const progress = (timer.duration - timer.remainingTime) / timer.duration

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{timer.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(timer.status) }]}>
          <Text style={styles.statusText}>{timer.status}</Text>
        </View>
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(timer.remainingTime)}</Text>
        <Text style={styles.totalTime}>/ {formatTime(timer.duration)}</Text>
      </View>

      <ProgressBar progress={progress} />

      <View style={styles.controls}>
        {timer.status !== "Completed" && (
          <>
            {timer.status === "Running" ? (
              <TouchableOpacity style={[styles.button, styles.pauseButton]} onPress={() => pauseTimer(timer.id)}>
                <Icon name="pause" size={18} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.button, styles.startButton]} onPress={() => startTimer(timer.id)}>
                <Icon name="play" size={18} color="white" />
              </TouchableOpacity>
            )}

            <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={() => resetTimer(timer.id)}>
              <Icon name="refresh" size={18} color="white" />
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => deleteTimer(timer.id)}>
          <Icon name="trash" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  timeText: {
    fontSize: 24,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
  },
  totalTime: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
    fontVariant: ["tabular-nums"],
  },
  controls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  startButton: {
    backgroundColor: "#4CAF50",
  },
  pauseButton: {
    backgroundColor: "#FF9800",
  },
  resetButton: {
    backgroundColor: "#2196F3",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
})

export default TimerItem

