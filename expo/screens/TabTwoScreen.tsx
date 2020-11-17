import * as React from "react";
import { StyleSheet, Button, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import git from "isomorphic-git/index";
import http from "isomorphic-git/http/web/index";
import expoFs from "expo-fs";
import { Buffer } from "buffer";

import { Text, View } from "../components/Themed";
import { EncodingType } from "expo-file-system";

(globalThis as any).Buffer = Buffer;

const getFilesFactory = (setFiles: (files: string[]) => void) => async (
  path: string
) => {
  if (FileSystem.documentDirectory === null) {
    throw new Error("No document directory #dtn4Oy");
  }
  const files = await FileSystem.readDirectoryAsync(
    FileSystem.documentDirectory + path
  ).catch((error) => {
    console.error("getFiles() error #5kfMMR", error);
  });
  if (typeof files !== "undefined") {
    setFiles(files);
  } else {
    setFiles([]);
  }
};

const del = async () => {
  await FileSystem.deleteAsync(FileSystem.documentDirectory + "repo").catch(
    (error) => {
      console.error("del() error #ap4gPi");
      console.error(error);
    }
  );
};

const clone = async () => {
  await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "repo");

  console.log("Starting clone #JyjafF");
  await git
    .clone({
      fs: expoFs,
      http,
      dir: "repo",
      // corsProxy: "https://cors.isomorphic-git.org",
      url: "https://github.com/chmac/do-test.git",
      ref: "master",
      singleBranch: true,
      depth: 1,
    })
    .catch((error) => {
      console.error("clone() error #CuZ9Xi");
      console.error(error);
    });

  Alert.alert("Clone finished #iOXriG");
};

export default function TabTwoScreen() {
  const [files, setFiles] = React.useState<string[]>([]);
  const getFiles = React.useCallback(getFilesFactory(setFiles), [setFiles]);

  return (
    <View style={styles.container}>
      <Text>Repo contents</Text>
      {files.map((file) => (
        <Text key={file}>{file}</Text>
      ))}
      {files.length === 0 ? <Text>No files</Text> : null}
      <View style={styles.button}>
        <Button title="Delete repo" onPress={() => del()} />
      </View>
      <View style={styles.button}>
        <Button title="Clone repo" onPress={() => clone()} />
      </View>
      <View style={styles.button}>
        <Button title="List root files" onPress={() => getFiles("")} />
      </View>
      <View style={styles.button}>
        <Button title="List repo files" onPress={() => getFiles("repo")} />
      </View>
      <View style={styles.button}>
        <Button
          title="List repo/.git files"
          onPress={() => getFiles("repo/.git")}
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
  button: {
    marginTop: 3,
    marginBottom: 3,
  },
});
