import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { REGISTER_REQUEST } from "../redux/auth/authTypes";
import { useTheme } from "../../App";
import { RootState } from "../redux/rootReducer";

interface RegisterScreenProps {
  navigation: any;
}

interface FormState {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const error = useSelector((state: RootState) => state.auth.error);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [form, setForm] = useState<FormState>({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [validationError, setValidationError] = useState("");

  const updateField = (field: keyof FormState, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const validate = (): string | null => {
    if (
      !form.fname ||
      !form.lname ||
      !form.email ||
      !form.phone ||
      !form.password ||
      !form.confirmPassword
    )
      return "All fields are required";

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(form.email)) return "Invalid email format";

    if (form.phone.length !== 10) return "Phone number must be 10 digits";

    if (form.password.length < 6) return "Password must be at least 6 characters";

    if (form.password !== form.confirmPassword) return "Passwords do not match";

    return null;
  };

  const handleRegister = () => {
    const err = validate();
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError("");

    dispatch({
      type: REGISTER_REQUEST,
      payload: {
        fname: form.fname,
        lname: form.lname,
        email: form.email,
        phone: form.phone,
        password: form.password,
      },
    });

    navigation.navigate("Login");
  };

  const themeStyles = {
    safeArea: { backgroundColor: isDark ? "#0F172A" : "#F8FAFC" },
    title: { color: isDark ? "#F8FAFC" : "#111827" },
    subtitle: { color: isDark ? "#CBD5E1" : "#6B7280" },
    card: { backgroundColor: isDark ? "#1E293B" : "#FFFFFF" },
    label: { color: isDark ? "#E2E8F0" : "#374151" },
    input: { backgroundColor: isDark ? "#334155" : "#F9FAFB", color: isDark ? "#F8FAFC" : "#111827", borderColor: isDark ? "#475569" : "#E5E7EB" },
    errorBox: { backgroundColor: isDark ? "#7F1D1D" : "#FEE2E2", color: isDark ? "#FCA5A5" : "#DC2626" },
    textNormal: { color: isDark ? "#E2E8F0" : "#4B5563" },
    link: { color: isDark ? "#60A5FA" : "#2563EB" },
  };

  return (
    <SafeAreaView style={[styles.safeArea, themeStyles.safeArea]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.title, themeStyles.title]}>Create Account</Text>
            <Text style={[styles.subtitle, themeStyles.subtitle]}>Join us today and get started</Text>
          </View>

          <View style={[styles.formCard, themeStyles.card]}>
            {([
              { key: "fname", label: "First Name" },
              { key: "lname", label: "Last Name" },
              { key: "email", label: "Email Address" },
              { key: "phone", label: "Phone Number" },
              { key: "password", label: "Password" },
              { key: "confirmPassword", label: "Confirm Password" },
            ] as { key: keyof FormState; label: string }[]).map(({ key, label }) => (
              <View key={key} style={styles.inputGroup}>
                <Text style={[styles.inputLabel, themeStyles.label]}>{label}</Text>
                <TextInput
                  style={[styles.input, themeStyles.input]}
                  placeholder={label}
                  placeholderTextColor={isDark ? "#94A3B8" : "#9CA3AF"}
                  secureTextEntry={key === "password" || key === "confirmPassword"}
                  keyboardType={key === "phone" ? "number-pad" : "default"}
                  maxLength={key === "phone" ? 10 : undefined}
                  value={form[key]}
                  onChangeText={(v) => updateField(key, v)}
                />
                {key === "password" && <Text style={styles.passwordHint}>Must be at least 6 characters</Text>}
              </View>
            ))}

            <View style={styles.errorContainer}>
              {validationError ? <Text style={[styles.error, themeStyles.errorBox]}>{validationError}</Text> : null}
              {error ? <Text style={[styles.error, themeStyles.errorBox]}>{error}</Text> : null}
            </View>

            <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
              <Text style={styles.registerText}>Create Account</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.loginRedirect}>
            <Text style={[styles.loginText, themeStyles.textNormal]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={[styles.loginLink, themeStyles.link]}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  keyboardAvoid: { flex: 1 },
  container: { flexGrow: 1, padding: 24, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 40 },
  title: { fontSize: 32, fontWeight: "700" },
  subtitle: { fontSize: 15 },
  formCard: { borderRadius: 16, padding: 20, marginBottom: 20 },
  inputGroup: { marginBottom: 18 },
  inputLabel: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  input: { borderRadius: 10, padding: 14, fontSize: 16, borderWidth: 1 },
  passwordHint: { fontSize: 12, color: "#6B7280", marginTop: 4 },
  errorContainer: { minHeight: 40, justifyContent: "center" },
  error: { textAlign: "center", fontWeight: "600", fontSize: 14, padding: 10, borderRadius: 8, marginBottom: 5 },
  registerBtn: { backgroundColor: "#3B82F6", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 10 },
  registerText: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" },
  loginRedirect: { flexDirection: "row", justifyContent: "center", marginTop: 10 },
  loginText: { fontSize: 15 },
  loginLink: { fontSize: 15, fontWeight: "700" },
});
