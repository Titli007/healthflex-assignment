"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Timer, HistoryItem, TimerContextType } from "../../types"

const TimerContext = createContext<TimerContextType | undefined>(undefined)

export const useTimers = (): TimerContextType => {
  const context = useContext(TimerContext)
  if (context === undefined) {
    throw new Error("useTimers must be used within a TimerProvider")
  }
  return context
}

interface TimerProviderProps {
  children: React.ReactNode
}

const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const [timers, setTimers] = useState<Timer[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Load timers and history from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedTimers = await AsyncStorage.getItem("timers")
        const storedHistory = await AsyncStorage.getItem("timerHistory")

        if (storedTimers) setTimers(JSON.parse(storedTimers))
        if (storedHistory) setHistory(JSON.parse(storedHistory))
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Save timers to AsyncStorage whenever they change
  useEffect(() => {
    const saveTimers = async () => {
      try {
        await AsyncStorage.setItem("timers", JSON.stringify(timers))
      } catch (error) {
        console.error("Error saving timers:", error)
      }
    }

    if (!loading) saveTimers()
  }, [timers, loading])

  // Save history to AsyncStorage whenever it changes
  useEffect(() => {
    const saveHistory = async () => {
      try {
        await AsyncStorage.setItem("timerHistory", JSON.stringify(history))
      } catch (error) {
        console.error("Error saving history:", error)
      }
    }

    if (!loading) saveHistory()
  }, [history, loading])

  // Add a new timer
  const addTimer = (timer: Omit<Timer, "id" | "status" | "remainingTime" | "intervalId">) => {
    const newTimer: Timer = {
      ...timer,
      id: Date.now().toString(),
      status: "Paused",
      remainingTime: timer.duration,
      intervalId: null,
    }
    setTimers([...timers, newTimer])
  }

  // Start a timer
  const startTimer = (id: string) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) => {
        if (timer.id === id && timer.status !== "Running") {
          const intervalId = setInterval(() => {
            updateRemainingTime(id)
          }, 1000)

          return { ...timer, status: "Running", intervalId }
        }
        return timer
      }),
    )
  }

  // Pause a timer
  const pauseTimer = (id: string) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) => {
        if (timer.id === id && timer.status === "Running") {
          if (timer.intervalId) clearInterval(timer.intervalId)
          return { ...timer, status: "Paused", intervalId: null }
        }
        return timer
      }),
    )
  }

  // Reset a timer
  const resetTimer = (id: string) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) => {
        if (timer.id === id) {
          if (timer.intervalId) clearInterval(timer.intervalId)
          return {
            ...timer,
            status: "Paused",
            remainingTime: timer.duration,
            intervalId: null,
          }
        }
        return timer
      }),
    )
  }

  // Update remaining time for a running timer
  const updateRemainingTime = (id: string) => {
    setTimers((prevTimers) => {
      return prevTimers.map((timer) => {
        if (timer.id === id && timer.status === "Running") {
          const newRemainingTime = Math.max(0, timer.remainingTime - 1)

          // Check if timer has completed
          if (newRemainingTime === 0) {
            if (timer.intervalId) clearInterval(timer.intervalId)

            // Add to history
            const completedTime = new Date().toISOString()
            setHistory((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                timerId: timer.id,
                name: timer.name,
                category: timer.category,
                duration: timer.duration,
                completedAt: completedTime,
              },
            ])

            return {
              ...timer,
              status: "Completed",
              remainingTime: 0,
              intervalId: null,
              completedAt: completedTime,
            }
          }

          // Check if halfway alert should be triggered
          if (timer.halfwayAlert && Math.ceil(timer.duration / 2) === newRemainingTime) {
            // This would be where we trigger the alert
            console.log(`Halfway alert for ${timer.name}`)
          }

          return { ...timer, remainingTime: newRemainingTime }
        }
        return timer
      })
    })
  }

  // Start all timers in a category
  const startCategoryTimers = (category: string) => {
    timers.forEach((timer) => {
      if (timer.category === category && timer.status !== "Completed") {
        startTimer(timer.id)
      }
    })
  }

  // Pause all timers in a category
  const pauseCategoryTimers = (category: string) => {
    timers.forEach((timer) => {
      if (timer.category === category && timer.status === "Running") {
        pauseTimer(timer.id)
      }
    })
  }

  // Reset all timers in a category
  const resetCategoryTimers = (category: string) => {
    timers.forEach((timer) => {
      if (timer.category === category) {
        resetTimer(timer.id)
      }
    })
  }

  // Delete a timer
  const deleteTimer = (id: string) => {
    setTimers((prevTimers) => {
      const timerToDelete = prevTimers.find((timer) => timer.id === id)
      if (timerToDelete && timerToDelete.intervalId) {
        clearInterval(timerToDelete.intervalId)
      }
      return prevTimers.filter((timer) => timer.id !== id)
    })
  }

  // Export timer data as JSON
  const exportTimerData = async (): Promise<string | null> => {
    try {
      const data = {
        timers,
        history,
      }
      return JSON.stringify(data)
    } catch (error) {
      console.error("Error exporting data:", error)
      return null
    }
  }

  return (
    <TimerContext.Provider
      value={{
        timers,
        history,
        loading,
        addTimer,
        startTimer,
        pauseTimer,
        resetTimer,
        deleteTimer,
        startCategoryTimers,
        pauseCategoryTimers,
        resetCategoryTimers,
        exportTimerData,
      }}
    >
      {children}
    </TimerContext.Provider>
  )
}

export default TimerProvider

