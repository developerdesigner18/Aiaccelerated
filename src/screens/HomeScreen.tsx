import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "../redux/auth/authTypes";
import { useTheme } from "../../App";
import { RootState } from "../redux/rootReducer";

/* --------------------------- User Interface --------------------------- */
interface User {
  fname?: string;
  lname?: string;
  email?: string;
  phone?: string;
}

/* --------------------------- User Info Item Props --------------------- */
interface UserInfoItemProps {
  label: string;
  value?: string;
}

const UserInfoItem: React.FC<UserInfoItemProps> = ({ label, value }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const Colors = {
    text: isDark ? "#F3F4F6" : "#1F2937",
    subText: isDark ? "#9CA3AF" : "#6B7280",
    divider: isDark ? "#2E3440" : "#E5E7EB",
  };

  return (
    <View>
      <View style={styles.infoItem}>
        <Text style={[styles.label, { color: Colors.subText }]}>{label}</Text>
        <Text style={[styles.value, { color: Colors.text }]}>{value || "--"}</Text>
      </View>
      <View style={[styles.divider, { backgroundColor: Colors.divider }]} />
    </View>
  );
};

/* --------------------------- HomeScreen Component -------------------- */
const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector<RootState, User | null>((state) => state.auth.user);

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const Colors = {
    background: isDark ? "#0D1117" : "#F8FAFC",
    card: isDark ? "#161B22" : "#FFFFFF",
    text: isDark ? "#F3F4F6" : "#1F2937",
    subText: isDark ? "#9CA3AF" : "#6B7280",
    primary: isDark ? "#2563EB" : "#3B82F6",
    divider: isDark ? "#2E3440" : "#E5E7EB",
  };

  const handleLogout = () => {
    dispatch({ type: LOGOUT });
  };

  const initials = `${user?.fname?.[0] || ""}${user?.lname?.[0] || ""}`;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors.background }]}>
      <ScrollView style={[styles.container, { backgroundColor: Colors.background }]}>
        <View style={styles.switchWrapper}>
          <Text style={[styles.switchLabel, { color: isDark ? "#FFF" : "#000" }]}>
            Dark Mode
          </Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: "#D1D5DB", true: "#4B5563" }}
            thumbColor={isDark ? "#F3F4F6" : "#111827"}
          />
        </View>
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: Colors.primary }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={[styles.greeting, { color: Colors.text }]}>
            Hello, {user?.fname} 👋
          </Text>
          <Text style={[styles.subtitle, { color: Colors.subText }]}>
            Welcome to your profile
          </Text>
        </View>
        <View style={[styles.card, { backgroundColor: Colors.card }]}>
          <View style={[styles.cardHeader, { borderBottomColor: Colors.divider }]}>
            <Text style={[styles.cardTitle, { color: Colors.text }]}>
              Personal Information
            </Text>
          </View>
          <View style={styles.infoSection}>
            <UserInfoItem label="First Name" value={user?.fname} />
            <UserInfoItem label="Last Name" value={user?.lname} />
            <UserInfoItem label="Email" value={user?.email} />
            <UserInfoItem label="Phone" value={user?.phone} />
          </View>
        </View>
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: isDark ? "#DC2626" : "#EF4444" }]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

/* --------------------------- Styles ------------------------------ */
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20 },

  header: { alignItems: "center", marginBottom: 30, marginTop: 10 },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: { fontSize: 28, fontWeight: "bold", color: "#FFFFFF" },

  greeting: { fontSize: 28, fontWeight: "bold" },
  subtitle: { fontSize: 16 },

  card: { borderRadius: 16, padding: 20, marginBottom: 20 },
  cardHeader: { marginBottom: 20, borderBottomWidth: 1, paddingBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: "600" },
  infoSection: { gap: 8 },
  infoItem: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12 },
  divider: { height: 1, width: "100%" },
  label: { fontSize: 14, fontWeight: "500" },
  value: { fontSize: 16, fontWeight: "600", textAlign: "right" },

  logoutButton: { borderRadius: 12, padding: 16, alignItems: "center", marginBottom: 40 },
  logoutButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },

  switchWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
  },
  switchLabel: { fontSize: 16, fontWeight: "600" },
});
