# Aiaccelerated React Native App

**Aiaccelerated** is a mobile application built with [React Native](https://reactnative.dev) that supports **email/password authentication**, **biometric login**, **user profile management**, and **theme switching**. The project uses **Redux** for state management and **Redux-Saga** for handling async operations.

---

## Project Overview

**Key Features:**

* **Email & Password Authentication**: Standard login and registration flow with validation.
* **Biometric Login**: Fingerprint authentication for quick and secure access.
* **User Profile**: Displays user details (`First Name`, `Last Name`, `Email`, `Phone`) on the Home screen.
* **Dark/Light Theme Switching**: Toggle app theme dynamically.
* **Secure Credential Storage**: User credentials stored using `react-native-keychain`.
* **Persistent Session**: AsyncStorage maintains user sessions across app restarts.

---

## Prerequisites

Before running the app, ensure the following are installed:

* Node.js v18 or above
* Yarn or npm
* Android Studio (for Android)
* Xcode (for iOS)
* Android/iOS device or simulator
* Optional: Device with fingerprint/biometric support

---

## Installation

1. Clone the repository:

```sh
git clone <YOUR_REPO_URL>
cd Aiaccelerated
```

2. Install dependencies:

```sh
# Using npm
npm install

# OR using Yarn
yarn install
```

---

## Running the App

### 1. Start Metro Bundler

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

### 2. Build & Run

#### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

#### iOS

> Ensure CocoaPods dependencies are installed:

```sh
bundle install
bundle exec pod install
```

Then run:

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

---

## App Usage

1. **Registration & Login**

   * Users register with first name, last name, email, phone, and password.
   * After registration, login with email & password.
2. **Biometric Login**

   * After 5 failed login attempts, the app locks the account.
   * Fingerprint login automatically fetches user details and navigates to Home.
3. **Home Screen**

   * Shows user profile (first name, last name, email, phone).
   * Dark/Light theme toggle.
   * Logout clears session and navigates back to Login.

---

## Folder Structure

```
/src
  /redux           # Redux actions, reducers, types
  /screens         # Login, Register, Home screens
  /theme           # Colors, theme utils
App.tsx
```

---

## State Management

* **Redux**: Manages authentication and user profile state.
* **Redux-Saga**: Handles asynchronous API calls.
* **AsyncStorage**: Stores session data.
* **Keychain**: Securely stores credentials for biometric login.

---

## Scripts

| Command           | Description         |
| ----------------- | ------------------- |
| `npm start`       | Start Metro bundler |
| `npm run android` | Run Android app     |
| `npm run ios`     | Run iOS app         |
| `npm run lint`    | Run ESLint          |
| `npm test`        | Run Jest tests      |

---

## Troubleshooting

* Ensure your Android/iOS device has biometrics enabled.
* For iOS, run `pod install` after adding new native dependencies.
* Clean builds may resolve build issues:

  * **Android**: Delete `android/app/build` and rebuild.
  * **iOS**: Clean Xcode build folder (`Cmd + Shift + K`) and rebuild.

---

## Learn More

* [React Native Docs](https://reactnative.dev/docs/getting-started)
* [Redux](https://redux.js.org/)
* [Redux-Saga](https://redux-saga.js.org/)
* [React Native Keychain](https://github.com/oblador/react-native-keychain)
* [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

---

## Contact

For support or inquiries, contact **[Your Name / Company]**.
