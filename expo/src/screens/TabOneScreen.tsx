import * as React from "react";
import { Alert, Button, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { Text, View } from "../components/Themed";
import { createRepo } from "../services/repo/repo.state";
import { RootDispatch } from "../store";
import * as FileSystem from "expo-file-system";

(globalThis as any).FileSystem = FileSystem;

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
          title="Create new repo"
          onPress={() => {
            dispatch(
              createRepo({
                repoId: "re2",
                title: "Testing repos",
                descriptionMarkdown:
                  "This is a test repo.\n\n- A list\n- With two items\n\nAnd more text",
                path: "/re2/",
                uuid: "re2-uuid-example",
              })
            );
          }}
        />
        <Button
          title="Delete re2"
          onPress={async () => {
            await FileSystem.deleteAsync(FileSystem.documentDirectory + "re2/");
            Alert.alert("Done");
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
