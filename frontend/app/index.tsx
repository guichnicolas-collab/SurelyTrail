import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import TrailMap from "../components/TrailMap";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <TrailMap />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
