import * as FileSystem from "expo-file-system";
import expoFs from "expo-fs";
import http from "isomorphic-git/http/web/index";
import git from "isomorphic-git/index";
import * as React from "react";
import { Alert, Button, FlatList, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { Text, View } from "../../components/Themed";
import { selectAllOffers } from "../../services/library/library.state";
import { RootState } from "../../store";

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
      // url: "https://github.com/unicorn-utterances/unicorn-utterances.git",
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

export default function TabTwo() {
  const [files, setFiles] = React.useState<string[]>([]);
  const getFiles = React.useCallback(getFilesFactory(setFiles), [setFiles]);
  const offers = useSelector(selectAllOffers);

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
      <View style={styles.offers}>
        {offers.map((offer) => (
          <View key={offer.id} style={styles.offer}>
            <Text style={styles.offerTitle}>{offer.title}</Text>
            <Text>{offer.bodyMarkdown}</Text>
          </View>
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
  button: {
    marginTop: 3,
    marginBottom: 3,
  },
  offers: {
    width: "100%",
  },
  offer: {
    width: "100%",
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
