"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Share, ScrollView } from "react-native"
import { useTimers } from "../context/TimerContext"
import Icon from "react-native-vector-icons/Ionicons"
import type { HistoryItem } from "../../types"

const HistoryScreen: React.FC = () => {
  const { history, exportTimerData } = useTimers()
  const [filter, setFilter] = useState<string>("all")
  const [categories, setCategories] = useState<string[]>([])

  // Extract unique categories from history
  useEffect(() => {
    if (history.length > 0) {
      const uniqueCategories = [...new Set(history.map((item) => item.category))]
      setCategories(uniqueCategories)
    }
  }, [history])

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Format duration for display
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  // Filter history items based on selected category
  const filteredHistory = filter === "all" ? history : history.filter((item) => item.category === filter)

  // Handle export functionality
  const handleExport = async () => {
    try {
      const jsonData = await exportTimerData()
      if (jsonData) {
        await Share.share({
          message: jsonData,
          title: "Timer Data Export",
        })
      }
    } catch (error) {
      Alert.alert("Export Failed", "There was an error exporting your data.")
    }
  }

  // Render each history item
  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyName}>{item.name}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
      <View style={styles.historyDetails}>
        <Text style={styles.historyText}>
          <Icon name="time-outline" size={14} /> Duration: {formatDuration(item.duration)}
        </Text>
        <Text style={styles.historyText}>
          <Icon name="checkmark-circle-outline" size={14} /> Completed: {formatDate(item.completedAt)}
        </Text>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Timer History</Text>
        <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
          <Icon name="download-outline" size={20} color="white" />
          <Text style={styles.exportButtonText}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity
            style={[styles.filterButton, filter === "all" && styles.filterButtonActive]}
            onPress={() => setFilter("all")}
          >
            <Text style={[styles.filterButtonText, filter === "all" && styles.filterButtonTextActive]}>All</Text>
          </TouchableOpacity>

          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.filterButton, filter === category && styles.filterButtonActive]}
              onPress={() => setFilter(category)}
            >
              <Text style={[styles.filterButtonText, filter === category && styles.filterButtonTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {history.length > 0 ? (
        <FlatList
          data={filteredHistory}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="time-outline" size={50} color="#ccc" />
          <Text style={styles.emptyStateText}>No timer history yet</Text>
          <Text style={styles.emptyStateSubtext}>Complete some timers to see them here</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  exportButtonText: {
    color: "white",
    marginLeft: 4,
    fontWeight: "500",
  },
  filterContainer: {
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#f0f0f0",
  },
  filterButtonActive: {
    backgroundColor: "#007AFF",
  },
  filterButtonText: {
    color: "#333",
  },
  filterButtonTextActive: {
    color: "white",
  },
  listContent: {
    padding: 16,
  },
  historyItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  historyName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  categoryBadge: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: "#666",
  },
  historyDetails: {
    marginTop: 4,
  },
  historyText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    color: "#666",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
})

export default HistoryScreen

