import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { SafeAreaProvider } from "react-native-safe-area-context"
import Ionicons from "react-native-vector-icons/Ionicons"
import HomeScreen from "./src/screens/HomeScreen"
import AddTimerScreen from "./src/screens/AddTimerScreen"
import HistoryScreen from "./src/screens/HistoryScreen"
import TimerProvider from "./src/context/TimerContext"

const Tab = createBottomTabNavigator()

export default function App() {
  return (
    <SafeAreaProvider>
      <TimerProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: string

                if (route.name === "Home") {
                  iconName = focused ? "timer" : "timer-outline"
                } else if (route.name === "Add Timer") {
                  iconName = focused ? "add-circle" : "add-circle-outline"
                } else if (route.name === "History") {
                  iconName = focused ? "list" : "list-outline"
                } else {
                  iconName = "help-outline"
                }

                return <Ionicons name={iconName} size={size} color={color} />
              },
              tabBarActiveTintColor: "#007AFF",
              tabBarInactiveTintColor: "gray",
              headerShown: true,
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Add Timer" component={AddTimerScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </TimerProvider>
    </SafeAreaProvider>
  )
}

