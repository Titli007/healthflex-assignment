"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { useTimers } from "../context/TimerContext"
import CategoryGroup from "../components/CategoryGroup"
import CompletionModal from "../components/CompletionModal"
import type { Timer } from "../../types"

const HomeScreen: React.FC = () => {
  const { timers, loading } = useTimers()
  const [categories, setCategories] = useState<string[]>([])
  const [completedTimer, setCompletedTimer] = useState<Timer | null>(null)
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  // Group timers by category
  useEffect(() => {
    if (timers.length > 0) {
      const uniqueCategories = [...new Set(timers.map((timer) => timer.category))]
      setCategories(uniqueCategories)
    } else {
      setCategories([])
    }

    // Check for newly completed timers
    const justCompleted = timers.find(
      (timer) =>
        timer.status === "Completed" &&
        timer.completedAt &&
        new Date().getTime() - new Date(timer.completedAt).getTime() < 1000,
    )

    if (justCompleted) {
      setCompletedTimer(justCompleted)
      setModalVisible(true)
    }
  }, [timers])

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading timers...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {categories.length > 0 ? (
          categories.map((category) => (
            <CategoryGroup
              key={category}
              category={category}
              timers={timers.filter((timer) => timer.category === category)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No timers yet. Add a timer to get started!</Text>
          </View>
        )}
      </ScrollView>

      {/* Completion Modal */}
      <CompletionModal visible={modalVisible} timer={completedTimer} onClose={() => setModalVisible(false)} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
})

export default HomeScreen

