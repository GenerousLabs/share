import * as React from "react";
import { StyleSheet } from "react-native";
import * as FileSystem from "expo-file-system";

import { Text, View } from "../components/Themed";

const getFiles = () => {
  if (FileSystem.documentDirectory === null) {
    throw new Error("No document directory #dtn4Oy");
  }
  return FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
};

export default function TabTwoScreen() {
  const [files, setFiles] = React.useState<string[]>([]);
  React.useEffect(() => {
    getFiles()
      .then(async (files) => {
        if (files.length === 0) {
          await FileSystem.writeAsStringAsync(
            FileSystem.documentDirectory + "example.txt",
            "An example file"
          );
        }
        setFiles(files);
      })
      .catch((error) => {
        console.error("getFiles() error #pvP9vj");
        console.error(error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text>A little more again</Text>
        {files.map((file) => (
          <Text key={file}>{file}</Text>
        ))}
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
