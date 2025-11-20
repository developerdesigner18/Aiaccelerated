import React, { createContext, useState, useContext, ReactNode } from "react";
import { ThemeColors } from "./colors";

// Define the Theme type
export interface AppTheme extends ThemeColors {
  mode: "light" | "dark";
}

// Example theme objects (make sure your colors file exports these)
export const LightTheme: AppTheme = { 
  mode: "light",
  background: "#F3F4F6",
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  cardBg: "#FFFFFF",
  inputBg: "#F9FAFB",
  inputBorder: "#E5E7EB",
  buttonBg: "#2563EB",
  buttonText: "#FFFFFF",
};

export const DarkTheme: AppTheme = {
  mode: "dark",
  background: "#0F172A",
  textPrimary: "#F8FAFC",
  textSecondary: "#CBD5E1",
  cardBg: "#1E293B",
  inputBg: "#334155",
  inputBorder: "#475569",
  buttonBg: "#3B82F6",
  buttonText: "#FFFFFF",
};

// Define context type
interface ThemeContextProps {
  theme: AppTheme;
  toggleTheme: () => void;
}

// Create context with default value
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<AppTheme>(LightTheme);

  const toggleTheme = () => {
    setTheme(prev => (prev.mode === "light" ? DarkTheme : LightTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useAppTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }
  return context;
};
