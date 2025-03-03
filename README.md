# React Native Timer App

This is a React Native timer app with category grouping, built using TypeScript and React Native CLI.

demo video : 

## Features

- Create timers with name, duration, category, and optional halfway alert
- Group timers by categories
- Start, pause, and reset individual timers
- Bulk actions for timers in a category
- Timer history with filtering
- Export timer data

## Setup Instructions

1. Clone the repository:
   \`\`\`
   git clone <repository-url>
   cd <project-directory>
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Install specific dependencies:
   \`\`\`
   npm install @react-navigation/native @react-navigation/bottom-tabs react-native-safe-area-context @react-native-async-storage/async-storage react-native-vector-icons
   \`\`\`

4. For iOS, add the following to your \`ios/Podfile\`:
   \`\`\`
   pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'
   \`\`\`
   Then run:
   \`\`\`
   cd ios && pod install && cd ..
   \`\`\`

5. For Android, edit \`android/app/build.gradle\` and add:
   \`\`\`
   implementation project(':react-native-vector-icons')
   \`\`\`

6. Also for Android, edit \`android/settings.gradle\` and add:
   \`\`\`
   include ':react-native-vector-icons'
   project(':react-native-vector-icons').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-vector-icons/android')
   \`\`\`

7. Link the vector icons library:
   \`\`\`
   react-native link react-native-vector-icons
   \`\`\`

8. Run the app:
   - For iOS: \`npx react-native run-ios\`
   - For Android: \`npx react-native run-android\`

## Assumptions Made During Development

1. The app is designed for mobile devices running iOS or Android.
2. Users have a basic understanding of how timers work.
3. The app uses local storage (AsyncStorage) for persisting timer data and history. There's no backend server or cloud synchronization.
4. The app assumes a stable internet connection for icon loading (react-native-vector-icons).
5. The app is designed with English as the primary language. Localization is not implemented in this version.
6. The app assumes that the device's date and time settings are accurate for timer functionality.
7. The minimum duration for a timer is 1 second, and the maximum is not explicitly set (limited by JavaScript's number representation).
8. The app assumes that users won't create an excessive number of timers that could potentially impact performance or storage limits.
9. The export functionality uses the device's native sharing capabilities.
10. The app doesn't implement user authentication or multi-user support. It's designed for single-user use on a device.
11. The app doesn't provide haptic feedback or sound notifications for timer completions (only visual).
12. The app assumes that the device has sufficient storage space for saving timer data and history.
13. The halfway alert feature is implemented but doesn't include push notifications. It's limited to in-app alerts.
14. The app doesn't account for system-level interruptions (like phone calls) that might affect timer accuracy when the app is in the background.
15. The UI is designed with a light theme. Dark mode support is not implemented in this version.

## License

This project is licensed under the MIT License.

