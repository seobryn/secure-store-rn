import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import * as SecureStore from "expo-secure-store";

const API_URL = "https://run.mocky.io/v3/17784dfa-be23-4c8e-a22a-a4cb204be049";

export default function App() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [tokenValue, setToken] = useState(false);

  const getToken = async () => {
    const token = await SecureStore.getItemAsync("token", {
      requireAuthentication: true,
    });
    console.log(token);
    setToken(token);
  };

  const clearToken = () => {
    SecureStore.deleteItemAsync("token", {
      requireAuthentication: true,
    });
    setToken("");
  };

  useEffect(() => {
    getToken();
  }, []);

  const handleLogin = async (user) => {
    if (!user.username || !user.password) return;
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      console.log(data);
      SecureStore.setItem("token", data.accessToken, {
        requireAuthentication: true,
      });
      Alert.alert("Login Success", "Token Saved");
      setToken(data.accessToken);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "You have to Enable Biometrics before Logging In");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>App With Secure Store</Text>
      {!tokenValue && (
        <>
          <TextInput
            placeholder="Username"
            onChangeText={(text) => setUser({ ...user, username: text })}
            value={user.username}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            onChangeText={(text) => setUser({ ...user, password: text })}
            value={user.password}
          />
          <Button
            title="Login"
            color="teal"
            onPress={() => handleLogin(user)}
          />
        </>
      )}
      {tokenValue && (
        <View>
          <Text>Token Saved: {tokenValue}</Text>
          <Button title="Logout" color="teal" onPress={() => clearToken()} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
