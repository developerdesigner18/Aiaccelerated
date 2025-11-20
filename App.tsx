import React, { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Image } from "react-native";
import { NavigationContainer, DefaultTheme, DarkTheme, Theme as NavTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider, useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import store, { RootState } from "./src/redux/store";
import { Animated } from "react-native";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";

type ThemeType = "light" | "dark";

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
}

const Stack = createNativeStackNavigator();

/* ----------------------------- THEME CONTEXT ----------------------------- */
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>("light");

  useEffect(() => {
    (async () => {
      const savedTheme = await AsyncStorage.getItem("appTheme");
      if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
    })();
  }, []);

  const toggleTheme = async () => {
    const newTheme: ThemeType = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("appTheme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

/* ----------------------------- SPLASH SCREEN ----------------------------- */

const SplashScreen: React.FC = () => {
  const colors = ["#FF3C3C", "#FFB93C", "#3CFF57", "#3CB4FF"]; // multi-color dots
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % colors.length);
    }, 500); // change dot every 0.5s
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.splashContainer}>
      <Image
        style={{ width: '100%', height: 150, marginBottom: 20 }}
        source={require("./src/assets/images/logo_app.png")}
        resizeMode="contain"
      />
      <View style={styles.dotsContainer}>
        {colors.map((color, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: color, opacity: activeIndex === index ? 1 : 0.3 },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

/* ----------------------------- AUTH CHECK WRAPPER ----------------------------- */
const AppNavigator: React.FC = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  const { theme } = useTheme();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        dispatch({ type: "LOGIN_SUCCESS", payload: JSON.parse(storedUser) });
      }
      // Simulate splash screen duration
      setTimeout(() => {
        setShowSplash(false);
        setLoading(false);
      }, 3000); // 2 seconds splash
    };
    checkLoginStatus();
  }, [dispatch]);

  if (loading || showSplash) return <SplashScreen />;

  const navTheme: NavTheme = theme === "light" ? DefaultTheme : DarkTheme;

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

/* ----------------------------- MAIN APP EXPORT ----------------------------- */
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#c5c2c8ff",
    justifyContent: "center",
    alignItems: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
  },
});
