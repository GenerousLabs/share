import * as React from "react";
import { Button, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootDispatch } from "../store";

export default function TabOneScreen() {
  const dispatch: RootDispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View>
        <Button
          title="Dispatch something"
          onPress={() => {
            dispatch(commitAll({ repoId: "repo1", message: "From button" }));
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
