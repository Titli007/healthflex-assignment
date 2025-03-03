import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import { useTimers } from "../context/TimerContext"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

type RootStackParamList = {
  Home: undefined
  "Add Timer": undefined
  History: undefined
}

type AddTimerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Add Timer">

interface AddTimerScreenProps {
  navigation: AddTimerScreenNavigationProp
}

const AddTimerScreen: React.FC<AddTimerScreenProps> = ({ navigation }) => {
  const { addTimer } = useTimers()
  const [name, setName] = useState<string>("")
  const [duration, setDuration] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [halfwayAlert, setHalfwayAlert] = useState<boolean>(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    let isValid = true
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
      isValid = false
    }

    if (!duration.trim()) {
      newErrors.duration = "Duration is required"
      isValid = false
    } else if (isNaN(Number(duration)) || Number.parseInt(duration) <= 0) {
      newErrors.duration = "Duration must be a positive number"
      isValid = false
    }

    if (!category.trim()) {
      newErrors.category = "Category is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const newTimer = {
        name,
        duration: Number.parseInt(duration),
        category,
        halfwayAlert,
        createdAt: new Date().toISOString(),
      }

      addTimer(newTimer)
      Alert.alert("Success", "Timer added successfully!")

      // Reset form
      setName("")
      setDuration("")
      setCategory("")
      setHalfwayAlert(false)

      // Navigate back to home screen
      navigation.navigate("Home")
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create New Timer</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Timer Name</Text>
            <TextInput style={styles.input} placeholder="e.g., Workout Timer" value={name} onChangeText={setName} />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duration (seconds)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 300"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
            />
            {errors.duration && <Text style={styles.errorText}>{errors.duration}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Workout, Study, Break"
              value={category}
              onChangeText={setCategory}
            />
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Enable Halfway Alert</Text>
            <Switch
              value={halfwayAlert}
              onValueChange={setHalfwayAlert}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={halfwayAlert ? "#007AFF" : "#f4f3f4"}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Create Timer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
})

export default AddTimerScreen

