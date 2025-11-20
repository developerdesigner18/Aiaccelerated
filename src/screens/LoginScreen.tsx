import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN_REQUEST } from "../redux/auth/authTypes";
import { useTheme } from "../../App";
import { lightColors, darkColors } from "../theme/colors";
import * as Keychain from "react-native-keychain";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootState } from "../redux/rootReducer";

interface LoginScreenProps {
  navigation: any;
}

interface User {
  email: string;
  password: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const reduxError = useSelector((state: RootState) => state.auth.error);
  const isLoading = useSelector((state: RootState) => state.auth?.loading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [lockedOut, setLockedOut] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [hasStoredCredentials, setHasStoredCredentials] = useState(false);

  const { theme } = useTheme();
  const colors = theme === "light" ? lightColors : darkColors;

  useEffect(() => {
    const checkBiometric = async () => {
      try {
        const biometryType = await Keychain.getSupportedBiometryType();
        if (biometryType) {
          setBiometricAvailable(true);
          const credentials = await Keychain.getGenericPassword();
          if (credentials) {
            setHasStoredCredentials(true);
            // Do NOT set email automatically here
            // It should only populate after biometric login
          }
        }
      } catch (error) {
        console.log("Biometric check error:", error);
      }
    };
    checkBiometric();
  }, []);


  const storeCredentialsForBiometric = async () => {
    try {
      const usersData = await AsyncStorage.getItem("users");
      const users: User[] = usersData ? JSON.parse(usersData) : [];
      const registeredUser = users.find((user) => user.email === email);
      if (registeredUser) {
        await Keychain.setGenericPassword(
          registeredUser.email,
          registeredUser.password,
          {
            accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
            accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
            securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
          }
        );
        setHasStoredCredentials(true);
      }

    } catch (error) {
      console.log("Error storing credentials:", error);
    }
  };

const handleFingerprintLogin = async () => {
  try {
    const credentials = await Keychain.getGenericPassword({
      authenticationPrompt: {
        title: "Login with Fingerprint",
        subtitle: "Authenticate to unlock your account",
        description: "Use your fingerprint to log in securely.",
      },
    });

    if (credentials) {
      // Fetch all registered users
      const usersData = await AsyncStorage.getItem("users");
      const users: User[] = usersData ? JSON.parse(usersData) : [];
      // Find the full user data matching the email from Keychain
      const matchedUser = users.find((user) => user.email === credentials.username);

      if (matchedUser) {
        // Dispatch full user data
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: matchedUser,
        });

        // Store user in AsyncStorage for session persistence
        await AsyncStorage.setItem("user", JSON.stringify(matchedUser));

        setEmail(matchedUser.email);
        setPassword(matchedUser.password || ""); // optional: autofill password if needed
        setAttempt(0);
        setLockedOut(false);

        ToastAndroid.show("Login Successful", ToastAndroid.SHORT);
        navigation.navigate("Home"); // Navigate to HomeScreen
      } else {
        ToastAndroid.show("User data not found", ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show("Fingerprint login cancelled", ToastAndroid.SHORT);
    }
  } catch (error: any) {
    console.log("Biometric error:", error);
    ToastAndroid.show(
      error.toString().includes("Authentication failed")
        ? "Fingerprint not recognized. Try again."
        : "Biometric authentication unavailable",
      ToastAndroid.SHORT
    );
  }
};


  const doLogin = () => {
    const newAttempt = attempt + 1;
    setAttempt(newAttempt);

    if (lockedOut) {
      ToastAndroid.show(
        "Account locked. Use fingerprint to unlock.",
        ToastAndroid.SHORT
      );
      return;
    }

    if (!email || !password) {
      ToastAndroid.show(
        "Please enter both email and password",
        ToastAndroid.SHORT
      );
      return;
    }

    if (newAttempt >= 5) {
      setLockedOut(true);
      storeCredentialsForBiometric();
      ToastAndroid.show("Too many attempts. Account locked.", ToastAndroid.SHORT);

      if (biometricAvailable && hasStoredCredentials) {
        handleFingerprintLogin();
      }
      return;
    }

    dispatch({
      type: LOGIN_REQUEST,
      payload: { email, password },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.heading, { color: colors.textPrimary }]}>
        Hey There Welcome Back! 👋
      </Text>
      <Text style={[styles.subHeading, { color: colors.textSecondary }]}>
        Sign in to continue to your account
      </Text>

      <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.inputBg, color: colors.textPrimary },
          ]}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!lockedOut}
        />

        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.inputBg, color: colors.textPrimary },
          ]}
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="none"
          editable={!lockedOut}
        />

        {lockedOut && (
          <Text style={[styles.lockedText, { color: "#ff4444" }]}>
            Account locked! Use fingerprint to unlock.
          </Text>
        )}

        {reduxError && !lockedOut && (
          <Text style={styles.error}>Invalid Credentials</Text>
        )}

        <TouchableOpacity
          style={[styles.loginBtn, { backgroundColor: colors.buttonBg }]}
          onPress={doLogin}
        >
          <Text style={[styles.loginBtnText, { color: colors.buttonText }]}>
            {isLoading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        {lockedOut && biometricAvailable && hasStoredCredentials && (
          <TouchableOpacity
            onPress={handleFingerprintLogin}
            style={[
              styles.fingerprintBtn,
              { backgroundColor: colors.cardBg, borderColor: colors.buttonBg },
            ]}
          >
            <Text style={{ fontSize: 24, marginBottom: 8 }}>🔒</Text>
            <Text
              style={{
                color: colors.textPrimary,
                textAlign: "center",
                fontWeight: "500",
              }}
            >
              Unlock with Fingerprint
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          style={{ marginTop: 18 }}
        >
          <Text style={{ color: colors.textSecondary, textAlign: "center" }}>
            Don't have an account?{" "}
            <Text style={{ color: colors.buttonBg, fontWeight: "500" }}>
              Create one
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 26, justifyContent: "center" },
  heading: { fontSize: 30, fontWeight: "700", textAlign: "center", marginBottom: 20 },
  subHeading: { fontSize: 16, fontWeight: "400", textAlign: "center", marginBottom: 20 },
  card: { padding: 24, borderRadius: 16 },
  input: { height: 52, borderRadius: 12, paddingHorizontal: 14, marginBottom: 15, fontSize: 16 },
  loginBtn: { paddingVertical: 15, borderRadius: 12, marginTop: 10 },
  loginBtnText: { fontSize: 18, textAlign: "center", fontWeight: "600" },
  error: { color: "red", textAlign: "center", marginBottom: 10, fontWeight: "500" },
  lockedText: { textAlign: "center", marginBottom: 10, fontSize: 14, fontWeight: "bold" },
  fingerprintBtn: { padding: 16, borderRadius: 12, borderWidth: 1, alignItems: "center", marginTop: 15 },
  attemptText: { textAlign: "center", marginBottom: 10, fontSize: 14 },
});
